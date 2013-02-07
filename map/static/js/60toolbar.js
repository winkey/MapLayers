/*******************************************************************************
   toolbar
*******************************************************************************/


function NewWorld_toolbar_Create(vector) {

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

	return maptbar;
}

/*******************************************************************************
   toolbar
*******************************************************************************/

function Newworld_login() {}
function NewWorld_toolbar_Create2(vector) {

    var maptbar = Ext.create('Ext.toolbar.Toolbar');
    
    maptbar.add({
        text: 'login',
        handler: Newworld_login,
        tooltip: 'login',
        xtype: 'button'
    });

    
	return maptbar;
}