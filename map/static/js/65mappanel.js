/*******************************************************************************
  map panel
*******************************************************************************/

function NewWorld_Mappanel_Create(maptbar) {  
  var mapPanel = new GeoExt.MapPanel({
    //title: "title",
    //renderTo: "mappanel",
    border: true,
    region: "center",
    map: map,
    center: [map.getCenter().Lon, map.getCenter().Lat],
    zoom: map.getZoom(),
    extent: map.getExtent(),
    stateId: "map",
    tbar: maptbar
  });
  
	return mapPanel;
}