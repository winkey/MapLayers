



/*******************************************************************************
  transparency slider
*******************************************************************************/

function NewWorld_TransparencySlider_Create() {
	
  var openTransparencySlider = function(layer) {
    var title = 'Transparency - ' + layer.name;
    var transparency_window = new Ext.Window({
      title:title,
      layout:'fit',
      width:300,
      height:100,
      items:[new GeoExt.LayerOpacitySlider({
        layer: layer,
        aggressive: true, 
        width: 200,
        fieldLabel: 'opacity',
        plugins: new GeoExt.LayerOpacitySliderTip()
      })],
      buttons: [{
        text: 'Close',
        handler: function(){
          transparency_window.close();
        }
      }]
    });     
    transparency_window.show();
  };


	return openTransparencySlider;
}

    
function finishup() {



	var openTransparencySlider = NewWorld_TransparencySlider_Create();
	
  	NewWorld_Setcenter();


/*******************************************************************************
   vector drawing layers
*******************************************************************************/

    var vector = new OpenLayers.Layer.Vector("vector");
    /*map.addLayer(vector);*/
	var maptbar = NewWorld_toolbar_Create(vector);

 	var mapPanel = NewWorld_Mappanel_Create(maptbar);

  /***** rightclick menu baseLayerContextMenu *****/
      
  var baseLayerContextMenu = new Ext.menu.Menu({
    items: [{
      text: "Adjust Transparency",
      iconCls: 'default-icon-menu',
      handler: function() {
        var node = tree.getSelectionModel().getSelectedNode();
        if(node && node.layer) {
          openTransparencySlider(node.layer);
        }
      },
      scope: this
    }]
  });

  /***** rightclick menu rasterOverlayContextMenu *****/
  
  var rasterOverlayContextMenu = new Ext.menu.Menu({
    items: [
      {
        text: "Adjust Transparency",
        iconCls: 'default-icon-menu',
        handler: function() {
          var node = tree.getSelectionModel().getSelectedNode();
          if(node && node.layer) {
            openTransparencySlider(node.layer);
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
  
/*******************************************************************************
  tree panel
*******************************************************************************/
    
  var tree = new Ext.tree.TreePanel(
    {
      border: true,
      region: "west",
      title: 'layers',
      width: 250,
      split: true,
      collapsible: true,
      collapseMode: "mini",
      autoScroll: true,
      root: layerRoot,
      listeners: {
        checkchange: treeCheckChange,
        contextmenu: treeContextMenu,
        scope: this
      },
      baseLayerContextMenu: baseLayerContextMenu,
      rasterOverlayContextMenu: rasterOverlayContextMenu
    }
  );

  NewWorld_Viewport_Create(mapPanel, tree);



  /***** get layer list from the url *****/
  
  var pair;
  var slayers = getHashVariable('layers');
  
  if ( slayers && slayers != "") {
    parsetree(layerRoot, slayers);
  }
  

/******************************************************************************
 add openlayers move event
******************************************************************************/
  
  map.events.register('moveend', map, MoveListner);
  

};


	

