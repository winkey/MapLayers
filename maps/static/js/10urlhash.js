/*******************************************************************************
 *
 * Project: MapLayers
 * App:     javascript permalink in url hash
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


/**************************************************************************//**
 *
 *  @brief function to fecth a query var from the location bar
 * 
******************************************************************************/

dojo.require("dojo");

require(['dojo/_base/declare'], function(declare) {
    MapLayers.Hash = new Object();

});



function MapLayers_Hash_Get(Variable) {
    
    var hash = document.location.hash
    if ( hash && hash != '') {
        hash = hash.substring(1);
    }
    
    var vars = hash.split('&');
    var i;
    for ( i = 0; i < vars.length; i++ ) {
        pair = vars[i].split('=');
        if (pair[0] == Variable) {
            MapLayers.Hash.GetRet = (pair[1]);
            return (MapLayers.Hash.GetRet);
        }
    }
    
    return (null);
}

/**************************************************************************//**
 *
 *  @brief function to replace a query var in the location bar
 * 
******************************************************************************/

function MapLayers_Hash_Replace(Variable, contents) {
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

function MapLayers_Hash_Removelayer(hashname, lid) {
    var pair;
    var newlayers = '';
    var needcomma = false;
    
    var layers = MapLayers_Hash_Get(hashname);
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
        
    MapLayers_Hash_Replace(hashname, newlayers);
        
}


/**************************************************************************//**
 *
 *  @brief build the layer list of all layers plus this one
*****************************************************************************/

function MapLayers_Hash_Addlayer(hashname, lid) {

    var newlayers = ''; 
    var needcomma = false;
    var done = false;

    var layers = MapLayers_Hash_Get(hashname);
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
    
    MapLayers_Hash_Replace(hashname, newlayers);
    
}

/**************************************************************************//**
 *
 *  @brief build the open list of all layers plus this one
*****************************************************************************/

function AddLayerToHashOpen(lid) {

    var newlayers = ''; 
    var needcomma = false;
    var done = false;

    var layers = MapLayers_Hash_Get('open');
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
    
    MapLayers_Hash_Replace('open', newlayers);
    
}


/******************************************************************************
openlayers move event function
******************************************************************************/

function MoveListner() {
    var zoom = this.getZoom();
    MapLayers_Hash_Replace('zoom', zoom);
    
    var center = this.getCenter();
    var proj = new OpenLayers.Projection("EPSG:4326");
    newcenter = center.transform(MapLayers.Map.map.getProjectionObject(), proj);
    MapLayers_Hash_Replace('lon', newcenter.lon);
    MapLayers_Hash_Replace('lat', newcenter.lat);

}


/******************************************************************************
  function to get the center and zoom from the url snd set it in the map
******************************************************************************/

function MapLayers_Setcenter() {
      

    //if (MapLayers.Settings.debug) console.log("MapLayers_Setcenter()");

    /***** get lat lon and zoom from the url *****/
    
    var pair;
    var slat = MapLayers_Hash_Get('lat');
    var slon = MapLayers_Hash_Get('lon');
    var szoom = MapLayers_Hash_Get('zoom');
    
    /***** if lat and lon are set in the url, override default *****/
    
    if ( slat && slat != "" && slon && slon != "" ) {

        MapLayers.Settings.mycenter = new OpenLayers.LonLat(slon, slat);
    }
    
    /***** if zoom is set in the url, override default *****/

    if ( szoom && szoom != "" ) {
        MapLayers.Settings.zoom = szoom;
    }
    
    /***** if map center and zoom arent set, set them *****/
    
    var ToProj   = MapLayers.Map.map.getProjectionObject();
    var FromProj = new OpenLayers.Projection("EPSG:4326");
    var NewCenter = MapLayers.Settings.mycenter.transform(FromProj, ToProj);
    MapLayers.Map.map.setCenter(NewCenter, MapLayers.Settings.zoom);

    
}
