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

dojo.require("dijit.Tree");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.RadioButton");
dojo.require("dojo/aspect");

require(['dojo/_base/declare'], function(declare) {
    MapLayers.Tree = new Object();
});







function MapLayers_Tree_GetPath( result ) {

    //////if (MapLayers.Settings.debug) console.log("MapLayers_Tree_GetPath( result)", result);

    /***** the tree isnt expanded posibly so we need to folow it to our node *****/
    var path = new Array();
    for ( var pitem = result ;
          pitem ;
          pitem = MapLayers.Store.Memory.get( pitem.parent )
    ) {
        path.unshift( pitem );
    }

    return path;
}

function MapLayers_Tree_ExpandPath( path ) {

    //////if (MapLayers.Settings.debug) console.log("MapLayers_Tree_ExpandPath( path)", path);

    /***** loop over the path and expand the nodes *****/

    for ( var iPath = 0; iPath < path.length; iPath++ ) {
        var node = MapLayers.Tree.tree.getNodesByItem(path[iPath])[0];

        if (node && node.isExpandable) {
            //console.log("expanding ", path[iPath].id);
            MapLayers.Tree.tree._expandNode(node);
        }
    }
}


function MapLayers_Tree_Find_Layers_callback( result ) {

    //////if (MapLayers.Settings.debug) console.log("MapLayers_Tree_Find_Layers_callback( result)", result);
    if ( result && result.Checkable ) {

        var path = MapLayers_Tree_GetPath( result );
        MapLayers_Tree_ExpandPath(path);

        /***** now we can click on our node *****/

        node = MapLayers.Tree.tree.getNodesByItem(result)[0];
        node.checkbox.set('checked', true);
    }
}

function MapLayers_Tree_Open_Layers_callback( result ) {

    //////if (MapLayers.Settings.debug) console.log("MapLayers_Tree_Open_Layers_callback( result)", result);
    if ( result ) {

        var path = MapLayers_Tree_GetPath( result );
        MapLayers_Tree_ExpandPath(path);

    }
}

/******************************************************************************
    function to parse the tree to turn on the requested layers
******************************************************************************/


function MapLayers_Tree_Find_and_Open_Layers( layers, expand) {

    //////if (MapLayers.Settings.debug) console.log("MapLayers_Tree_Find_and_Open_Layers( layers, expand)", layers, expand);

    /***** loop over the layers in the url *****/

    var lays = layers.split(",");
    var iLid;
    for ( var iLid = 0; iLid < lays.length; iLid++ ) {

        if (expand) {
            MapLayers_Store_Cache_get_withcallback(
                lays[iLid],
                MapLayers_Tree_Open_Layers_callback
            );
        } else {
            MapLayers_Store_Cache_get_withcallback(
                lays[iLid],
                MapLayers_Tree_Find_Layers_callback
            );
        }

    }
}

require(['dojo/_base/declare'], function(declare) {

declare("MapLayers.Tree.Node",null,{

    leaf: false,
    isExpanded: false,
    checked: false,
    Checkable: false,
    layer: null,

    log:  function () {
        if (MapLayers.Settings.debug) {
            //console.log("MapLayers.Tree.Node. : ", this, " : ", arguments);
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

        this.log( "CheckChange (checked) ", checked);

        /***** if turn on a temp folder item it has a controll, activate it *****/

        /***** temp layer *****/

        if (this.control) {
            if(checked) {
                if (MapLayers.Map.ActiveControl) {
                    MapLayers.Map.ActiveControl.deactivate();
                }
                MapLayers.Map.ActiveControl = this.control;
                MapLayers.Map.ActiveControl.activate();
                this.Layer_on( this.layer) ;

            } else {

                this.Layer_off( this.layer) ;
            }
        }

        /***** new permalink add/remove *****/

        else if ( this.nodetype != 'Animation' ) {
            if(checked) {
                MapLayers_Hash_Addlayer("layers", this.layer.lid);
                this.Layer_on( this.layer) ;

            } else {
                MapLayers_Hash_Removelayer("layers", this.layer.lid);
                this.Layer_off( this.layer) ;
            }
        }

        if ( this.nodetype == 'Animation' ) {

            if(checked) {
                MapLayers_Hash_Addlayer("layers", this.id);


                var children = MapLayers.Store.Observable.getChildren(this);
                children.forEach(function(child) {
                    MapLayers_Time_addnode(child);
                    MapLayers.Map.map.addLayer(child.layer);
                });
            }

            else {
                MapLayers_Hash_Removelayer("layers", this.id);

                var children = MapLayers.Store.Observable.getChildren(this);
                children.forEach(function(child) {
                    MapLayers_Time_removenode(child);
                    MapLayers.Map.map.removeLayer(child.layer, 'TRUE');
                });
            }

        }

        /***** keep the layers out of the map to keep the map fast *****/

        else if ( this.layer.isBaseLayer === false
                  && this.nodetype != 'Google'
                  && this.nodetype != 'Googlev3'
                ) {

            if(checked) {
                MapLayers.Map.map.addLayer(this.layer);
            } else {
                MapLayers.Map.map.removeLayer(this.layer, 'TRUE');
            }

        /***** set the zoom on the map when baselayer is changed *****/

        } else {
            this.layer.onMapResize();
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
        this.log( "querycallback");


        switch(this.nodetype) {
            
            case 'Folder':
                

                if (this.id == 1) {

                    /***** add tempfolder *****/

                    MapLayers_Tree_Create_TemFolder(this)

                }

                break;

            case 'Radio':

                /***** fetch the RADIO   items now *****/
                
                var children = MapLayers.Store.Observable.query( { parent: this.id } );
                
                break;

            case 'Animation':

                /***** fetch the animation items now *****/

                var children = MapLayers.Store.Observable.query( { parent: this.id } );
                
                break;

            case 'Link':

                /***** fetch the link target now *****/

                var target = MapLayers.Store.Observable.query( { id: this.target } )[0];
                
                if ( target ) {            
                    if (target.leaf || target.nodetype == 'Animation') {
                        this.Checkable = true;
                    }
                
                    this.haschildren = target.haschildren;
                    this.leaf = target.leaf;
                }

                break;
            
            default:


                break;
        }
    }

});
}); // end of require
/*******************************************************************************

***** hack to add temp folder *****

*******************************************************************************/

function MapLayers_Tree_Create_TemFolder(ParentNode) {

    //////if (MapLayers.Settings.debug) console.log("MapLayers_Tree_Create_TemFolder(ParentNode) ", ParentNode );
    if (!MapLayers.Tree.tempid ) {
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

        MapLayers.Tree.tempid = 1;

        var mynewnode = new MapLayers.Tree.Node(newNode, ParentNode);


        MapLayers.Store.Memory.add( mynewnode );

    }

}

/*******************************************************************************


*******************************************************************************/

function MapLayers_Tree_Create_Templayer(Lname, Layer, Controll) {

    //////if (MapLayers.Settings.debug) console.log("MapLayers_Tree_Create_Templayer(Lname, Layer, Controll :", Lname, Layer, Controll);

    var newNode = ({
        leaf: true,
        name: Lname, //dojo
        isExpanded: false, //dojo
        checked: true,
        id: "temp" + MapLayers.Tree.tempid++,
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

    var mynewnode = new MapLayers.Tree.Node(newNode, ParentNode);

    MapLayers.Store.Memory.add( mynewnode );
    MapLayers.Store.Observable.notify(mynewnode);
}

/*******************************************************************************
 *
 *  @brief function to create a tree node
 * 

*******************************************************************************/

function MapLayers_Tree_CreateTreeNode (args) {
     //////if (MapLayers.Settings.debug) console.log("MapLayers_Tree_CreateTreeNode (args) ", args);

    tnode = new dijit._TreeNode(args);
    tnode.labelNode.innerHTML = args.label;

     
    /***** if its Checkable add the checkbox*****/

    if (args.item.Checkable) {

        if ( !args.item.radioGroup) {
            cb = new dijit.form.CheckBox({
                checked: args.item.checked });
        } else {

            cb = new dijit.form.RadioButton({
                checked: args.item.checked,
                name: args.item.radioGroup
                  });
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
}

function MapLayers_Tree_Parse (newNode, ParentNode) {
    ////if (MapLayers.Settings.debug) console.log("MapLayers_Tree_Parse (newNode, ParentNode)", newNode, ParentNode );


    var node = new MapLayers.Tree.Node(newNode, ParentNode);
    var booboo;
    return node;

}

function MapLayers_Tree_Create_querycallback(NodeData) {
    ////if (MapLayers.Settings.debug) console.log("MapLayers_Tree_Create_querycallback(NodeData)", NodeData );
    NodeData.querycallback();
}

/*******************************************************************************
 *
 *  @brief function to create the tree 
 * 

*******************************************************************************/
    

function MapLayers_Tree_Create () {
    
    //////if (MapLayers.Settings.debug) console.log("MapLayers_Tree_Create()");

    /***** make the store *****/

    MapLayers_Store_Create( 1 , MapLayers_Tree_Parse, MapLayers_Tree_Create_querycallback ) 
        
    /***** make the tree itself *****/
    
    MapLayers.Tree.tree = new dijit.Tree(
        {
            model: MapLayers.Store.Model,

            /***** NOTE THE dndSource stuff needs overrode there just stubs *****/
            //dndController: dijit.tree.dndSource, //fixme do we bneed to mod or replace this to save teh tree? what about perms?
            showRoot: true,
            onOpen: function (item, node) { item.ExpandNode(node); },
            onClose: function (item, node) { item.CollapseNode(node); },
            _createTreeNode: MapLayers_Tree_CreateTreeNode
            //fixme the json example had persist: false
        },
        'Tree'
    );

    MapLayers.Tree.tree.placeAt(TreeForm)

    return MapLayers.Tree.tree
}



