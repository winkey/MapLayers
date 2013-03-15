/*******************************************************************************
 *
 * Project: NewWorld
 * App:     javascript permalink in url hash
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
    newcenter = center.transform(NewWorld.Map.map.getProjectionObject(), proj);
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
    NewWorld.Settings.center = new OpenLayers.LonLat(slon, slat);
  }
  
  /***** if zoom is set in the url, override default *****/

  if ( szoom && szoom != "" ) {
    NewWorld.Settings.zoom = szoom;
  }
  
  /***** if map center and zoom arent set, set them *****/
  
  if (!NewWorld.Map.map.getCenter() || NewWorld.Map.map.getCenter().lon == 0) {
    var proj = new OpenLayers.Projection("EPSG:4326");
    NewWorld.Map.map.setCenter(NewWorld.Settings.center.transform(proj, NewWorld.Map.map.getProjectionObject()), NewWorld.Settings.zoom);
  }
  
}