################################################################################
#
# Project: NewWorld
# App:     maps
#
# models
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

# from django.db import models
from django.contrib.gis.db import models


################################################################################
#
# @brief class for map settings model
#
################################################################################

class Settings( models.Model ):
    
    def __unicode__( self ):
        return self.question

    title = models.CharField( max_length = 2048, help_text = "Display name for the map" )
    # center = models.PointField( srid = 4326 )
    zoom = models.IntegerField() # /*min_value = 0, max_value = 24 )
    tilecacheurl = models.CharField( max_length = 2048, help_text = "Display name for the map" )

    # overriding the default manager with a GeoManager instance.
    objects = models.GeoManager()
    # "center": "SRID=4326;POINT (0 0)",
