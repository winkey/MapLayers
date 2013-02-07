NewWorld_Settings = new Object();

NewWorld_Settings.title = "";
NewWorld_Settings.center = {};
NewWorld_Settings.zoom = 0;

urlcgibin_tc = "";
urlkmlrepeater = "http://hyperquad.telascience.org/cgi-bin/kmlrepeater";



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