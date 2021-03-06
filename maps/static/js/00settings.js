/*******************************************************************************
 *
 * Project: MapLayers
 * App:     javascript settings
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

require(['dojo/_base/declare'], function(declare) {
    MapLayers = new Object(); 
    MapLayers.Settings = new Object();

    MapLayers.Settings.debug=true;
});


/**************************************************************************//**
 *
 *  @brief fuction to deal with the settings object
 * 
 ******************************************************************************/

function MapLayers_Settings_Set(settings) {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Settings_Set()");

    MapLayers.Settings = settings[0].fields;
    MapLayers.Settings.debug=true;

    var c = OpenLayers.Geometry.fromWKT(MapLayers.Settings.center);
    MapLayers.Settings.mycenter = new OpenLayers.LonLat(c.x, c.y);
    

}
