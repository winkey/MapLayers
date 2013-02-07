
function NewWorld_login() {
	
	window.open(
    	"/login/",
    	'login',
    	'height=200,width=300,left=10,top=10,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no'
    );
	

}
function NewWorld_login_Finish() {
	NewWorld_Objects.loginbutton.setText('logout'); 
	NewWorld_Objects.loginbutton.setHandler(NewWorld_logout);
	
	/***** need to get a fresh tree *****/ 
	/***** parse hash layer list *****/ 
	
}
	
function NewWorld_logout() {
	
	window.open(
    	"/logout/",
    	'logout',
    	'height=400,width=300,left=10,top=10,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no'
    );
	
	
}
function NewWorld_logout_Finish() {
	NewWorld_Objects.loginbutton.setText('login'); 
	NewWorld_Objects.loginbutton.setHandler(NewWorld_login); 
	
	/***** need to get a fresh tree *****/
	/***** parse hash layer list *****/
}
/*******************************************************************************
   toolbar
*******************************************************************************/


function NewWorld_toolbar_Create(vector) {

	NewWorld_Objects.loginbutton = new Ext.Toolbar.Button({
        text: 'login',
        handler: NewWorld_login
	});

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


