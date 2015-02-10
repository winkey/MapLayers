/*******************************************************************************
 *
 * Project: NewWorld
 * App:     javascript ext toolbar
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


/*******************************************************************************
   toolbar
*******************************************************************************/


function NewWorld_toolbar_Create(vector) {

	if (NewWorld.login.isLoggedin == true) {
		NewWorld.login.loginbutton = new Ext.Toolbar.Button({
	        text: 'logout',
	        handler: NewWorld_logout
		});
	} else {
		NewWorld.login.loginbutton = new Ext.Toolbar.Button({
	        text: 'login',
	        handler: NewWorld_login
		});
	}
	
  var maptbar = [
    NewWorld.login.loginbutton,
    "->",
    new Ext.Toolbar.Button({
        text: 'Open in Google Earth',
        handler: writekml
	}),
    "->",
    new GeoExt.Action({
      control: new OpenLayers.Control.Navigation(),
      map: NewWorld.Map.map,
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
        map: NewWorld.Map.map,
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
        map: NewWorld.Map.map,
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
        map: NewWorld.Map.map,
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


