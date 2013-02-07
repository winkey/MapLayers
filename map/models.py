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
