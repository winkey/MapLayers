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
from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _


##### 

from rest_framework import serializers

#####

from django.forms import ModelForm
from django import forms
from django.contrib.auth.models import User, Group

from colorpicker.fields import ColorField

from mapfile import forms as myforms
#from django import forms.models

################################################################################
## pattern (child of style)
################################################################################

class pattern(models.Model):
    on                  = models.IntegerField()
    off                 = models.IntegerField()

    class Meta:
        verbose_name = _( "pattern" )
        verbose_name_plural = _( "pattern" )

class patternForm( ModelForm ):

    class Meta:
        model = pattern

################################################################################
## extent django dont have a float aray type
################################################################################


class extent(models.Model):
    minx                = models.FloatField()
    miny                = models.FloatField()
    maxx                = models.FloatField()
    maxy                = models.FloatField()

    class Meta:
        verbose_name = _( "extent" )
        verbose_name_plural = _( "extent" )

class extentForm( ModelForm ):

    class Meta:
        model = extent

################################################################################
## style (child of class amd leader )
################################################################################

STYLE_GEOMTRANSFORM_CHOICES = (
    ('bbox', 'bbox'),
    ('end', 'end'),
    ('labelpnt', 'labelpnt'),
    ('labelpoly', 'labelpoly'),
    ('start', 'start'),
    ('vertices', 'vertices'),
    ('bbox', 'bbox'),
    #<expression>: Applies the given expression to the geometry
)

STYLE_LINECAP_CHOICES = (
    ('butt', 'butt'),
    ('round', 'round'),
    ('square', 'square'),
)

STYLE_LINEJOIN_CHOICES = (
    ('round', 'round'),
    ('miter', 'miter'),
    ('bevel', 'bevel'),
)

class style(models.Model):
    angle               = models.FloatField(                 default = 0,
                                                             help_text='Angle, given in degrees, to draw the line work. Default is 0. For symbols of Type HATCH, this is the angle of the hatched lines.')
    #d angleitem        = models.CharField(                  max_length = 2048 )
    antialias           = models.BooleanField(               default=False)
    #d backgroundcolor     = ColorField( )*/
    color               = ColorField( )
    gap                 = models.FloatField()
    geotransform        = models.CharField(                  max_length = 2048,
                                                             choices = STYLE_GEOMTRANSFORM_CHOICES)
    initialgap          = models.FloatField()
    linecap             = models.CharField(                  max_length = 2048,
                                                             choices = STYLE_LINECAP_CHOICES)
    linejoin            = models.CharField(                  max_length = 2048,
                                                             choices = STYLE_LINEJOIN_CHOICES)
    linejoinmaxsize     = models.IntegerField()
    maxscaledenom       = models.FloatField()
    maaxsize            = models.FloatField()
    maxwidth            = models.FloatField()
    minscaledenom       = models.FloatField()
    minsize             = models.FloatField()
    minwidth            = models.FloatField()
    offset              = models.CommaSeparatedIntegerField( max_length=2)
    opacity             = models.CharField(                  max_length = 2048)
    outlinecolor        = models.CharField(                  max_length = 2048)
    outlinewidth        = models.CharField(                  max_length = 2048)
    pattern             = models.ManyToManyField(pattern)
    polaroffset         = models.CharField(                  max_length = 2048)
    size                = models.CharField(                  max_length = 2048)
    symbol              = models.CharField(                  max_length = 2048)
    width               = models.CharField(                  max_length = 2048)



angle : double
    Angle, given in degrees, to draw the line work. Default is 0. For symbols of Type HATCH, this is the angle of the hatched lines.
angleitem : string

    Deprecated since version 5.0: Use setBinding.
antialias : int
    MS_TRUE or MS_FALSE. Should TrueType fonts be antialiased.
backgroundcolor : colorObj
    Background pen color.
color : colorObj
    Foreground or fill pen color.
mincolor : colorObj
    Attribute for Color Range Mapping (MS RFC 6: Color Range Mapping of Continuous Feature Values). mincolor, minvalue, maxcolor, maxvalue define the range for mapping a continuous feature value to a continuous range of colors when rendering the feature on the map.
minsize : int
    Minimum pen or symbol width for scaling styles.
minvalue : double
    Attribute for Color Range Mapping (MS RFC 6: Color Range Mapping of Continuous Feature Values). mincolor, minvalue, maxcolor, maxvalue define the range for mapping a continuous feature value to a continuous range of colors when rendering the feature on the map.
minwidth : int
    Minimum width of the symbol.
maxcolor : colorObj
    Attribute for Color Range Mapping (MS RFC 6: Color Range Mapping of Continuous Feature Values). mincolor, minvalue, maxcolor, maxvalue define the range for mapping a continuous feature value to a continuous range of colors when rendering the feature on the map.
maxsize : int
    Maximum pen or symbol width for scaling.
maxvalue : double
    Attribute for Color Range Mapping (MS RFC 6: Color Range Mapping of Continuous Feature Values). mincolor, minvalue, maxcolor, maxvalue define the range for mapping a continuous feature value to a continuous range of colors when rendering the feature on the map.
maxwidth : int
    Maximum width of the symbol.
offsetx : int
    Draw with pen or symbol offset from map data.
offsety : int
    Draw with pen or symbol offset from map data.
outlinecolor : colorObj
    Outline pen color.
rangeitem : string
    Attribute/field that stores the values for the Color Range Mapping (MS RFC 6: Color Range Mapping of Continuous Feature Values).
size : int
    Pixel width of the style’s pen or symbol.
sizeitem : string

    Deprecated since version 5.0: Use setBinding.
symbol : int
    The index within the map symbolset of the style’s symbol.
symbolname : string immutable
    Name of the style’s symbol.
width : int
    Width refers to the thickness of line work drawn, in pixels. Default is 1. For symbols of Type HATCH, the with is how thick the hatched lines are.





    ############################################################################
    # method to create a mapscript style obj from the django object
    ############################################################################

    def toMS(self):

        oMSstyle = new mapscript.styleObj()

        oMSstyle.angle              = self.angle
        #oMSstyle.angleitem         = self.angleitem
        oMSstyle.antialias          = self.antialias
        #oMSstyle.backgroundcolor   = self.backgroundcolor
        oMSstyle.color              = self.color
        oMSstyle.gap                = self.gap
        oMSstyle.geotransform       = self.geotransform
        oMSstyle.initialgap         = self.initialgap
        oMSstyle.linecap            = self.linecap
        oMSstyle.linejoin           = self.linejoin
        oMSstyle.linejoinmaxsize    = self.linejoinmaxsize
        oMSstyle.maxscaledenom      = self.maxscaledenom
        oMSstyle.minsize            = self.minsize
        oMSstyle.minwidth           = self.minwidth
        oMSstyle.offset             = self.offset
        oMSstyle.opacity            = self.opacity
        oMSstyle.outlinecolor       = self.outlinecolor
        oMSstyle.outlinewidth       = self.outlinewidth

        #oMSstyle.pattern            = self.pattern

        oMSstyle.polaroffset        = self.polaroffset
        oMSstyle.size               = self.size
        oMSstyle.symbol             = self.symbol
        oMSstyle.align              = self.align
        oMSstyle.align              = self.align

    ############################################################################
    # method to populate a django style obj from the mapscript object
    ############################################################################

    def fromMS(self, oMSstyle):

        self.angle              = oMSstyle.angle
        #self.angleitem          = oMSstyle.angleitem
        self.antialias          = oMSstyle.antialias
        #self.backgroundcolor    = oMSstyle.backgroundcolor
        self.color              = oMSstyle.color
        self.gap                = oMSstyle.gap
        self.geotransform       = oMSstyle.geotransform
        self.initialgap         = oMSstyle.initialgap
        self.linecap            = oMSstyle.linecap
        self.linejoin           = oMSstyle.linejoin
        self.linejoinmaxsize    = oMSstyle.linejoinmaxsize
        self.maxscaledenom      = oMSstyle.maxscaledenom
        self.minsize            = oMSstyle.minsize
        self.minwidth           = oMSstyle.minwidth
        self.offset             = oMSstyle.offset
        self.opacity            = oMSstyle.opacity
        self.outlinecolor       = oMSstyle.outlinecolor
        self.outlinewidth       = oMSstyle.outlinewidth

        #self.pattern            = oMSstyle.pattern

        self.polaroffset        = oMSstyle.polaroffset
        self.size               = oMSstyle.size
        self.symbol             = oMSstyle.symbol
        self.align              = oMSstyle.align
        self.align              = oMSstyle.align

    class Meta:
        verbose_name = _( "style" )
        verbose_name_plural = _( "style" )

class styleForm( ModelForm ):

    pattern             = forms.models.ModelMultipleChoiceField(  pattern.objects, widget=myforms.MultipleSelectWithPop)
    class Meta:
        model = style

################################################################################
## leader (child of class)
################################################################################

class leader(models.Model):
    gridstep            = models.IntegerField()
    mindistance         = models.IntegerField()
    style               = models.ManyToManyField(style)

    class Meta:
        verbose_name = _( "leader" )
        verbose_name_plural = _( "leader" )

class leaderForm( ModelForm ):

    style           = forms.models.ModelMultipleChoiceField(  style.objects, widget=myforms.MultipleSelectWithPop)
    class Meta:
        model = leader



################################################################################
## label (child of legend and scalebar and class)
################################################################################

LABEL_POSITION_CHOICES = (
    ('ul', 'ul'),
    ('uc', 'uc'),
    ('ur', 'ur'),
    ('cl', 'cl'),
    ('cc', 'cc'),
    ('cr', 'cr'),
    ('ll', 'll'),
    ('lc', 'lc'),
    ('lr', 'lr'),
    ('auto', 'auto'),
)

LABEL_TYPE_CHOICES = (
    ('bitmap', 'bitmap'),
    ('truetype', 'truetype'),
);

class label(models.Model):
    align               = models.CharField(                  max_length = 2048)
    angle               = models.CharField(                  max_length = 2048)
    antialias           = models.BooleanField(               default=False)
    
    # fixme need to finish the color field class
    backgroundcolor     = models.CommaSeparatedIntegerField( max_length=3)
    backgroundshadowcolor = ColorField( )
    backgroundshadowsize  = ColorField( )

    buffer              = models.IntegerField()
    color               = models.CharField(                  max_length = 2048)
    encoding            = models.CharField(                  max_length = 2048)
    expression          = models.CharField(                  max_length = 2048)
    font                = models.CharField(                  max_length = 2048)
    force               = models.NullBooleanField()
    maxlength           = models.IntegerField()
    maxoverlapangle     = models.FloatField()
    maxscaledenom       = models.FloatField()
    maxsize             = models.FloatField()
    mindistance         = models.IntegerField()
    minfeaturesize      = models.CharField(                  max_length = 2048)
    minscaledenom       = models.FloatField()
    minsize             = models.FloatField()
    offset              = models.CommaSeparatedIntegerField( max_length=2)
    ourtlinecolor       = ColorField( )
    outlinewidth        = models.IntegerField()
    partials            = models.NullBooleanField(           default=True)
    position            = models.CharField(                  max_length = 2048,
                                                             choices = LABEL_POSITION_CHOICES,
                                                             default = 'auto')
    proprity            = models.CharField(                  max_length = 2048)
    repeatdistance      = models.IntegerField()
    shadowcolor         = ColorField( )
    shadowsize          = models.CommaSeparatedIntegerField( max_length=2)
    size                = models.IntegerField()
    style               = models.ManyToManyField(style)
    text                = models.CharField(                  max_length = 2048)
    type                = models.CharField(                  max_length = 2048,
                                                             choices = LABEL_TYPE_CHOICES )
    wrap                = models.CharField(                  max_length=1)

    ############################################################################
    # method to create a mapscript label obj from the django object
    ############################################################################

    def toMS(self):

        oMSlabel = new mapscript.labelObj()

        oMSlabel.align              = self.align
        oMSlabel.angle              = self.angle
        oMSlabel.antialias          = self.antialias
        oMSlabel.backgroundcolor    = self.backgroundcolor
        oMSlabel.backgroundshadowcolor  = self.backgroundshadowcolor
        oMSlabel.backgroundshadowsize   = self.backgroundshadowsize
        oMSlabel.buffer             = self.buffer
        oMSlabel.color              = self.color
        oMSlabel.encoding           = self.encoding
        oMSlabel.expression         = self.expression
        oMSlabel.font               = self.font
        oMSlabel.force              = self.force
        oMSlabel.maxlength          = self.maxlength
        oMSlabel.maxoverlapangle    = self.maxoverlapangle
        oMSlabel.maxscaledenom      = self.maxscaledenom
        oMSlabel.maxsize            = self.maxsize

        oMSlabel.mindistance        = self.mindistance
        oMSlabel.minfeaturesize     = self.minfeaturesize
        oMSlabel.minscaledenom      = self.minscaledenom
        oMSlabel.offset             = self.offset
        oMSlabel.ourtlinecolor      = self.ourtlinecolor
        oMSlabel.outlinewidth       = self.outlinewidth
        oMSlabel.partials           = self.partials
        oMSlabel.position           = self.position

        oMSlabel.proprity           = self.proprity
        oMSlabel.repeatdistance     = self.repeatdistance
        oMSlabel.shadowcolor        = self.shadowcolor
        oMSlabel.shadowsize         = self.shadowsize
        oMSlabel.size               = self.size
        
        for style in self.style.all():
            oMSlabel.addStyle(style.toMS)

        oMSlabel.text               = self.text
        oMSlabel.type               = self.type
        oMSlabel.wrap               = self.wrap

        return oMSlabel

    ############################################################################
    # method to populate a django label obj from the mapscript object
    ############################################################################

    def fromMS(self, oMSlabel):

        self.align              = oMSlabel.align
        self.angle              = oMSlabel.angle
        self.antialias          = oMSlabel.antialias
        self.backgroundcolor    = oMSlabel.backgroundcolor
        self.backgroundshadowcolor  = oMSlabel.backgroundshadowcolor
        self.backgroundshadowsize   = oMSlabel.backgroundshadowsize
        self.buffer             = oMSlabel.buffer
        self.color              = oMSlabel.color
        self.encoding           = oMSlabel.encoding
        self.expression         = oMSlabel.expression
        self.font               = oMSlabel.font
        self.force              = oMSlabel.force
        self.maxlength          = oMSlabel.maxlength
        self.maxoverlapangle    = oMSlabel.maxoverlapangle
        self.maxscaledenom      = oMSlabel.maxscaledenom
        self.maxsize            = oMSlabel.maxsize

        self.mindistance        = oMSlabel.mindistance
        self.minfeaturesize     = oMSlabel.minfeaturesize
        self.minscaledenom      = oMSlabel.minscaledenom
        self.offset             = oMSlabel.offset
        self.ourtlinecolor      = oMSlabel.ourtlinecolor
        self.outlinewidth       = oMSlabel.outlinewidth
        self.partials           = oMSlabel.partials
        self.position           = oMSlabel.position

        self.proprity           = oMSlabel.proprity
        self.repeatdistance     = oMSlabel.repeatdistance
        self.shadowcolor        = oMSlabel.shadowcolor
        self.shadowsize         = oMSlabel.shadowsize
        self.size               = oMSlabel.size
        
        for style in self.style.all():
            oMSlabel.addStyle(style.toMS)

        self.text               = oMSlabel.text
        self.type               = oMSlabel.type
        self.wrap               = oMSlabel.wrap

    class Meta:
        verbose_name = _( "label" )
        verbose_name_plural = _( "label" )

class labelForm( ModelForm ):

    style           = forms.models.ModelMultipleChoiceField(  style.objects, widget=myforms.MultipleSelectWithPop)
    class Meta:
        model = label


################################################################################
## validation (child of web and layer and class)
################################################################################

class validation(models.Model):
    varname             = models.CharField(                  max_length = 2048)
    regex               = models.CharField(                  max_length = 2048)


    class Meta:
        verbose_name = _( "validation" )
        verbose_name_plural = _( "validation" )

class validationForm( ModelForm ):

    class Meta:
        model = validation


################################################################################
## class (child of layer)
################################################################################

class Class(models.Model):
    #d backgroundcolor     = ColorField( ) */
    #d color               = ColorField( ) */
    #  DEBUG [on|off] */
    expression          = models.CharField(                  max_length = 2048)
    group               = models.CharField(                  max_length = 2048)
    keyimage            = models.CharField(                  max_length = 2048)
    label               = models.ForeignKey('label')
    leader              = models.ForeignKey('leader')
    maxscaledenom       = models.FloatField()
    #d maxsize             = models.IntegerField() */
    minscaledenom       = models.FloatField()
    #d minsize             = models.IntegerField()*/
    name                = models.CharField(                  max_length = 2048)
    #d outlinecolor        = ColorField( ) */
    #d size                = models.IntegerField()*/
    status              = models.BooleanField(           default=True)
    style               = models.ManyToManyField(style)
    #d symbol              = models.CharField(                  max_length = 2048)
    template            = models.CharField(                  max_length = 2048)
    text                = models.CharField(                  max_length = 2048)
    validation          = models.ManyToManyField(validation)

    ############################################################################
    # method to create a mapscript class obj from the django object
    ############################################################################

    def toMS(self):

        oMSClass = mapscript.classObj()

        #oMSClass.backgroundcolor     = self.backgroundcolor
        #oMSClass.color     = self.color
        #oMSClass.debug     = self.debug

        oMSClass.expression     = self.expression
        oMSClass.group          = self.group
        oMSClass.keyimage       = self.keyimage


        label               `   = models.ForeignKey('label')
        leader                  = models.ForeignKey('leader')

        oMSClass.maxscaledenom  = self.maxscaledenom
        #oMSClass.maxsize       = self.maxsize
        oMSClass.minscaledenom  = self.minscaledenom
        #oMSClass.minsize       = self.minsize
        oMSClass.name           = self.name
        #oMSClass.outlinecolor   = self.outlinecolor
        #oMSClass.size           = self.size
        oMSClass.status         = self.status

        for style in self.style.all():
            oMSClass.addStyle(style.toMS)

        oMSClass.group          = self.group

        #d symbol               = models.CharField(                  max_length = 2048)

        oMSClass.template       = self.template
        oMSClass.text           = self.text

        #validation          = models.ManyToManyField(validation)

        return oMSClass


    class Meta:
        verbose_name = _( "Class" )
        verbose_name_plural = _( "Class" )

class ClassForm( ModelForm ):

    label           = forms.models.ModelChoiceField(          label.objects, widget=myforms.SelectWithPop)
    leader          = forms.models.ModelChoiceField(          leader.objects, widget=myforms.SelectWithPop)
    style           = forms.models.ModelMultipleChoiceField(  style.objects, widget=myforms.MultipleSelectWithPop)
    validation      = forms.models.ModelMultipleChoiceField(  validation.objects, widget=myforms.MultipleSelectWithPop)
    class Meta:
        model = Class


################################################################################
## cluster (child of layer)
################################################################################

class cluster(models.Model):
    maxdistance         = models.FloatField()
    region              = models.CharField(                  max_length = 2048)
    Buffer              = models.FloatField()
    group               = models.CharField(                  max_length = 2048)
    Filter              = models.CharField(                  max_length = 2048)

    ############################################################################
    # method to create a mapscript cluster obj from the django object
    ############################################################################

    def toMS(self):

        oMSClass = mapscript.clusterObj()


    maxdistance         = models.FloatField()
    region              = models.CharField(                  max_length = 2048)
    Buffer              = models.FloatField()
    group               = models.CharField(                  max_length = 2048)
    Filter              = models.CharField(                  max_length = 2048)

    class Meta:
        verbose_name = _( "cluster" )
        verbose_name_plural = _( "cluster" )

class clusterForm( ModelForm ):

    class Meta:
        model = cluster

################################################################################
## points (child of symbol and feature)
################################################################################

class points(models.Model):
    x                   = models.IntegerField()
    y                   = models.IntegerField()

    class Meta:
        verbose_name = _( "points" )
        verbose_name_plural = _( "points" )

class pointsForm( ModelForm ):

    class Meta:
        model = points

################################################################################
## feature (child of layer)
################################################################################

class feature(models.Model):
    points              = models.ManyToManyField(points)
    items               = models.CharField(                  max_length = 2048)
    text                = models.CharField(                  max_length = 2048)
    wkt                 = models.CharField(                  max_length = 2048)

    class Meta:
        verbose_name = _( "feature" )
        verbose_name_plural = _( "feature" )

class featureForm( ModelForm ):
    points          = forms.models.ModelMultipleChoiceField(  points.objects, widget=myforms.MultipleSelectWithPop)
    class Meta:
        model = feature

################################################################################
## grid (child of layer)
################################################################################

class grid(models.Model):
    labelformat         = models.CharField(                  max_length = 2048)
    minarcs             = models.FloatField()
    maxarcs             = models.FloatField()
    mininterval         = models.FloatField()
    maxinterval         = models.FloatField()
    minsubdivide        = models.FloatField()
    maxsubdivide        = models.FloatField()


    class Meta:
        verbose_name = _( "grid" )
        verbose_name_plural = _( "grid" )

class gridForm( ModelForm ):

    class Meta:
        model = grid


################################################################################
## join (child of layer)
################################################################################

JOIN_CONNECTIONTYPE_CHOICES = (
    ('csv', 'csv'),
    ('mysql', 'mysql'),
    ('postgresql', 'postgresql'),
)

JOIN_TYPE_CHOICES = (
    ('ONE-TO-ONE', 'ONE-TO-ONE'),
    ('ONE-TO-MANY', 'ONE-TO-MANY'),
)

class join(models.Model):
    connection          = models.CharField(                  max_length = 2048)
    connectiontype      = models.CharField(                  max_length = 2048,
                                                             choices = JOIN_CONNECTIONTYPE_CHOICES)
    footer              = models.CharField(                  max_length = 2048)
    From                = models.CharField(                  max_length = 2048)
    header              = models.CharField(                  max_length = 2048)
    name                = models.CharField(                  max_length = 2048)
    table               = models.CharField(                  max_length = 2048)
    template            = models.CharField(                  max_length = 2048)
    to                  = models.CharField(                  max_length = 2048)
    Type                = models.CharField(                  max_length = 2048,
                                                             choices = JOIN_TYPE_CHOICES,
                                                             default = 'ONE-TO-ONE')

    class Meta:
        verbose_name = _( "join" )
        verbose_name_plural = _( "join" )

class joinForm( ModelForm ):

    class Meta:
        model = join

################################################################################
# metadata (child of web and layer)
################################################################################


METADATA_KEY_CHOICES = (

    ( "ows_http_max_age",                   "ows_http_max_age" ),
    ( "ows_schemas_location",               "ows_schemas_location" ),
    ( "ows_sld_enabled",                    "ows_sld_enabled" ),
    ( "ows_updatesequence",                 "ows_updatesequence" ),
    ( "wms_abstract",                       "wms_abstract" ),
    ( "wms_accessconstraints",              "wms_accessconstraints" ),
    ( "wms_addresstype,",                   "wms_addresstype," ),
    ( "wms_address,",                       "wms_address," ),
    ( "wms_city,",                          "wms_city," ),
    ( "wms_stateorprovince,",               "wms_stateorprovince," ),
    ( "wms_postcode,",                      "wms_postcode," ),
    ( "wms_country",                        "wms_country" ),
    ( "wms_attribution_logourl_format",     "wms_attribution_logourl_format" ),
    ( "wms_attribution_logourl_height",     "wms_attribution_logourl_height" ),
    ( "wms_attribution_logourl_href",       "wms_attribution_logourl_href" ),
    ( "wms_attribution_logourl_width",      "wms_attribution_logourl_width" ),
    ( "wms_attribution_onlineresource",     "wms_attribution_onlineresource" ),
    ( "wms_attribution_title",              "wms_attribution_title" ),
    ( "wms_bbox_extended:",                 "wms_bbox_extended:" ),
    ( "wms_contactelectronicmailaddress",   "wms_contactelectronicmailaddress" ),
    ( "wms_contactfacsimiletelephone",      "wms_contactfacsimiletelephone" ),
    ( "wms_contactperson,",                 "wms_contactperson," ),
    ( "wms_contactorganization,",           "wms_contactorganization," ),
    ( "wms_contactposition",                "wms_contactposition" ),
    ( "wms_contactvoicetelephone",          "wms_contactvoicetelephone" ),
    ( "wms_enable_request",                 "wms_enable_request" ),
    ( "ows_enable_request",                 "ows_enable_request" ),
    ( "wms_encoding",                       "wms_encoding" ),
    ( "wms_feature_info_mime_type",         "wms_feature_info_mime_type" ),
    ( "wms_fees",                           "wms_fees" ),
    ( "wms_getcapabilities_version",        "wms_getcapabilities_version" ),
    ( "wms_getlegendgraphic_formatlist",    "wms_getlegendgraphic_formatlist" ),
    ( "wms_getmap_formatlist",              "wms_getmap_formatlist" ),
    ( "wms_keywordlist",                    "wms_keywordlist" ),
    #( "wms_keywordlist_vocabulary",        "wms_keywordlist_vocabulary" ),
    #( "wms_keywordlist_[vocabulary’s name]_items", "wms_keywordlist_[vocabulary’s name]_items" ),
    ( "wms_languages",                      "wms_languages" ),
    ( "wms_layerlimit",                     "wms_layerlimit" ),
    ( "wms_onlineresource",                 "wms_onlineresource" ),
    ( "wms_remote_sld_max_bytes",           "wms_remote_sld_max_bytes" ),
    ( "wms_resx",                           "wms_resx" ),
    ( "wms_resy",                           "wms_resy" ),
    ( "wms_rootlayer_abstract",             "wms_rootlayer_abstract" ),
    ( "wms_rootlayer_keywordlist",          "wms_rootlayer_keywordlist" ),
    ( "wms_rootlayer_title",                "wms_rootlayer_title" ),
    ( "wms_service_onlineresource",         "wms_service_onlineresource" ),
    ( "wms_srs",                            "wms_srs" ),
    ( "wms_timeformat",                     "wms_timeformat" ),
    ( "wms_title",                          "wms_title" ),
    ( "Layer Object Metadata",              "Layer Object Metadata" ),
    ( "gml_exclude_items",                  "gml_exclude_items" ),
    ( "gml_geometries",                     "gml_geometries" ),
    ( "gml_groups",                         "gml_groups" ),
    #( "gml_[group name]_group", "gml_[group name]_group" ),
    ( "gml_include_items",                  "gml_include_items" ),
    #( "gml_[item name]_alias", "gml_[item name]_alias" ),
    #( "gml_[item name]_type", "gml_[item name]_type" ),
    #( "gml_[geometry name]_type", "gml_[geometry name]_type" ),
    ( "gml_xml_items",                      "gml_xml_items" ),
    ( "wms_authorityurl_name",              "wms_authorityurl_name" ),
    ( "wms_authorityurl_href",              "wms_authorityurl_href" ),
    ( "wms_dataurl_format",                 "wms_dataurl_format" ),
    ( "wms_dataurl_href",                   "wms_dataurl_href" ),
    ( "wms_exclude_items",                  "wms_exclude_items" ),
    ( "wms_extent",                         "wms_extent" ),
    ( "wms_getfeatureinfo_formatlist",      "wms_getfeatureinfo_formatlist" ),
    ( "wms_getlegendgraphic_formatlist",    "wms_getlegendgraphic_formatlist" ),
    ( "wms_getmap_formatlist",              "wms_getmap_formatlist" ),
    ( "wms_group_abstract",                 "wms_group_abstract" ),
    ( "wms_group_title",                    "wms_group_title" ),
    ( "wms_identifier_authority",           "wms_identifier_authority" ),
    ( "wms_identifier_value",               "wms_identifier_value" ),
    ( "wms_include_items",                  "wms_include_items" ),
    ( "wms_keywordlist",                    "wms_keywordlist" ),
    #( "wms_keywordlist_vocabulary",        "wms_keywordlist_vocabulary" ),
    #( "wms_keywordlist_[vocabulary’s name]_items", "wms_keywordlist_[vocabulary’s name]_items" ),
    ( "wms_layer_group",                    "wms_layer_group" ),
    ( "wms_metadataurl_format",             "wms_metadataurl_format" ),
    ( "wms_metadataurl_href",               "wms_metadataurl_href" ),
    ( "wms_metadataurl_type",               "wms_metadataurl_type" ),
    ( "wms_opaque",                         "wms_opaque" ),
    ( "wms_srs",                            "wms_srs" ),
    #( "wms_style",                         "wms_style" ),
    #( "#wms_style_[style’s_name]_legendurl_format", "#wms_style_[style’s_name]_legendurl_format" ),
    #( "#wms_style_[style’s_name]_legendurl_height", "#wms_style_[style’s_name]_legendurl_height" ),
    #( "#wms_style_[style’s_name]_legendurl_href", "#wms_style_[style’s_name]_legendurl_href" ),
    #( "#wms_style_[style’s_name]_legendurl_width", "#wms_style_[style’s_name]_legendurl_width" ),
    ( "wms_timedefault",                    "wms_timedefault" ),
    ( "wms_timeextent",                     "wms_timeextent" ),
    ( "wms_timeitem",                       "wms_timeitem" ),
    ( "wms_title",                          "wms_title" )
)



class metadata(models.Model):
    key                 = models.CharField( choices = METADATA_KEY_CHOICES,
                                            max_length = 2048)
    value               = models.CharField(                  max_length = 2048)

    class Meta:
        verbose_name = _( "metadata" )
        verbose_name_plural = _( "metadata" )

    ############################################################################
    # method to create a mapscript metadata obj from the django object
    ############################################################################

    def toMS(self, oMSmetadata):
        
        oMSmetadata->set(self.key, self.value)

    ############################################################################
    # method to populate a django map obj from the mapscript object
    # this is a little differnt due to mapscript
    ############################################################################

    def fromMS(self, oMSmetadata, oMSmetadataKey, bool save):

        self.key    = oMSmetadataKey
        self.value  = oMSmetadata->get($oMSmetadataKey) 


Methods

void clear()
    Clear all items in the hashTable (To NULL).
string get(string key)
    Fetch class metadata entry by name. Returns “” if no entry matches the name. Note that the search is case sensitive.
string nextkey(string previousKey)
    Return the next key or first key if previousKey = NULL. Return NULL if no item is in the hashTable or end of hashTable is reached
int remove(string key)
    Remove a metadata entry in the hashTable. Returns MS_SUCCESS/MS_FAILURE.
int set(string key, string value)
    Set a metadata entry in the hashTable. Returns MS_SUCCESS/MS_FAILURE.



class metadataForm( ModelForm ):

    class Meta:
        model = metadata

################################################################################
# projection (child of map and layer)
################################################################################

class projection(models.Model):
    epsg
    epsg               = models.CharField(                  max_length = 2048)

    class Meta:
        verbose_name = _( "projection" )
        verbose_name_plural = _( "projection" )

class projectionForm( ModelForm ):

    class Meta:
        model = projection

################################################################################
# config (child of map)
################################################################################

class config(models.Model):
    key                 = models.CharField(                  max_length = 2048)
    value               = models.CharField(                  max_length = 2048)

    class Meta:
        verbose_name = _( "config" )
        verbose_name_plural = _( "config" )

class configForm( ModelForm ):

    class Meta:
        model = config

################################################################################
# transform (child of layer)
################################################################################

TRANSFORM_POSITION_CHOICES = (
    ('ul', 'ul'),
    ('uc', 'uc'),
    ('ur', 'ur'),
    ('cl', 'cl'),
    ('cc', 'cc'),
    ('cr', 'cr'),
    ('ll', 'll'),
    ('lc', 'lc'),
    ('lr', 'lr'),
)

class transform(models.Model):
    transform           = models.BooleanField(               default = True)
    position            = models.CharField(                  max_length = 2048,
                                                             choices = TRANSFORM_POSITION_CHOICES,
                                                             default = 'lr')

    class Meta:
        verbose_name = _( "transform" )
        verbose_name_plural = _( "transform" )

class transformForm( ModelForm ):

    class Meta:
        model = transform


################################################################################
# layer (child of map)
################################################################################

LAYER_CONNECTIONTYPE_CHOICES = (
    ('local', 'local'),
    ('ogr', 'ogr'),
    ('oraclespatial', 'oraclespatial'),
    ('plugin', 'plugin'),
    ('postgis', 'postgis'),
    ('sde', 'sde'),
    ('union', 'union'),
    ('uvraster', 'uvraster'),
    ('wfs', 'wfs'),
    ('wms', 'wms'),
)

LAYER_SIZEUNITS_CHOICES = (
    ('feet', 'feet'),
    ('inches', 'inches'),
    ('kilometers', 'kilometers'),
    ('meters', 'meters'),
    ('miles', 'miles'),
    ('nauticalmiles', 'nauticalmiles'),
    ('pixels', 'pixels'),
)

LAYER_STATUS_CHOICES = (
    ('off', 'off'),
    ('on', 'on'),
    ('default', 'perm on'),
)

LAYER_TYPE_CHOICES = (
    ('chart', 'chart'),
    ('circle', 'circle'),
    ('line', 'line'),
    ('point', 'point'),
    ('polygon', 'polygon'),
    ('raster', 'raster'),
    ('query', 'query'),
)

LAYER_UNITS_CHOICES = (
    ('dd', 'dd'),
    ('feet', 'feet'),
    ('inches', 'inches'),
    ('kilometers', 'kilometers'),
    ('meters', 'meters'),
    ('miles', 'miles'),
    ('nauticalmiles', 'nauticalmiles'),
    ('percentages', 'percentages'),
    ('pixels', 'pixels'),
)



class layer(models.Model):
    Class               = models.ForeignKey('Class')
    classgroup          = models.CharField(                  max_length = 2048)
    classitem           = models.CharField(                  max_length = 2048)
    cluster             = models.ForeignKey('cluster')
    connection          = models.CharField(                  max_length = 2048)
    connectiontype      = models.CharField(                  max_length = 2048,
                                                             choices = LAYER_CONNECTIONTYPE_CHOICES,
                                                             default = 'local')
    data                = models.CharField(                  max_length = 2048)
    #  DEBUG [off|on|0|1|2|3|4|5] */
    #d dump                = models.NullBooleanField()
    extent              = models.ForeignKey('extent')
    feature             = models.ManyToManyField(feature)
    Filter              = models.CharField(                  max_length = 2048)
    filteritem          = models.CharField(                  max_length = 2048)
    footer              = models.CharField(                  max_length = 2048)
    grid                = models.ForeignKey('grid')
    group               = models.CharField(                  max_length = 2048)
    header              = models.CharField(                  max_length = 2048)
    join                = models.ForeignKey('join')
    #d labelangleitem      = models.CharField(                  max_length = 2048)
    labelcache          = models.BooleanField(               default = True)
    labelitem           = models.CharField(                  max_length = 2048)
    labelmaxscaledenom  = models.FloatField()
    labelminscaledenom  = models.FloatField()
    labelrequires       = models.CharField(                  max_length = 2048)
    #d labelsizeitem       = models.CharField(                  max_length = 2048)
    mask                = models.CharField(                  max_length = 2048)
    maxfeatures         = models.IntegerField()
    maxgeowidth         = models.FloatField()
    maxscaledenom       = models.FloatField()
    metadata            = models.ManyToManyField(metadata)
    mimgeowidth         = models.FloatField()
    minscaledenom       = models.FloatField()
    name                = models.CharField(                  max_length = 2048)
    offsite             = models.CommaSeparatedIntegerField( max_length=3)
    opacity             = models.CharField(                  max_length = 2048)
    plugin              = models.CharField(                  max_length = 2048)
    postlabelcache      = models.BooleanField(               default = False )
    processing          = models.CharField(                  max_length = 2048)
    projection          = models.ForeignKey('projection')
    requires            = models.CharField(                  max_length = 2048)
    sizeunits           = models.CharField(                  max_length = 2048,
                                                             choices = LAYER_SIZEUNITS_CHOICES,
                                                             default = 'pixels')
    status              = models.CharField(                  max_length = 2048,
                                                             choices = LAYER_STATUS_CHOICES,
                                                             default = 'default')
    styleitem           = models.CharField(                  max_length = 2048)
    symbolscaledenom    = models.FloatField()
    template            = models.CharField(                  max_length = 2048)
    tileindex           = models.CharField(                  max_length = 2048)
    tileitem            = models.CharField(                  max_length = 2048)
    tolerance           = models.FloatField()
    toleranceunits      = models.CharField(                  max_length = 2048)
    #d transparency        = models.NullBooleanField()*/
    transform           = models.ForeignKey('transform')
    Type                = models.CharField(                  max_length = 2048,
                                                             choices = LAYER_TYPE_CHOICES,
                                                             default = 'raster')
    units               = models.CharField(                  max_length = 2048,
                                                             choices = LAYER_UNITS_CHOICES,
                                                             default='miles')
    validation          = models.ManyToManyField(validation)

    class Meta:
        verbose_name = _( "layer" )
        verbose_name_plural = _( "layer" )

class layerForm( ModelForm ):
    Class           = forms.models.ModelChoiceField(          Class.objects, widget=myforms.SelectWithPop)
    cluster         = forms.models.ModelChoiceField(          cluster.objects, widget=myforms.SelectWithPop)
    extent          = forms.models.ModelChoiceField(          extent.objects, widget=myforms.SelectWithPop)
    feature         = forms.models.ModelMultipleChoiceField(  feature.objects, widget=myforms.MultipleSelectWithPop)
    grid            = forms.models.ModelChoiceField(          grid.objects, widget=myforms.SelectWithPop)
    join            = forms.models.ModelChoiceField(          join.objects, widget=myforms.SelectWithPop)
    metadata        = forms.models.ModelMultipleChoiceField(  metadata.objects, widget=myforms.MultipleSelectWithPop)
    projection      = forms.models.ModelChoiceField(          projection.objects, widget=myforms.SelectWithPop)
    transform       = forms.models.ModelChoiceField(          transform.objects, widget=myforms.SelectWithPop)
    class Meta:
        model = layer

################################################################################
# legend (child of map)
################################################################################

LEGEND_POSITION_CHOICES = (
    ('ul', 'ul'),
    ('uc', 'uc'),
    ('ur', 'ur'),
    ('ll', 'll'),
    ('lc', 'lc'),
    ('lr', 'lr'),
)

LEGEND_STATUS_CHOICES = (
    ('off', 'off'),
    ('on', 'on'),
    ('embed', 'embed'),
)

class legend(models.Model):
    imagecolor          = models.CommaSeparatedIntegerField( max_length=3)
    #d interlace           = models.NullBooleanField()
    keysize             = models.CommaSeparatedIntegerField( max_length=2)
    keyspacing          = models.CommaSeparatedIntegerField( max_length=2)
    label               = models.ManyToManyField(label)
    outlinecolor        = ColorField( )
    position            = models.CharField(                  max_length = 2048,
                                                             choices = LEGEND_POSITION_CHOICES,
                                                             default = 'lr')
    postlabelcache      = models.BooleanField(               default = False)
    status              = models.CharField(                  max_length = 2048,
                                                             choices = LEGEND_STATUS_CHOICES,
                                                             default = 'off')
    template            = models.CharField(                  max_length = 2048)
    #d transparent         = models.NullBooleanField()

    class Meta:
        verbose_name = _( "legend" )
        verbose_name_plural = _( "legend" )

class legendForm( ModelForm ):
    label           = forms.models.ModelMultipleChoiceField(  label.objects, widget=myforms.MultipleSelectWithPop)
    class Meta:
        model = legend

################################################################################
# querymap (child of map)
################################################################################

QUERYMAP_STYLE_CHOICES = (
    ('normal', 'normal'),
    ('hilite', 'hilite'),
    ('selected', 'selected'),
)

class querymap(models.Model):
    color               = ColorField( )
    size                = models.CommaSeparatedIntegerField( max_length=2)
    status              = models.BooleanField(               default=False)
    style               = models.CharField(                  max_length = 2048,
                                                             choices = QUERYMAP_STYLE_CHOICES,
                                                             default='normal')

    class Meta:
        verbose_name = _( "querymap" )
        verbose_name_plural = _( "querymap" )

class querymapForm( ModelForm ):

    class Meta:
        model = querymap

################################################################################
# reference (child of map)
################################################################################

class reference(models.Model):
    color               = models.CommaSeparatedIntegerField( max_length=3)
    extent              = models.ForeignKey('extent')
    image               = models.CharField(                  max_length = 2048)
    marker              = models.CharField(                  max_length = 2048)
    markersize          = models.IntegerField()
    minboxsize          = models.IntegerField()
    maxboxsize          = models.IntegerField()
    outlinecolor        = ColorField( )
    size                = models.CommaSeparatedIntegerField( max_length=2)
    status              = models.NullBooleanField(           default=False)


    class Meta:
        verbose_name = _( "reference" )
        verbose_name_plural = _( "reference" )

class referenceForm( ModelForm ):
    extent          = forms.models.ModelChoiceField(          extent.objects, widget=myforms.SelectWithPop)
    class Meta:
        model = reference

################################################################################
# scalebar (child of map)
################################################################################


SCALEBAR_ALIGN_CHOICES = (
    ('left', 'left'),
    ('center', 'center'),
    ('right', 'right'),
)

SCALEBAR_POSITION_CHOICES = (
    ('ul', 'ul'),
    ('uc', 'uc'),
    ('ur', 'ur'),
    ('ll', 'll'),
    ('lc', 'lc'),
    ('lr', 'lr'),
)

SCALEBAR_STATUS_CHOICES = (
    ('off', 'off'),
    ('on', 'on'),
    ('embed', 'embed'),
)

SCALEBAR_UNITS_CHOICES = (
    ('feet', 'feet'),
    ('inches', 'inches'),
    ('kilometers', 'kilometers'),
    ('meters', 'meters'),
    ('miles', 'miles'),
    ('nauticalmiles', 'nauticalmiles'),
)

class scalebar(models.Model):
    align               = models.CharField(                  max_length = 2048,
                                                             choices = SCALEBAR_ALIGN_CHOICES,
                                                             default = 'center')
    backgroundcolor     = ColorField( )
    color               = ColorField( )
    imagecolor          = ColorField( )
    #d interlace           = models.NullBooleanField()
    intervals           = models.IntegerField()
    label               = models.ManyToManyField(label)
    outlinecolor        = ColorField( )
    position            = models.CharField(                  max_length = 2048,
                                                             choices = SCALEBAR_POSITION_CHOICES,
                                                             default='lr')
    postlabelcache      = models.BooleanField(               default=False)
    size                = models.CommaSeparatedIntegerField( max_length=2 )
    status              = models.CharField(                  max_length = 2048,
                                                             choices = SCALEBAR_STATUS_CHOICES,
                                                             default='off' )
    style               = models.IntegerField()
    #d transparent         = models.NullBooleanField()
    units               = models.CharField(                  max_length = 2048,
                                                             choices = SCALEBAR_UNITS_CHOICES,
                                                             default='miles')

    class Meta:
        verbose_name = _( "scalebar" )
        verbose_name_plural = _( "scalebar" )

class scalebarForm( ModelForm ):
    label           = forms.models.ModelMultipleChoiceField(  label.objects, widget=myforms.MultipleSelectWithPop)
    class Meta:
        model = scalebar

################################################################################
# symbol (child of map)
################################################################################

SYMBOL_TYPE_CHOICES = (
    ('ellipse', 'ellipse'),
    ('hatch', 'hatch'),
    ('pixmap', 'pixmap'),
    ('svg', 'svg'),
    ('truetype', 'truetype'),
    ('vector', 'vector'),
)

class symbol(models.Model):
    anchorpoint         = models.CommaSeparatedIntegerField( max_length=2)
    antialias           = models.BooleanField(               default=False)
    character           = models.CharField(                  max_length=1)
    filled              = models.BooleanField(               default=False)
    font                = models.CharField(                  max_length = 2048)
    image               = models.CharField(                  max_length = 2048)
    name                = models.CharField(                  max_length = 2048)
    points              = models.ManyToManyField(points)
    transparent         = models.CharField(                  max_length = 2048)
    Type                = models.CharField(                  max_length = 2048,
                                                             choices = SYMBOL_TYPE_CHOICES)

    class Meta:
        verbose_name = _( "symbol" )
        verbose_name_plural = _( "symbol" )

class symbolForm( ModelForm ):
    points          = forms.models.ModelMultipleChoiceField(  points.objects, widget=myforms.MultipleSelectWithPop)
    class Meta:
        model = symbol


################################################################################
# web (child of map)
################################################################################

class web(models.Model):
    browseformat        = models.CharField(                  max_length = 2048)
    empty               = models.CharField(                  max_length = 2048)
    error               = models.CharField(                  max_length = 2048)
    footer              = models.CharField(                  max_length = 2048)
    header              = models.CharField(                  max_length = 2048)
    imagepath           = models.CharField(                  max_length = 2048)
    imageurl            = models.CharField(                  max_length = 2048)
    legendformat        = models.CharField(                  max_length = 2048)
    #d log = models.CharField(                  max_length = 2048)*/
    maxscaledenom       = models.FloatField()
    #d maxscale            = models.FloatField()*/
    maxtemplate         = models.CharField(                  max_length = 2048)
    metadata            = models.ManyToManyField(metadata)
    minscaledenom       = models.FloatField()
    #d minscale            = models.FloatField()*/
    mintemplate         = models.CharField(                  max_length = 2048)
    queryformat         = models.CharField(                  max_length = 2048)
    template            = models.CharField(                  max_length = 2048)
    temppath            = models.CharField(                  max_length = 2048)
    validation          = models.ManyToManyField(validation)

    ############################################################################
    # method to create a mapscript web obj from the django object
    ############################################################################

    def toMS(self):
        oMSweb = mapscript.webObj()

        oMSweb.browseformat     = self.browseformat
        oMSweb.empty            = self.empty
        oMSweb.error            = self.error
        oMSweb.footer           = self.footer
        oMSweb.header           = self.header
        oMSweb.imagepath        = self.imagepath
        oMSweb.imageurl         = self.imageurl
        oMSweb.legendformat     = self.legendformat
        #d oMSweb.log           = self.log
        oMSweb.maxscaledenom    = self.maxscaledenom
        #d oMSweb.maxscale      = self.maxscale
        oMSweb.maxtemplate      = self.maxtemplate

        oMSweb.metadata         = self.metadata

        oMSweb.minscaledenom    = self.minscaledenom
        #d oMSweb.minscale      = self.minscale
        oMSweb.mintemplate      = self.mintemplate
        oMSweb.queryformat      = self.queryformat
        oMSweb.template         = self.template
        oMSweb.temppath         = self.temppath
        
        # fixme not supported by mapscript?
        #validation          = models.ManyToManyField(validation)

    ############################################################################
    # method to populate a django outputformat obj from the mapscript object
    ############################################################################

    def fromMS(self, oMSweb, bool save):

        self.browseformat     = oMSweb.browseformat
        self.empty            = oMSweb.empty
        self.error            = oMSweb.error
        self.footer           = oMSweb.footer
        self.header           = oMSweb.header
        self.imagepath        = oMSweb.imagepath
        self.imageurl         = oMSweb.imageurl
        self.legendformat     = oMSweb.legendformat
        #d self.log           = oMSweb.log
        self.maxscaledenom    = oMSweb.maxscaledenom
        #d self.maxscale      = oMSweb.maxscale
        self.maxtemplate      = oMSweb.maxtemplate

        self.metadata         = oMSweb.metadata

        self.minscaledenom    = oMSweb.minscaledenom
        #d self.minscale      = oMSweb.minscale
        self.mintemplate      = oMSweb.mintemplate
        self.queryformat      = oMSweb.queryformat
        self.template         = oMSweb.template
        self.temppath         = oMSweb.temppath
        
        # fixme not supported by mapscript?
        #validation          = models.ManyToManyField(validation)


    class Meta:
        verbose_name = _( "web" )
        verbose_name_plural = _( "web" )

class webForm( ModelForm ):
    metadata        = forms.models.ModelMultipleChoiceField(  metadata.objects, widget=myforms.MultipleSelectWithPop)
    validation      = forms.models.ModelMultipleChoiceField(  validation.objects, widget=myforms.MultipleSelectWithPop)
    class Meta:
        model = web

################################################################################
# outputformat (child of map)
################################################################################

OUTPUTFORMAT_IMAGEMODE_CHOICES = (
    (MS_IMAGEMODE_PC256, 'PC256'),
    (MS_IMAGEMODE_RGB, 'RGB'),
    (MS_IMAGEMODE_RGBA, 'RGBA'),
    (MS_IMAGEMODE_INT16, 'INT16'),
    (MS_IMAGEMODE_FLOAT32, 'FLOAT32'),
    (MS_IMAGEMODE_BYTE, 'BYTE'),
    (MS_IMAGEMODE_FEATURE, 'FEATURE'),
    (MS_IMAGEMODE_NULL, 'NULL'),
)
, MS_IMAGEMODE_RGB, MS_IMAGEMODE_RGBA, MS_IMAGEMODE_INT16, MS_IMAGEMODE_FLOAT32, MS_IMAGEMODE_BYTE, MS_IMAGEMODE_FEATURE, MS_IMAGEMODE_NULL

class outputformat(models.Model):
    name                = models.CharField(                  max_length = 2048)
    driver              = models.CharField(                  max_length = 2048)
    extension           = models.CharField(                  max_length = 2048)
    imagemode           = models.IntField(                   choices=OUTPUTFORMAT_IMAGEMODE_CHOICES)
                                                             
    mimetype            = models.CharField(                  max_length = 2048)
    transparent         = models.NullBooleanField()
    #fixme
    #formatoption        = models.CharField(                  max_length = 2048)
    
    ############################################################################
    # method to create a mapscript outputformat obj from the django object
    ############################################################################

    def toMS(self):
        oMSoutputformat = mapscript.outputFormatObj()

        oMSoutputformat.name         = self.name
        oMSoutputformat.driver       = self.driver
        oMSoutputformat.extension    = self.extension
        oMSoutputformat.imagemode    = self.imagemode
        oMSoutputformat.mimetype     = self.mimetype
        oMSoutputformat.transparent  = self.transparent
        
        #fixme option hash here

    ############################################################################
    # method to populate a django outputformat obj from the mapscript object
    ############################################################################

    def fromMS(self, oMSoutputformat, bool save):
        
        self.name             = oMSoutputformat.name
        self.driver       = oMSoutputformat.driver
        self.extension    = oMSoutputformat.extension
        self.imagemode    = oMSoutputformat.imagemode
        self.mimetype     = oMSoutputformat.mimetype
        self.transparent  = oMSoutputformat.transparent
        
        #fixme option hash here

        if save:
            self.map.save

    class Meta:
        verbose_name = _( "outputformat" )
        verbose_name_plural = _( "outputformat" )

class outputformatForm( ModelForm ):

    class Meta:
        model = outputformat

# todo a symbolset table in the database, upload form, and choices for the symbolset in the map model
#todo imagetype should have choices based on the outputformat table

################################################################################
# map (child of mapfile)
################################################################################

Map_UNITS_CHOICES = (
    ( MS_DD,            'Decimal Degrees' ),
    ( MS_FEET,          'feet' ),
    ( MS_INCHES,        'inches' ),
    #( 'kilometers',    'kilometers' ),
    ( MS_METERS,        'meters' ),
    ( MS_MILES,         'miles' ),
    ( MS_NAUTICALMILES, 'nauticalmiles' ),
    ( MS_PIXELS,        'pixels' ),
)

Map_STATUS_CHOICES = (
    ( MS_ON,        'ON' ),
    ( MS_OFF,       'OFF' ),
    ( MS_DEFAULT,   'DEFAULT' )
)

Map_DEBUG_CHOICES = (
    ( MS_OFF,       'OFF' ),
    ( MS_ON,        'ON' ),
)

class Map(models.Model):
    
    angle               = models.FloatField(                 help_text='Angle, given in degrees, to rotate the map in a clockwise direction.',
                                                             default = 0.0)
    config              = models.ManyToManyField( config)
    datapattern         = models.CharField(                  max_length = 2048)
    debug               = models.IntegerField(               Map_DEBUG_CHOICES,
                                                             default = MS_OFF)
    defresolution       = models.IntegerField(               help_text='Sets the reference resolution (pixels per inch) used for symbology.',
                                                             default = 72)
    extent              = models.ForeignKey('extent')
    fontset             = models.CharField(                  max_length = 2048)
    imagecolor          = ColorField(                        help_text='Color to initialize the map with (i.e. background color)')
    #d imagequality        = models.IntegerField()*/
    imagetype           = models.CharField(                  max_length = 2048)
    #d interlace           = models.NullBooleanField()
    layer               = models.ManyToManyField(layer)
    legend              = models.ForeignKey('legend')
    name                = models.CharField(                  max_length = 25)
    maxsize             = models.IntegerField(               help_text='Sets the maximum size of the map image.',
                                                             default = 2048)
    outputformat        = models.ManyToManyField(outputformat)
    projection          = models.ForeignKey('projection')
    
    querymap            = models.ForeignKey('querymap')
    reference           = models.ForeignKey('reference')
    resolution          = models.IntegerField()
    scaledenom          = models.FloatField(                 help_text='Computed scale of the map',
                                                             null=True)
    scalebar            = models.ForeignKey('scalebar')
    shapepath           = models.CharField(                  max_length = 2048)
    size                = models.CommaSeparatedIntegerField( help_text='Size in pixels of the output image (i.e. the map).',
                                                             max_length=2,
                                                             default=[256,256])
    status              = models.IntegerField(               Map_STATUS_CHOICES,
                                                             default = MS_ON)
    symbolset           = models.CharField(                  max_length = 2048)
    symbol              = models.ManyToManyField(symbol)
    templatepattern     = models.CharField(                  max_length = 2048)
    #d transparent      = models.NullBooleanField()
    units               = models.IntegerField(               help_text='Units of the map coordinates. Used for scale computations',
                                                             choices = Map_UNITS_CHOICES,
                                                             max_length = 2048)
    web                 = models.ForeignKey('web')

    ############################################################################
    # method to create a mapscript map obj from the django object
    ############################################################################

    def toMS(self):

        oMSMap = mapscript.mapObj()

        oMSMap.name             = self.name

        oMSMap.setRotation( self.angle )

        for config in self.config.all():
            oMSMap.setConfigOption( config.key, config.value )

        oMSMap.datapattern      = self.datapattern
        oMSMap.debug            = self.debug
        oMSMap.defresolution    = self.defresolution

        oMSMap.extent           = self.extent.toMS()

        oMSMap.fontset          = self.fontset
        oMSMap.imagecolor       = self.imagecolor
        #d oMSMap.imagequality  = self.imagequality
        oMSMap.imagetype        = self.imagetype
        #d oMSMap.interlace     = self.interlace

        for layer in self.layer.all():
            oMSMap.insertLayer(layer.toMS)

        oMSMap.legend           = self.legend.toMS

        oMSMap.maxsize          = self.maxsize
        
        for outputformat in self.outputformat.all():
            oMSMap.appendOutputFormat(outputformat.toMS)

        oMSMap.projection       = self.projection.toMS

        self.querymap.toMS( oMSMap.querymap )

        self.reference.toMS( oMSMap.reference )

        oMSMap.resolution       = self.resolution
        oMSMap.scaledenom       = self.scaledenom

        self.scalebar.toMS( oMSMap.scalebar )

        oMSMap.shapepath        = self.shapepath
        oMSMap.size             = self.size
        oMSMap.status           = self.status

        oMSMap.setSymbolSet( self.symbolset )

        for symbol in self.symbol.all():
            oMSMap.addSymbol(symbol.toMS)

        oMSMap.templatepattern  = self.templatepattern
        #d oMSMap.transparent   = self.transparent
        oMSMap.units            = self.units

        oMSMap.web              = self.web.toMS

    ############################################################################
    # method to populate a django map obj from the mapscript object
    ############################################################################

    def fromMS(self, oMSMap, bool save):

        self.name             = oMSMap.name
        self.angle            = oMSMap.angle

        getConfigOption( string
        # mapscript does not seem to support this
        while key = oMSMap.configoptions.nextKey():
            myconfig = config(key, getConfigOption( key ) )
            if save:
                myconfig.save
   
        self.datapattern      = oMSMap.datapattern
        #self.debug           = oMSMap.debug
        self.defresolution    = oMSMap.defresolution

        self.extent = extent()
        self.extent.fromMS( MSMap.extent, save )

        self.fontset          = oMSMap.fontset
        self.imagecolor       = oMSMap.imagecolor
        #d self.imagequality  = oMSMap.imagequality
        self.imagetype        = oMSMap.imagetype
        #d self.interlace     = oMSMap.interlace

        for myid in range( oMSMap.numlayers ):
            mylayer = layer()
            mylayer.fromMS( MSMap.getLayer( myid ), save )
            self.layer.add(mylayer)

        self.legend = legend()
        self.legend.fromMS( MSMap.legend, save )

        self.maxsize          = oMSMap.maxsize
        
        for myid in range( oMSMap.numoutputformats ):
            myoutputformat = outputformat()
            myoutputformat.fromMS( MSMap.getOutputFormat( myid ), save )
            self.outputformat.add(myoutputformat)

        self.projection = projection()
        self.projection.fromMS( MSMap.projection, save )

        self.querymap = querymap()
        self.querymap.fromMS( MSMap.querymap, save )

        self.reference = reference()
        self.reference.fromMS( MSMap.reference, save )

        self.resolution       = oMSMap.resolution
        self.scaledenom       = oMSMap.scaledenom

        self.scalebar = scalebar()
        self.scalebar.fromMS( MSMap.scalebar, save )

        self.shapepath        = oMSMap.shapepath
        self.size             = oMSMap.size
        self.status           = oMSMap.status
        self.symbolset        = oMSMap.symbolset

        ##### warning this assumes id  0 thru getNumSymbols() - 1

        for myid in range( oMSMap.getNumSymbols() ):
            mysymbol = symbol()
            mysymbol.fromMS( MSMap.getSymbolObjectById( myid ), save )
            self.symbol.add(mysymbol)

        self.templatepattern  = oMSMap.templatepattern
        #d self.transparent   = oMSMap.transparent
        self.units            = oMSMap.units

        self.web = web()
        self.web.fromMS( MSMap.web, save )

        if save:
            self.map.save


    class Meta:
        verbose_name = _( "Map" )
        verbose_name_plural = _( "Map" )


class MapForm( ModelForm ):
    config          = forms.models.ModelMultipleChoiceField(  config.objects, widget=myforms.MultipleSelectWithPop)
    extent          = forms.models.ModelChoiceField(          extent.objects, widget=myforms.SelectWithPop)
    layer           = forms.models.ModelMultipleChoiceField(  layer.objects, widget=myforms.MultipleSelectWithPop)
    legend          = forms.models.ModelChoiceField(          legend.objects, widget=myforms.SelectWithPop)
    outputformat    = forms.models.ModelMultipleChoiceField(  outputformat.objects, widget=myforms.MultipleSelectWithPop)
    projection      = forms.models.ModelChoiceField(          projection.objects, widget=myforms.SelectWithPop)
    querymap        = forms.models.ModelChoiceField(          querymap.objects, widget=myforms.SelectWithPop)
    reference       = forms.models.ModelChoiceField(          reference.objects, widget=myforms.SelectWithPop)
    scalebar        = forms.models.ModelChoiceField(          scalebar.objects, widget=myforms.SelectWithPop)
    symbol          = forms.models.ModelMultipleChoiceField(  symbol.objects, widget=myforms.MultipleSelectWithPop)
    web             = forms.models.ModelChoiceField(          web.objects, widget=myforms.SelectWithPop)

    class Meta:
        model = Map
        


################################################################################
# mapfile
################################################################################

#class mapfile(models.Model): (
#    Map                 = models.ForeignKey('Map')
#    ts                  = models.DateTimeField(auto_now=False, auto_now_add=False)



