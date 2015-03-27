/*******************************************************************************
 *
 * Project: NewWorld
 * App:     javascript openlsyers map
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

dojo.ready(function() {
    NewWorld.Map = new Object();
});

/**************************************************************************//**
 *
 *  @brief fuction to create the openlayers map
 * 
 * fixme theme needs to come from config somehow
******************************************************************************/

function NewWorld_OLMap_Create() {

    //if (NewWorld.Settings.debug) console.log("NewWorld_OLMap_Create()");

    NewWorld.Map.map = new OpenLayers.Map({
        div:                "MapPane",
        units:              "m",
        maxResolution:      156543.0339,
        numZoomLevels:      24,
        projection:         new OpenLayers.Projection("EPSG:900913"),
        displayProjection:  new OpenLayers.Projection("EPSG:4326"),
        maxExtent:          new OpenLayers.Bounds(-20037508.34,-20037508.34, 20037508.34,20037508.34),
        controls:           [new OpenLayers.Control.PanZoomBar(),
                             new OpenLayers.Control.Attribution(),
                             new OpenLayers.Control.MousePosition()
                            ],
        theme:              "../static/OpenLayers-2.13.1/theme/default/style.css",
        allOverlays:        false
    });

}
