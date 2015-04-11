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

    if (MapLayers.Settings.debug) console.log("MapLayers_Store_Create( rootid )", rootid);

    var our_JsonRest = mydojo.declare(mydojo.JsonRest, {
        query: function () {
            var originalResults = this.inherited(arguments);
            var newResults = originalResults.then(function (results) {
                return mydojo.array.map(results, function (result) {
                
                    /***** get the parent *****/

                    var parent = MapLayers.Store.Memory.query( { id: result.parent } )[0];

                    /***** parse the data in the node before we add it *****/

                    return parse_callback( result, parent);
                    
                });
            });
            var mynewResults = mydojo.lang.delegate(newResults, { total: originalResults.total });
            return new mydojo.QueryResults(mynewResults);
        },
        get: function () {
            var originalResults = this.inherited(arguments);

            /***** modify in place *****/

            originalResults.then(function (results) {
                
                parse_callback( results, null);
                    
            });
            
            return originalResults;
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


    /***** we need to insert a little routine into the model so that *****/
    /***** when its given a new node from the store we can act on it *****/

    mydojo.aspect.after(
        MapLayers.Store.Model,
        "getIdentity",
        function(originalgetIdentity, Arguments) {

            var item = MapLayers.Store.Memory.query( {id: Arguments[0].id } );
            obstore_callback (item[0]);
            
            return originalgetIdentity;
        }
    );

}


