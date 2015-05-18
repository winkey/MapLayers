/*******************************************************************************
 *
 * Project: MapLayers
 * App:     javascript finishup code
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

dojo.require("dojo");

function finishup() {

    //if (MapLayers.Settings.debug) console.log("finishup()");

    MapLayers_Setcenter();
    MapLayers_Draw_init();

    /***** get layer list from the url *****/
    
    var open =  MapLayers_Hash_Get('open');

    if ( open && open != "") {
        MapLayers.Tree.Tree.ExpandLayers( open);
    }
}

function finishup2() {   

    //if (MapLayers.Settings.debug) console.log("finishup2()");

    MapLayers_toolbar_Create();
    MapLayers_Time_CreateSlider();
    dijit.registry.byId("borderContainer").resize();

    var layers = MapLayers_Hash_Get('layers');
    if ( layers && layers != "") {
        MapLayers.Tree.Tree.PrefetchLayers( layers );
    } else {
        finishup3();
    }

}

function finishup3() {


    //if (MapLayers.Settings.debug) console.log("finishup3()");

    var layers = MapLayers_Hash_Get('layers');
    if ( layers && layers != "") {
        MapLayers.Tree.Tree.TurnOnLayers( layers );
    }
    MapLayers.Time.Toolbar.InitFromHash();



/******************************************************************************
 add openlayers move event
******************************************************************************/
  
    MapLayers.Map.map.events.register('moveend', MapLayers.Map.map, MoveListner);
  
    /***** set the topic on the window *****/
    
    document.title = MapLayers.Settings.title;
};


/**************************************************************************//**
 *
 *  @brief fuction to get the login status json
 * 
******************************************************************************/

function MapLayers_Login_GetJson() {
    
    $.getJSON( "isLoggedin", {}, 
        function(data) {
            MapLayers.login.isLoggedin = data.isLoggedin;

            MapLayers_OLMap_Create();
            MapLayers_Tree_Create();

        }
    );
}

/**************************************************************************//**
 *
 *  @brief fuction to get the settings json
 * 
******************************************************************************/


function MapLayers_Settings_GetJson() {
    
    $.getJSON( "settings", {}, 
        function(data) {
            MapLayers_Settings_Set(data);
            MapLayers_Login_GetJson();
        }
    );
}



dojo.ready(function() {
    
    MapLayers_Settings_GetJson();

});
