/*******************************************************************************
 *
 * Project: NewWorld
 * App:     javascript view in google earth
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





dojo.ready(function() {
    NewWorld.Kml = new Object();
    

});


/******************************************************************************
    recursive function to parse the tree to build a kml
******************************************************************************/

function NewWorld_Kml_parsetree(item, indent) {

    //if (NewWorld.Settings.debug) console.log("NewWorld_Kml_parsetree(item, indent) ", item, indent);

    var children = NewWorld.Tree.Store.getChildren(item);
    
    if (children) {
        
        /***** loop over the children *****/

        children.forEach(function(child) {
            
            /***** is the node a layer *****/

            if ( child.leaf ) {
                
                /***** ignore base layers *****/

                if (!child.layer.isBaseLayer) {

                    /***** layer kml head *****/

                    NewWorld.Kml.kml += indent + '<Folder>\n';
                    NewWorld.Kml.kml += indent + '  <name>' + child.name + '</name>\n';
                    NewWorld.Kml.kml += indent + '  <visibility>0</visibility>\n';
                    NewWorld.Kml.kml += indent + '  <open>1</open>\n';
                    NewWorld.Kml.kml += indent + '  <Style>\n';
                    NewWorld.Kml.kml += indent + '    <ListStyle>\n';
                    NewWorld.Kml.kml += indent + '      <listItemType>radioFolder</listItemType>\n';
                    NewWorld.Kml.kml += indent + '      <bgColor>00ffffff</bgColor>\n';
                    NewWorld.Kml.kml += indent + '      <maxSnippetLines>2</maxSnippetLines>\n';
                    NewWorld.Kml.kml += indent + '    </ListStyle>\n';
                    NewWorld.Kml.kml += indent + '  </Style>\n';

                    
                    /***** if the layer is on print the off folder first *****/

	                if (child.checked) {
                        
                        NewWorld.Kml.kml += indent + '  <Folder>\n';
                        NewWorld.Kml.kml += indent + '    <name>off</name>\n';
                        NewWorld.Kml.kml += indent + '    <visibility>0</visibility>\n';
                        NewWorld.Kml.kml += indent + '  </Folder>\n';
                    }

                    /***** print the on folder *****/

                    NewWorld.Kml.kml += indent + '  <Folder>\n';
                    NewWorld.Kml.kml += indent + '    <name>on</name>\n';
	                if (child.checked) {
                        NewWorld.Kml.kml += indent + '    <visibility>1</visibility>\n';
                    } else {
                        NewWorld.Kml.kml += indent + '    <visibility>0</visibility>\n';
                    }
                    NewWorld.Kml.kml += indent + '    <NetworkLink>\n';
                    NewWorld.Kml.kml += indent + '      <Link>\n';
                    NewWorld.Kml.kml += indent + '        <href>' + NewWorld.Settings.tilecacheurl + '/1.0.0/' + child.id + '_4326/0/0/0.kml</href>\n';
                    NewWorld.Kml.kml += indent + '        <viewRefreshMode>onRegion</viewRefreshMode>\n';
                    NewWorld.Kml.kml += indent + '      </Link>\n';
                    NewWorld.Kml.kml += indent + '    </NetworkLink>\n';
                    NewWorld.Kml.kml += indent + '    <NetworkLink>\n';
                    NewWorld.Kml.kml += indent + '      <Link>\n';
                    NewWorld.Kml.kml += indent + '        <href>' + NewWorld.Settings.tilecacheurl + '/1.0.0/' + child.id + '_4326/0/1/0.kml</href>\n';
                    NewWorld.Kml.kml += indent + '        <viewRefreshMode>onRegion</viewRefreshMode>\n';
                    NewWorld.Kml.kml += indent + '      </Link>\n';
                    NewWorld.Kml.kml += indent + '    </NetworkLink>\n';
                    NewWorld.Kml.kml += indent + '  </Folder>\n';

                    /***** if the layer is off print the off folder last *****/

	                if ( ! child.checked) {
                        
                        NewWorld.Kml.kml += indent + '  <Folder>\n';
                        NewWorld.Kml.kml += indent + '    <name>off</name>\n';
                        NewWorld.Kml.kml += indent + '    <visibility>1</visibility>\n';
                        NewWorld.Kml.kml += indent + '  </Folder>\n';
                    }
                    
                    /***** end the folder for the layer *****/

                    NewWorld.Kml.kml += indent + '</Folder>\n';

                }

            /***** node must be a container *****/
   
            } else {

                /***** ignore base layers *****/
                console.log( "child before if ", child);
                if (child.name != "Base Layers") {
                    console.log( "got here");
                    NewWorld.Kml.kml += indent + '<Folder>\n';
                    NewWorld.Kml.kml += indent + '  <name>' + child.text + '</name>\n';
                    NewWorld.Kml.kml += indent + '  <visibility>0</visibility>\n';
                    
                    //fixme this is always false
                    if ( child.isExpanded ) {
                        NewWorld.Kml.kml += indent + '  <open>1</open>\n';
                    } else {
                        NewWorld.Kml.kml += indent + '  <open>0</open>\n';
                    }
                    console.log( "got here");
                    NewWorld_Kml_parsetree(child, indent + "  ");


                    NewWorld.Kml.kml += indent + '</Folder>\n';
                }
            }
        });
    }    
}

function NewWorld_Kml_writekml() {
    
    //if (NewWorld.Settings.debug) console.log("NewWorld_Kml_writekml()");

    var zoom = NewWorld.Map.map.getZoom();
    
    var center = NewWorld.Map.map.getCenter();
    var proj = new OpenLayers.Projection("EPSG:4326");
    var newcenter = center.transform(NewWorld.Map.map.getProjectionObject(), proj);

    var lon = newcenter.lon;
    var lat = newcenter.lat;

    var altitude = 128000000;
    for (i = 0; i < zoom; i++) {
        altitude /= 2;
    }
    
    NewWorld.Kml.kml = '\
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

    NewWorld_Kml_parsetree(NewWorld.Tree.obStore.query( { id: 1 } )[0], "    ");
    
     NewWorld.Kml.kml += '\
  </Document>\n\
</kml>\n';


    var kmlform = document.createElement("form");
    kmlform.method="post" ;
    kmlform.action = "./kmlrepeater";
    kmlform.target = 'kmlframe';
    
    var kmlinput = document.createElement("input");
    kmlinput.setAttribute("name", "kml") ;
    kmlinput.setAttribute("value", NewWorld.Kml.kml);

    kmlform.appendChild(kmlinput)
    
    document.getElementById("kmliframe").appendChild(kmlform)

    kmlform.target = "kmlframe"
    kmlform.submit() ;

}


