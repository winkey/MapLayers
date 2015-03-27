/*******************************************************************************
 *
 * Project: NewWorld
 * App:     javascript dojo layer tree
 *
 * 
 *
 *******************************************************************************
 * Copyright (c) 2013,  Brian Case 
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
dojo.require("dojo/store/Memory");
dojo.require("dijit/tree/ObjectStoreModel");
dojo.require("dojo/store/Observable");
//dojo.require("dijit/tree/dndSource");
dojo.require("dojo/aspect");
dojo.require("dojo/store/Memory");

dojo.ready(function() {
    NewWorld.Tree = new Object();
});


/**************************************************************************//**
 *
 * @brief function to fetch the layer tree 
 * 
******************************************************************************/
//fixme
function NewWorld_Tree_GetBranch(id, parent) {
    
    $.getJSON( "../layers/treebranch?id="+id, {},
        function(data) {
             NewWorld_Tree_Parse( data, parent );
             finishup();
        }
    );
}

/*****************************************************************************
 function for the trees checkchange
*****************************************************************************/

function NewWorld_Tree_CheckChange(item, checked) {

    if (NewWorld.Settings.debug) console.log("NewWorld_Tree_CheckChange(item, checked)", item, checked);
    
    /***** if turn on a temp folder item it has a controll, activate it *****/


    /***** temp layer *****/

    if (item.control) {
        if(checked) {
            if (NewWorld.Map.ActiveControl) {
                NewWorld.Map.ActiveControl.deactivate();
            }
            NewWorld.Map.ActiveControl = item.control;
            NewWorld.Map.ActiveControl.activate();
            item.layer.setVisibility(true);
        
        } else {

            item.layer.setVisibility(false);
        }
    }
    
    /***** new permalink add/remove *****/
    
    else if ( item.nodetype != 'Animation' ) {
        if(checked) {
            NewWorld_Hash_Addlayer("layers", item.layer.lid);
            item.layer.setVisibility(true);
            
        } else {
            NewWorld_Hash_Removelayer("layers", item.layer.lid);
            item.layer.setVisibility(false);
        }
    }
    
    if ( item.nodetype == 'Animation' ) {
        
        if(checked) {
            NewWorld_Hash_Addlayer("layers", item.id);
            
            
            var children = NewWorld.Tree.Store.getChildren(item);
            children.forEach(function(child) {
                NewWorld_Time_addnode(child);
                NewWorld.Map.map.addLayer(child.layer);
            });
        }
               
        else {
            NewWorld_Hash_Removelayer("layers", item.id);
            
            var children = NewWorld.Tree.Store.getChildren(item);
            children.forEach(function(child) {
                NewWorld_Time_removenode(child);
                NewWorld.Map.map.removeLayer(child.layer, 'TRUE');
            });
        }

    }
    
    /***** keep the layers out of the map to keep the map fast *****/
    
    else if ( item.layer.isBaseLayer === false &&
         item.nodetype != 'Google'
       ) {
    
        if(checked) {
            NewWorld.Map.map.addLayer(item.layer);
        } else {
            NewWorld.Map.map.removeLayer(item.layer, 'TRUE');
        }

    /***** set the zoom on the map when baselayer is changed *****/

    } else {
        item.layer.onMapResize();
        var center = NewWorld.Map.map.getCenter();
    
        if (NewWorld.Map.map.baseLayer != null && center != null) {
            var zoom = NewWorld.Map.map.getZoom();
            NewWorld.Map.map.zoom = null;
            NewWorld.Map.map.setCenter(center, zoom);
        }
    }
    
    

}

/*****************************************************************************
 function for the tree node expansion
*****************************************************************************/

function NewWorld_Tree_ExpandNode(item, node) {


    /***** search for unexpanded parents *****/

    NewWorld_Hash_Addlayer("open", item.id);
    
}

/*****************************************************************************
 function for the tree node Collapse
*****************************************************************************/

function NewWorld_Tree_CollapseNode(item, node) {

    /***** search children for expanded layers *****/

    NewWorld_Hash_Removelayer("open", item.id);

    
}


/******************************************************************************
    function to parse the tree to turn on the requested layers
******************************************************************************/


function NewWorld_Tree_Find_and_Open_Layers( layers, expand) {
    
    if (NewWorld.Settings.debug) console.log("NewWorld_Tree_FindLayers(layers)", layers);

    /***** loop over the layers in the url *****/

    var lays = layers.split(",");
    var iLid;
    for ( var iLid = 0; iLid < lays.length; iLid++ ) {

        var item = NewWorld.Tree.obStore.query( { id: lays[iLid] } )[0];

        if (item && expand || item.Checkable) {

            /***** the tree isnt expanded posibly so we need to folow it to our node *****/

/***** fixme in the next release 
            var paths= NewWorld.Tree.tree.get('paths');
            var path=[];

            for ( var pitem = item ;
                  pitem ;
                  pitem = NewWorld.Tree.obStore.query( { id: pitem.parent } )[0] 
            ) {
                path.splice( 0, 0, pitem.id);
            }
            
            paths.push(path);

            NewWorld.Tree.tree.set('paths',  paths ); 
****/

            var path = [];
            var pitem;
            for ( pitem = item ;
                  pitem ;
                  pitem = NewWorld.Tree.obStore.query( { id: pitem.parent } )[0] 
            ) {
                path.unshift( pitem );
            }
            
            /***** loop over the path and expand the nodes *****/

            for ( var iPath = 0; iPath < path.length; iPath++ ) {
                var node = NewWorld.Tree.tree.getNodesByItem(path[iPath])[0];
                
                if (node && node.isExpandable) {
                    NewWorld.Tree.tree._expandNode(node);
                }
            }

            /***** now we can click on our node *****/
           
            if (!expand) {
                node = NewWorld.Tree.tree.getNodesByItem(item)[0];
                node.checkbox.set('checked', true);
            }
        }
    }
}

/******************************************************************************
    function to parse the tree to find a node by its id

    i dont think we can use this
******************************************************************************/
//fixme
function NewWorld_Tree_FindNode_by_id(root, id) {

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





function NewWorld_Tree_Parse( NodesArray, ParentNode) {
    
    /***** loop over the array of tree data *****/
    
    while (NodesArray.length > 0 ) {
        
        var layer = null;
        
        /***** pop the node off the array *****/
        
        var NodeData = NodesArray[0];
        NodesArray.shift();
        
        var newNode = ({
            leaf: false,
            name: NodeData.name, //dojo
            //labelType: "text", //dojo
            isExpanded: false, //dojo
            checked: false,
            id: NodeData.id, //dojo
            parent: NodeData.parent, //fixme is this incompatable with dnd?
            lft: NodeData.lft,
            rght: NodeData.rght,
            tree_id: NodeData.tree_id,
            level: NodeData.level,
            nodetype: NodeData.nodetype,
            Checkable: false,
            timestamp:NodeData.timestamp,
            begin_timespan:NodeData.begin_timespan,
            end_timespan:NodeData.end_timespan
        });                                          
            //                                    w                     s                   e            n
            //'myExtent': new OpenLayers.Bounds(-9852248.59963804, 3527237.61654759, -9447717.68891644, 4172836.22079423)
        /***** is this the root node? *****/
        
        if ( ParentNode == null) {
            NewWorld_Tree_Create(NodeData.id);
        }

        switch(NodeData.nodetype) {
            
            case 'Folder':
                break;

            case 'Radio':
                break;

            case 'Animation':
                newNode.Checkable = true;
                break;

            case 'Link':    
                newNode.target = NodeData.target;
                break;
          
            case 'ArcGISCache':
                continue;
    
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
                continue;
                
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
                NodeData.options.tileSize = new OpenLayers.Size(NodeData.options.tileSize[0],
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
                return 

        }
        
        if ( layer != null) {
            
            
            newNode.leaf = true;
            newNode.Checkable = true;
            newNode.layer = layer; 

                
            if (ParentNode.nodetype == 'Radio') {
                newNode.radioGroup = "RadioGroup_" + ParentNode.id;
                
                if (! ParentNode.haschildren) {
                    newNode.checked = true;
                    
                }
                
            }
            
            if (ParentNode.nodetype == 'Animation') {
                newNode.checked = null;
                newNode.Checkable = false;
            }
                
            /***** add a baselayer to the map now *****/
               
            if ( NodeData.options.isBaseLayer == true ||
                 NodeData.nodetype == 'Google'
               ) {
                NewWorld.Map.map.addLayers([layer]);
                
            }
            
            NewWorld.Tree.obStore.add( newNode );
            ParentNode.haschildren = true;

        } else {
            

        //console.log("nodetype  : ", NodeData.nodetype);
        NewWorld.Tree.obStore.add( newNode );

        /***** ad our new node to the tree *****/
        
        if (ParentNode) {
            ParentNode.haschildren = true;
        }


            //fixme could this be wrong if the next item in the array isnt a child?
        NewWorld_Tree_Parse( NodesArray, newNode)
            
        }
       
    }

    /***** hack to add temp folder *****/
    if (ParentNode && ParentNode.id == 1) {
    
        NewWorld_Tree_Parse( [{
            leaf: false,
            isExpanded: false, //dojo
            checked: false,
            id: "temp",
            parent: 1,
            nodetype: "Folder",
            lft: 0,
            rght: 0,
            tree_id: 1,
            level: 1,
            Checkable: false,
            name: "Temporary Layers"
        }], newNode)

        NewWorld.Tree.tempid = 1;
    }
}

/*******************************************************************************


*******************************************************************************/

function NewWorld_Tree_Create_Templayer(Lname, Layer, Controll) {

    if (NewWorld.Settings.debug) console.log("NewWorld_Tree_Create_Templayer(Lname, Layer, Controll :", Lname, Layer, Controll);

    var newNode = ({
        leaf: true,
        name: Lname, //dojo
        isExpanded: false, //dojo
        checked: true,
        id: "temp" + NewWorld.Tree.tempid++,
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

    NewWorld.Tree.obStore.add( newNode );
   
}

/*******************************************************************************
 *
 *  @brief function to create a tree node
 * 

*******************************************************************************/

function NewWorld_Tree_CreateTreeNode (args) {
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
            NewWorld.Tree.Store.put(args.item);

            /***** update the url etc.... *****/

            NewWorld_Tree_CheckChange(args.item, this.checked);

        });
    }

    return tnode;
}




/*******************************************************************************
 *
 *  @brief function to create the tree panel
 * 

*******************************************************************************/
    
function NewWorld_Tree_Create( rootid) {

    if (NewWorld.Settings.debug) console.log("NewWorld_Tree_Create(rootid) :", rootid);

    NewWorld.Tree.Store = new dojo.store.Memory({
        data: [],
        getChildren: function(object){
            return this.query({parent: object.id});
        }
    })

/*
    dojo.aspect.around(NewWorld.Tree.Store, "put", function(originalPut){
        // To support DnD, the store must support put(child, {parent: parent}).
        // Since memory store doesn't, we hack it.
        // Since our store is relational, that just amounts to setting child.parent
        // to the parent's id.
        return function(obj, options){
            if(options && options.parent){
                obj.parent = options.parent.id;
            }
            return originalPut.call(NewWorld.Tree.Store, obj, options);
        }
    });
*/

    NewWorld.Tree.obStore = new dojo.store.Observable( NewWorld.Tree.Store );

    
    NewWorld.Tree.Model = new dijit.tree.ObjectStoreModel({
        store: NewWorld.Tree.obStore,
        query: { id: rootid },
        mayHaveChildren: function(item) {
                    return  !item.leaf;
                }
    });


    /***** add the temp layers *****/


}

function NewWorld_Tree_Create_stage_2 () {
    
    if (NewWorld.Settings.debug) console.log("NewWorld_Tree_Create_stage_2()");

    /***** make the tree itself *****/
    
    NewWorld.Tree.tree = new dijit.Tree(
        {
            model: NewWorld.Tree.Model,

            /***** NOTE THE dndSource stuff needs overrode there just stubs *****/
            //dndController: dijit.tree.dndSource, //fixme do we bneed to mod or replace this to save teh tree? what about perms?
            showRoot: true,
            onOpen: NewWorld_Tree_ExpandNode,
            onClose: NewWorld_Tree_CollapseNode,
            _createTreeNode: NewWorld_Tree_CreateTreeNode
        },
        'Tree'
    )

    NewWorld.Tree.tree.placeAt(TreeForm)

    return NewWorld.Tree.tree
}




