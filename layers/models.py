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

##### srializers #####

from rest_framework import serializers

#####

from django.forms import ModelForm
from django import forms
from django.contrib.auth.models import User, Group

import datetime

FOLDER_TYPE_CHOICES = ( 
    ( 'Folder', 'Folder' ),
    ( 'Radio', 'Radio' ),
    ( 'Animation', 'Animation' ),
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
    
    # overriding the default manager with a GeoManager instance.
    # objects = models.GeoManager()
    
    class Meta:
        verbose_name = _( "layertreenode" )
        verbose_name_plural = _( "layertreenodes" )

        
    def GetVisibility( self ):
        return False
    
class layertreenodeSerializer( serializers.ModelSerializer ):
    
    class Meta:
        model = layertreenode

    # def field_to_native( self, obj, field_name ):
    #    if obj is None:
    #        return None
    #    val = getattr( obj, self.source or field_name )
    #    if val is None:
    #        return None
    #    return super( layertreenodeSerializer, self ).field_to_native( obj, field_name )
       
    def to_native( self, obj ):
        print obj
        #print obj.nodetype
        if isinstance( obj, Folder ) or obj.nodetype == 'Folder' :
            print 'is Folder\n'
            serializer = FolderSerializer( obj )
        elif isinstance( obj, Radio ) or obj.nodetype == 'Radio' :
            print 'is Radio\n'
            serializer = RadioSerializer( obj )
        elif isinstance( obj, Animation ) or obj.nodetype == 'Animation' :
            print 'is Animation\n'
            serializer = AnimationSerializer( obj )
        # elif isinstance( obj, ArcGISCache ) or obj.nodetype == 'ArcGISCache' :
        #    print 'is ArcGISCache\n'
        #    serializer = ArcGISCacheSerializer( obj )
        elif isinstance( obj, ArcGIS93Rest ) or obj.nodetype == 'ArcGIS93Rest' :
            print 'is ArcGIS93Rest\n'
            serializer = ArcGIS93RestSerializer( obj )
        elif isinstance( obj, ArcIMS ) or obj.nodetype == 'ArcIMS' :
            print 'is ArcIMS\n'
            serializer = ArcIMSSerializer( obj )
        elif isinstance( obj, Bing ) or obj.nodetype == 'Bing' :
            print 'is Bing\n'
            serializer = BingSerializer( obj )
        elif isinstance( obj, GeoRSS ) or obj.nodetype == 'GeoRSS' :
            print 'is GeoRSS\n'
            serializer = GeoRSSSerializer( obj )
        elif isinstance( obj, Google ) or obj.nodetype == 'Google' :
            print 'is Google\n'
            serializer = GoogleSerializer( obj )
        elif isinstance( obj, Googlev3 ) or obj.nodetype == 'Googlev3' :
            print 'is Googlev3\n'
            serializer = Googlev3Serializer( obj )
        elif isinstance( obj, KaMap ) or obj.nodetype == 'KaMap' :
            print 'is KaMap\n'
            serializer = KaMapSerializer( obj )
        elif isinstance( obj, KaMapCache ) or obj.nodetype == 'KaMapCache' :
            print 'is KaMapCache\n'
            serializer = KaMapCacheSerializer( obj )
        # elif isinstance( obj, MapGuide ) or obj.nodetype == 'MapGuide' :
        #    print 'is MapGuide\n'
        #    serializer = MapGuideSerializer( obj )
        elif isinstance( obj, MapServer ) or obj.nodetype == 'MapServer' :
            print 'is MapServer\n'
            serializer = MapServerSerializer( obj )
        elif isinstance( obj, OSM ) or obj.nodetype == 'OSM' :
            print 'is OSM\n'
            serializer = OSMSerializer( obj )
        elif isinstance( obj, TileCache ) or obj.nodetype == 'TileCache' :
            print 'is TileCache\n'
            serializer = TileCacheSerializer( obj )
        elif isinstance( obj, TMS ) or obj.nodetype == 'TMS' :
            print 'is TMS\n'
            serializer = TMSSerializer( obj )
        elif isinstance( obj, WMS ) or obj.nodetype == 'WMS' :
            print 'is WMS\n'
            serializer = WMSSerializer( obj )
        elif isinstance( obj, WMTS ) or obj.nodetype == 'WMTS' :
            print 'is WMTS\n'
            serializer = WMTSSerializer( obj )
        elif isinstance( obj, WorldWind ) or obj.nodetype == 'WorldWind' :
            print 'is WorldWind\n'
            serializer = WorldWindSerializer( obj )
        elif isinstance( obj, XYZ ) or obj.nodetype == 'XYZ' :
            print 'is XYZ\n'
            serializer = XYZSerializer( obj )
        elif hasattr( obj, '__iter__' ):
            print 'is iter\n'
            return [self.to_native( item ) for item in obj]
        #    return super( layertreenodeSerializer, self ).to_native( obj )

        print serializer
        print serializer.data
        return serializer.data

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

class FolderForm( ModelForm ):

    class Meta:
        model = Folder
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )


class FolderSerializer( serializers.ModelSerializer ):
    
    class Meta:
        model = Folder

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

class RadioForm( ModelForm ):

    class Meta:
        model = Radio
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )


    
class RadioSerializer( serializers.ModelSerializer ):
    
    class Meta:
        model = Radio

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

class AnimationForm( ModelForm ):

    class Meta:
        model = Animation
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )


    

class AnimationSerializer( serializers.ModelSerializer ):
    
    class Meta:
        model = Animation

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
# class ArcGISCacheForm( ModelForm ):
#
#    class Meta:
#        model = ArcGISCache
#        exclude = ( 'nodetype', 'parent', 'added', 'modified' )
#        
#    
# class ArcGISCacheSerializer( serializers.ModelSerializer ):
#    
#    class Meta:
#        model = ArcGISCache

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

class ArcGIS93RestForm( ModelForm ):

    class Meta:
        model = ArcGIS93Rest
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

class ArcGIS93Rest_options_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = ArcGIS93Rest
        fields = ( 'layers', 'format', 'srs', 'opacity', 'attribution',
                   'isBaseLayer', 'gutter', 'lid', 'visibility' )
    
    lid = serializers.Field( source = 'id' )
    visibility = serializers.Field( source = 'GetVisibility' )
    
class ArcGIS93RestSerializer( serializers.ModelSerializer ):
    options = ArcGIS93Rest_options_Serializer( source = '*' )
    class Meta:
        model = ArcGIS93Rest
        exclude = ( 'layers', 'format', 'srs', 'layers', 'format',
                    'transparency', 'opacity', 'singleTile', 'attribution',
                    'isBaseLayer', 'gutter' )

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

class ArcIMSForm( ModelForm ):

    class Meta:
        model = ArcIMS
        exclude = ( 'serviceName', 'async', 'nodetype', 'parent', 'added', 'modified' )

class ArcIMS_options_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = ArcIMS
        fields = ( 'opacity', 'attribution', 'isBaseLayer', 'gutter', 'lid', 'visibility' )
    
    lid = serializers.Field( source = 'id' )
    visibility = serializers.Field( source = 'GetVisibility' )
    
class ArcIMSSerializer( serializers.ModelSerializer ):
    options = ArcIMS_options_Serializer( source = '*' )
    class Meta:
        model = ArcIMS
        exclude = ( 'opacity', 'attribution', 'opacity', 'attribution', 'isBaseLayer', 'gutter' )
            

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

class BingForm( ModelForm ):

    class Meta:
        model = Bing
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

    
class Bing_options_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = Bing
        fields = ( 'opacity', 'isBaseLayer', 'lid', 'visibility' )
    

    
    lid = serializers.Field( source = 'id' )
    visibility = serializers.Field( source = 'GetVisibility' )
        
class BingSerializer( serializers.ModelSerializer ):
    options = Bing_options_Serializer( source = '*' )
    class Meta:
        model = Bing
        exclude = ( 'opacity', 'isBaseLayer' )
                   
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

class GeoRSSForm( ModelForm ):

    class Meta:
        model = GeoRSS
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )


class GeoRSS_options_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = GeoRSS
        fields = ( 'attribution', 'isBaseLayer', 'lid', 'visibility' )
    

    
    lid = serializers.Field( source = 'id' )
    visibility = serializers.Field( source = 'GetVisibility' )

# fixme mod url for a proxy
class GeoRSSSerializer( serializers.ModelSerializer ):
    options = Bing_options_Serializer( source = '*' )
    class Meta:
        model = GeoRSS
        exclude = ( 'attribution', 'isBaseLayer' )

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
    
       
class GoogleForm( ModelForm ):

    class Meta:
        model = Google
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )


class Google_options_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = Google
        fields = ( 'sphericalMercator', 'type', 'opacity', 'isBaseLayer', 'lid', 'visibility' )
    
    lid = serializers.Field( source = 'id' )
    visibility = serializers.Field( source = 'GetVisibility' )
        
class GoogleSerializer( serializers.ModelSerializer ):
    options = Google_options_Serializer( source = '*' )
    class Meta:
        model = Google
        exclude = ( 'sphericalMercator', 'type', 'opacity', 'isBaseLayer' )
    
    

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

class Googlev3Form( ModelForm ):

    class Meta:
        model = Googlev3
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )


class Googlev3_options_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = Googlev3
        fields = ( 'type', 'numZoomLevels', 'opacity', 'isBaseLayer', 'lid', 'visibility' )
    
    lid = serializers.Field( source = 'id' )
    visibility = serializers.Field( source = 'GetVisibility' )
        
class Googlev3Serializer( serializers.ModelSerializer ):
    options = Googlev3_options_Serializer( source = '*' )
    class Meta:
        model = Googlev3
        exclude = ( 'type', 'numZoomLevels', 'opacity', 'isBaseLayer' )

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

class KaMapForm( ModelForm ):

    class Meta:
        model = KaMap
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )



class KaMap_params_Serializer( serializers.ModelSerializer ):

    class Meta:
        model = KaMap
        fields = ( 'g', 'map', 'i' )
        
class KaMap_options_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = KaMap
        fields = ( 'opacity', 'attribution', 'isBaseLayer', 'lid', 'visibility' )
    
    lid = serializers.Field( source = 'id' )
    visibility = serializers.Field( source = 'GetVisibility' )
    
class KaMapSerializer( serializers.ModelSerializer ):
    params = KaMap_params_Serializer( source = '*' )
    options = KaMap_options_Serializer( source = '*' )

    class Meta:
        model = KaMap
        exclude = ( 'g', 'map', 'i', 'opacity', 'attribution', 'isBaseLayer', 'lid', 'visibility' )


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

class KaMapCacheForm( ModelForm ):

    class Meta:
        model = KaMapCache
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

class KaMapCache_metaTileSize_Serializer( serializers.ModelSerializer ):
    w = serializers.Field( source = 'GetmetaTileSizeW' )
    h = serializers.Field( source = 'GetmetaTileSizeH' )
    class Meta:
        model = KaMapCache
        fields = ( 'w', 'h' )
        
class KaMapCache_params_Serializer( serializers.ModelSerializer ):
    metaTileSize = KaMapCache_metaTileSize_Serializer
    class Meta:
        model = KaMapCache
        fields = ( 'g', 'map', 'i', 'metaTileSize' )
        
class KaMapCache_options_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = KaMapCache
        fields = ( 'opacity', 'attribution', 'isBaseLayer', 'lid', 'visibility' )
    
    lid = serializers.Field( source = 'id' )
    visibility = serializers.Field( source = 'GetVisibility' )
    
class KaMapCacheSerializer( serializers.ModelSerializer ):
    params = KaMapCache_params_Serializer( source = '*' )
    options = KaMapCache_options_Serializer( source = '*' )

    class Meta:
        model = KaMapCache
        exclude = ( 'g', 'map', 'i', 'metaTileSize' 'opacity', 'attribution', 'isBaseLayer', 'lid', 'visibility' )

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
# class MapGuideForm( ModelForm ):
#
#    class Meta:
#        model = MapGuide
#        exclude = ( 'nodetype', 'parent', 'added', 'modified' )
#
#    
# class MapGuideSerializer( serializers.ModelSerializer ):
#    
#    class Meta:
#        model = MapGuide

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
        verbose_name = _( "WMS" )
        verbose_name_plural = _( "WMSs" )

class MapServerForm( ModelForm ):

    class Meta:
        model = MapServer
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

class MapServer_params_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = MapServer
        fields = ( 'layers', 'layers', 'map' )
        
class MapServer_options_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = MapServer
        fields = ( 'opacity', 'singleTile', 'attribution', 'isBaseLayer', 'gutter', 'lid', 'visibility' )
    
    lid = serializers.Field( source = 'id' )
    visibility = serializers.Field( source = 'GetVisibility' )
    
class MapServerSerializer( serializers.ModelSerializer ):
    params = MapServer_params_Serializer( source = '*' )
    options = MapServer_options_Serializer( source = '*' )
    class Meta:
        model = MapServer
        exclude = ( 'layer', 'layers', 'map', 'opacity', 'singleTile', 'attribution', 'isBaseLayer', 'gutter' )

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

    
class OSMForm( ModelForm ):

    class Meta:
        model = OSM
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

      
class OSM_options_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = OSM
        fields = ( 'opacity', 'isBaseLayer', 'lid', 'visibility' )
    

    
    lid = serializers.Field( source = 'id' )
    visibility = serializers.Field( source = 'GetVisibility' )
        
class OSMSerializer( serializers.ModelSerializer ):
    options = OSM_options_Serializer( source = '*' )
    class Meta:
        model = OSM
        exclude = ( 'opacity', 'isBaseLayer' )
    
    
    
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

class TileCacheForm( ModelForm ):

    class Meta:
        model = TileCache
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

    
class TileCache_options_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = TileCache
        fields = ( 'opacity', 'attribution', 'isBaseLayer', 'lid', 'visibility' )
    
    lid = serializers.Field( source = 'id' )
    visibility = serializers.Field( source = 'GetVisibility' )
    
class TileCacheSerializer( serializers.ModelSerializer ):
    options = TileCache_options_Serializer( source = '*' )    
    class Meta:
        model = TileCache
        exclude = ( 'opacity', 'attribution', 'isBaseLayer' )

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

class TMSForm( ModelForm ):

    class Meta:
        model = TMS
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

    
class TMS_options_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = TMS
        fields = ( 'layername', 'type', 'opacity', 'attribution', 'isBaseLayer', 'lid', 'visibility' )
    
    lid = serializers.Field( source = 'id' )
    visibility = serializers.Field( source = 'GetVisibility' )
    
class TMSSerializer( serializers.ModelSerializer ):
    options = TMS_options_Serializer( source = '*' )
    class Meta:
        model = TMS
        exclude = ( 'layername', 'type', 'opacity', 'attribution', 'isBaseLayer' )

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

class WMSForm( ModelForm ):

    class Meta:
        model = WMS
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

class WMS_params_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = WMS
        fields = ( 'layers', 'format', 'transparency' )
        
class WMS_options_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = WMS
        fields = ( 'opacity', 'singleTile', 'attribution', 'isBaseLayer', 'gutter', 'lid', 'visibility' )
    
    lid = serializers.Field( source = 'id' )
    visibility = serializers.Field( source = 'GetVisibility' )
    
class WMSSerializer( serializers.ModelSerializer ):
    params = WMS_params_Serializer( source = '*' )
    options = WMS_options_Serializer( source = '*' )
    class Meta:
        model = WMS
        exclude = ( 'layers', 'format', 'transparency', 'opacity', 'singleTile', 'attribution', 'isBaseLayer', 'gutter' )
        
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

class WMTSForm( ModelForm ):

    class Meta:
        model = WMTS
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

class WMTS_options_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = WMTS
        fields = ( 'name', 'url', 'layer', 'matrixSet', 'format', 'style',
                   'opacity', 'attribution', 'isBaseLayer', 'lid', 'visibility' )
    
    lid = serializers.Field( source = 'id' )
    visibility = serializers.Field( source = 'GetVisibility' )
    
class WMTSSerializer( serializers.ModelSerializer ):
    options = WMTS_options_Serializer( source = '*' )
    
    class Meta:
        model = WMTS

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


class WorldWindForm( ModelForm ):

    class Meta:
        model = WorldWind
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

class WorldWind_options_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = WorldWind
        fields = ( 'opacity', 'attribution', 'isBaseLayer', 'lid', 'visibility' )
    lid = serializers.Field( source = 'id' )
    visibility = serializers.Field( source = 'GetVisibility' )
    
class WorldWind_params_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = WorldWind
        fields = ( 'T' )
        
class WorldWindSerializer( serializers.ModelSerializer ):
    params = WorldWind_params_Serializer( source = '*' )
    options = WorldWind_options_Serializer( source = '*' )
    class Meta:
        model = WorldWind
        exclude = ( 't', 'tileSize', 'opacity', 'attribution', 'isBaseLayer' )

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


class XYZForm( ModelForm ):

    class Meta:
        model = XYZ
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

        
class XYZ_options_Serializer( serializers.ModelSerializer ):
    class Meta:
        model = XYZ
        fields = ( 'opacity', 'attribution', 'isBaseLayer', 'lid', 'visibility' )
        
    lid = serializers.Field( source = 'id' )
    visibility = serializers.Field( source = 'GetVisibility' )
    
                     
class XYZSerializer( serializers.ModelSerializer ):
    
    options = XYZ_options_Serializer( source = '*' )
    class Meta:
        model = XYZ
        exclude = ( 'opacity', 'attribution', 'isBaseLayer' )


################################################################################
#
# @brief these items need set in the json
#
################################################################################
#      displayInLayerSwitcher: true, ### if parent is a radio folder
#
#      visibility: false, always false
#      lid: # set to the pk ofn the tree



################################################################################
#
# @brief class for the layers form
#
################################################################################

class foldersForm( forms.Form ):
    nodetype = forms.ChoiceField ( choices = FOLDER_TYPE_CHOICES )
    # class Meta:
        # model = layertreenode
        # fields = ( 'nodetype' )
        
################################################################################
#
# @brief class for the layers form
#
################################################################################

class layersForm( forms.Form ):
    nodetype = forms.ChoiceField( choices = LAYER_TYPE_CHOICES )
    # class Meta:
        # model = layertreenode
        # fields = ( 'nodetype' )
        
