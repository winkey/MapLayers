################################################################################
#
# Project: NewWorld
# App:     tilecache
#
# models for tilecache config
#
################################################################################
# Copyright (c) 2013,  Brian Case 
#
# Permission is hereby granted, free of charge, to any person obtaining a
# copy of this software and associated documentation files (the 'Software'),
# to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense,
# and/or sell copies of the Software, and to permit persons to whom the
# Software is furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included
# in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS
# OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.
################################################################################ 

# from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _

import layers.models as layers

################################################################################
#
# @brief class for map settings model
#
################################################################################


class config( models.Model ):
    def __unicode__( self ):
        return self.question

    lid                 = models.BigIntegerField( unique=True )
    name                = models.TextField( null=False, unique=True )

    ArcXML = 'ArcXML'
    GDAL   = 'GDAL'
    Image = 'Image'
    Mapserver = 'Mapserver'
    Mapnik = 'Mapnik'
    WMS = 'WMS'

    TYPE_CHOICES = (
        (ArcXML, ArcXML),
        (GDAL, GDAL),
        (Image, Image),
        (Mapserver, Mapserver),
        (Mapnik, Mapnik),
        (WMS, WMS),
    )

    type                = models.TextField( null=False, choices=TYPE_CHOICES)
    mapfile             = models.TextField( null=True )
    file                = models.TextField( null=True )
    url                 = models.TextField( null=True )
    username            = models.TextField( null=True )
    password            = models.TextField( null=True )
    off_layers          = models.TextField( null=True )
    projection          = models.TextField( null=True )
    layers              = ArrayField( models.TextField( ),  null=True)
    bbox                = ArrayField( models.FloatField( ), size=4, default=[ -180, -90, 180, 90 ])
    data_extent         = ArrayField( models.FloatField( ), size=4, null=True)
    size                = ArrayField( models.IntegerField(), size=2, default=[ 256, 256 ] )
    resolutions         = ArrayField( models.FloatField( ), null=True)
    levels              = models.FloatField( default=20 )
    extension           = models.TextField( default = 'png' )
    srs                 = models.TextField( default = 'EPSG:4326',  )
    debug               = models.NullBooleanField( default = False )
    description         = models.TextField( null=True )
    watermarkimage      = models.TextField( null=True )
    watermarkopacity    = models.FloatField( null=True )
    extent_type         = models.TextField( null=True  )
    tms_type            = models.TextField( null=True )
    units               = models.TextField( null=True  )
    mime_type           = models.TextField( null=True  )
    paletted            = models.NullBooleanField( )
    spherical_mercator  = models.NullBooleanField( )
    metadata            = models.TextField( null=True )
    expired             = models.DateTimeField( null=True)
    metatile            = models.NullBooleanField( default = False )
    metasize            = ArrayField( models.IntegerField(), size=2, default=[ 5, 5 ] )
    metabuffer          = ArrayField( models.IntegerField(), size=2, default=[ 10, 10 ] )


import tilecache.signals

