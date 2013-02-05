#from django.db import models
from django.contrib.gis.db import models
from django.forms import ModelForm
from django import forms
from django.contrib.auth.models import User, Group
from mptt.models import MPTTModel, TreeForeignKey


FOLDER_TYPE_CHOICES = ( 
    ( 'normal', 'Normal' ),
    ( 'radio', 'Radio' ),
    ( 'animation', 'Animation' ),
 )

LAYER_TYPE_CHOICES = (
    ( 'ArcGISCache', 'ArcGISCache' ),
    ( 'ArcGIS93Rest', 'ArcGIS93Rest' ),
    ( 'ArcIMS', 'ArcIMS' ),
    ( 'Bing', 'Bing' ),
    ( 'GeoRSS', 'GeoRSS' ),
    ( 'Google', 'Google' ),
    ( 'Googlev3', 'Googlev3' ),
    ( 'OSM', 'OSM' ),
    ( 'TMS', 'TMS' ),
    ( 'WMS', 'WMS' ),
    ( 'WMTS', 'WMTS' ),
    ( 'WorldWind', 'WorldWind' ),
    ( 'XYZ', 'XYZ' ),
)

FORMAT_CHOICES = (
    ('image/png', 'png'),
    ('image/jpeg', 'jpeg'),
    ('image/tiff', 'tiff'),
)

PERM_CHOICES = (
    ('r', 'r'),
    ('w', 'w'),
    ('rw', 'rw'),
)

################################################################################
#
# @brief class for the layer tree node model
#
################################################################################

class layertreenode( MPTTModel ):
    
    def __unicode__(self):
        return self.question

    name = models.CharField( max_length = 2048, help_text = "Display name for the layer" )

    nodetype = models.CharField( max_length = 40, choices = LAYER_TYPE_CHOICES )

    layers = models.CharField( max_length = 2048, null = True, blank = True )

    format = models.CharField( max_length=40, choices=FORMAT_CHOICES, null=True, blank=True)

    added = models.DateTimeField(null=True, blank=True  )
    modified = models.DateTimeField( null=True, blank=True )
    url = models.CharField( max_length = 2048 )
    isBaseLayer = models.NullBooleanField( null = True, default = False )
    transparency = models.NullBooleanField( null = True, default = False )
    attribution = models.CharField(max_length=2048, null=True, blank=True )
    displayInLayerSwitcher = models.NullBooleanField( null = True, blank = True, default = False )
    opacity = models.FloatField( null = True, blank = True )
    singleTile = models.NullBooleanField( null = True, blank = True, default = False )
    extra_ol_args = models.CharField( max_length = 2048, null = True, blank = True )
    
    extent = models.PolygonField(srid=4326, editable=False, null=True )
    
    ##### owner group and perms #####
    
    owner = models.ForeignKey(User, editable=False, null=True, blank=True)
    groups = models.ForeignKey(Group, editable=False, null=True, blank=True)

    ownerperm = models.CharField( default = 'rw', max_length = 3, choices = PERM_CHOICES, null = True, blank = True )
    groupperm = models.CharField( default = 'rw', max_length = 3, choices = PERM_CHOICES, null = True, blank = True )
    globalperm = models.CharField( default = 'r', max_length = 3, choices = PERM_CHOICES, null = True, blank = True )

    ##### tree structure ####
    
    # parent = models.ForeignKey(folders, editable=False, null=True, blank=True)
    parent = TreeForeignKey( 'self', null = True, blank = True, related_name = 'children' )
    
    timestamp = models.DateTimeField( null = True, blank = True )
    begin_timespan = models.DateTimeField( null = True, blank = True )
    end_timespan = models.DateTimeField( null = True, blank = True )
    
    # overriding the default manager with a GeoManager instance.
    objects = models.GeoManager()

################################################################################
#
# @brief class for the layers form
#
################################################################################

class foldersForm(ModelForm):
    nodetype = forms.ChoiceField ( choices = FOLDER_TYPE_CHOICES )
    class Meta:
        model = layertreenode
        fields = ( 'name', 'nodetype', 'ownerperm',
                   'groupperm', 'globalperm' )

################################################################################
#
# @brief class for the layers form
#
################################################################################

class layersForm(ModelForm):
    nodetype = forms.ChoiceField( choices = LAYER_TYPE_CHOICES )
    class Meta:
        model = layertreenode
        
        
################################################################################
#
# @brief class for the user form
#
################################################################################

class UserForm(ModelForm):
    class Meta:
        model=User

class GroupForm(ModelForm):
    class Meta:
        model=Group
