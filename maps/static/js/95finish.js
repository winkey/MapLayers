/*******************************************************************************
 *
 * Project: NewWorld
 * App:     javascript finishup code
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

dojo.require("dojo");

function finishup() {



    
    NewWorld_Setcenter();
    NewWorld_Draw_init();

    NewWorld_toolbar_Create();
    NewWorld_Time_CreateSlider();
    dijit.registry.byId("borderContainer").resize();
      /***** get layer list from the url *****/
  
    
    var layers = NewWorld_Hash_Get('layers');
    var open =  NewWorld_Hash_Get('open');

    if ( open && open != "") {
        NewWorld_Tree_Find_and_Open_Layers( open, true);
    }
    if ( layers && layers != "") {
        NewWorld_Tree_Find_and_Open_Layers( layers, false);
    }
  

/******************************************************************************
 add openlayers move event
******************************************************************************/
  
    NewWorld.Map.map.events.register('moveend', NewWorld.Map.map, MoveListner);
  
    /***** set the topic on the window *****/
    
    document.title = NewWorld.Settings.title;
};





/**************************************************************************//**
 *
 * @brief function to fetch the layer tree 
 * 
******************************************************************************/

function NewWorld_Tree_GetJson() {
    
    $.getJSON( "../layers/treejson", {},
        function(data) {
            NewWorld_Tree_Parse( data, null );
            NewWorld_Tree_Create_stage_2();
            finishup();
        }
    );
}

/**************************************************************************//**
 *
 *  @brief fuction to get the login status json
 * 
******************************************************************************/


function NewWorld_Login_GetJson() {
    
    $.getJSON( "isLoggedin", {}, 
        function(data) {
            NewWorld.login.isLoggedin = data.isLoggedin;

            NewWorld_OLMap_Create();



            NewWorld_Tree_GetJson();
        }
    );
}

/**************************************************************************//**
 *
 *  @brief fuction to get the settings json
 * 
******************************************************************************/


function NewWorld_Settings_GetJson() {
    
    $.getJSON( "settings", {}, 
        function(data) {
            NewWorld_Settings_Set(data);
            NewWorld_Login_GetJson();
        }
    );
}



dojo.ready(function() {



    NewWorld_Settings_GetJson();
});
