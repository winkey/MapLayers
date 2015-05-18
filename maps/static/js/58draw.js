/*******************************************************************************
 *
 * Project: MapLayers
 * App:     javascript draw vector layers
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


dojo.ready(function() {
    MapLayers.Draw = new Object();


});

function MapLayers_Draw_init() {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Draw_init()");

    MapLayers.Draw.NavControl = new OpenLayers.Control.Navigation();
    MapLayers.Map.ActiveControl = MapLayers.Draw.NavControl;
    MapLayers.Draw.Layers = [];
    MapLayers.Map.map.addControl(MapLayers.Map.ActiveControl);
}

function MapLayers_Draw_DoNav() {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Draw_DoNav()");

    if ( MapLayers.Map.ActiveControl != MapLayers.Draw.NavControl ) {

        if (MapLayers.Map.ActiveControl) {
            MapLayers.Map.ActiveControl.deactivate();
        }
        MapLayers.Map.ActiveControl = MapLayers.Draw.NavControl;
        MapLayers.Map.ActiveControl.activate();
    }
}

function MapLayers_Draw_NewPoint() {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Draw_NewPoint()");

    /***** create the layer *****/

    var Layer = new OpenLayers.Layer.Vector("Point Layer");

    /***** create the Control *****/

    MapLayers.Map.map.addLayers([Layer]);
    var Control = new OpenLayers.Control.DrawFeature(Layer, OpenLayers.Handler.Point);
    MapLayers.Map.map.addControl(Control);

    if (MapLayers.Map.ActiveControl) {
        MapLayers.Map.ActiveControl.deactivate();
    }
    MapLayers.Map.ActiveControl = Control;
    MapLayers.Map.ActiveControl.activate();
    
    /***** create the tree item *****/

    MapLayers.Tree.Tree.CreateTemplayer("Point Layer", Layer, Control)
}

function MapLayers_Draw_NewLine() {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Draw_NewLine()");

    /***** create the layer *****/

    var Layer = new OpenLayers.Layer.Vector("Line Layer");

    /***** add the layer to the map *****/

    MapLayers.Map.map.addLayer(Layer)

    /***** create the Control *****/

    MapLayers.Map.map.addLayers([Layer]);
    var Control = new OpenLayers.Control.DrawFeature(Layer, OpenLayers.Handler.Path);
    MapLayers.Map.map.addControl(Control);

    if (MapLayers.Map.ActiveControl) {
        MapLayers.Map.ActiveControl.deactivate();
    }
    MapLayers.Map.ActiveControl = Control;
    MapLayers.Map.ActiveControl.activate();
    
    
    /***** create the tree item *****/

    MapLayers.Tree.Tree.CreateTemplayer("Line Layer", Layer, Control)
}

function MapLayers_Draw_NewPoly() {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Draw_NewPoly()");

    /***** create the layer *****/

    var Layer = new OpenLayers.Layer.Vector("Polygon Layer");

    /***** add the layer to the map *****/

    MapLayers.Map.map.addLayer(Layer)

    /***** create the Control *****/

    MapLayers.Map.map.addLayers([Layer]);
    var Control = new OpenLayers.Control.DrawFeature(Layer, OpenLayers.Handler.Polygon);

    MapLayers.Map.map.addControl(Control);


    if (MapLayers.Map.ActiveControl) {
        MapLayers.Map.ActiveControl.deactivate();
    }
    MapLayers.Map.ActiveControl = Control;
    MapLayers.Map.ActiveControl.activate();
    

    
    /***** create the tree item *****/

    MapLayers.Tree.Tree.CreateTemplayer("Polygon Layer", Layer, Control)
}

function MapLayers_Draw_NewBox() {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Draw_NewBox() :");

    /***** create the layer *****/

    var Layer = new OpenLayers.Layer.Vector("Box Layer");

    /***** add the layer to the map *****/

    MapLayers.Map.map.addLayer(Layer)

    /***** create the Control *****/

    MapLayers.Map.map.addLayers([Layer]);
    var Control = new OpenLayers.Control.DrawFeature(
        Layer,
        OpenLayers.Handler.RegularPolygon,
        {
            handlerOptions: {
                sides: 4,
                irregular: true
            }
        }
    );
    MapLayers.Map.map.addControl(Control);


    if (MapLayers.Map.ActiveControl) {
        MapLayers.Map.ActiveControl.deactivate();
    }
    MapLayers.Map.ActiveControl = Control;
    MapLayers.Map.ActiveControl.activate();
    
    
    /***** create the tree item *****/

    MapLayers.Tree.Tree.CreateTemplayer("Box Layer", Layer, Control)

}



/* an array of draw controls that are added when there chosen, each one a new layer of the type
the tree should have a temporary layers thing where we add them, then drag and drop should support saving them to the db
the draw button should have sub menues to choose layer types

can we do things besides rectagles? mayby a thing to choose number of sides?
*/

