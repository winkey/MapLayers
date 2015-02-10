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



from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from polymorphic_tree.admin import PolymorphicMPTTParentModelAdmin, PolymorphicMPTTChildModelAdmin


from . import models

from . import forms

################################################################################
#
# @brief admin for the layer tree node model
#
################################################################################

class layertreenodeChildAdmin(PolymorphicMPTTChildModelAdmin):
    """ Base admin class for all child models """
    base_model = models.layertreenode

    # By using these `base_...` attributes instead of the regular ModelAdmin `form` and `fieldsets`,
    # the additional fields of the child models are automatically added to the admin form.
    base_form = forms.layertreenodeForm
    #base_fieldsets = (
    #    ...
    #)

################################################################################
#
# @brief admin for the normal folder
#
################################################################################

class FolderAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the Radio folder
#
################################################################################

class RadioAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the Animation folder
#
################################################################################

class AnimationAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the ArcGISCache layer
#
################################################################################

#class ArcGISCacheAdmin(layertreenodeChildAdmin):
#    pass

################################################################################
#
# @brief admin for the ArcGIS93Rest layer
#
################################################################################

class ArcGIS93RestAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the ArcIMS layer
#
################################################################################

class ArcIMSAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the Bing layer
#
################################################################################

class BingAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the GeoRSS layer
#
################################################################################

class GeoRSSAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the Google layer
#
################################################################################

class GoogleAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the Googlev3 layer
#
################################################################################

class Googlev3Admin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the KaMap layer
#
################################################################################

class KaMapAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the KaMapCache layer
#
################################################################################

class KaMapCacheAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the MapGuide layer
#
################################################################################

#class MapGuideAdmin(layertreenodeChildAdmin):
#    pass

################################################################################
#
# @brief admin for the MapServer layer
#
################################################################################

class MapServerAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the OSM layer
#
################################################################################

class OSMAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the TileCache layer
#
################################################################################

class TileCacheAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the TMS layer
#
################################################################################

class TMSAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the WMS layer
#
################################################################################

class WMSAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the WMTS layer
#
################################################################################

class WMTSAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the WorldWind layer
#
################################################################################

class WorldWindAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief admin for the XYZ layer
#
################################################################################


class XYZAdmin(layertreenodeChildAdmin):
    pass

################################################################################
#
# @brief The parent model admin
#
################################################################################

class layertreenodeParentAdmin(PolymorphicMPTTParentModelAdmin):

    base_model = models.layertreenode
    child_models = (
        (models.Folder, FolderAdmin),
        (models.Radio, RadioAdmin),
        (models.Animation, AnimationAdmin),
        #(models.ArcGISCache, ArcGISCacheAdmin),
        (models.ArcGIS93Rest, ArcGIS93RestAdmin),
        (models.ArcIMS, ArcIMSAdmin),
        (models.Bing, BingAdmin),
        (models.GeoRSS, GeoRSSAdmin),
        (models.Google, GoogleAdmin),
        (models.Googlev3, Googlev3Admin),
        (models.KaMap, KaMapAdmin),
        (models.KaMapCache, KaMapCacheAdmin),
        #(models.MapGuide, MapGuideAdmin),
        (models.MapServer, MapServerAdmin),
        (models.OSM, OSMAdmin),
        (models.TileCache, TileCacheAdmin),
        (models.TMS, TMSAdmin),
        (models.WMS, WMSAdmin),
        (models.WMTS, WMTSAdmin),
        (models.WorldWind, WorldWindAdmin),
        (models.XYZ, XYZAdmin),
    )

admin.site.register(models.layertreenode, layertreenodeParentAdmin)



