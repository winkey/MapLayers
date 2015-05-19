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


dojo.require("dojo");

require(['dojo/_base/declare'], function(declare) {

    MapLayers.Store = new Object();

});



/*******************************************************************************
    jsonrest object
*******************************************************************************/

require( [ 'dojo/_base/declare', "dojo/_base/array", "dojo/_base/lang",
           "dojo/when", "dojo/store/util/QueryResults", "dojo/store/JsonRest"],
           function(declare, array, lang, when, QueryResults, JsonRest ) {

    MapLayers.Store._JsonRest = declare(JsonRest, {

        parse_callback: null,

        log:  function () {
            if (MapLayers.Settings.debug) {
                 //console.log("MapLayers.Store._JsonRest. : ", this, " : ", arguments);
            }
        },

        /***********************************************************************
          query method
        ***********************************************************************/

        query: function (query, directives) {

            this.log("query( query, directives )", query, directives);

            var originalResults = this.inherited(arguments);

            var newResults = originalResults.then(function (results) {

                return array.map(results, function (result) {

                    /***** if it is already in the memory we dont replace it *****/

                    var newitem = null;
                    if ( (newitem = MapLayers.Store.Memory.get( result.id )) ) {
                        newitem.status = "update";
                        //fixme what if its new data on the server? serial num?

                    /***** use the new data *****/

                    } else {

                        var parent = MapLayers.Store.Memory.get( result.parent );
                        newitem = MapLayers.Store.JsonRest.parse_callback( result, parent );
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
            var mynewResults = lang.delegate(newResults, { total: originalResults.total });
            return new QueryResults(mynewResults);
        },

        /***********************************************************************
          get method
        ***********************************************************************/

        get: function (id, directives) {

            this.log("get( id, directives )", id, directives);

            var originalResult = this.inherited(arguments);

            /***** modify in place *****/

            var newresult = originalResult.then(function (result) {
                var mynewresult = MapLayers.Store.JsonRest.parse_callback( result, null);
                mynewresult.querytype = "get";
                mynewresult.status = "new";

                return mynewresult;

            });

            return newresult;
        },

        /***********************************************************************
          getChildren method
        ***********************************************************************/

        getChildren: function(node){

            this.log("getChildren(node) ", node);
            if (node.nodetype == 'Link' ) {
                node = MapLayers.Store.Memory.get( node.target );
            }
            
            return MapLayers.Store.Observable.query({parent: node.id});
        }
    });
});

/*******************************************************************************
    Memory object
*******************************************************************************/

require( [ 'dojo/_base/declare', "dojo/store/Memory"],
           function(declare, Memory ) {

    MapLayers.Store._Memory = declare( Memory, {

        data: [],

        log:  function () {
            if (MapLayers.Settings.debug) {
                 //console.log("MapLayers.Store._Memory. : ", this, " : ", arguments);
            }
        },

        /***********************************************************************
          query method
        ***********************************************************************/

        query: function (query, directives) {

            this.log("query( query, directives )", query, directives);

            return this.inherited(arguments);
        },

        /***********************************************************************
          get method
        ***********************************************************************/

        get: function (id, directives) {

            this.log("get( id, directives )", id, directives);

            return this.inherited(arguments);
        },

        /***********************************************************************
          put method
        ***********************************************************************/

        put: function(object, options){

            this.log("put( object, options )", object, options);

            return this.inherited(arguments);
        },



        /***********************************************************************
          getChildren method
        ***********************************************************************/

        getChildren: function(node){

            this.log("getChildren(node) ", node);


            if (node.nodetype == 'Link' ) {
                node = MapLayers.Store.Memory.get( node.target );
            }
            return MapLayers.Store.Observable.query({parent: node.id});
        }
    });
});

/*******************************************************************************
    cache object
*******************************************************************************/
require( [ 'dojo/_base/declare', "dojo/when", "dojo/_base/lang",
           "dojo/promise/all", "dojo/store/Cache"],
           function(declare, when, lang, all, Cache ) {

    MapLayers.Store._Cache = function(masterStore, cachingStore, obstore_callback, options) {

        var RealCache = new Cache(masterStore, cachingStore, options);
        
    	return lang.delegate(RealCache, {

            log:  function () {
                if (MapLayers.Settings.debug) {
                     //console.log("MapLayers.Store._Cache. : ", this, " : ", arguments);
                }
            },

            /***********************************************************************
              _queryFromCache method
            ***********************************************************************/

            _queryFromCache: function(query, directives) {

                //this.log("_queryFromCache(query, directives)", query, directives);

                /***** check the cache *****/

                var results = cachingStore.query(query, directives);
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
                if (skip) return results;
                
                return null;
            },

            /*******************************************************************
              _NewOrUpdate method
            *******************************************************************/

            _NewOrUpdate: function( object) {

                var MoreResults = null;
                //this.log("_NewOrUpdate(object)", object);

                if ( object
                     && object.hasOwnProperty('status')
                     && object.status == "new"
                   ) {

                    /***** notify each new layer as they come in *****/

                    //MapLayers.Store.Observable.notify(object);

                    /***** callback for imediate action items *****/
                            
                    object.ChildPromise = object.querycallback();

                } else if (object.hasOwnProperty('status') && object.status == "update") {
//FIXME when we make it refresh we need to fix this
                    /*this.log ("notify(object) ", object);
                    MapLayers.Store.Observable.notify(object, object.id);*/
                    //fixme updated = true;
                }

                object.status = null;

            },

            /*******************************************************************
              _queryNewOrUpdate method
            *******************************************************************/

            _queryNewOrUpdate: function(results) {

                var MoreResultsArray = [];
                //log("_queryNewOrUpdate(results)", results);

                results.forEach(function(object) {
                    MapLayers.Store.Cache._NewOrUpdate(object);
                });

            },

            /*******************************************************************
              _putCache method
            *******************************************************************/

            _putCache: function(object) {
                
                 //console.log("_putCache(object)", object);

                if (object && object.status == "new") {
                    if (!cachingStore.get(object.id) ) {
                        cachingStore.put(object, {id: object.id});
                    }
                }
            },

            /*******************************************************************
              _queryPutCache method
            *******************************************************************/

            _queryPutCache: function(results) {
                
                MapLayers.Store.Cache.log("_queryPutCache(results)", results);
                //console.log("_queryPutCache(results)", results);
                results.forEach(function(object) {
                    MapLayers.Store.Cache._putCache(object);
                });
            },

            /***********************************************************************
              query method
            ***********************************************************************/

            // fixme we will need a way to get a new one if the data on the server changes

            query: function(query, directives) {

                MapLayers.Store.Cache.log("query(query, directives)", query, directives);

                /***** check the cache *****/

                var results = this._queryFromCache (query, directives);


                /***** get results from the server? *****/

                if ( !results ) {
                    var newresults = masterStore.query(query, directives);

                    /***** add the results the store *****/

                    newresults.then(function(newresults) {
                        MapLayers.Store.Cache._queryPutCache(newresults);
                        return newresults; // we need this for the next .then

                    /***** now notify *****/

                    }).then(function(newresults) {
                        if ( !newresults[0] ) {
                            MapLayers.Store.Cache.log ("warning newresults is empty. query = ", query);
                            return;
                        }
                        //fixme var updated = false; 

                        MapLayers.Store.Cache._queryNewOrUpdate(newresults);

                        /***** if these are baselayers turn on the map ****/

                        var parent = cachingStore.query( {id: newresults[0].parent} )[0]; 
                        if ( parent.name == "Base Layers"
                             && !MapLayers.Store.calledfinishup
                           ) {
                            MapLayers.Store.calledfinishup = true;
                            finishup();
                        }

                    });

                    return newresults;
                }

                return results;
            },

            /***********************************************************************
              get method
            ***********************************************************************/

            get: function (id, directives) {

                this.log("get(id, directives)", id, directives);

                result = cachingStore.get(id);

                if (!result) {
                    result = masterStore.get(id, directives),

                    result.then( function (result) {
                        MapLayers.Store.Cache._putCache(result);
                        MapLayers.Store.Cache._NewOrUpdate(result);
                        return result;
                    });
                }

                return result;
                
            },

            /***********************************************************************
              GetWithCallback method
            ***********************************************************************/

            GetWithCallback: function(id, callback) {

                this.log("GetWithCallback(id, callback)", id);

                when(
                    this.get( id ),
                    function (result) {
                        if(result) {
                            callback(result);

                        }
                    }
                );
            },

            /*******************************************************************
              PromisesOfPromises method
            *******************************************************************/

            _PromisesOfPromises: function (results, callback) {

                MapLayers.Store.Cache.log("_PromisesOfPromises(results )", results);

                var ChildPromises = [];
                results.forEach(function(object) {
                    if (object && object.ChildPromise) {
                        ChildPromises.push(object.ChildPromise);
                    }
                });
                if (ChildPromises.length) {
                    
                    when (
                        all(ChildPromises),
                        function(result) {
                            MapLayers.Store.Cache._PromisesOfPromises(result, callback);
                        }
                    );
                } else {
                    callback();
                }
            },
                

            /*******************************************************************
              QueryAndCallbackArray method
            *******************************************************************/

            QueryAndCallbackArray: function(array, callback, donecallback) {

                MapLayers.Store.Cache.log("QueryAndCallbackArray(array )", array);
                if ( array.length > 0) {
                    var parent = array.shift();

                    when(
                        MapLayers.Store.Cache.query( {parent: parent} ),
                        function (result) {
                            MapLayers.Store.Cache._PromisesOfPromises(
                                result,
                                function() {
                                    callback(parent);
                                    MapLayers.Store.Cache.QueryAndCallbackArray (array, callback, donecallback);
                                }
                            );
                        }
                    );
                } else {
                    donecallback();
                }
            }

        });
    };
});

/*******************************************************************************
    Observable object
*******************************************************************************/

require( [ 'dojo/_base/declare', "dojo/_base/lang", "dojo/store/Observable"],
           function(declare, lang, Observable ) {

    MapLayers.Store._Observable = function(store) {

        var RealObservable = new Observable(store);
        
    	return lang.delegate(RealObservable, {
    
            log:  function () {
                if (MapLayers.Settings.debug) {
                     //console.log("MapLayers.Store._Observable. : ", this, " : ", arguments);
                }
            },

            /*******************************************************************
              query method
            *******************************************************************/

            query: function (query, directives) {

                this.log("query( query, directives )", query, directives);

                return RealObservable.query(query, directives)
            },

            /*******************************************************************
              get method
            *******************************************************************/

            get: function (id, directives) {

                this.log("get( id, directives )", id, directives);

                return RealObservable.get(id, directives);
            }
        });
    };
});

/*******************************************************************************
    ObjectStoreModel object
*******************************************************************************/

require( [ 'dojo/_base/declare', "dojo/when", "dojo/promise/all",
           "dijit/tree/ObjectStoreModel"],
           function(declare, when, all, ObjectStoreModel ) {

    MapLayers.Store._ObjectStoreModel = declare(ObjectStoreModel, {

        RootId: 0,

        log:  function () {
            if (MapLayers.Settings.debug) {
                console.log("MapLayers.Store._ObjectStoreModel. : ", this, " : ", arguments);
            }
        },

        //fixme do we need this with getroot?         
        //query: { id: this.RootId },

        /***********************************************************************
          mayHaveChildren method
        ***********************************************************************/

        mayHaveChildren: function(item) {

            this.log("mayHaveChildren( item )", item);

            if (item.nodetype == 'Link' ) {
                item = MapLayers.Store.Memory.get( item.target );
            }
            return  !item.leaf;
        },

        /***********************************************************************
          getRoot method
        ***********************************************************************/

        getRoot: function(onItem){

            this.log("getRoot( onItem )", onItem);
            
            this.store.get(MapLayers.Store.Model.RootId).then(onItem);

        },

        /***********************************************************************
          _PromisesOfPromises method
        ***********************************************************************/

        _PromisesOfPromises: function (results, origresults, callback) {

                MapLayers.Store.Cache.log("_PromisesOfPromises(results )", results);

                var ChildPromises = [];
                results.forEach(function(object) {
                    if (object && object.ChildPromise) {
                        ChildPromises.push(object.ChildPromise);
                    }
                });
                if (ChildPromises.length) {
                    
                    when (
                        all(ChildPromises),
                        function(result) {
                            MapLayers.Store.Model._PromisesOfPromises(result, origresults, callback);
                        }
                    );
                } else {
                    callback(origresults);
                }
            },

        /***********************************************************************
          getChildren method
        ***********************************************************************/

		getChildren: function(parentItem, onComplete, onError) {

            this.log("getChildren( parentItem, onComplete, onError parentItem.ChildPromise)", parentItem, parentItem.ChildPromise);
            
            var originalResults = this.inherited(arguments,[ 
                parentItem,
                function (items) {
                    MapLayers.Store.Model._PromisesOfPromises(items, items, onComplete);
                    },
                onError
            ]);
            return originalResults
		}

    });
});

/*******************************************************************************
 *
 *  @brief function to create the store for the tree
 * 

*******************************************************************************/

dojo.require("dijit/tree/ObjectStoreModel");

function MapLayers_Store_Create( RootId, parse_callback, obstore_callback ) {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Store_Create( RootId, parse_callback, obstore_callback )", RootId);

    //MapLayers.Store.obstore_callback = obstore_callback;

    /***** json store *****/

    MapLayers.Store.JsonRest = new MapLayers.Store._JsonRest({
        target: "../layers/query"
    });
    MapLayers.Store.JsonRest.parse_callback = parse_callback;

    /***** memory store *****/

    MapLayers.Store.Memory = new MapLayers.Store._Memory({
        data: [],
    })


//FIXME
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

    MapLayers.Store.Cache = new MapLayers.Store._Cache(
        MapLayers.Store.JsonRest,
        MapLayers.Store.Memory,
        obstore_callback
    );

    /***** obstore *****/

    MapLayers.Store.Observable = new MapLayers.Store._Observable(
        MapLayers.Store.Cache
    );


    /***** create the model *****/

    MapLayers.Store.Model = new MapLayers.Store._ObjectStoreModel({
        store: MapLayers.Store.Observable,
        RootId: RootId
    });

}






