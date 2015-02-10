################################################################################
#
# Project: NewWorld
# App:     Layers
#
# forms for layer info storage
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
from django.utils.translation import ugettext_lazy as _


from . import models


from django.forms import ModelForm
from django import forms
from django.contrib.auth.models import User, Group


################################################################################
#
# @brief form for the layer tree node model
#
################################################################################

class layertreenodeForm( ModelForm ):

    class Meta:
        model = models.layertreenode
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )
    
    
################################################################################
#
# @brief form for the normal folder
#
################################################################################

class FolderForm( ModelForm ):

    class Meta:
        model = models.Folder
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

################################################################################
#
# @brief form for the Radio folder
#
################################################################################

class RadioForm( ModelForm ):

    class Meta:
        model = models.Radio
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

################################################################################
#
# @brief form for the Animation folder
#
################################################################################

class AnimationForm( ModelForm ):

    class Meta:
        model = models.Animation
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

################################################################################
#
# @brief form for the ArcGISCache layer
#
################################################################################

# class ArcGISCacheForm( ModelForm ):
#
#    class Meta:
#        model = models.ArcGISCache
#        exclude = ( 'nodetype', 'parent', 'added', 'modified' )
#        
#    
################################################################################
#
# @brief form for the ArcGIS93Rest layer
#
################################################################################

class ArcGIS93RestForm( ModelForm ):

    class Meta:
        model = models.ArcGIS93Rest
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

################################################################################
#
# @brief form for the ArcIMS layer
#
################################################################################

class ArcIMSForm( ModelForm ):

    class Meta:
        model = models.ArcIMS
        exclude = ( 'serviceName', 'async', 'nodetype', 'parent', 'added', 'modified' )

################################################################################
#
# @brief form for the Bing layer
#
################################################################################

class BingForm( ModelForm ):

    class Meta:
        model = models.Bing
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

################################################################################
#
# @brief form for the GeoRSS layer
#
################################################################################

class GeoRSSForm( ModelForm ):

    class Meta:
        model = models.GeoRSS
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

################################################################################
#
# @brief form for the Google layer
#
################################################################################

class GoogleForm( ModelForm ):

    class Meta:
        model = models.Google
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

################################################################################
#
# @brief form for the Googlev3 layer
#
################################################################################

class Googlev3Form( ModelForm ):

    class Meta:
        model = models.Googlev3
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

################################################################################
#
# @brief form for the KaMap layer
#
################################################################################

class KaMapForm( ModelForm ):

    class Meta:
        model = models.KaMap
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

################################################################################
#
# @brief form for the KaMapCache layer
#
################################################################################

class KaMapCacheForm( ModelForm ):

    class Meta:
        model = models.KaMapCache
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

################################################################################
#
# @brief form for the MapGuide layer
#
################################################################################

# class MapGuideForm( ModelForm ):
#
#    class Meta:
#        model = models.MapGuide
#        exclude = ( 'nodetype', 'parent', 'added', 'modified' )
#
################################################################################
#
# @brief form for the MapServer layer
#
################################################################################

class MapServerForm( ModelForm ):

    class Meta:
        model = models.MapServer
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

################################################################################
#
# @brief form for the OSM layer
#
################################################################################

class OSMForm( ModelForm ):

    class Meta:
        model = models.OSM
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

################################################################################
#
# @brief form for the TileCache layer
#
################################################################################

class TileCacheForm( ModelForm ):

    class Meta:
        model = models.TileCache
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

################################################################################
#
# @brief form for the TMS layer
#
################################################################################

class TMSForm( ModelForm ):

    class Meta:
        model = models.TMS
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

################################################################################
#
# @brief form for the WMS layer
#
################################################################################

class WMSForm( ModelForm ):

    class Meta:
        model = models.WMS
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

################################################################################
#
# @brief form for the WMTS layer
#
################################################################################

class WMTSForm( ModelForm ):

    class Meta:
        model = models.WMTS
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )

################################################################################
#
# @brief form for the WorldWind layer
#
################################################################################

class WorldWindForm( ModelForm ):

    class Meta:
        model = models.WorldWind
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )
################################################################################
#
# @brief form for the XYZ layer
#
################################################################################

class XYZForm( ModelForm ):

    class Meta:
        model = models.XYZ
        exclude = ( 'nodetype', 'parent', 'added', 'modified' )


################################################################################
#
# @brief class for the layers form
#
################################################################################

class foldersForm( forms.Form ):
    nodetype = forms.ChoiceField ( choices = models.FOLDER_TYPE_CHOICES )
    # class Meta:
        # model = models.layertreenode
        # fields = ( 'nodetype' )
        
################################################################################
#
# @brief class for the layers form
#
################################################################################

class layersForm( forms.Form ):
    nodetype = forms.ChoiceField( choices = models.LAYER_TYPE_CHOICES )
    # class Meta:
        # model = models.layertreenode
        # fields = ( 'nodetype' )
        
