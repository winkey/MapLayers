/*******************************************************************************
 *
 * Project: NewWorld
 * App:     javascript dojo toolbar
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


function NewWorld_toolbar_Create() {

    if (NewWorld.Settings.debug) console.log("NewWorld_toolbar_Create()");
    
    NewWorld.toolbar = new dijit.Toolbar({}, "toolbar");


    /***** LOGIN BUTTON *****/

    var label="";

    NewWorld.login.loginbutton = new dijit.form.Button({
            label: "Login",
            showLabel: true,
            onClick: NewWorld_login
        });

    if ( NewWorld.login.isLoggedin) {
        NewWorld.login.loginbutton.set('label', 'Logout')
        NewWorld.login.loginbutton.set('onClick', NewWorld_logout)
    }        

    NewWorld.toolbar.addChild(NewWorld.login.loginbutton)
    NewWorld.login.loginbutton.startup();

    NewWorld.toolbar.addChild(new dijit.ToolbarSeparator({}));

    var gebutton = new dijit.form.Button({
        label: "Open in Google Earth",
        showLabel: true,
        onClick: NewWorld_Kml_writekml
    });

    NewWorld.toolbar.addChild(gebutton)
    gebutton.startup();

    NewWorld.toolbar.addChild(new dijit.ToolbarSeparator({}));

    var NavButton = new dijit.form.Button({
        label: "Navigate",
        showLabel: true,
        onClick: NewWorld_Draw_DoNav
    });

    NewWorld.toolbar.addChild(NavButton);
    NavButton.startup();

    
    var DrawMenu = new dijit.DropDownMenu({ style: "display: none;"});

    PointMenu = new dijit.MenuItem({
        label: "New Point Layer",
        onClick: NewWorld_Draw_NewPoint
    });
    DrawMenu.addChild(PointMenu);


    var LineMenu = new dijit.MenuItem({
        label: "New Line Layer",
        onClick: NewWorld_Draw_NewLine
    });
    DrawMenu.addChild(LineMenu);

    var PolyMenu = new dijit.MenuItem({
        label: "New Polygon Layer",
        onClick: NewWorld_Draw_NewPoly
    });
    DrawMenu.addChild(PolyMenu);

    var BoxMenu = new dijit.MenuItem({
        label: "New Box Layer",
        onClick: NewWorld_Draw_NewBox
    });
    DrawMenu.addChild(BoxMenu);

    

    DrawMenu.startup();

    var DrawButton = new dijit.form.DropDownButton({
        label: "Draw",
        dropDown: DrawMenu,
    })
    
    NewWorld.toolbar.addChild(DrawButton);
    DrawButton.startup();


    NewWorld.toolbar.placeAt("ToolbarPane")
    NewWorld.toolbar.startup();

}

    

