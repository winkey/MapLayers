/*******************************************************************************
 *
 * Project: MapLayers
 * App:     javascript dojo layer tree
 *
 * 
 *
 *******************************************************************************
 * Copyright (c) 2013-2015,  Brian Case 
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


require(['dojo/_base/declare'], function(declare) {
    MapLayers.Tree = new Object();
});


require(['dojo/_base/declare'], function(declare) {

    declare("MapLayers.Tree._Node",null,{

        leaf: false,
        isExpanded: false,
        checked: false,
        Checkable: false,
        layer: null,

        log:  function () {
            if (MapLayers.Settings.debug) {
               //console.log("MapLayers.Tree._Node. : ", this, " : ", arguments);
            }
        },

        /***************************************************************************
         method to turn a layer off
        ***************************************************************************/

        Layer_off: function () {

            if ( this.layer
                 && this.layer.getVisibility()
               ) {
                this.layer.setVisibility(false);
            }

        },

        /***************************************************************************
         method to turn a layer on
        ***************************************************************************/

        Layer_on: function () {

            if ( this.layer
                 && ! this.layer.getVisibility()
               ) {
                this.layer.setVisibility(true);
            }

        },

        /***************************************************************************
         method for the trees checkchange
        ***************************************************************************/

        CheckChange: function (checked) {

            //console.log( "CheckChange (checked) ", checked);

            item = this;
            if (item.nodetype == 'Link' ) {
                item = MapLayers.Store.Memory.get( item.target )
            }

            /***** if turn on a temp folder item it has a controll, activate it *****/

            /***** temp layer *****/

            if (item.control) {
                if(checked) {
                    if (MapLayers.Map.ActiveControl) {
                        MapLayers.Map.ActiveControl.deactivate();
                    }
                    MapLayers.Map.ActiveControl = this.control;
                    MapLayers.Map.ActiveControl.activate();
                    item.Layer_on( item.layer) ;

                } else {

                    item.Layer_off( item.layer) ;
                }
            }

            /***** new permalink add/remove *****/

            else if ( item.nodetype != 'Animation' ) {
                if(checked) {
                    MapLayers_Hash_Addlayer("layers", this.layer.lid);
                    item.Layer_on( item.layer) ;

                } else {
                    MapLayers_Hash_Removelayer("layers", this.layer.lid);
                    item.Layer_off( item.layer) ;
                }
            }

            if ( item.nodetype == 'Animation' ) {

                if(checked) {
                    MapLayers_Hash_Addlayer("layers", this.id);


                    var children = MapLayers.Store.Memory.getChildren(item);
                    
                    for ( var i = 0; i < children.length; i++ ) {
                        
                        MapLayers.Time.Toolbar.AddNode(children[i]);
                        MapLayers.Map.map.addLayer(children[i].layer);
                    };
                }

                else {
                    MapLayers_Hash_Removelayer("layers", this.id);

                  var children = MapLayers.Store.Memory.getChildren(item);
                  for ( var i = 0; i < children.length; i++ ) {
                        MapLayers.Time.Toolbar.RemoveNode(children[i]);
                        MapLayers.Map.map.removeLayer(children[i].layer, 'TRUE');
                    };
                }

            }

            /***** keep the layers out of the map to keep the map fast *****/

            else if ( item.layer.isBaseLayer === false
                      && item.nodetype != 'Google'
                      && item.nodetype != 'Googlev3'
                    ) {

                if(checked) {
                    MapLayers.Map.map.addLayer(item.layer);
                } else {
                    MapLayers.Map.map.removeLayer(item.layer, 'TRUE');
                }

            /***** set the zoom on the map when baselayer is changed *****/

            } else {
                item.layer.onMapResize();
                var center = MapLayers.Map.map.getCenter();

                if (MapLayers.Map.map.baseLayer != null && center != null) {
                    var zoom = MapLayers.Map.map.getZoom();
                    MapLayers.Map.map.zoom = null;
                    MapLayers.Map.map.setCenter(center, zoom);
                }
            }

        },

        /***************************************************************************
         function for the tree node expansion
        ***************************************************************************/

        ExpandNode: function (node) {
            this.log( "ExpandNode (node) ", node);

            MapLayers_Hash_Addlayer("open", this.id);

        },

        /***************************************************************************
         function for the tree node Collapse
        ***************************************************************************/

        CollapseNode: function (node) {
            this.log( "CollapseNode (node) ", node);

            MapLayers_Hash_Removelayer("open", this.id);
        },

        /***********************************************************************//**
         *
         *  @brief to parse the json array into the dojo tree
         * 
         *  @param NodesArray
         *  @param ParentNode
         *  @param LayerArray
         * 
        ***************************************************************************/

        constructor: function (NodeData, ParentNode) {
            this.log( "constructor (NodeData, ParentNode) ", NodeData, ParentNode);
            var layer = null;

            for (var attrname in NodeData) {
                this[attrname] = NodeData[attrname];
            }

            //fixme need extent for zoom to, we dont keep this in the db either
            //                                    w                     s                   e            n
            //'myExtent': new OpenLayers.Bounds(-9852248.59963804, 3527237.61654759, -9447717.68891644, 4172836.22079423)
            switch(this.nodetype) {

                case 'Folder':
                    break;

                case 'Radio':
                    break;

                case 'Animation':
                    this.Checkable = true;
                    break;

                case 'Link':    
                    break;

                case 'ArcGISCache':
                    break;

                case 'ArcGIS93Rest':
                    layer = new OpenLayers.Layer.ArcGIS93Rest( this.name,
                                                               this.url,
                                                               this.options
                                                             );
                   break;

                case 'ArcIMS':
                    layer = new OpenLayers.Layer.ArcIMS( this.name,
                                                         this.url,
                                                         this.options
                                                       );
                    break;

                case 'Bing':
                    layer = new OpenLayers.Layer.Bing( this.name,
                                                       this.type,
                                                       this.key,
                                                       this.options
                                                      );
                    break;

                case 'GeoRSS':

                    this.popupSize = new OpenLayers.Size(this.popupSize[0],
                                                             this.popupSize[1]);
                    this.projection = new OpenLayers.Projection("EPSG:" + this.projection);

                    layer = new OpenLayers.Layer.GeoRSS( this.name,
                                                         this.url,
                                                         this.popupSize,
                                                         this.projection,
                                                         this.options
                                                       );
                    break;

                
                case 'Google':

                    switch (this.options.type) {
                        case 'G_SATELLITE_MAP':
                            this.options.type = G_SATELLITE_MAP;
                            break;
                        case 'G_HYBRID_MAP':
                            this.options.type = G_HYBRID_MAP;
                            break;
                        case 'G_PHYSICAL_MAP':
                            this.options.type = G_PHYSICAL_MAP
                            break;
                    }

                    layer = new OpenLayers.Layer.Google( this.name,
                                                         this.options
                                                       );

                    break;
                

                case 'Googlev3':
                    switch (this.options.type) {
                        case 'SATELLITE':
                            this.options.type = google.maps.MapTypeId.SATELLITE;
                            break;
                        case 'HYBRID':
                            this.options.type = google.maps.MapTypeId.HYBRID;
                            break;
                        case 'TERRAIN':
                            this.options.type = google.maps.MapTypeId.TERRAIN;
                            break;
                        case 'ROADMAP':
                            this.options.type = google.maps.MapTypeId.ROADMAP;
                            break;
                    }

                    layer = new OpenLayers.Layer.Google( this.name,
                                                           this.options
                                                         );
                    break;

                case 'KaMap':
                    layer = new OpenLayers.Layer.KaMap( this.name,
                                                        this.url,
                                                        this.params,
                                                        this.options
                                                      );
                    break;

                case 'KaMapCache':
                    layer = new OpenLayers.Layer.KaMapCache( this.name,
                                                             this.url,
                                                             this.params,
                                                             this.options
                                                           );
                    break;

                case 'MapGuide':
                    break;

                case 'MapServer':
                    layer = new OpenLayers.Layer.MapServer( this.name,
                                                            this.url,
                                                            this.params,
                                                            this.options
                                                          );
                    break;

                case 'OSM':
                    layer = new OpenLayers.Layer.OSM( this.name,
                                                      this.url,
                                                      this.options
                                                    );
                    break;

                case 'TMS':
                    layer = new OpenLayers.Layer.TMS( this.name,
                                                      this.url,
                                                      this.options
                                                    );
                    break;

                case 'TileCache':
                    layer = new OpenLayers.Layer.TileCache( this.name,
                                                            this.url,
                                                            this.layername,
                                                            this.options
                                                          );
                    break;

                case 'WMS':
                    layer = new OpenLayers.Layer.WMS( this.name,
                                                      this.url,
                                                      this.params,
                                                      this.options
                                                     );
                    break;

                case 'WMTS':
                    layer = new OpenLayers.Layer.WMTS( this.options
                                                     );
                    break;

                case 'WorldWind':
                    this.options.tileSize = new OpenLayers.Size( this.options.tileSize[0],
                                                                     this.options.tileSize[1] );
                    layer = new OpenLayers.Layer.WorldWind( this.name,
                                                            this.url,
                                                            this.lzd,
                                                            this.zoomLevels,
                                                            this.params,
                                                            this.options
                                                          );
                    break;

                case 'XYZ':
                    layer = new OpenLayers.Layer.XYZ( this.name,
                                                      this.url,
                                                      this.options
                                                    );
                    break;

                default:
                    break;

            }

            /***** layer *****/

            if ( layer ) {

                this.leaf = true;
                this.Checkable = true;
                this.layer = layer; 


                if (ParentNode.nodetype == 'Radio') {
                    this.radioGroup = "RadioGroup_" + ParentNode.id;

                    if (! ParentNode.haschildren) {
                        this.checked = true;


                    }

                }

                if (ParentNode.nodetype == 'Animation') {
                    this.checked = null;
                    this.Checkable = false;
                }

                /***** add a baselayer to the map now *****/

                if ( this.options.isBaseLayer == true
                     || this.nodetype == 'Google'
                     || this.nodetype == 'Googlev3'
                   ) {
                    MapLayers.Map.map.addLayers([layer]);

                }



                ParentNode.haschildren = true;

            /***** folder type *****/

            } else {
                if (ParentNode) {
                    ParentNode.haschildren = true;
                }
                
                switch(this.nodetype) {
                    
                    case 'Folder':
                        

                        if (this.id == 1) {

                            this.isExpanded = true;

                        }

                        break;

                
                    default:
                        break;
                }

            }

            return this;
        },

        /*******************************************************************************


        *******************************************************************************/

        querycallback: function () {
            //console.log( "querycallback this ", this);
            var promise = null;

            switch(this.nodetype) {
                
                case 'Radio':
                    

                    if (this.id == 2) {

                        /***** add tempfolder *****/
                        var parent = MapLayers.Store.Memory.get(this.parent);

                        MapLayers.Tree.Tree.CreateTempFolder(parent);

                    }

                    //break;

                case 'Radio':

                    /***** fetch the RADIO   items now *****/
                    
                    promise = MapLayers.Store.Observable.query( { parent: this.id } );
                    
                    break;

                case 'Animation':

                    /***** fetch the animation items now *****/

                    promise = MapLayers.Store.Observable.query( { parent: this.id } );
                    
                    break;

                case 'Link':

                    /***** fetch the link target now *****/

                    promise = MapLayers.Store.Observable.get( this.target );



                    break;
                
                default:


                    break;
            }


        return promise;
        }

    });
}); // end of require

/*******************************************************************************
 tree object
*******************************************************************************/


require( [ 'dojo/_base/declare', "dijit/Tree", "dijit/form/CheckBox",
           "dijit/form/RadioButton"],
         function(declare, Tree, CheckBox, RadioButton) {

    MapLayers.Tree._Tree = declare(Tree, {


        tempid: null,

        /***********************************************************************
         methood to log
        ***********************************************************************/

        log:  function () {
            if (MapLayers.Settings.debug) {
                 //console.log("MapLayers.Store._Tree. : ", this, " : ", arguments);
            }
        },
    
        /***********************************************************************
         methood to create a treenode
        ***********************************************************************/

        _createTreeNode: function (args) {
            this.log("_CreateTreeNode (args) ", args);

            args.item;

            if (args.item.nodetype == 'Link' ) {
                var link = MapLayers.Store.Memory.get( args.item.target )
            }

            tnode = new Tree._TreeNode(args);
            //tnode.olditem = args.item;
            tnode.labelNode.innerHTML = args.label;

             
            /***** if its Checkable add the checkbox*****/

            if ( args.item.Checkable
                 || ( link && link.Checkable ) 
               ) {

                if (link) {
                    if ( !link.radioGroup ) {
        
                        cb = new CheckBox({
                            checked: link.checked });
                    } else {

                        cb = new RadioButton({
                            checked: link.checked,
                            name: link.radioGroup
                        });
                    }
                } else {
                    if ( !args.item.radioGroup ) {
        
                        cb = new CheckBox({
                            checked: args.item.checked });
                    } else {

                        cb = new RadioButton({
                            checked: args.item.checked,
                            name: args.item.radioGroup
                        });
                    }
                }

                cb.placeAt(tnode.labelNode, "first");

                tnode.checkbox = cb;
                tnode.own(cb);

                dojo.connect(cb, "onChange", function() {
                    
                    /***** update the checked in the store *****/

                    args.item.checked = this.checked;
                    MapLayers.Store.Memory.put(args.item);

                    /***** update the url etc.... *****/

                    args.item.CheckChange(this.checked);

                });
            }

            return tnode;
        },

        /***********************************************************************
         methood to GetPath
        ***********************************************************************/

        GetPath: function ( result ) {

            this.log("GetPath( result)", result);

            /***** the tree isnt expanded posibly so we need to folow it to our node *****/
            var path = [];
            for ( var pitem = result ;
                  pitem ;
                  pitem = MapLayers.Store.Memory.get( pitem.parent )
            ) {
                path.unshift( pitem );
            }

            return path;
        },

        /***********************************************************************
         methood to ExpandPath
        ***********************************************************************/

        ExpandPath: function ( path ) {

            this.log("ExpandPath( path)", path);

            /***** loop over the path and expand the nodes *****/

            for ( var iPath = 0; iPath < path.length; iPath++ ) {
                var node = MapLayers.Tree.Tree.getNodesByItem(path[iPath])[0];

                if (node && node.isExpandable) {
                    //console.log("expanding ", path[iPath].id);
                    this._expandNode(node);
                }
            }
        },

        /***********************************************************************
         methood to ExpandLayersCallback
        ***********************************************************************/

        _ExpandLayersCallback: function ( id ) {

            MapLayers.Tree.Tree.log("_ExpandLayersCallback( id)", id);

            var result = null;
            if ( id && (result = MapLayers.Store.Memory.get(id) ) ) {

                var path = MapLayers.Tree.Tree.GetPath( result );
                MapLayers.Tree.Tree.ExpandPath(path);
            }
        },

        /***********************************************************************
            method to parse the tree to turn on the requested layers
        ***********************************************************************/

        ExpandLayers: function ( layers ) {

            this.log("ExpandLayers( layers )", layers);

            var lays = layers.split(",");

            MapLayers.Store.Cache.QueryAndCallbackArray (
                lays,
                this._ExpandLayersCallback,
                finishup2
            );
        },


        /***********************************************************************
         methood to TurnOnLayersCallback
        ***********************************************************************/

        _TurnOnLayersCallback: function ( result ) {

            MapLayers.Tree.Tree.log("_TurnOnLayersCallback( result)", result);

            if (result && result.nodetype == 'Link' ) {
                var link = MapLayers.Store.Memory.get( result.target )
            }
            
            if ( (result && result.Checkable)
                 || ( link && link.Checkable) 
               ) {

                /***** now we can click on our node *****/

                node = MapLayers.Tree.Tree.getNodesByItem(result)[0];
                node.checkbox.set('checked', true, false);
                result.CheckChange(true);
            }
        },

        /***********************************************************************
         methood to TurnOnLayers
        ***********************************************************************/

        TurnOnLayers: function (layers ) {

            this.log("TurnOnLayers ( layers )", layers);

            /***** loop over the layers in the url *****/

            var lays = layers.split(",");

            var iLid;
            for ( var iLid = 0; iLid < lays.length; iLid++ ) {
                var result = MapLayers.Store.Memory.get(lays[iLid]);
                this._TurnOnLayersCallback( result );
            }
        },

        /***********************************************************************
         methood to PrefetchLayers
        ***********************************************************************/

        PrefetchLayers: function ( layers ) {

            this.log("PrefetchLayers( layers )", layers);

            var lays = layers.split(",");
            MapLayers.Store.Cache.QueryAndCallbackArray(
                lays,
                function () {},
                function () {
                    finishup3();
                }
            );
        },

        /***********************************************************************
        ***** hack to add temp folder *****
        ***********************************************************************/

        CreateTempFolder: function (ParentNode) {

            this.log("MapLayers_Tree_Create_TempFolder(ParentNode) ", ParentNode );

            if (!this.tempid ) {
                var newNode = {
                    id: "temp",
                    parent: 1,
                    nodetype: "Folder",
                    owner: null,
                    groups: null,
                    timestamp: null,
                    begin_timespan: null,
                    end_timespan: null,
                    tile_cache: false,
                    tooltip: "",
                    metadata: "",
                    lft: 0,
                    rght: 0,
                    tree_id: 1,
                    level: 1,
                    name: "Temporary Layers",
                    leaf: false,
                    isExpanded: false, //dojo
                    checked: false,
                    Checkable: false
                };

                this.tempid = 1;

                var mynewnode = new MapLayers.Tree._Node(newNode, ParentNode);


                MapLayers.Store.Memory.add( mynewnode );
                MapLayers.Store.Observable.notify(mynewnode);

                return mynewnode;
            }

        },

        /***********************************************************************
          CreateTemplayer
        ***********************************************************************/

        CreateTemplayer: function (Lname, Layer, Controll) {

            this.log("CreateTemplayer(Lname, Layer, Controll :", Lname, Layer, Controll);

            var newNode = ({
                leaf: true,
                name: Lname, //dojo
                isExpanded: false, //dojo
                checked: true,
                id: "temp" + this.tempid++,
                parent: "temp", //fixme is this incompatable with dnd?
                lft: 0,
                rght: 0,
                tree_id: 1,
                level: 1,
                nodetype: "Vector",
                Checkable: true,
                lname: Lname,
                layer: Layer,
                control: Controll
            });

            var ParentNode = MapLayers.Store.Memory.get("temp");

            var mynewnode = new MapLayers.Tree._Node(newNode, ParentNode);

            MapLayers.Store.Memory.add( mynewnode );
            MapLayers.Store.Observable.notify(mynewnode);

            return mynewnode;
        }




    });
});


/*******************************************************************************
 *
 *  @brief function to create the tree 
 * 

*******************************************************************************/

function MapLayers_Tree_Create () {
    
    //if (MapLayers.Settings.debug) console.log("MapLayers_Tree_Create()");
    /***** make the store *****/

    MapLayers_Store_Create(
        1,
        function (newNode, ParentNode) {
            return new MapLayers.Tree._Node(newNode, ParentNode);
        },
        function  (NodeData) {
            NodeData.querycallback();
        }
    );


    MapLayers.Tree.Tree = new MapLayers.Tree._Tree ({
        model: MapLayers.Store.Model,

        /***** NOTE THE dndSource stuff needs overrode there just stubs *****/
        //dndController: dijit.tree.dndSource, //fixme do we bneed to mod or replace this to save teh tree? what about perms?
        showRoot: true,
        onOpen: function (item, node) { item.ExpandNode(node); },
        onClose: function (item, node) { item.CollapseNode(node); },
    },  'Tree' );

    MapLayers.Tree.Tree.placeAt(TreeForm)

    return MapLayers.Tree.Tree
}

