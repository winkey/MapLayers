title = "NASA Lance MODIS";
project = "lance_modis";
urlcgibin_tc = "http://hypercube.telascience.org/tilecache/tilecache.py";
urlkmlrepeater = "http://hyperquad.telascience.org/cgi-bin/kmlrepeater";
document.title = title;
center={};
zoom=0;

Ext.onReady(function() {

    center = new OpenLayers.LonLat(0, 0);
    zoom=4;

});




