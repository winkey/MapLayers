
/**************************************************************************//**
 *
 *  @brief fuction to create the openlayers map
 * 
 * fixme theme needs to come from config somehow
******************************************************************************/

function NewWorld_OLMap_Create() {

  map = new OpenLayers.Map(
    {
      'units' : "m",
      'maxResolution' : 156543.0339,
      'numZoomLevels' : 24,
      'projection' : new OpenLayers.Projection("EPSG:900913"),
      'displayProjection' : new OpenLayers.Projection("EPSG:4326"),
      'maxExtent' : new OpenLayers.Bounds(-20037508.34,-20037508.34, 20037508.34,20037508.34),
      'controls': [new OpenLayers.Control.PanZoomBar(),
                   new OpenLayers.Control.Attribution(),
                   new OpenLayers.Control.MousePosition()
                  ],
      'theme': 'http://openlayers.org/dev/theme/default/style.css',
      allOverlays: false
    }
  );

}
