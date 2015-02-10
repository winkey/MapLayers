/*******************************************************************************
 *
 * Project: NewWorld
 * App:     javascript rightclick context menu 
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



function NewWorld_Menu_baseLayerContextMenu() {
  /***** rightclick menu baseLayerContextMenu *****/
      
  var baseLayerContextMenu = new Ext.menu.Menu({
    items: [{
      text: "Adjust Transparency",
      iconCls: 'default-icon-menu',
      handler: function() {
        var node = tree.getSelectionModel().getSelectedNode();
        if(node && node.layer) {
          NewWorld_Widgets_TransparencySlider(node.layer);
        }
      },
      scope: this
    }]
  });

	return baseLayerContextMenu;
}	

function NewWorld_Menu_rasterOverlayContextMenu() {
  /***** rightclick menu rasterOverlayContextMenu *****/
  
  var rasterOverlayContextMenu = new Ext.menu.Menu({
    items: [
      {
        text: "Adjust Transparency",
        iconCls: 'default-icon-menu',
        handler: function() {
          var node = tree.getSelectionModel().getSelectedNode();
          if(node && node.layer) {
            NewWorld_Widgets_TransparencySlider(node.layer);
          }
        },
      scope: this
      },
      {
        text: "Get Layer URL",
        iconCls: 'default-icon-menu',
        handler: function() {
          var node = tree.getSelectionModel().getSelectedNode();
          if(node && node.layer && node.layer.getFullRequestString) {
            Ext.MessageBox.alert(node.layer.name + ' - ' + node.layer.CLASS_NAME,
            node.layer.getFullRequestString());
          }
        },
        scope: this
      },
      {
        text: "Zoom to Layer Extent",
	    iconCls: "icon-zoom-visible",
        handler: function() {
	      var node = tree.getSelectionModel().getSelectedNode();
          if(node && node.layer) {
	        this.map.zoomToExtent(node.layer.myExtent);//restrictedExtent);
	      }
	    },
        scope: this
      }
    ]
  });

	return rasterOverlayContextMenu;
} 