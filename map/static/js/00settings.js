/*******************************************************************************
 *
 * Project: NewWorld
 * App:     javascript settings
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


NewWorld_Settings = new Object();

NewWorld_Settings.title = "";
NewWorld_Settings.center = {};
NewWorld_Settings.zoom = 0;
NewWorld_Settings.isLoggedin;

urlcgibin_tc = "";
urlkmlrepeater = "http://hyperquad.telascience.org/cgi-bin/kmlrepeater";

NewWorld_Objects = new Object();

NewWorld_Objects.loginbutton = {};

layers = [];

layerRoot = {};

map = {};

var mapPanel;

/**************************************************************************//**
 *
 *  @brief fuction to deal with the settings object
 * 
 ******************************************************************************/

function NewWorld_Settings_Set(settings) {
	
    NewWorld_Settings.title = settings.title;
    /*NewWorld_Settings.center = OpenLayers.Geometry.fromWKT(settings.center);
     */
    NewWorld_Settings.center = new OpenLayers.LonLat(0, 0);
    NewWorld_Settings.zoom = settings.zoom;
    urlcgibin_tc = settings.tilecacheurl;
    
    document.title = NewWorld_Settings.title;

}