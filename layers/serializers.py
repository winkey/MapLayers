################################################################################
#
# Project: NewWorld
# App:     Layers
#
# serializers for layer info storage
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

from layers.models import layertreenode
from layers.models import Folder
from layers.models import Radio
from layers.models import Animation
# from layers.models import ArcGISCache
from layers.models import ArcGIS93Rest
from layers.models import ArcIMS
from layers.models import Bing
from layers.models import GeoRSS
from layers.models import Google
from layers.models import Googlev3
from layers.models import KaMap
from layers.models import KaMapCache
# from layers.models import MapGuide
from layers.models import MapServer
from layers.models import OSM
from layers.models import TileCache
from layers.models import TMS
from layers.models import WMS
from layers.models import WMTS
from layers.models import WorldWind
from layers.models import XYZ


##### srializers #####

from rest_framework import serializers


################################################################################
#
# @brief serializer for the layer tree node model
#
################################################################################

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
        elif isinstance( obj, Link ) or obj.nodetype == 'Link' :
            print 'is Link\n'
            serializer = LinkSerializer( obj )
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

################################################################################
#
# @brief serializer for the normal folder
#
class FolderSerializer( serializers.ModelSerializer ):
    
    class Meta:
        model = Folder

################################################################################
#
# @brief serializer for the Radio folder
#
################################################################################

class RadioSerializer( serializers.ModelSerializer ):
    
    class Meta:
        model = Radio

################################################################################
#
# @brief serializer for the Animation folder
#
################################################################################

class AnimationSerializer( serializers.ModelSerializer ):
    
    class Meta:
        model = Animation

################################################################################
#
# @brief serializer for the Link folder
#
################################################################################

class LinkSerializer( serializers.ModelSerializer ):
    
    class Meta:
        model = Link

################################################################################
#
# @brief serializer for the ArcGISCache layer
#
################################################################################

# class ArcGISCacheSerializer( serializers.ModelSerializer ):
#    
#    class Meta:
#        model = ArcGISCache

################################################################################
#
# @brief serializer for the ArcGIS93Rest layer
#
################################################################################

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
# @brief serializer for the ArcIMS layer
#
################################################################################

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
# @brief serializer for the Bing layer
#
################################################################################

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
# @brief serializer for the GeoRSS layer
#
################################################################################

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
# @brief serializer for the Google layer
#
################################################################################

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
# @brief serializer for the Googlev3 layer
#
################################################################################

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
# @brief serializer for the KaMap layer
#
################################################################################

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
# @brief serializer for the KaMapCache layer
#
################################################################################

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
# @brief serializer for the MapGuide layer
#
################################################################################

# class MapGuideSerializer( serializers.ModelSerializer ):
#    
#    class Meta:
#        model = MapGuide

################################################################################
#
# @brief serializer for the MapServer layer
#
################################################################################

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
# @brief serializer for the OSM layer
#
################################################################################

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
# @brief serializer for the TileCache layer
#
################################################################################

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
# @brief serializer for the TMS layer
#
################################################################################

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
# @brief serializer for the WMS layer
#
################################################################################

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
# @brief serializer for the WMTS layer
#
################################################################################

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
# @brief serializer for the WorldWind layer
#
################################################################################

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
# @brief serializer for the XYZ layer
#
################################################################################

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

