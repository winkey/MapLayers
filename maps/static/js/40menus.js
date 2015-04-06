/*******************************************************************************
 *
 * Project: MapLayers
 * App:     javascript rightclick context menu 
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

function MapLayers_TreeMenu_Create() {

    var menu = new dijit.Menu();
    menu.bindDomNode(MapLayers.Tree.tree.domNode);

    /* we need this part for some reason */ 
    menu.addChild(new dijit.MenuItem({
        label: "Simple menu item"
    }));


        dojo.connect(treeControl, "onClick",treeControl, function(item,nodeWidget,e){
            console.log("is expandable?: ", nodeWidget.isExpandable, e.target);
            
            if( nodeWidget.isExpandable ) {
                    this._onExpandoClick({node:nodeWidget});
            }
            console.log("item : ", item);
        
        });
        
        dojo.connect(menu, "_openMyself", this, function(e) {
            treenode = dijit.getEnclosingWidget(e.target);            
            // prepare the menu
            dojo.forEach(menu.getChildren(), function(child){
                menu.removeChild(child);
                
                /*if (treenode.item.layer {
                    menu.addChild(new dijit.MenuItem({
                        label: "Zoom to Layer Extent"
                    onClick: function() {
                        this.map.zoomToExtent(treenode.layer.myExtent);
                    }
                }));*/
            }, this);

        });
        
        menu.startup();
}
/*
    MapLayers.Menues = new Object();
    
    MapLayers.Menues.Adj_Transparency = {
        text: "Adjust Transparency",
        iconCls: 'default-icon-menu',
        handler: function() {
          var node = tree.getSelectionModel().getSelectedNode();
          if(node && node.layer) {
            MapLayers_Widgets_TransparencySlider(node.layer);
          }
        },
        scope: this
    };

    MapLayers.Menues.Zoom_Extent = {
        text: "Zoom to Layer Extent",
        iconCls: "icon-zoom-visible",
        handler: function() {
          var node = tree.getSelectionModel().getSelectedNode();
          if(node && node.layer) {
            this.map.zoomToExtent(node.layer.myExtent);
          }
        },
        scope: this
    };

    MapLayers.Menues.Del = {
        text: "Delete",
        iconCls: "icon-zoom-visible",
        handler: function() {
          var node = tree.getSelectionModel().getSelectedNode();
          if(node. ) {
            this.map.zoomToExtent(node.layer.myExtent);
          }
        },
        scope: this
    };

});
*/
function MapLayers_Menu_ContextMenu(node, e) {

    var menu;

    /***** is it a layer or a folder? *****/

    if (node.attributes.leaf) {
        
        /***** base layer? *****/

        if ( NodeData.options.isBaseLayer == true ||
             NodeData.nodetype == 'Google'
           ) {
        
            menu = Ext.menu.Menu({
                items: [
                    MapLayers.Menues.Adj_Transparency
                ]
            });
        } else {
            menu = Ext.menu.Menu({
                items: [
                    MapLayers.Menues.Adj_Transparency,
                    MapLayers.Menues.Zoom_Extent
                ]
            });
        }

    /***** folder node *****/

    } else {

        
    }

}
    
      

