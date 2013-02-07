

/*******************************************************************************
   toolbar
*******************************************************************************/


function NewWorld_toolbar_Create(vector) {

	if (NewWorld_Settings.isLoggedin == true) {
		NewWorld_Objects.loginbutton = new Ext.Toolbar.Button({
	        text: 'logout',
	        handler: NewWorld_logout
		});
	} else {
		NewWorld_Objects.loginbutton = new Ext.Toolbar.Button({
	        text: 'login',
	        handler: NewWorld_login
		});
	}
	
  var maptbar = [
    NewWorld_Objects.loginbutton,
    "->",
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


