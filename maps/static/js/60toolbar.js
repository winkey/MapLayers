/*******************************************************************************
 *
 * Project: MapLayers
 * App:     javascript dojo toolbar
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

dojo.require("dijit.Toolbar");
dojo.require("dijit.ToolbarSeparator");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit/form/DropDownButton");
dojo.require("dijit/DropDownMenu");
dojo.require("dijit/MenuItem");


/*******************************************************************************
   toolbar
*******************************************************************************/


function MapLayers_toolbar_Create() {

    //if (MapLayers.Settings.debug) console.log("MapLayers_toolbar_Create()");
    
    MapLayers.toolbar = new dijit.Toolbar({}, "toolbar");


    /***** LOGIN BUTTON *****/

    var label="";

    MapLayers.login.loginbutton = new dijit.form.Button({
            label: "Login",
            showLabel: true,
            onClick: MapLayers_login
        });

    if ( MapLayers.login.isLoggedin) {
        MapLayers.login.loginbutton.set('label', 'Logout')
        MapLayers.login.loginbutton.set('onClick', MapLayers_logout)
    }        

    MapLayers.toolbar.addChild(MapLayers.login.loginbutton)
    MapLayers.login.loginbutton.startup();

    MapLayers.toolbar.addChild(new dijit.ToolbarSeparator({}));

    var gebutton = new dijit.form.Button({
        label: "Open in Google Earth",
        showLabel: true,
        onClick: MapLayers_Kml_writekml
    });

    MapLayers.toolbar.addChild(gebutton)
    gebutton.startup();

    MapLayers.toolbar.addChild(new dijit.ToolbarSeparator({}));

    var NavButton = new dijit.form.Button({
        label: "Navigate",
        showLabel: true,
        onClick: MapLayers_Draw_DoNav
    });

    MapLayers.toolbar.addChild(NavButton);
    NavButton.startup();

    
    var DrawMenu = new dijit.DropDownMenu({ style: "display: none;"});

    PointMenu = new dijit.MenuItem({
        label: "New Point Layer",
        onClick: MapLayers_Draw_NewPoint
    });
    DrawMenu.addChild(PointMenu);


    var LineMenu = new dijit.MenuItem({
        label: "New Line Layer",
        onClick: MapLayers_Draw_NewLine
    });
    DrawMenu.addChild(LineMenu);

    var PolyMenu = new dijit.MenuItem({
        label: "New Polygon Layer",
        onClick: MapLayers_Draw_NewPoly
    });
    DrawMenu.addChild(PolyMenu);

    var BoxMenu = new dijit.MenuItem({
        label: "New Box Layer",
        onClick: MapLayers_Draw_NewBox
    });
    DrawMenu.addChild(BoxMenu);

    

    DrawMenu.startup();

    var DrawButton = new dijit.form.DropDownButton({
        label: "Draw",
        dropDown: DrawMenu,
    })
    
    MapLayers.toolbar.addChild(DrawButton);
    DrawButton.startup();


    MapLayers.toolbar.placeAt("ToolbarPane")
    MapLayers.toolbar.startup();

}

    

