/*******************************************************************************
 *
 * Project: MapLayers
 * App:     javascript view in google earth
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
    MapLayers.Kml = new Object();
    

});


/******************************************************************************
    recursive function to parse the tree to build a kml
******************************************************************************/

function MapLayers_Kml_parsetree(item, indent) {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Kml_parsetree(item, indent) ", item, indent);

    var children = MapLayers.Tree.Store.getChildren(item);
    
    if (children) {
        
        /***** loop over the children *****/

        children.forEach(function(child) {
            
            /***** is the node a layer *****/

            if ( child.leaf ) {
                
                /***** ignore base layers *****/

                if (!child.layer.isBaseLayer) {

                    /***** layer kml head *****/

                    MapLayers.Kml.kml += indent + '<Folder>\n';
                    MapLayers.Kml.kml += indent + '  <name>' + child.name + '</name>\n';
                    MapLayers.Kml.kml += indent + '  <visibility>0</visibility>\n';
                    MapLayers.Kml.kml += indent + '  <open>1</open>\n';
                    MapLayers.Kml.kml += indent + '  <Style>\n';
                    MapLayers.Kml.kml += indent + '    <ListStyle>\n';
                    MapLayers.Kml.kml += indent + '      <listItemType>radioFolder</listItemType>\n';
                    MapLayers.Kml.kml += indent + '      <bgColor>00ffffff</bgColor>\n';
                    MapLayers.Kml.kml += indent + '      <maxSnippetLines>2</maxSnippetLines>\n';
                    MapLayers.Kml.kml += indent + '    </ListStyle>\n';
                    MapLayers.Kml.kml += indent + '  </Style>\n';

                    
                    /***** if the layer is on print the off folder first *****/

	                if (child.checked) {
                        
                        MapLayers.Kml.kml += indent + '  <Folder>\n';
                        MapLayers.Kml.kml += indent + '    <name>off</name>\n';
                        MapLayers.Kml.kml += indent + '    <visibility>0</visibility>\n';
                        MapLayers.Kml.kml += indent + '  </Folder>\n';
                    }

                    /***** print the on folder *****/

                    MapLayers.Kml.kml += indent + '  <Folder>\n';
                    MapLayers.Kml.kml += indent + '    <name>on</name>\n';
	                if (child.checked) {
                        MapLayers.Kml.kml += indent + '    <visibility>1</visibility>\n';
                    } else {
                        MapLayers.Kml.kml += indent + '    <visibility>0</visibility>\n';
                    }
                    MapLayers.Kml.kml += indent + '    <NetworkLink>\n';
                    MapLayers.Kml.kml += indent + '      <Link>\n';
                    MapLayers.Kml.kml += indent + '        <href>' + MapLayers.Settings.tilecacheurl + '/1.0.0/' + child.id + '_4326/0/0/0.kml</href>\n';
                    MapLayers.Kml.kml += indent + '        <viewRefreshMode>onRegion</viewRefreshMode>\n';
                    MapLayers.Kml.kml += indent + '      </Link>\n';
                    MapLayers.Kml.kml += indent + '    </NetworkLink>\n';
                    MapLayers.Kml.kml += indent + '    <NetworkLink>\n';
                    MapLayers.Kml.kml += indent + '      <Link>\n';
                    MapLayers.Kml.kml += indent + '        <href>' + MapLayers.Settings.tilecacheurl + '/1.0.0/' + child.id + '_4326/0/1/0.kml</href>\n';
                    MapLayers.Kml.kml += indent + '        <viewRefreshMode>onRegion</viewRefreshMode>\n';
                    MapLayers.Kml.kml += indent + '      </Link>\n';
                    MapLayers.Kml.kml += indent + '    </NetworkLink>\n';
                    MapLayers.Kml.kml += indent + '  </Folder>\n';

                    /***** if the layer is off print the off folder last *****/

	                if ( ! child.checked) {
                        
                        MapLayers.Kml.kml += indent + '  <Folder>\n';
                        MapLayers.Kml.kml += indent + '    <name>off</name>\n';
                        MapLayers.Kml.kml += indent + '    <visibility>1</visibility>\n';
                        MapLayers.Kml.kml += indent + '  </Folder>\n';
                    }
                    
                    /***** end the folder for the layer *****/

                    MapLayers.Kml.kml += indent + '</Folder>\n';

                }

            /***** node must be a container *****/
   
            } else {

                /***** ignore base layers *****/
                console.log( "child before if ", child);
                if (child.name != "Base Layers") {
                    console.log( "got here");
                    MapLayers.Kml.kml += indent + '<Folder>\n';
                    MapLayers.Kml.kml += indent + '  <name>' + child.text + '</name>\n';
                    MapLayers.Kml.kml += indent + '  <visibility>0</visibility>\n';
                    
                    //fixme this is always false
                    if ( child.isExpanded ) {
                        MapLayers.Kml.kml += indent + '  <open>1</open>\n';
                    } else {
                        MapLayers.Kml.kml += indent + '  <open>0</open>\n';
                    }
                    console.log( "got here");
                    MapLayers_Kml_parsetree(child, indent + "  ");


                    MapLayers.Kml.kml += indent + '</Folder>\n';
                }
            }
        });
    }    
}

function MapLayers_Kml_writekml() {
    
    //if (MapLayers.Settings.debug) console.log("MapLayers_Kml_writekml()");

    var zoom = MapLayers.Map.map.getZoom();
    
    var center = MapLayers.Map.map.getCenter();
    var proj = new OpenLayers.Projection("EPSG:4326");
    var newcenter = center.transform(MapLayers.Map.map.getProjectionObject(), proj);

    var lon = newcenter.lon;
    var lat = newcenter.lat;

    var altitude = 128000000;
    for (i = 0; i < zoom; i++) {
        altitude /= 2;
    }
    
    MapLayers.Kml.kml = '\
<?xml version="1.0" encoding="UTF-8"?>\n\
<kml xmlns="http://www.opengis.net/kml/2.2">\n\
  <Document>\n\
    <LookAt>\n\
      <longitude>' + lon + '</longitude>\n\
      <latitude>' + lat + '</latitude>\n\
      <altitude>' + altitude + '</altitude>\n\
      <range>0</range>\n\
      <tilt>0</tilt>\n\
      <heading>0</heading>\n\
      <altitudeMode>absolute</altitudeMode>\n\
    </LookAt>\n\
    <name>testy2</name>\n';

    MapLayers_Kml_parsetree(MapLayers.Tree.obStore.query( { id: 1 } )[0], "    ");
    
     MapLayers.Kml.kml += '\
  </Document>\n\
</kml>\n';


    var kmlform = document.createElement("form");
    kmlform.method="post" ;
    kmlform.action = "./kmlrepeater";
    kmlform.target = 'kmlframe';
    
    var kmlinput = document.createElement("input");
    kmlinput.setAttribute("name", "kml") ;
    kmlinput.setAttribute("value", MapLayers.Kml.kml);

    kmlform.appendChild(kmlinput)
    
    document.getElementById("kmliframe").appendChild(kmlform)

    kmlform.target = "kmlframe"
    kmlform.submit() ;

}


