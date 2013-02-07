/**************************************************************************//**
 *
 *  @brief function to fecth a query var from the location bar
 * 
******************************************************************************/

var getHashVariableRet;

function getHashVariable(Variable) {
    
    var hash = document.location.hash
    if ( hash && hash != '') {
        hash = hash.substring(1);
    }
    
    var vars = hash.split('&');
    var i;
    for ( i = 0; i < vars.length; i++ ) {
        pair = vars[i].split('=');
        if (pair[0] == Variable) {
            getHashVariableRet = (pair[1]);
            return (getHashVariableRet);
        }
    }
    
    return (null);
}

/**************************************************************************//**
 *
 *  @brief function to replace a query var in the location bar
 * 
******************************************************************************/

function ReplaceHashVariable(Variable, contents) {
    var newhash=''
    var needamp = false;
    var done = false;
    
    /***** get the hash portion of the url *****/
    
    var hash = document.location.hash
    if ( hash && hash != '') {
        hash = hash.substring(1);
    }
    
    var vars = hash.split('&');
    var i;
    for ( i = 0; i < vars.length; i++ ) {
        var pair = vars[i].split('=');
    
        /***** not the var to replace? *****/

        if (pair[0] != Variable) {
            if (needamp) {
                newhash += '&' + vars[i];
            } else {
                newhash += vars[i];
                needamp=true;
            }
        }
        
        /***** the var to replace *****/
        
        else {
            if (needamp) {
                newhash += '&' + Variable + '=' + contents;
            } else {
                newhash += Variable + '=' + contents;
                needamp=true;
            }
            done = true;
        }
    }
    
    if (!done) {
        if (needamp) {
            newhash += '&' + Variable + '=' + contents;
        } else {
            newhash += Variable + '=' + contents;
            needamp=true;
        }
        done = true;
    }
    
    document.location.hash = newhash;
}

/**************************************************************************//**
 *
 *  @brief build the layer list of all layers minus this one
*****************************************************************************/

function RemoveLayerFromHashLayers(lid) {
    var pair;
    var newlayers = '';
    var needcomma = false;
    
    var layers = getHashVariable('layers');
    if (layers) {
        var lids = layers.split(',')
        var i;
        for ( i = 0; i < lids.length; i++ ) {
            if (lid != lids[i]) {
                if (needcomma) {
                    newlayers += ',' + lids[i];
                } else {
                    newlayers += lids[i];
                    needcomma = true;
                }
            }
        }
    }
    
    /***** set the layers in the url *****/
        
    ReplaceHashVariable('layers', newlayers);
        
}

/**************************************************************************//**
 *
 *  @brief build the layer list of all layers plus this one
*****************************************************************************/

function AddLayerToHashLayers(lid) {

    var newlayers = ''; 
    var needcomma = false;
    var done = false;

    var layers = getHashVariable('layers');
    if (layers) {
        var lids = layers.split(',')
        var i;
        for ( i = 0; i < lids.length; i++ ) {
            if (needcomma) {
                newlayers += ',' + lids[i];
            } else {
                newlayers += lids[i];
                needcomma = true;
            }
            if (lid == lids[i]) {
                done = true;
            }
        }
    }
        
    if (!done) {
        if (needcomma) {
            newlayers += ',' + lid;
        } else {
            newlayers += lid;
            needcomma = true;
        }
        done = true;
    }
    
    /***** set the layers in the url *****/
    
    ReplaceHashVariable('layers', newlayers);
    
}

/******************************************************************************
openlayers move event function
******************************************************************************/

function MoveListner() {
    var zoom = this.getZoom();
    ReplaceHashVariable('zoom', zoom);
    
    var center = this.getCenter();
    var proj = new OpenLayers.Projection("EPSG:4326");
    newcenter = center.transform(map.getProjectionObject(), proj);
    ReplaceHashVariable('lon', newcenter.lon);
    ReplaceHashVariable('lat', newcenter.lat);

}


/******************************************************************************
  function to get the center and zoom from the url snd set it in the map
******************************************************************************/

function NewWorld_Setcenter() {

 /***** get lat lon and zoom from the url *****/
  
  var pair;
  var slat = getHashVariable('lat');
  var slon = getHashVariable('lon');
  var szoom = getHashVariable('zoom');
  
  /***** if lat and lon are set in the url, override default *****/
  
  if ( slat && slat != "" && slon && slon != "" ) {
    NewWorld_Settings.center = new OpenLayers.LonLat(slon, slat);
  }
  
  /***** if zoom is set in the url, override default *****/

  if ( szoom && szoom != "" ) {
    NewWorld_Settings.zoom = szoom;
  }
  
  /***** if map center and zoom arent set, set them *****/
  
  if (!map.getCenter() || map.getCenter().lon == 0) {
    var proj = new OpenLayers.Projection("EPSG:4326");
    map.setCenter(NewWorld_Settings.center.transform(proj, map.getProjectionObject()), NewWorld_Settings.zoom);
  }
  
}