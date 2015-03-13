################################################################################
#
# Project: NewWorld
# App:     Layers
#
# models forms and serializers for layer info storage
#
################################################################################
# Copyright (c) 2013,  Brian Case 
#
# Permission is hereby granted, free of charge, to any person obtaining a
# copy of this software and associated documentation files (the "Software"),
# to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense,
# and/or sell copies of the Software, and to permit persons to whom the
# Software is furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included
# in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
# OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.
################################################################################ 

#from django.db import models
from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _
from polymorphic_tree.models import PolymorphicMPTTModel, PolymorphicTreeForeignKey

from django.contrib.auth.models import User, Group

import datetime

FOLDER_TYPE_CHOICES = ( 
    ( 'Folder', 'Folder' ),
    ( 'Radio', 'Radio' ),
    ( 'Animation', 'Animation' ),
    ( 'Link', 'Link' ),
 )

LAYER_TYPE_CHOICES = ( 
    # ( 'ArcGISCache', 'ArcGISCache' ),
    ( 'ArcGIS93Rest', 'ArcGIS93Rest' ),
    ( 'ArcIMS', 'ArcIMS' ),
    ( 'Bing', 'Bing' ),
    ( 'GeoRSS', 'GeoRSS' ),
    ( 'Google', 'Google' ),
    ( 'Googlev3', 'Googlev3' ),
    ( 'KaMap', 'KaMap' ),
    ( 'KaMapCache', 'KaMapCache' ),
    # ( 'MapGuide', 'MapGuide' ),
    ( 'MapServer', 'MapServer' ),
    ( 'OSM', 'OSM' ),
    ( 'TileCache', 'TileCache' ),
    ( 'TMS', 'TMS' ),
    ( 'WMS', 'WMS' ),
    ( 'WMTS', 'WMTS' ),
    ( 'WorldWind', 'WorldWind' ),
    ( 'XYZ', 'XYZ' ),
 )

FORMAT_CHOICES = ( 
    ( 'image/png', 'png' ),
    ( 'image/jpeg', 'jpeg' ),
    ( 'image/tiff', 'tiff' ),
 )


################################################################################
#
# @brief class, form, and serializer for the layer tree node model
#
################################################################################

class layertreenode( PolymorphicMPTTModel ):
    #id = models.BigIntegerField( primary_key=True )
    parent = PolymorphicTreeForeignKey( 'self', blank = True, null = True,
                                        related_name = 'children',
                                        verbose_name = _( 'parent' ) )
    
    # def __unicode__(self):
    #    return self.question

    
    
    
    # extent = models.PolygonField( srid = 4326, editable = False, null = True )
    
    nodetype = models.CharField( max_length = 40, choices = LAYER_TYPE_CHOICES )

    
    added = models.DateTimeField( default = datetime.datetime.utcnow() )
    modified = models.DateTimeField( default = datetime.datetime.utcnow() )
    
    ##### owner group and perms #####
    
    owner = models.ForeignKey( User, editable = False, null = True, blank = True )
    groups = models.ForeignKey( Group, editable = False, null = True, blank = True )

    timestamp = models.DateTimeField( null = True, blank = True )
    begin_timespan = models.DateTimeField( null = True, blank = True )
    end_timespan = models.DateTimeField( null = True, blank = True )
    
    tile_cache = models.NullBooleanField( default = False )
    tooltip = models.CharField( max_length = 80 )
    metadata = models.CharField( max_length = 8096 )

    
    # overriding the default manager with a GeoManager instance.
    # objects = models.GeoManager()
    
    class Meta:
        verbose_name = _( "layertreenode" )
        verbose_name_plural = _( "layertreenodes" )

        
    def GetVisibility( self ):
        return False


class FolderNode():
    pass

class LayerNode():
    pass

################################################################################
#
# @brief class, form, and serializer for the normal folder
#
################################################################################


class Folder( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Display name" )
    
    class Meta:
        verbose_name = _( "Folder" )
        verbose_name_plural = _( "Folders" )

################################################################################
#
# @brief class, form, and serializer for the Radio folder
#
################################################################################

class Radio( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Display name" )
    
    class Meta:
        verbose_name = _( "Radio" )
        verbose_name_plural = _( "Radios" )

################################################################################
#
# @brief class, form, and serializer for the Animation folder
#
################################################################################

class Animation( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Display name" )
    
    class Meta:
        verbose_name = _( "Animation" )
        verbose_name_plural = _( "Animations" )

################################################################################
#
# @brief class, form, and serializer for the Link folder
#
################################################################################

class Link( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Display name" )
    target = models.BigIntegerField( )

    class Meta:
        verbose_name = _( "Link" )
        verbose_name_plural = _( "Link" )

################################################################################
#
# @brief class, form, and serializer for the ArcGISCache layer
#
################################################################################

# class ArcGISCache( layertreenode ):
#    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
#    
#    class Meta:
#        verbose_name = _( "ArcGISCache" )
#        verbose_name_plural = _( "ArcGISCaches" )
#
################################################################################
#
# @brief class, form, and serializer for the ArcGIS93Rest layer
#
################################################################################

class ArcGIS93Rest( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
    
    url = models.CharField( max_length = 2048 )
    
    ##### openlayers options object ##### 

    layers = models.CharField( max_length = 2048 )
    format = models.CharField( max_length = 40, choices = FORMAT_CHOICES )
    srs = models.CharField( max_length = 2048 )
    opacity = models.FloatField( null = True, blank = True )
    attribution = models.CharField( max_length = 2048, null = True, blank = True )
    isBaseLayer = models.NullBooleanField( default = False )
    gutter = models.IntegerField( null = True, blank = True )
    
    class Meta:
        verbose_name = _( "ArcGIS93Rest" )
        verbose_name_plural = _( "ArcGIS93Rests" )

################################################################################
#
# @brief class, form, and serializer for the ArcIMS layer
#
################################################################################

class ArcIMS( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
    
    url = models.CharField( max_length = 2048 )
    
    ##### openlayers options object ##### 
    
    serviceName = models.CharField( max_length = 2048 )
    async = models.NullBooleanField( default = True )
    opacity = models.FloatField( null = True, blank = True )
    attribution = models.CharField( max_length = 2048, null = True, blank = True )
    isBaseLayer = models.NullBooleanField( default = False )
    gutter = models.IntegerField( null = True, blank = True )
    
    class Meta:
        verbose_name = _( "ArcIMS" )
        verbose_name_plural = _( "ArcIMSs" )

################################################################################
#
# @brief class, form, and serializer for the Bing layer
#
################################################################################

BING_TYPE_CHOICES = ( 
    ( 'Road', 'Road' ),
    ( 'AerialWithLabels', 'Hybrid' ),
    ( 'Aerial', 'Aerial' ),
 )
        
class Bing( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
    type = models.CharField( max_length = 40, choices = BING_TYPE_CHOICES )
    key = models.CharField( max_length = 2048 )
    
    opacity = models.FloatField( null = True, blank = True )
    isBaseLayer = models.NullBooleanField( default = False )
    
    class Meta:
        verbose_name = _( "Bing" )
        verbose_name_plural = _( "Bings" )

################################################################################
#
# @brief class, form, and serializer for the GeoRSS layer
#
################################################################################

class GeoRSS( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
    url = models.CharField( max_length = 2048 )
    popupSize = models.CommaSeparatedIntegerField( max_length = 2, default = ( 500, 200 ) )
    projection = models.IntegerField( default = 4326 )
    
    
    attribution = models.CharField( max_length = 2048, null = True, blank = True )
    isBaseLayer = models.NullBooleanField( default = False )
    
    class Meta:
        verbose_name = _( "GeoRSS" )
        verbose_name_plural = _( "GeoRSSs" )

################################################################################
#
# @brief class, form, and serializer for the Google layer
#
################################################################################

GOOGLE_TYPE_CHOICES = ( 
    ( 'G_SATELLITE_MAP', 'Satellite' ),
    ( 'G_HYBRID_MAP', 'Hybrid' ),
    ( 'G_PHYSICAL_MAP', 'Terrain' ),
    ( '', 'Streets' ),
 )

class Google( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
    
    type = models.CharField( max_length = 40, choices = GOOGLE_TYPE_CHOICES )
    sphericalMercator = models.NullBooleanField( default = True )
    opacity = models.FloatField( null = True, blank = True )
    isBaseLayer = models.NullBooleanField( default = False )
    
    class Meta:
        verbose_name = _( "Google" )
        verbose_name_plural = _( "Googles" )
    
################################################################################
#
# @brief class, form, and serializer for the Googlev3 layer
#
################################################################################

GOOGLEV3_TYPE_CHOICES = ( 
    ( 'Satellite', 'SATELLITE' ),
    ( 'Hybrid', 'HYBRID' ),
    ( 'Terrain', 'TERRAIN' ),
    ( 'Streets', 'ROADMAP' ),
 )
    
class Googlev3( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
    
    type = models.CharField( max_length = 40, choices = GOOGLEV3_TYPE_CHOICES )
    numZoomLevels = models.IntegerField ( null = True, blank = True )
    opacity = models.FloatField( null = True, blank = True )
    isBaseLayer = models.NullBooleanField( default = False )
    
    class Meta:
        verbose_name = _( "Googlev3" )
        verbose_name_plural = _( "Googlev3s" )

################################################################################
#
# @brief class, form, and serializer for the KaMap layer
#
################################################################################

KaMap_TYPE_CHOICES = ( 
    ( 'png', 'png' ),
    ( 'png24', 'png24' ),
    ( 'jpg', 'jpeg' ),
    ( 'tif', 'tiff' ),
    ( 'gif', 'gif' ),
 )

class KaMap( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
    url = models.CharField( max_length = 2048 )
    
    ##### openlayers param params object #####
      
    g = models.CharField( max_length = 2048 )
    map = models.CharField( max_length = 2048 )
    i = models.CharField( max_length = 40, choices = KaMap_TYPE_CHOICES )
     
    ##### openlayers options object ##### 
    
    opacity = models.FloatField( null = True, blank = True )
    attribution = models.CharField( max_length = 2048, null = True, blank = True )
    isBaseLayer = models.NullBooleanField( default = False )
        
    class Meta:
        verbose_name = _( "KaMap" )
        verbose_name_plural = _( "KaMaps" )

################################################################################
#
# @brief class, form, and serializer for the KaMapCache layer
#
################################################################################

KaMapCache_TYPE_CHOICES = ( 
    ( 'png', 'png' ),
    ( 'png24', 'png24' ),
    ( 'jpg', 'jpeg' ),
    ( 'tif', 'tiff' ),
    ( 'gif', 'gif' ),
 )

class KaMapCache( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
    url = models.CharField( max_length = 2048 )
    
    ##### openlayers param params object #####
      
    g = models.CharField( max_length = 2048 )
    map = models.CharField( max_length = 2048 )
    i = models.CharField( max_length = 40, choices = KaMapCache_TYPE_CHOICES )
    metaTileSize = models.CommaSeparatedIntegerField( max_length = 2, default = ( 5, 5 ) )
    
    ##### openlayers options object ##### 
    
    opacity = models.FloatField( null = True, blank = True )
    attribution = models.CharField( max_length = 2048, null = True, blank = True )
    isBaseLayer = models.NullBooleanField( default = False )
    
    def GetmetaTileSizeW( self ):
        return self.metaTileSize[0]
    def GetmetaTileSizeH( self ):
        return self.metaTileSize[1]
    
    class Meta:
        verbose_name = _( "KaMapCache" )
        verbose_name_plural = _( "KaMapCaches" )

################################################################################
#
# @brief class, form, and serializer for the MapGuide layer
#
################################################################################

# class MapGuide( layertreenode ):
#    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
#    
#    class Meta:
#        verbose_name = _( "" )
#        verbose_name_plural = _( "s" )
#
################################################################################
#
# @brief class, form, and serializer for the MapServer layer
#
################################################################################

class MapServer( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
    
    
    url = models.CharField( max_length = 2048 )
    
    ##### openlayers params object #####
      
    layer = models.CharField( max_length = 2048, null = True, blank = True )
    layers = models.CharField( max_length = 2048, null = True, blank = True )
    map = models.CharField( max_length = 2048, null = True, blank = True )
    
    ##### openlayers options object ##### 
    
    opacity = models.FloatField( null = True, blank = True )
    singleTile = models.NullBooleanField( null = True, blank = True, default = False )
    attribution = models.CharField( max_length = 2048, null = True, blank = True )
    isBaseLayer = models.NullBooleanField( default = False )
    gutter = models.IntegerField( null = True, blank = True )
    
    class Meta:
        verbose_name = _( "Mapserver" )
        verbose_name_plural = _( "Mapservers" )

################################################################################
#
# @brief class, form, and serializer for the OSM layer
#
################################################################################

class OSM( layertreenode, LayerNode ):
    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
    url = models.CharField( max_length = 2048 )
    opacity = models.FloatField( null = True, blank = True )
    isBaseLayer = models.NullBooleanField( default = False )
    
    class Meta:
        verbose_name = _( "OSM" )
        verbose_name_plural = _( "OSMs" )

################################################################################
#
# @brief class, form, and serializer for the TileCache layer
#
################################################################################

class TileCache( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
    url = models.CharField( max_length = 2048 )
    layername = models.CharField( max_length = 2048 )
    
    ##### openlayers options object ##### 
    
    opacity = models.FloatField( null = True, blank = True )
    attribution = models.CharField( max_length = 2048, null = True, blank = True )
    isBaseLayer = models.NullBooleanField( default = False )
    
    class Meta:
        verbose_name = _( "TileCache" )
        verbose_name_plural = _( "TileCaches" )

################################################################################
#
# @brief class, form, and serializer for the TMS layer
#
################################################################################

TMS_TYPE_CHOICES = ( 
    ( 'png', 'png' ),
    ( 'jpg', 'jpeg' ),
    ( 'tif', 'tiff' ),
 )

class TMS( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
    url = models.CharField( max_length = 2048 )
    
    ##### openlayers options object ##### 
    
    layername = models.CharField( max_length = 2048 )
    type = models.CharField( max_length = 40, choices = TMS_TYPE_CHOICES )
    opacity = models.FloatField( null = True, blank = True )
    attribution = models.CharField( max_length = 2048, null = True, blank = True )
    isBaseLayer = models.NullBooleanField( default = False )
    
    class Meta:
        verbose_name = _( "TMS" )
        verbose_name_plural = _( "TMSs" )

################################################################################
#
# @brief class, form, and serializer for the WMS layer
#
################################################################################

class WMS( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
    
    url = models.CharField( max_length = 2048 )
    
    ##### openlayers param params object #####
      
    layers = models.CharField( max_length = 2048 )
    format = models.CharField( max_length = 40, choices = FORMAT_CHOICES )
    transparency = models.NullBooleanField( default = False )
    
    ##### openlayers options object ##### 
    
    opacity = models.FloatField( null = True, blank = True )
    singleTile = models.NullBooleanField( null = True, blank = True, default = False )
    attribution = models.CharField( max_length = 2048, null = True, blank = True )
    isBaseLayer = models.NullBooleanField( default = False )
    gutter = models.IntegerField( null = True, blank = True )
    
    class Meta:
        verbose_name = _( "WMS" )
        verbose_name_plural = _( "WMSs" )

################################################################################
#
# @brief class, form, and serializer for the WMTS layer
#
################################################################################

class WMTS( layertreenode ):
    
    ##### openlayers options object ##### 

    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
    url = models.CharField( max_length = 2048 )
    layer = models.CharField( max_length = 2048, null = True, blank = True )
    
    matrixSet = models.CharField( max_length = 2048, null = True, blank = True )
    
    format = models.CharField( max_length = 40, choices = FORMAT_CHOICES, null = True, blank = True )
    style = models.CharField( max_length = 2048, null = True, blank = True )

    opacity = models.FloatField( null = True, blank = True )
    attribution = models.CharField( max_length = 2048, null = True, blank = True )
    isBaseLayer = models.NullBooleanField( default = False )    

    class Meta:
        verbose_name = _( "WMTS" )
        verbose_name_plural = _( "WMTSs" )

################################################################################
#
# @brief class, form, and serializer for the WorldWind layer
#
################################################################################

class WorldWind( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
    url = models.CharField( max_length = 2048 )
    lzd = models.FloatField( null = True, blank = True, help_text = "Level zero tile size degrees" )
    zoomLevels = models.IntegerField( null = True, blank = True, help_text = "Number of zoom levels" )
    
    ##### PARAMS #####
    
    T = models.CharField( max_length = 2048, null = True, blank = True, help_text = "Tileset" )
    
    ##### options #####
    
    tileSize = models.CommaSeparatedIntegerField( max_length = 2, default = ( 512, 512 ) )
    opacity = models.FloatField( null = True, blank = True )
    attribution = models.CharField( max_length = 2048, null = True, blank = True )
    isBaseLayer = models.NullBooleanField( default = False )
    
    class Meta:
        verbose_name = _( "WorldWind" )
        verbose_name_plural = _( "WorldWinds" )


################################################################################
#
# @brief class, form, and serializer for the XYZ layer
#
################################################################################

class XYZ( layertreenode ):
    name = models.CharField( max_length = 2048, help_text = "Name of Layer" )
    
    url = models.CharField( max_length = 2048 )
    
    ##### ol options object #####
    
    opacity = models.FloatField( null = True, blank = True )
    attribution = models.CharField( max_length = 2048, null = True, blank = True )
    isBaseLayer = models.NullBooleanField( default = False )
    
    class Meta:
        verbose_name = _( "XYZ" )
        verbose_name_plural = _( "XYZs" )


