var mapPanel;


/*****************************************************************************
 function to fecth a query var from the location bar
*****************************************************************************/

var getHashVariableRet;

function getHashVariable(Variable) {
    
    var hash = document.location.hash
    if ( hash && hash != '') {
        hash = hash.substring(1);
    }
    
    var vars = hash.split('&');
    var i;
    for ( i = 0; i < vars.length; i++ ) {
        pair = vars[i].split('=');
        if (pair[0] == Variable) {
            getHashVariableRet = (pair[1]);
            return (getHashVariableRet);
        }
    }
    
    return (null);
}

/*****************************************************************************
 function to replace a query var in the location bar
*****************************************************************************/

function ReplaceHashVariable(Variable, contents) {
    var newhash=''
    var needamp = false;
    var done = false;
    
    /***** get the hash portion of the url *****/
    
    var hash = document.location.hash
    if ( hash && hash != '') {
        hash = hash.substring(1);
    }
    
    var vars = hash.split('&');
    var i;
    for ( i = 0; i < vars.length; i++ ) {
        var pair = vars[i].split('=');
    
        /***** not the var to replace? *****/

        if (pair[0] != Variable) {
            if (needamp) {
                newhash += '&' + vars[i];
            } else {
                newhash += vars[i];
                needamp=true;
            }
        }
        
        /***** the var to replace *****/
        
        else {
            if (needamp) {
                newhash += '&' + Variable + '=' + contents;
            } else {
                newhash += Variable + '=' + contents;
                needamp=true;
            }
            done = true;
        }
    }
    
    if (!done) {
        if (needamp) {
            newhash += '&' + Variable + '=' + contents;
        } else {
            newhash += Variable + '=' + contents;
            needamp=true;
        }
        done = true;
    }
    
    document.location.hash = newhash;
}

/*****************************************************************************
 build the layer list of all layers minus this one
*****************************************************************************/

function RemoveLayerFromHashLayers(lid) {
    var pair;
    var newlayers = '';
    var needcomma = false;
    
    var layers = getHashVariable('layers');
    if (layers) {
        var lids = layers.split(',')
        var i;
        for ( i = 0; i < lids.length; i++ ) {
            if (lid != lids[i]) {
                if (needcomma) {
                    newlayers += ',' + lids[i];
                } else {
                    newlayers += lids[i];
                    needcomma = true;
                }
            }
        }
    }
    
    /***** set the layers in the url *****/
        
    ReplaceHashVariable('layers', newlayers);
        
}

/*****************************************************************************
 build the layer list of all layers plus this one
*****************************************************************************/

function AddLayerToHashLayers(lid) {

    var newlayers = ''; 
    var needcomma = false;
    var done = false;

    var layers = getHashVariable('layers');
    if (layers) {
        var lids = layers.split(',')
        var i;
        for ( i = 0; i < lids.length; i++ ) {
            if (needcomma) {
                newlayers += ',' + lids[i];
            } else {
                newlayers += lids[i];
                needcomma = true;
            }
            if (lid == lids[i]) {
                done = true;
            }
        }
    }
        
    if (!done) {
        if (needcomma) {
            newlayers += ',' + lid;
        } else {
            newlayers += lid;
            needcomma = true;
        }
        done = true;
    }
    
    /***** set the layers in the url *****/
    
    ReplaceHashVariable('layers', newlayers);
    
}

/*****************************************************************************
 function for the trees checkchange
*****************************************************************************/

function treeCheckChange(node, checked) {

    /***** new permalink add/remove *****/
    
    if(checked) {
        AddLayerToHashLayers(node.layer.lid);
        
    }
    else {
        RemoveLayerFromHashLayers(node.layer.lid);
        
    }

    /***** keep the layers out of the map to keep the map fast *****/
    
    if (node.layer.isBaseLayer === false) {
    
        /***** dont add or remove from the map if perm is true *****/
    
        if (node.layer.perm === false) {
            if(checked) {
                map.addLayer(node.layer);
            } else {
                map.removeLayer(node.layer, 'TRUE');
            }
        }

    /***** set the zoom on the map when baselayer is changed *****/

    } else {
        node.layer.onMapResize();
        var center = map.getCenter();
    
        if (map.baseLayer != null && center != null) {
            var zoom = map.getZoom();
            map.zoom = null;
            map.setCenter(center, zoom);
        }
    }
    
}


/*****************************************************************************
 function for the trees context menu
*****************************************************************************/

function treeContextMenu(node, e) {

    if (node && node.layer) {
        node.select();
        if (node.layer.isBaseLayer) {
            var c = node.getOwnerTree().baseLayerContextMenu;
            c.showAt(e.getXY());
        } else if (node.layer instanceof OpenLayers.Layer.Vector) {
            //var c = node.getOwnerTree().vectorOverlayContextMenu;
            //c.showAt(e.getXY());
            1+1;
        } else {
            var c = node.getOwnerTree().rasterOverlayContextMenu;
            c.showAt(e.getXY());
        }
    }
    
}

/******************************************************************************
    recursive function to parse the tree to turn on the requested layers
******************************************************************************/

function parsetree(root, layers) {

    var nodes = root.childNodes;
    
    if (nodes && layers) {
        
        /***** loop over the nodes children *****/
            
        var iNode;
        for ( iNode = 0; iNode < nodes.length ; iNode++ ) {
            
            /***** is the node a laayer *****/
            mynode = nodes[iNode];
            if ( nodes[iNode].attributes.nodeType == "gx_layer" ) {
                
                /***** loop over the layers in the url *****/

                var lays = layers.split(",");
                var iLid;
                for ( var iLid = 0; iLid < lays.length; iLid++ ) {
                    
                    /***** if this node is in the url list select it *****/
                    
                    if ( nodes[iNode].layer.lid == lays[iLid] ) {
                        nodes[iNode].getUI().toggleCheck(true);
                    }
                }
                
            /***** node must be a container *****/
   
            } else {
                
                /***** open and close the container *****/
                //nodes[iNode].expand(true);
                nodes[iNode].collapse(true);
                
                parsetree(nodes[iNode], layers);
            }
        }
    }    
}

/******************************************************************************
openlayers move event function
******************************************************************************/

function MoveListner() {
    var zoom = this.getZoom();
    ReplaceHashVariable('zoom', zoom);
    
    var center = this.getCenter();
    var proj = new OpenLayers.Projection("EPSG:4326");
    newcenter = center.transform(map.getProjectionObject(), proj);
    ReplaceHashVariable('lon', newcenter.lon);
    ReplaceHashVariable('lat', newcenter.lat);

}



    
function finishup() {

/*******************************************************************************
  transparency slider
*******************************************************************************/

  openTransparencySlider = function(layer) {
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

/*******************************************************************************
   vector drawing layers
*******************************************************************************/

    var vector = new OpenLayers.Layer.Vector("vector");
    /*map.addLayer(vector);
*/

/*******************************************************************************
   toolbar
*******************************************************************************/

  var maptbar = [
    /*new Ext.Toolbar.Button({
        text: 'login',
        handler: Newworld_login
	}),
    "->",*/
    new Ext.Toolbar.Button({
        text: 'Open in Google Earth',
        handler: writekml
	}),
    "->",
    new GeoExt.Action({
      control: new OpenLayers.Control.Navigation(),
      map: map,
      toggleGroup: "edit",
      pressed: true,
      allowDepress: false,
      text: "Navigate"
    }),
    new GeoExt.Action({
        text: "Draw Poly",
        control: new OpenLayers.Control.DrawFeature(
            vector, OpenLayers.Handler.Polygon
        ),
        map: map,
        // button options
        toggleGroup: "edit",
        allowDepress: false,
        tooltip: "Draw Polygon",
        // check item options
        group: "draw"
    }),
    new GeoExt.Action({
        text: "Draw Line",
        control: new OpenLayers.Control.DrawFeature(
            vector, OpenLayers.Handler.Path
        ),
        map: map,
        // button options
        toggleGroup: "edit",
        allowDepress: false,
        tooltip: "Draw Linestring",
        // check item options
        group: "draw"
    }),
    new GeoExt.Action({
        text: "Draw Point",
        control: new OpenLayers.Control.DrawFeature(
            vector, OpenLayers.Handler.Point
        ),
        map: map,
        // button options
        toggleGroup: "edit",
        allowDepress: false,
        tooltip: "Draw Point",
        // check item options
        group: "draw"
    })
  ];


 
/*******************************************************************************
  map panel
*******************************************************************************/

  /***** get lat lon and zoom from the url *****/
  
  var pair;
  var slat = getHashVariable('lat');
  var slon = getHashVariable('lon');
  var szoom = getHashVariable('zoom');
  
  /***** if lat and lon are set in the url, override default *****/
  
  if ( slat && slat != "" && slon && slon != "" ) {
    center = new OpenLayers.LonLat(slon, slat);
  }
  
  /***** if zoom is set in the url, override default *****/

  if ( szoom && szoom != "" ) {
    zoom = szoom;
  }
  
  /***** if map center and zoom arent set, set them *****/
  
  if (!map.getCenter() || map.getCenter().lon == 0) {
    var proj = new OpenLayers.Projection("EPSG:4326");
    map.setCenter(center.transform(proj, map.getProjectionObject()), zoom);
  }

  /***** map panel *****/
  
  mapPanel = new GeoExt.MapPanel({
    title: "title",
    //renderTo: "mappanel",
    border: true,
    region: "center",
    map: map,
    center: [map.getCenter().Lon, map.getCenter().Lat],
    zoom: map.getZoom(),
    extent: map.getExtent(),
    stateId: "map",
    tbar: maptbar
  });

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

/*******************************************************************************
  viewport
*******************************************************************************/

  new Ext.Viewport({
    layout: "fit",
    hideBorders: true,
    items: {
      layout: "border",
      deferredRender: false,
      items: [mapPanel, tree/*, {
        contentEl: "desc",
        region: "east",
        bodyStyle: {"padding": "5px"},
        collapsible: true,
        collapseMode: "mini",
        split: true,
        width: 200,
        title: "Description"
      }*/]
    }
  });



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
