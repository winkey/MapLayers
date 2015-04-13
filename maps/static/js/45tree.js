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


dojo.ready(function() {
    MapLayers.Tree = new Object();
});


/*****************************************************************************
 function for the trees checkchange
*****************************************************************************/

function MapLayers_Tree_CheckChange(item, checked) {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Tree_CheckChange(item, checked)", item, checked);

    /***** if turn on a temp folder item it has a controll, activate it *****/


    /***** temp layer *****/

    if (item.control) {
        if(checked) {
            if (MapLayers.Map.ActiveControl) {
                MapLayers.Map.ActiveControl.deactivate();
            }
            MapLayers.Map.ActiveControl = item.control;
            MapLayers.Map.ActiveControl.activate();
            item.layer.setVisibility(true);

        } else {

            item.layer.setVisibility(false);
        }
    }

    /***** new permalink add/remove *****/

    else if ( item.nodetype != 'Animation' ) {
        if(checked) {
            MapLayers_Hash_Addlayer("layers", item.layer.lid);
            item.layer.setVisibility(true);

        } else {
            MapLayers_Hash_Removelayer("layers", item.layer.lid);
            item.layer.setVisibility(false);
        }
    }

    if ( item.nodetype == 'Animation' ) {

        if(checked) {
            MapLayers_Hash_Addlayer("layers", item.id);


            var children = MapLayers.Store.Observable.getChildren(item);
            children.forEach(function(child) {
                MapLayers_Time_addnode(child);
                MapLayers.Map.map.addLayer(child.layer);
            });
        }

        else {
            MapLayers_Hash_Removelayer("layers", item.id);

            var children = MapLayers.Store.Observable.getChildren(item);
            children.forEach(function(child) {
                MapLayers_Time_removenode(child);
                MapLayers.Map.map.removeLayer(child.layer, 'TRUE');
            });
        }

    }

    /***** keep the layers out of the map to keep the map fast *****/

    else if ( item.layer.isBaseLayer === false &&
         item.nodetype != 'Google'
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

}

/*****************************************************************************
 function for the tree node expansion
*****************************************************************************/

function MapLayers_Tree_ExpandNode(item, node) {

    /***** search for unexpanded parents *****/

    MapLayers_Hash_Addlayer("open", item.id);

}

/*****************************************************************************
 function for the tree node Collapse
*****************************************************************************/

function MapLayers_Tree_CollapseNode(item, node) {

    /***** search children for expanded layers *****/

    MapLayers_Hash_Removelayer("open", item.id);

}


function MapLayers_Tree_Find_Layers_callback( result ) {

   //if (MapLayers.Settings.debug) console.log("MapLayers_Tree_Find_Layers_callback( result)", result);
    if ( result && result.Checkable ) {

        /***** the tree isnt expanded posibly so we need to folow it to our node *****/

        var path = [];
        var pitem;
        for ( pitem = result ;
              pitem ;
              pitem = MapLayers.Store.Memory.get( pitem.parent )
        ) {
            path.unshift( pitem );
        }

        /***** loop over the path and expand the nodes *****/

        console.log("expanding ", result.id); 
        for ( var iPath = 0; iPath < path.length; iPath++ ) {
            var node = MapLayers.Tree.tree.getNodesByItem(path[iPath])[0];

            if (node && node.isExpandable) {
                MapLayers.Tree.tree._expandNode(node);
            }
        }

        /***** now we can click on our node *****/

        node = MapLayers.Tree.tree.getNodesByItem(result)[0];
        node.checkbox.set('checked', true);
    }
}

function MapLayers_Tree_Open_Layers_callback( result ) {

   //if (MapLayers.Settings.debug) console.log("MapLayers_Tree_Open_Layers_callback( result)", result);
    if ( result ) {

        /***** the tree isnt expanded posibly so we need to folow it to our node *****/

        var path = [];
        var pitem;
        for ( pitem = result ;
              pitem ;
              pitem = MapLayers.Store.Memory.get( pitem.parent )
        ) {
            path.unshift( pitem );
        }

        /***** loop over the path and expand the nodes *****/

        console.log("expanding ", result.id); 
        for ( var iPath = 0; iPath < path.length; iPath++ ) {
            var node = MapLayers.Tree.tree.getNodesByItem(path[iPath])[0];

            if (node && node.isExpandable) {
                MapLayers.Tree.tree._expandNode(node);
            }
        }

    }
}

/******************************************************************************
    function to parse the tree to turn on the requested layers
******************************************************************************/


function MapLayers_Tree_Find_and_Open_Layers( layers, expand) {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Tree_Find_and_Open_Layers( layers, expand)", layers, expand);

    /***** loop over the layers in the url *****/

    var lays = layers.split(",");
    var iLid;
    for ( var iLid = 0; iLid < lays.length; iLid++ ) {

        if (expand) {
            MapLayers_Store_Cache_get_withcallback(
                lays[iLid],
                undefined,
                MapLayers_Tree_Open_Layers_callback,
                expand
            );
        } else {
            MapLayers_Store_Cache_get_withcallback(
                lays[iLid],
                undefined,
                MapLayers_Tree_Find_Layers_callback,
                expand
            );
        }

    }
}

/******************************************************************************
    function to parse the tree to find a node by its id

    i dont think we can use this
******************************************************************************/

function MapLayers_Tree_FindNode_by_id(root, id) {

    var nodes = root.childNodes;

    if (nodes && id) {

        /***** loop over the nodes children *****/

        var iNode;
        for ( iNode = 0; iNode < nodes.length ; iNode++ ) {

            var node = nodes[iNode];

            if ( node.id == id) {
                return node
            }
        }
    }
}


/**************************************************************************//**
 *
 *  @brief recursive funtion to parse the json array into the dojo tree
 * 
 *  @param NodesArray
 *  @param ParentNode
 *  @param LayerArray
 * 
******************************************************************************/





function MapLayers_Tree_Parse( NodeData, ParentNode) {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Tree_Parse( NodeData, ParentNode)", NodeData, ParentNode);

    var layer = null;

    NodeData.leaf = false;
    NodeData.isExpanded = false;
    NodeData.checked = false;
    NodeData.Checkable = false;

    //fixme need extent for zoom to, we dont keep this in the db either
    //                                    w                     s                   e            n
    //'myExtent': new OpenLayers.Bounds(-9852248.59963804, 3527237.61654759, -9447717.68891644, 4172836.22079423)
    switch(NodeData.nodetype) {

        case 'Folder':
            break;

        case 'Radio':
            break;

        case 'Animation':
            NodeData.Checkable = true;
            break;

        case 'Link':    
            NodeData.target = NodeData.target;
            break;

        case 'ArcGISCache':
            return NodeData;

        case 'ArcGIS93Rest':
            layer = new OpenLayers.Layer.ArcGIS93Rest( NodeData.name,
                                                       NodeData.url,
                                                       NodeData.options
                                                     );
           break;

        case 'ArcIMS':
            layer = new OpenLayers.Layer.ArcIMS( NodeData.name,
                                                 NodeData.url,
                                                 NodeData.options
                                               );
            break;

        case 'Bing':
            layer = new OpenLayers.Layer.Bing( NodeData.name,
                                               NodeData.type,
                                               NodeData.key,
                                               NodeData.options
                                              );
            break;

        case 'GeoRSS':

            NodeData.popupSize = new OpenLayers.Size(NodeData.popupSize[0],
                                                     NodeData.popupSize[1]);
            NodeData.projection = new OpenLayers.Projection("EPSG:" + NodeData.projection);

            layer = new OpenLayers.Layer.GeoRSS( NodeData.name,
                                                 NodeData.url,
                                                 NodeData.popupSize,
                                                 NodeData.projection,
                                                 NodeData.options
                                               );
            break;

        case 'Google':

            switch (NodeData.options.type) {
                case 'G_SATELLITE_MAP':
                    NodeData.options.type = G_SATELLITE_MAP;
                    break;
                case 'G_HYBRID_MAP':
                    NodeData.options.type = G_HYBRID_MAP;
                    break;
                case 'G_PHYSICAL_MAP':
                    NodeData.options.type = G_PHYSICAL_MAP
                    break;
            }

            layer = new OpenLayers.Layer.Google( NodeData.name,
                                                 NodeData.options
                                               );
            break;

        case 'Googlev3':
            switch (NodeData.options.type) {
                case 'SATELLITE':
                    NodeData.options.type = google.maps.MapTypeId.SATELLITE;
                    break;
                case 'HYBRID':
                    NodeData.options.type = google.maps.MapTypeId.HYBRID;
                    break;
                case 'TERRAIN':
                    NodeData.options.type = google.maps.MapTypeId.TERRAIN;
                    break;
                case 'ROADMAP':
                    NodeData.options.type = google.maps.MapTypeId.ROADMAP;
                    break;
            }

            layer = new OpenLayers.Layer.Googlev3( NodeData.name,
                                                   NodeData.options
                                                 );
            break;

        case 'KaMap':
            layer = new OpenLayers.Layer.KaMap( NodeData.name,
                                                NodeData.url,
                                                NodeData.params,
                                                NodeData.options
                                              );
            break;

        case 'KaMapCache':
            layer = new OpenLayers.Layer.KaMapCache( NodeData.name,
                                                     NodeData.url,
                                                     NodeData.params,
                                                     NodeData.options
                                                   );
            break;

        case 'MapGuide':
            return NodeData;

        case 'MapServer':
            layer = new OpenLayers.Layer.MapServer( NodeData.name,
                                                    NodeData.url,
                                                    NodeData.params,
                                                    NodeData.options
                                                  );
            break;

        case 'OSM':
            layer = new OpenLayers.Layer.OSM( NodeData.name,
                                              NodeData.url,
                                              NodeData.options
                                            );
            break;

        case 'TMS':
            layer = new OpenLayers.Layer.TMS( NodeData.name,
                                              NodeData.url,
                                              NodeData.options
                                            );
            break;

        case 'TileCache':
            layer = new OpenLayers.Layer.TileCache( NodeData.name,
                                                    NodeData.url,
                                                    NodeData.layername,
                                                    NodeData.options
                                                  );
            break;

        case 'WMS':
            layer = new OpenLayers.Layer.WMS( NodeData.name,
                                              NodeData.url,
                                              NodeData.params,
                                              NodeData.options
                                             );
            break;

        case 'WMTS':
            layer = new OpenLayers.Layer.WMTS( NodeData.options
                                             );
            break;

        case 'WorldWind':
            NodeData.options.tileSize = new OpenLayers.Size( NodeData.options.tileSize[0],
                                                             NodeData.options.tileSize[1] );
            layer = new OpenLayers.Layer.WorldWind( NodeData.name,
                                                    NodeData.url,
                                                    NodeData.lzd,
                                                    NodeData.zoomLevels,
                                                    NodeData.params,
                                                    NodeData.options
                                                  );
            break;

        case 'XYZ':
            layer = new OpenLayers.Layer.XYZ( NodeData.name,
                                              NodeData.url,
                                              NodeData.options
                                            );
            break;

        default:
            return NodeData

    }

    /***** layer *****/

    if ( layer != null) {
        NodeData.leaf = true;
        NodeData.Checkable = true;
        NodeData.layer = layer; 


        if (ParentNode.nodetype == 'Radio') {
            NodeData.radioGroup = "RadioGroup_" + ParentNode.id;

            if (! ParentNode.haschildren) {
                NodeData.checked = true;


            }

        }

        if (ParentNode.nodetype == 'Animation') {
            NodeData.checked = null;
            NodeData.Checkable = false;
        }

        /***** add a baselayer to the map now *****/

        if ( NodeData.options.isBaseLayer == true ||
             NodeData.nodetype == 'Google'
           ) {
            MapLayers.Map.map.addLayers([layer]);

        }



        ParentNode.haschildren = true;

    /***** folder type *****/

    } else {
        if (ParentNode) {
            ParentNode.haschildren = true;
        }
        
        switch(NodeData.nodetype) {
            
            case 'Folder':
                

                if (NodeData.id == 1) {

                    NodeData.isExpanded = true;

                }

                break;

        
            default:
                break;
        }

    }

    return NodeData;
}

/*******************************************************************************


*******************************************************************************/

function MapLayers_Tree_Create_querycallback(NodeData) {
    
    //if (MapLayers.Settings.debug) console.log("MMapLayers_Tree_Create_querycallback(NodeData) ", NodeData );


    switch(NodeData.nodetype) {
        
        case 'Folder':
            

            if (NodeData.id == 1) {

                /***** add tempfolder *****/

                MapLayers_Tree_Create_TemFolder(NodeData)

            }

            break;

        case 'Radio':

            /***** fetch the RADIO   items now *****/
            
            var children = MapLayers.Store.Observable.query( { parent: NodeData.id } );
            
            break;

        case 'Animation':

            /***** fetch the animation items now *****/

            var children = MapLayers.Store.Observable.query( { parent: NodeData.id } );
            
            break;

        case 'Link':

            /***** fetch the link target now *****/

            var target = MapLayers.Store.Observable.query( { id: NodeData.target } )[0];
            
            if ( target ) {            
                if (target.leaf || target.nodetype == 'Animation') {
                    NodeData.Checkable = true;
                }
            
                NodeData.haschildren = target.haschildren;
                NodeData.leaf = target.leaf;
            }

            break;
        
        default:


            break;
    }
}
/*******************************************************************************

***** hack to add temp folder *****

*******************************************************************************/

function MapLayers_Tree_Create_TemFolder(ParentNode) {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Tree_Create_TemFolder(ParentNode) ", ParentNode );
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

        MapLayers.Store.Memory.add( newNode );

    }

}

/*******************************************************************************


*******************************************************************************/

function MapLayers_Tree_Create_Templayer(Lname, Layer, Controll) {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Tree_Create_Templayer(Lname, Layer, Controll :", Lname, Layer, Controll);

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

    MapLayers.Store.Memory.add( newNode );
    MapLayers.Store.Observable.notify(newNode);
}

/*******************************************************************************
 *
 *  @brief function to create a tree node
 * 

*******************************************************************************/

function MapLayers_Tree_CreateTreeNode (args) {
     //if (MapLayers.Settings.debug) console.log("MapLayers_Tree_CreateTreeNode (args) ", args);

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

            MapLayers_Tree_CheckChange(args.item, this.checked);

        });
    }

    return tnode;
}




/*******************************************************************************
 *
 *  @brief function to create the tree 
 * 

*******************************************************************************/
    

function MapLayers_Tree_Create () {
    
    //if (MapLayers.Settings.debug) console.log("MapLayers_Tree_Create()");

    /***** make the store *****/

    MapLayers_Store_Create( 1 , MapLayers_Tree_Parse, MapLayers_Tree_Create_querycallback ) 
        
    /***** make the tree itself *****/
    
    MapLayers.Tree.tree = new dijit.Tree(
        {
            model: MapLayers.Store.Model,

            /***** NOTE THE dndSource stuff needs overrode there just stubs *****/
            //dndController: dijit.tree.dndSource, //fixme do we bneed to mod or replace this to save teh tree? what about perms?
            showRoot: true,
            onOpen: MapLayers_Tree_ExpandNode,
            onClose: MapLayers_Tree_CollapseNode,
            _createTreeNode: MapLayers_Tree_CreateTreeNode
            //fixme the json example had persist: false
        },
        'Tree'
    );

    MapLayers.Tree.tree.placeAt(TreeForm)

    return MapLayers.Tree.tree
}



