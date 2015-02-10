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



var kml;


/******************************************************************************
    recursive function to parse the tree to build a kml
******************************************************************************/

function parsetree_kml(root, indent) {

    var nodes = root.childNodes;
    
    if (nodes) {
        
        /***** loop over the nodes children *****/
            
        var iNode;
        for ( iNode = 0; iNode < nodes.length ; iNode++ ) {
            
            /***** is the node a laayer *****/
            
            if ( nodes[iNode].attributes.nodeType == "gx_layer" ) {
                
                /***** ignore base layers *****/

                if (nodes[iNode].layer.isBaseLayer) {
                    continue;
                }

                /***** layer kml head *****/

                kml += indent + '<Folder>\n';
                kml += indent + '  <name>' + nodes[iNode].text + '</name>\n';
                kml += indent + '  <visibility>0</visibility>\n';
                kml += indent + '  <open>1</open>\n';
                kml += indent + '  <Style>\n';
                kml += indent + '    <ListStyle>\n';
                kml += indent + '      <listItemType>radioFolder</listItemType>\n';
                kml += indent + '      <bgColor>00ffffff</bgColor>\n';
                kml += indent + '      <maxSnippetLines>2</maxSnippetLines>\n';
                kml += indent + '    </ListStyle>\n';
                kml += indent + '  </Style>\n';

                
                /***** if the layer is on print the off folder first *****/

	            if (nodes[iNode].getUI().isChecked()) {
                    
                    kml += indent + '  <Folder>\n';
                    kml += indent + '    <name>off</name>\n';
                    kml += indent + '    <visibility>0</visibility>\n';
                    kml += indent + '  </Folder>\n';
                }

                /***** print the on folder *****/

                kml += indent + '  <Folder>\n';
                kml += indent + '    <name>on</name>\n';
	            if (nodes[iNode].getUI().isChecked()) {
                    kml += indent + '    <visibility>1</visibility>\n';
                } else {
                    kml += indent + '    <visibility>0</visibility>\n';
                }
                kml += indent + '    <NetworkLink>\n';
                kml += indent + '      <Link>\n';
                kml += indent + '        <href>' + NewWorld.Settings.tilecacheurl + '/1.0.0/' + project + '_'+ nodes[iNode].text + '_4326/0/0/0.kml</href>\n';
                kml += indent + '        <viewRefreshMode>onRegion</viewRefreshMode>\n';
                kml += indent + '      </Link>\n';
                kml += indent + '    </NetworkLink>\n';
                kml += indent + '    <NetworkLink>\n';
                kml += indent + '      <Link>\n';
                kml += indent + '        <href>' + NewWorld.Settings.tilecacheurl + '/1.0.0/' + project + '_'+ nodes[iNode].text + '_4326/0/1/0.kml</href>\n';
                kml += indent + '        <viewRefreshMode>onRegion</viewRefreshMode>\n';
                kml += indent + '      </Link>\n';
                kml += indent + '    </NetworkLink>\n';
                kml += indent + '  </Folder>\n';

                /***** if the layer is off print the off folder last *****/

	            if ( ! nodes[iNode].getUI().isChecked()) {
                    
                    kml += indent + '  <Folder>\n';
                    kml += indent + '    <name>off</name>\n';
                    kml += indent + '    <visibility>1</visibility>\n';
                    kml += indent + '  </Folder>\n';
                }
                
                /***** end the folder for the layer *****/

                kml += indent + '</Folder>\n';

            /***** node must be a container *****/
   
            } else {

                /***** ignore base layers *****/

                if (nodes[iNode].text == "Base Layers") {
                    continue;
                }

                kml += indent + '<Folder>\n';
                kml += indent + '  <name>' + nodes[iNode].text + '</name>\n';
                kml += indent + '  <visibility>0</visibility>\n';
                
                if ( nodes[iNode].isExpanded() ) {
                    kml += indent + '  <open>1</open>\n';
                } else {
                    kml += indent + '  <open>0</open>\n';
                }

                parsetree_kml(nodes[iNode], indent + "  ");

                kml += indent + '</Folder>\n';
            }
        }
    }    
}

function writekml() {
    
    var zoom = NewWorld.Map.map.getZoom();
    
    var center = NewWorld.Map.map.getCenter();
    var proj = new OpenLayers.Projection("EPSG:4326");
    newcenter = center.transform(NewWorld.Map.map.getProjectionObject(), proj);

    var lon = newcenter.lon;
    var lat = newcenter.lat;

    altitude = 128000000;
    for (i = 0; i < zoom; i++) {
        altitude /= 2;
    }
    
    kml = '\
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

    parsetree_kml(NewWorld.Tree.layerRoot, "    ");
    
     kml += '\
  </Document>\n\
</kml>\n';


    var kmlform = document.createElement("form");
    kmlform.method="post" ;
    kmlform.action = urlkmlrepeater;
    kmlform.target = 'kmlframe';
    
    var kmlinput = document.createElement("input");
    kmlinput.setAttribute("name", "kml") ;
    kmlinput.setAttribute("value", kml);

    kmlform.appendChild(kmlinput)
    
    document.getElementById("kmliframe").appendChild(kmlform)

    kmlform.target = "kmlframe"
    kmlform.submit() ;

}


