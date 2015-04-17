/*******************************************************************************
 *
 * Project: MapLayers
 * App:     javascript dojo layer tree
 *
 * 
 *
 *******************************************************************************
 * Copyright (c) 2015,  Brian Case 
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
******************************************************************************/

require([
        "dojo/_base/declare",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/when",
        "dojo/store/util/QueryResults",
        "dojo/store/JsonRest",
        "dojo/store/Memory",
        "dojo/store/Cache",
        "dojo/store/Observable",
        "dijit/tree/ObjectStoreModel",
        "dojo/aspect",
        "dijit/tree/dndSource" 
    ],
    function (
        declare,
        array,
        lang,
        when,
        QueryResults,
        JsonRest,
        Memory,
        Cache,
        Observable,
        ObjectStoreModel,
        aspect,
        dndSource
    ) {

        mydojo = new Object();

        mydojo.declare = declare;
        mydojo.array = array;
        mydojo.lang = lang;
        mydojo.when = when;
        mydojo.QueryResults = QueryResults;
        mydojo.JsonRest = JsonRest;
        mydojo.Memory = Memory;
        mydojo.Cache = Cache;
        mydojo.Observable = Observable;
        mydojo.ObjectStoreModel = ObjectStoreModel;
        mydojo.aspect = aspect;
        mydojo.dndSource = dndSource;
    }
);

dojo.require("dojo");

dojo.ready(function() {
    MapLayers.Store = new Object();

});
/*******************************************************************************
 *
 *  @brief function to create the store for the tree
 * 

*******************************************************************************/
    
function MapLayers_Store_Create( rootid, parse_callback, obstore_callback ) {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Store_Create( rootid )", rootid);

    MapLayers.Store.obstore_callback = obstore_callback;


    var our_JsonRest = mydojo.declare(mydojo.JsonRest, {
        query: function (query, directives) {
            var originalResults = this.inherited(arguments);

            var newResults = originalResults.then(function (results) {

                return mydojo.array.map(results, function (result) {

                    /***** if it is already in the memory we dont replace it *****/

                    var newitem = null;
                    if ( (newitem = MapLayers.Store.Memory.get( result.id )) ) {
                        newitem.status = "update";
                        //fixme what if its new data on the server? serial num?

                    /***** use the new data *****/

                    } else {

                        var parent = MapLayers.Store.Memory.get( result.parent );
                        newitem = parse_callback( result, parent );
                        newitem.status = "new";
                    }

                    /***** store the query on the item so the cache can test  *****/
                    /***** if it needs to fetch, but favor the parent= querys *****/

                    if ( ! newitem.querytype
                         || newitem.querytype != JSON.stringify({parent: result.parent} )
                       ) {
                        newitem.querytype = JSON.stringify(query);
                    }

                    return newitem
                });
            });
            var mynewResults = mydojo.lang.delegate(newResults, { total: originalResults.total });
            return new mydojo.QueryResults(mynewResults);
        },
        get: function () {
            var originalResults = this.inherited(arguments);

            /***** modify in place *****/

            var newresults = originalResults.then(function (result) {
            
                var newresult = parse_callback( result, null);
                newresult.querytype = "get";

                return newresult;

            });

            return newresults;
        }
    });

    /***** json store *****/

    MapLayers.Store.JsonRest = new our_JsonRest({
        target: "../layers/query",
         getChildren: function(node){
            return this.query({parent: node.id});
        }
    });

    /***** memory store *****/

    MapLayers.Store.Memory = new mydojo.Memory({
        data: [],
        getChildren: function(node){
            return this.query({parent: node.id});
        }
    })

/*
    mydojo.aspect.around(MapLayers.Tree.Store, "put", function(originalPut){
        // To support DnD, the store must support put(child, {parent: parent}).
        // Since memory store doesn't, we hack it.
        // Since our store is relational, that just amounts to setting child.parent
        // to the parent's id.
        return function(obj, options){
            if(options && options.parent){
                obj.parent = options.parent.id;
            }
            return originalPut.call(MapLayers.Tree.Store, obj, options);
        }
    });
*/
    /***** tie the memory and json store together into a cache *****/

    MapLayers.Store.Cache = new mydojo.Cache(
        MapLayers.Store.JsonRest,
        MapLayers.Store.Memory
    );
	
    /***** change the query function so we check the cache                *****/
    /***** also we add a callback on all new fetches after there complete *****/

    // fixme we will need a way to get a new one if the data on the server changes

    mydojo.aspect.around (
        MapLayers.Store.Cache,
        "query",
        function(originalquery) {

            return function(query, directives) {

            //if (MapLayers.Settings.debug) console.log("MapLayers.Store.Cache.query(query, directives)", query, directives);

                /***** check the cache *****/

                var results = MapLayers.Store.Memory.query(query, directives);
                var skip = false;
                var checkold = false;
                if ( results.length > 0) {
                    skip = true;
                }

                /***** dont try to get temp stuff *****/

                if ( query
                     && query.hasOwnProperty('parent')
                     && typeof(query.parent) == "string"
                     && query.parent.match(/temp.*/) 
                   ) {
                     skip = true;
                }

                /***** if the first item is temp, fetch anyway *****/
            
                if ( results.length == 1
                     && typeof(results[0].id) == "string"
                     && results[0].id.match(/temp.*/) 
                   ) {
                    skip=false;
                }

                /***** if the query was different on any results in the set  *****/
                

                for ( var iResult = 0;
                      skip &&iResult < results.length;
                      iResult++
                    ) {

                    if (results[iResult].querytype != JSON.stringify(query) ) {
                        skip = false;
                    }
                }


                /***** get results from the server? *****/

                if ( !skip ) {
                    var newresults = MapLayers.Store.JsonRest.query(query, directives);

                    /***** loop over the results and add them to the store *****/

                    newresults.then(function(newresults) {
                        newresults.forEach(function(object) {
                            if (object.status == "new") {
                                MapLayers.Store.Memory.put(object);
                            }
                        });

                        return newresults; // we need this for the next .then

                    /***** now notify *****/

                    }).then(function(newresults) {
                        var updated = false; 
                        var parent = MapLayers.Store.Memory.query( {id: newresults[0].parent} )[0]; 

                        newresults.forEach(function(object) {
                            if (object.hasOwnProperty('status') && object.status == "new") {
                                MapLayers.Store.Observable.notify(object);
                                obstore_callback (object);
                            } else if (object.hasOwnProperty('status') && object.status == "update") {
                                MapLayers.Store.Observable.notify(object, object.id);
                                updated = true;
                            }
                            object.status = null;

                        });

                        if (updated) {
                            //fixme this destroys checkboxs on folders
                            //MapLayers.Store.Observable.notify(parent, parent.id);
                        }

                        /***** if these are baselayers turn on the map ****/

                        if ( parent.name == "Base Layers"
                             && !MapLayers.Store.calledfinishup
                           ) {
                            MapLayers.Store.calledfinishup = true;
                            finishup();
                        }

                    });
                }

                return results;
            }
        }
    );

    /***** change the get function so we can add a callback  *****/

    mydojo.aspect.around (
        MapLayers.Store.Cache,
        "get",
        function (originalget) {
            return function (id, directives) {

            //if (MapLayers.Settings.debug) console.log("MapLayers.Store.Cache.get(id, directives)", id, directives);

                return mydojo.when(
                    MapLayers.Store.Memory.get(id),
                    function (result) {
                        return result || mydojo.when(

                            MapLayers.Store.JsonRest.get(id, directives),
                            function (result) {
                                if(result) {
                                    MapLayers.Store.Memory.put(result, {id: id});
                                    obstore_callback (result);
                                }
                                return result;
                            }
                        );
                    }
                );
            }
        }
    );

    /***** obstore *****/

    MapLayers.Store.Observable = new mydojo.Observable(
        MapLayers.Store.Cache
    );


    /***** create the model *****/

    MapLayers.Store.Model = new mydojo.ObjectStoreModel({
        store: MapLayers.Store.Observable,
        //fixme do we need this with getroot?         
        //query: { id: rootid },
        mayHaveChildren: function(item) {
                    return  !item.leaf;
                },

        getRoot: function(onItem){
            
            this.store.get(rootid).then(onItem);
        }

    
    });

}

function MapLayers_Store_Cache_get_withcallback (id, callback) {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Store_Cache_get_withcallback(id, callback)", id);

    mydojo.when(
        MapLayers.Store.Memory.get(id),
        function (result) {
            if ( result ) {
                callback(result);
            } else {
                mydojo.when(
                    MapLayers.Store.JsonRest.get(id),
                    function (result) {

                        if(result) {
                            MapLayers.Store.Memory.put(result, {id: id});
                            MapLayers.Store.obstore_callback (result);
                            callback(result);
                        }
                    }
                );
            }
        }
    );
}


