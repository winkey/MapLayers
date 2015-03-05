################################################################################
#
# Project: NewWorld
# App:     Mapfile
#
# models and serializers for mapfile storage
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


##### 

from rest_framework import serializers

#####


from django.contrib.auth.models import User, Group

from colorpicker.fields import ColorField



################################################################################
## style (child of class amd leader )
#
#Style holds parameters for symbolization and styling. Multiple styles may be applied within a CLASS or LABEL.
#
#This object appeared in 4.0 and the intention is to separate logic from looks. The final intent is to have named styles (Not yet supported) that will be re-usable through the mapfile. This is the way of defining the appearance of an object (a CLASS or a LABEL).
#
#ANGLE [double|attribute|AUTO]
#
#    Angle, given in degrees, to rotate the symbol (counter clockwise). Default is 0 (no rotation). If you have an attribute that specifies angles in a clockwise direction (compass direction), you have to adjust the angle attribute values before they reach MapServer (360-ANGLE), as it is not possible to use a mathematical expression for ANGLE.
#
#        For points, it specifies the rotation of the symbol around its center.
#
#        For decorated lines, the behaviour depends on the value of the GAP element.
#            For negative GAP values it specifies the rotation of the decoration symbol relative to the direction of the line. An angle of 0 means that the symbols x-axis is oriented along the direction of the line.
#            For non-negativ (or absent) GAP values it specifies the rotation of the decoration symbol around its center. An angle of 0 means that the symbol is not rotated.
#
#        For polygons, it specifies the angle of the lines in a HATCH symbol (0 - horizontal lines), or it specifies the rotation of the symbol used to generate the pattern in a polygon fill (it does not specify the rotation of the fill as a whole). For its use with hatched lines, see Example #7 in the symbology examples.
#
#        [attribute] was introduced in version 5.0, to specify the attribute to use for angle values. The hard brackets [] are required. For example, if your data source has an attribute named "MYROTATE" that holds angle values for each feature, your STYLE object for hatched lines might contain:
#
#        STYLE
#          SYMBOL 'hatch-test'
#          COLOR 255 0 0
#          ANGLE [MYROTATE]
#          SIZE 4.0
#          WIDTH 3.0
#        END
#
#        The associated RFC document for this feature is MS RFC 19: Style & Label attribute binding.
#
#        The AUTO keyword was added in version 5.4, and currently only applies when coupled with the GEOMTRANSFORM keyword.
#
#    Note
#
#    Rotation using ANGLE is not supported for SYMBOLs of TYPE ellipse with the GD renderer (gif).
#ANGLEITEM [string]
#
#    ANGLE[attribute] must now be used instead.
#
#    Deprecated since version 5.0.
#
#ANTIALIAS [true|false]
#    Should TrueType fonts be antialiased. Only useful for GD (gif) rendering. Default is false. Has no effect for the other renderers (where anti-aliasing can not be turned off).
#
#BACKGROUNDCOLOR [r] [g] [b] - deprecated
#
#    Color to use for non-transparent symbols.
#
#    Note
#
#    Multiple STYLEs can be used instead:
#
#    STYLE
#      BACKGROUNDCOLOR 0 0 0
#      SYMBOL "foo"
#      COLOR 255 0 0
#    END
#
#    can be replaced with:
#
#    STYLE
#      COLOR 0 0 0
#    END
#    STYLE
#      SYMBOL "foo"
#      COLOR 255 0 0
#    END
#
#    Deprecated since version 6.2.
#
#COLOR [r] [g] [b] | [hex string] | [attribute]
#
#    Color to use for drawing features.
#
#        r, g and b shall be integers [0..255]. To specify green, the following is used:
#
#            COLOR 0 255 0
#
#        hex string can be
#
#            RGB value - "#rrggbb". To specify magenta, the following is used:
#
#            COLOR "#FF00FF"
#
#            RGBA value (adding translucence) - "#rrggbbaa". To specify a semi-translucent magenta, the following is used:
#
#            COLOR "#FF00FFCC"
#
#        [attribute] was introduced in version 5.0, to specify the attribute to use for color values. The hard brackets [] are required. For example, if your data set has an attribute named "MYPAINT" that holds color values for each record, use: object for might contain:
#
#        COLOR [MYPAINT]
#
#        If COLOR is not specified, and it is not a SYMBOL of TYPE pixmap, then the symbol will not be rendered.
#
#        The associated RFC document for this feature is MS RFC 19: Style & Label attribute binding.
#
#GAP [double]
#
#    GAP specifies the distance between SYMBOLs (center to center) for decorated lines and polygon fills in layer SIZEUNITS. For polygon fills, GAP specifies the distance between SYMBOLs in both the X and the Y direction. For lines, the centers of the SYMBOLs are placed on the line. As of MapServer 5.0 this also applies to PixMap symbols.
#
#    When scaling of symbols is in effect (SYMBOLSCALEDENOM is specified for the LAYER), GAP specifies the distance in layer SIZEUNITS at the map scale 1:SYMBOLSCALEDENOM.
#
#        For lines, if INITIALGAP is not specified, the first symbol will be placed GAP/2 from the start of the line.
#        For lines, a negative GAP value will cause the symbols' X axis to be aligned relative to the tangent of the line.
#        For lines, a positive GAP value aligns the symbols' X axis relative to the X axis of the output device.
#        For lines, a GAP of 0 (the default value) will cause the symbols to be rendered edge to edge
#        For polygons, a missing GAP or a GAP of less than or equal to the size of the symbol will cause the symbols to be rendered edge to edge.
#
#    Symbols can be rotated using ANGLE.
#
#    New in version 6.0: moved from SYMBOL
#
#    Note
#
#    The behaviour of GAP has not been stable over time. It has specified the amount of space between the symbols, and also something in between the amount of space between the symbols and the center to center distance. Since 6.2 GAP specifies the center to center distance between the symbols.
#
#GEOMTRANSFORM [bbox|centroid|end|labelpnt|labelpoly|start|vertices|<expression>]
#
#    Used to indicate that the current feature will be transformed before the actual style is applied. Introduced in version 5.4.
#
#        bbox: produces the bounding box of the current feature geometry.
#
#        centroid: produces the centroid of the current feature geometry.
#
#        end: produces the last point of the current feature geometry. When used with ANGLE AUTO, it can for instance be used to render arrowheads on line segments.
#
#        labelpnt: used for LABEL styles. Draws a marker on the geographic position the label is attached to. This corresponds to the center of the label text only if the label is in position CC.
#
#        labelpoly: used for LABEL styles. Produces a polygon that covers the label plus a 1 pixel padding.
#
#        start: produces the first point of the current feature geometry. When used with ANGLE AUTO, it can for instance be used to render arrow tails on line segments.
#
#        vertices: produces all the intermediate vertices (points) of the current feature geometry (the start and end are excluded). When used with ANGLE AUTO, the marker is oriented by the half angle formed by the two adjacent line segments.
#
#        <expression>: Applies the given expression to the geometry. Supported expressions:
#            (buffer([shape],dist)): Buffer the geometry ([shape]) using dist pixels as buffer distance. For polygons, a negative dist will produce a setback.
#            (generalize([shape],tolerance)): simplifies a geometry ([shape]) in way comparable to FME's ThinNoPoint algorithm. See http://trac.osgeo.org/gdal/ticket/966 for more information.
#
#        Note
#
#        Depends on GEOS.
#            (simplify([shape],tolerance)): simplifies a geometry ([shape]) using the standard Douglas-Peucker algorithm.
#            (simplifypt([shape],tolerance)): simplifies a geometry ([shape]), ensuring that the result is a valid geometry having the same dimension and number of components as the input. tolerance must be non-negative.
#            (smoothsia([shape], smoothing_size, smoothing_iteration, preprocessing)): will smooth a geometry ([shape]) using the SIA algorithm
#
#        Example (polygon data set) - draw a two pixel wide line 5 pixels inside the boundary of the polygon:
#
#        STYLE
#          OUTLINECOLOR 255 0 0
#          WIDTH 2
#          GEOMTRANSFORM (buffer([shape],-5))
#        END
#
#    There is a difference between STYLE and LAYER GEOMTRANSFORM. LAYER-level will receive ground coordinates (meters, degress, etc) and STYLE-level will receive pixel coordinates. The argument to methods such as simplify() must be in the same units as the coordinates of the shapes at that point of the rendering workflow, i.e. pixels at the STYLE-level and in ground units at the LAYER-level.
#
#    LAYER NAME "my_layer"
#        TYPE LINE
#        STATUS DEFAULT
#        DATA "lines.shp"
#        GEOMTRANSFORM (simplify([shape], 10))  ## 10 ground units
#        CLASS
#            STYLE
#                GEOMTRANSFORM (buffer([shape], 5)  ## 5 pixels
#                WIDTH 2
#                COLOR 255 0 0
#            END
#        END
#    END
#
#    See also
#
#    Geometry Transformations
#
#INITIALGAP [double]
#
#    INITIALGAP is useful for styling dashed lines.
#
#    If used with GAP, INITIALGAP specifies the distance to the first symbol on a styled line.
#
#    If used with PATTERN, INITIALGAP specifies the distance to the first dash on a dashed line.
#
#    Example 1 - dashed line styled with circles:
#
#    STYLE
#      COLOR 0 0 0
#      WIDTH 4
#      PATTERN 40 10 END
#    END
#    STYLE
#      SYMBOL "circlef"
#      COLOR 0 0 0
#      SIZE 8
#      INITIALGAP 20
#      GAP 50
#    END
#
#    Example 1 - dashed line styled with dashed line overlay:
#
#    STYLE
#      COLOR 0 0 0
#      WIDTH 6
#      PATTERN 40 10 END
#    END
#    STYLE
#      COLOR 255 255 255
#      WIDTH 4
#      INITIALGAP 2
#      PATTERN 36 14 END
#    END
#
#    New in version 6.2.
#
#LINECAP [butt|round|square]
#
#    Sets the line cap type for lines. Default is round. See Cartographical Symbol Construction with MapServer for explanation and examples.
#
#    New in version 6.0: moved from SYMBOL
#
#LINEJOIN [round|miter|bevel]
#
#    Sets the line join type for lines. Default is round. See Cartographical Symbol Construction with MapServer for explanation and examples.
#
#    New in version 6.0: moved from SYMBOL
#
#LINEJOINMAXSIZE [int]
#
#    Sets the max length of the miter LINEJOIN type. The value represents a coefficient which multiplies a current symbol size. Default is 3. See Cartographical Symbol Construction with MapServer for explanation and examples.
#
#    New in version 6.0: moved from SYMBOL
#
#MAXSCALEDENOM [double]
#
#    Minimum scale at which this STYLE is drawn. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.
#
#    New in version 5.4.
#
#    See also
#
#    Map Scale
#
#MAXSIZE [double]
#    Maximum size in pixels to draw a symbol. Default is 500. Starting from version 5.4, the value can also be a decimal value (and not only integer). See LAYER SYMBOLSCALEDENOM.
#
#MAXWIDTH [double]
#    Maximum width in pixels to draw the line work. Default is 32. Starting from version 5.4, the value can also be a decimal value (and not only integer). See LAYER SYMBOLSCALEDENOM.
#
#MINSCALEDENOM [double]
#
#    Maximum scale at which this STYLE is drawn. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.
#
#    New in version 5.4.
#
#    See also
#
#    Map Scale
#
#MINSIZE [double]
#    Minimum size in pixels to draw a symbol. Default is 0. Starting from version 5.4, the value can also be a decimal value (and not only integer). See LAYER SYMBOLSCALEDENOM.
#
#MINWIDTH [double]
#    Minimum width in pixels to draw the line work. Default is 0. Starting from version 5.4, the value can also be a decimal value (and not only integer). See LAYER SYMBOLSCALEDENOM.
#
#OFFSET [x][y]
#
#    Geometry offset values in layer SIZEUNITS. In the general case, SIZEUNITS will be pixels.
#
#    When scaling of symbols is in effect (SYMBOLSCALEDENOM is specified for the LAYER), OFFSET gives offset values in layer SIZEUNITS at the map scale 1:SYMBOLSCALEDENOM.
#
#    An OFFSET of 20 40 will shift the geometry 20 SIZEUNITS to the left and 40 SIZEUNITS down before rendering.
#
#    For lines, an OFFSET of y = -99 will produce a line geometry that is shifted x SIZEUNITS perpendicular to the original line geometry. A positive x shifts the line to the right when seen along the direction of the line. A negative x shifts the line to the left when seen along the direction of the line.
#
#    For lines, an OFFSET of y = -999 (added in version 6.4) will produce a multiline geometry corresponding to the borders of a line that is x SIZEUNITS wide. This can be used to render only the outlines of a thick line.
#
#OPACITY [integer|attribute]
#
#    Opacity to draw the current style (applies to 5.2+, AGG Rendering Specifics only, does not apply to pixmap symbols)
#
#        [attribute] was introduced in version 5.6, to specify the attribute to use for opacity values.
#
#OUTLINECOLOR [r] [g] [b] | [attribute]
#
#    Color to use for outlining polygons and certain marker symbols (ellipse, vector polygons and truetype). Has no effect for lines. The width of the outline can be specified using WIDTH. If no WIDTH is specified, an outline of one pixel will be drawn.
#
#    If there is a SYMBOL defined for the STYLE, the OUTLINECOLOR will be used to create an outline for that SYMBOL (only ellipse, truetype and polygon vector symbols will get an outline). If there is no SYMBOL defined for the STYLE, the polygon will get an outline.
#
#        r, g and b shall be integers [0..255]. To specify green, the following is used:
#
#        OUTLINECOLOR 0 255 0
#        WIDTH 3.0
#
#        [attribute] was introduced in version 5.0, to specify the attribute to use for color values. The hard brackets [] are required. For example, if your data set has an attribute named "MYPAINT" that holds color values for each record, use: object for might contain:
#
#        OUTLINECOLOR [MYPAINT]
#
#        The associated RFC document for this feature is MS RFC 19: Style & Label attribute binding.
#
#OUTLINEWIDTH [double|attribute]
#
#    Width in pixels for the outline. Default is 0.0. The thickness of the outline will not depend on the scale.
#
#    New in version 5.4.
#
#PATTERN [double on] [double off] [double on] [double off] ... END
#
#    Used to define a dash pattern for line work (lines, polygon outlines, hatch lines, ...). The numbers (doubles) specify the lengths of the dashes and gaps of the dash pattern in layer SIZEUNITS. When scaling of symbols is in effect (SYMBOLSCALEDENOM is specified for the LAYER), the numbers specify the lengths of the dashes and gaps in layer SIZEUNITS at the map scale 1:SYMBOLSCALEDENOM.
#
#    LINECAP, LINEJOIN and LINEJOINMAXSIZE can be used to control the appearance of the dashed lines.
#
#    To specify a dashed line that is 5 units wide, with dash lengths of 5 units and gaps of 5 units, the following style can be used:
#
#        STYLE
#          COLOR 0 0 0
#          WIDTH 5.0
#          LINECAP BUTT
#          PATTERN 5.0 5.0 END
#        END
#
#    Since version 6.2, PATTERN can be used to create dashed lines for SYMBOLs of TYPE hatch. Patterns for hatches are always drawn with LINECAP butt. The patterns are generated relative to the edges of the bounding box of the polygon (an illustrated example can be found in the hatch fill section of the symbol construction document).
#
#    New in version 6.0: moved from SYMBOL
#
#POLAROFFSET [double|attribute] [double|attribute]
#
#    Offset given in polar coordinates.
#
#    The first parameter is a double value in layer SIZEUNITS (or the name of a layer attribute) that specifies the radius/distance.
#
#    The second parameter is a double value (or the name of a layer attribute) that specifies the angle (counter clockwise).
#
#    When scaling of symbols is in effect (SYMBOLSCALEDENOM is specified for the LAYER), POLAROFFSET gives the distance in layer SIZEUNITS at the map scale 1:SYMBOLSCALEDENOM.
#
#    A POLAROFFSET of 20 40 will shift the geometry to a position that is 20 SIZEUNITS away along a line that is at an angle of 40 degrees with a line that goes horizontally to the right.
#
#    When POLAROFFSET is used with layers that have CONNECTIONTYPE uvraster (vector field), the special attributes uv_length, uv_length_2, uv_angle and uv_minus_angle are available, making it convenient to specify arrow heads and tails. Example:
#
#    LAYER
#      ...
#      TYPE POINT
#      CONNECTIONTYPE uvraster
#      ...
#      CLASS
#        STYLE
#          SYMBOL "arrowbody"
#          ANGLE [uv_angle]
#          SIZE [uv_length]
#          WIDTH 3
#          COLOR 100 255 0
#        END
#        STYLE
#          SYMBOL "arrowhead"
#          ANGLE [uv_angle]
#          SIZE 10
#          COLOR 255 0 0
#          POLAROFFSET [uv_length_2] [uv_angle]
#        END
#        STYLE
#          SYMBOL "arrowtail"
#          ANGLE [uv_angle]
#          SIZE 10
#          COLOR 255 0 0
#          POLAROFFSET [uv_length_2] [uv_minus_angle]
#        END
#      END #class
#    END #layer
#
#    New in version 6.2: (MS RFC 78: Vector Field Rendering (CONNECTIONTYPE UVRASTER))
#
#SIZE [double|attribute]
#
#    Height, in layer SIZEUNITS, of the symbol/pattern to be used. Default value depends on the SYMBOL TYPE. For pixmap: the hight (in pixels) of the pixmap; for ellipse and vector: the maximum y value of the SYMBOL POINTS parameter, for hatch: 1.0, for truetype: 1.0.
#
#    When scaling of symbols is in effect (SYMBOLSCALEDENOM is specified for the LAYER), SIZE gives the height, in layer SIZEUNITS, of the symbol/pattern to be used at the map scale 1:SYMBOLSCALEDENOM.
#
#        For symbols of TYPE hatch, the SIZE is the center to center distance between the lines. For its use with hatched lines, see Example#8 in the symbology examples.
#
#        [attribute] was introduced in version 5.0, to specify the attribute to use for size values. The hard brackets [] are required. For example, if your data set has an attribute named "MYHIGHT" that holds size values for each feature, your STYLE object for hatched lines might contain:
#
#        STYLE
#          SYMBOL 'hatch-test'
#          COLOR 255 0 0
#          ANGLE 45
#          SIZE [MYHIGHT]
#          WIDTH 3.0
#        END
#
#        The associated RFC document for this feature is MS RFC 19: Style & Label attribute binding.
#
#        Starting from version 5.4, the value can also be a decimal value (and not only integer).
#
#SYMBOL [integer|string|filename|url|attribute]
#
#    The symbol to use for rendering the features.
#
#        Integer is the index of the symbol in the symbol set, starting at 1 (the 5th symbol is symbol number 5).
#
#        String is the name of the symbol (as defined using the SYMBOL NAME parameter).
#
#        Filename specifies the path to a file containing a symbol. For example a PNG file. Specify the path relative to the directory containing the mapfile.
#
#        URL specifies the address of a file containing a pixmap symbol. For example a PNG file. A URL must start with "http":
#
#        SYMBOL "http://myserver.org/path/to/file.png"
#
#        New in version 6.0.
#
#        [attribute] allows individual rendering of features by using an attribute in the dataset that specifies the symbol name (as defined in the SYMBOL NAME parameter). The hard brackets [] are required.
#
#        New in version 5.6.
#
#    If SYMBOL is not specified, the behaviour depends on the type of feature.
#
#        For points, nothing will be rendered.
#        For lines, SYMBOL is only relevant if you want to style the lines using symbols, so the absence of SYMBOL means that you will get lines as specified using the relevant line rendering parameters (COLOR, WIDTH, PATTERN, LINECAP, ...).
#        For polygons, the interior of the polygons will be rendered using a solid fill of the color specified in the COLOR parameter.
#
#    See also
#
#    SYMBOL
#
#WIDTH [double|attribute]
#
#    WIDTH refers to the thickness of line work drawn, in layer SIZEUNITS. Default is 1.0.
#
#    When scaling of symbols is in effect (SYMBOLSCALEDENOM is specified for the LAYER), WIDTH refers to the thickness of the line work in layer SIZEUNITS at the map scale 1:SYMBOLSCALEDENOM.
#
#        If used with SYMBOL and OUTLINECOLOR, WIDTH specifies the width of the symbol outlines. This applies to SYMBOL TYPE vector (polygons), ellipse and truetype.
#        For lines, WIDTH specifies the width of the line.
#        For polygons, if used with OUTLINECOLOR, WIDTH specifies the thickness of the polygon outline.
#        For a symbol of SYMBOL TYPE hatch, WIDTH specifies the thickness of the hatched lines. For its use with hatched lines, see Example #7 in the symbology examples.
#        [attribute] was added in version 5.4 to specify the attribute to use for the width value. The hard brackets [] are required.
#        Starting from version 5.4, the value can also be a decimal value (and not only integer).
#
#
#################################################################################


class style(models.Model):

    GEOMTRANSFORM_BBOX = 'bbox'
    GEOMTRANSFORM_END = 'end'
    GEOMTRANSFORM_LABELPNT = 'labelpnt'
    GEOMTRANSFORM_LABELPOLY = 'labelpoly'
    GEOMTRANSFORM_START = 'start'
    GEOMTRANSFORM_VERTICES = 'vertices'
    #<expression>: Applies the given expression to the geometry

    GEOMTRANSFORM_CHOICES = (
        (GEOMTRANSFORM_BBOX, GEOMTRANSFORM_BBOX),
        (GEOMTRANSFORM_END, GEOMTRANSFORM_END),
        (GEOMTRANSFORM_LABELPNT, GEOMTRANSFORM_LABELPNT),
        (GEOMTRANSFORM_LABELPOLY, GEOMTRANSFORM_LABELPOLY),
        (GEOMTRANSFORM_START, GEOMTRANSFORM_START),
        (GEOMTRANSFORM_VERTICES, GEOMTRANSFORM_VERTICES),
        #<expression>: Applies the given expression to the geometry
    )


    LINECAP_BUTT = 'butt'
    LINECAP_ROUND = 'round'
    LINECAP_SQUARE = 'square'

    LINECAP_CHOICES = (
        (LINECAP_BUTT, LINECAP_BUTT),
        (LINECAP_ROUND, LINECAP_ROUND),
        (LINECAP_SQUARE, LINECAP_SQUARE),
    )

    LINEJOIN_ROUND = 'round'
    LINEJOIN_MITER= 'miter'
    LINEJOIN_BEVEL = 'bevel'

    LINEJOIN_CHOICES = (
        (LINEJOIN_ROUND, LINEJOIN_ROUND),
        (LINEJOIN_MITER, LINEJOIN_MITER),
        (LINEJOIN_BEVEL, LINEJOIN_BEVEL),
    )




    angle               = models.FloatField(                 default = 0,
                                                             help_text='Angle, given in degrees, to draw the line work. Default is 0. For symbols of Type HATCH, this is the angle of the hatched lines.')
    #d angleitem        = models.TextField(                   )
    antialias           = models.NullBooleanField(           default=False)
    #d backgroundcolor     = ArrayField( models.IntegerField(), size=3)*/
    color               = ArrayField( models.IntegerField(), size=3)
    gap                 = models.FloatField()
    geotransform        = models.TextField(                  choices = GEOMTRANSFORM_CHOICES)
    initialgap          = models.FloatField()
    linecap             = models.TextField(                  choices = LINECAP_CHOICES)
    linejoinmaxsize     = models.IntegerField()
    maxscaledenom       = models.FloatField()
    maaxsize            = models.FloatField()
    maxwidth            = models.FloatField()
    minscaledenom       = models.FloatField()
    minsize             = models.FloatField()
    minwidth            = models.FloatField()
    offset              = ArrayField( models.IntegerField(), size=2)
    opacity             = models.TextField(                  )
    outlinecolor        = models.TextField(                  )
    outlinewidth        = models.TextField(                  )
    pattern             = ArrayField( ArrayField( models.FloatField(), size=2 ) )
    polaroffset         = models.TextField(                  )
    size                = models.TextField(                  )
    symbol              = models.TextField(                  )
    width               = models.TextField(                  )




    class Meta:
        verbose_name = _( "style" )
        verbose_name_plural = _( "style" )


################################################################################
## leader (child of class)
#
#
#GRIDSTEP [integer]
#    Specifies the number of pixels between positions that are tested for a label line. You might start with a value of 5, and increase depending on performance (see example below).
#
#MAXDISTANCE [integer]
#    Specifies the maximum distance in pixels from the normal label location that a leader line can be drawn. You might start with a value of 30, and increase depending on the resulting placement (see example below).
#STYLE
#    Signals the start of a STYLE object. Use this to style the leader line. 
#
################################################################################

class leader(models.Model):
    gridstep            = models.IntegerField()
    mindistance         = models.IntegerField()
    style               = models.ManyToManyField(style)

    class Meta:
        verbose_name = _( "leader" )
        verbose_name_plural = _( "leader" )




################################################################################
## label (child of legend and scalebar and class)
#
#
#ALIGN [left|center|right]
#
#    Specifies text alignment for multiline labels (see WRAP) Note that the alignment algorithm is far from precise, so don't expect fabulous results (especially for right alignment) if you're not using a fixed width font.
#
#    New in version 5.4.
#
#ANGLE [double|auto|auto2|follow|attribute]
#
#        Angle, counterclockwise, given in degrees, to draw the label. Default is 0.
#
#        AUTO allows MapServer to compute the angle. Valid for LINE layers only.
#
#        AUTO2 same as AUTO, except no logic is applied to try to keep the text from being rendered in reading orientation (i.e. the text may be rendered upside down). Useful when adding text arrows indicating the line direction.
#
#        FOLLOW was introduced in version 4.10 and tells MapServer to compute a curved label for appropriate linear features (see MS RFC 11: Support for Curved Labels for specifics). See also MAXOVERLAPANGLE.
#
#        [Attribute] was introduced in version 5.0, to specify the item name in the attribute table to use for angle values. The hard brackets [] are required. For example, if your shapefile's DBF has a field named "MYANGLE" that holds angle values for each record, your LABEL object might contain:
#
#        LABEL
#          COLOR  150 150 150
#          OUTLINECOLOR 255 255 255
#          FONT "sans"
#          TYPE truetype
#          SIZE 6
#          ANGLE [MYANGLE]
#          POSITION AUTO
#          PARTIALS FALSE
#        END
#
#        The associated RFC document for this feature is MS RFC 19: Style & Label attribute binding.
#
#ANTIALIAS [true|false]
#    Should text be antialiased? Note that this requires more available colors, decreases drawing performance, and results in slightly larger output images. Only useful for GD (gif) rendering. Default is false. Has no effect for the other renderers (where anti-aliasing can not be turned off).
#BACKGROUNDCOLOR [r] [g] [b]
#
#    Color to draw a background rectangle (i.e. billboard). Off by default.
#
#    Note
#
#    Removed in 6.0. Use a LABEL STYLE object with GEOMTRANSFORM labelpoly and COLOR.
#BACKGROUNDSHADOWCOLOR [r] [g] [b]
#
#    Color to draw a background rectangle (i.e. billboard) shadow. Off by default.
#
#    Note
#
#    Removed in 6.0. Use a LABEL STYLE object with GEOMTRANSFORM labelpoly, COLOR and OFFSET.
#BACKGROUNDSHADOWSIZE [x][y]
#
#    How far should the background rectangle be offset? Default is 1.
#
#    Note
#
#    Removed in 6.0. Use a LABEL STYLE object with GEOMTRANSFORM labelpoly, COLOR and OFFSET.
#
#BUFFER [integer]
#    Padding, in pixels, around labels. Useful for maintaining spacing around text to enhance readability. Available only for cached labels. Default is 0.
#
#COLOR [r] [g] [b] | [attribute]
#
#        Color to draw text with.
#
#        [Attribute] was introduced in version 5.0, to specify the item name in the attribute table to use for color values. The hard brackets [] are required. For example, if your shapefile's DBF has a field named "MYCOLOR" that holds color values for each record, your LABEL object might contain:
#
#        LABEL
#          COLOR  [MYCOLOR]
#          OUTLINECOLOR 255 255 255
#          FONT "sans"
#          TYPE truetype
#          SIZE 6
#          POSITION AUTO
#          PARTIALS FALSE
#        END
#
#        The associated RFC document for this feature is MS RFC 19: Style & Label attribute binding.
#
#ENCODING [string]
#
#    Supported encoding format to be used for labels. If the format is not supported, the label will not be drawn. Requires the iconv library (present on most systems). The library is always detected if present on the system, but if not, the label will not be drawn.
#
#    Required for displaying international characters in MapServer. More information can be found in the Label Encoding document.
#
#EXPRESSION [string]
#
#    Expression that determines when the LABEL is to be applied. See EXPRESSION in CLASS.
#
#    New in version 6.2.
#
#FONT [name|attribute]
#
#        Font alias (as defined in the FONTSET) to use for labeling.
#        [Attribute] was introduced in version 5.6 to specfify the font alias.
#        May contain a comma-separated list of up to MS_MAX_LABEL_FONTS (usually 5) font aliases used as fallback fonts in renderers supporting it, if a glyph is not available in a font. If specified directly, be sure to enclose the list with quotes. See MS RFC 80: Font Fallback Support.
#
#FORCE [true|false]
#    Forces labels for a particular class on, regardless of collisions. Available only for cached labels. Default is false. If FORCE is true and PARTIALS is false, FORCE takes precedence, and partial labels are drawn.
#
#MAXLENGTH [integer]
#
#    This keyword interacts with the WRAP keyword so that line breaks only occur after the defined number of characters.
#    Interaction with WRAP keyword   	maxlength = 0 	maxlength > 0 	maxlength < 0
#    wrap = 'char' 	always wrap at the WRAP character 	newline at the first WRAP character after MAXLENGTH characters 	hard wrap (always break at exactly MAXLENGTH characters)
#    no wrap 	no processing 	skip label if it contains more than MAXLENGTH characters 	hard wrap (always break at exactly MAXLENGTH characters)
#
#    The associated RFC document for this feature is MS RFC 40: Support Label Text Transformations.
#
#    New in version 5.4.
#
#MAXOVERLAPANGLE [double]
#
#    Angle threshold to use in filtering out ANGLE FOLLOW labels in which characters overlap (floating point value in degrees). This filtering will be enabled by default starting with MapServer 6.0. The default MAXOVERLAPANGLE value will be 22.5 degrees, which also matches the default in GeoServer. Users will be free to tune the value up or down depending on the type of data they are dealing with and their tolerance to bad overlap in labels. As per RFC 60, if MAXOVERLAPANGLE is set to 0, then we fall back on pre-6.0 behavior which was to use maxoverlapangle = 0.4*MS_PI (40% of 180 degrees = 72degree).
#
#    The associated RFC document for this feature is MS RFC 60: Labeling enhancement: ability to skip ANGLE FOLLOW labels with too much character overlap.
#
#MAXSCALEDENOM [double]
#
#    Minimum scale at which this LABEL is drawn. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.
#
#    New in version 5.4.
#
#    See also
#
#    Map Scale
#
#MAXSIZE [double]
#    Maximum font size to use when scaling text (pixels). Default is 256. Starting from version 5.4, the value can also be a fractional value (and not only integer). See LAYER SYMBOLSCALEDENOM.
#
#MINDISTANCE [integer]
#    Minimum distance between duplicate labels. Given in pixels.
#
#MINFEATURESIZE [integer|auto]
#    Minimum size a feature must be to be labeled. Given in pixels. For line data the overall length of the displayed line is used, for polygons features the smallest dimension of the bounding box is used. "Auto" keyword tells MapServer to only label features that are larger than their corresponding label. Available for cached labels only.
#
#MINSCALEDENOM [double]
#
#    Maximum scale at which this LABEL is drawn. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.
#
#    New in version 5.4.
#
#    See also
#
#    Map Scale
#
#MINSIZE [double]
#    Minimum font size to use when scaling text (pixels). Default is 4. Starting from version 5.4, the value can also be a fractional value (and not only integer). See LAYER SYMBOLSCALEDENOM.
#
#OFFSET [x][y]
#
#    Offset values for labels, relative to the lower left hand corner of the label and the label point. Given in pixels. In the case of rotated text specify the values as if all labels are horizontal and any rotation will be compensated for.
#
#    When used with FOLLOW angle, two additional options are available to render the label parallel to the original feature:
#
#        OFFSET x -99 : will render the label to the left or to the right of the feature, depending on the sign of {x}.
#        OFFSET x 99 : will render the label above or below the feature, depending on the sign of {x}.
#
#    See LAYER SYMBOLSCALEDENOM.
#
#OUTLINECOLOR [r] [g] [b] | [attribute]
#
#        Color to draw a one pixel outline around the characters in the text.
#
#        [attribute] was introduced in version 5.0, to specify the item name in the attribute table to use for color values. The hard brackets [] are required. For example, if your shapefile's DBF has a field named "MYOUTCOLOR" that holds color values for each record, your LABEL object might contain:
#
#        LABEL
#          COLOR  150 150 150
#          OUTLINECOLOR [MYOUTCOLOR]
#          FONT "sans"
#          TYPE truetype
#          SIZE 6
#          POSITION AUTO
#          PARTIALS FALSE
#        END
#
#        The associated RFC document for this feature is MS RFC 19: Style & Label attribute binding.
#
#OUTLINEWIDTH [integer]
#    Width of the outline if OUTLINECOLOR has been set. Defaults to 1. Currently only the AGG renderer supports values greater than 1, and renders these as a 'halo' effect: recommended values are 3 or 5.
#
#PARTIALS [true|false]
#    Can text run off the edge of the map? Default is true. If FORCE is true and PARTIALS is false, FORCE takes precedence, and partial labels are drawn.
#
#POSITION [ul|uc|ur|cl|cc|cr|ll|lc|lr|auto]
#    Position of the label relative to the labeling point (layers only). First letter is "Y" position, second letter is "X" position. "Auto" tells MapServer to calculate a label position that will not interfere with other labels. With points, MapServer selects from the 8 outer positions (i.e. excluding cc). With polygons, MapServer selects from cc (added in MapServer 5.4), uc, lc, cl and cr as possible positions. With lines, it only uses lc or uc, until it finds a position that doesn't collide with labels that have already been drawn. If all positions cause a conflict, then the label is not drawn (Unless the label's FORCE a parameter is set to "true"). "Auto" placement is only available with cached labels.
#
#PRIORITY [integer]|[item_name]|[attribute]
#
#    The priority parameter takes an integer value between 1 (lowest) and 10 (highest). The default value is 1. It is also possible to bind the priority to an attribute (item_name) using square brackets around the [item_name]. e.g. "PRIORITY [someattribute]"
#
#    Labels are stored in the label cache and rendered in order of priority, with the highest priority levels rendered first. Specifying an out of range PRIORITY value inside a map file will result in a parsing error. An out of range value set via MapScript or coming from a shape attribute will be clamped to the min/max values at rendering time. There is no expected impact on performance for using label priorities.
#
#    [Attribute] was introduced in version 5.6.
#
#    New in version 5.0.
#
#REPEATDISTANCE [integer]
#
#    The label will be repeated on every line of a multiline shape and will be repeated multiple times along a given line at an interval of REPEATDISTANCE pixels.
#
#    The associated RFC document for this feature is MS RFC 57: Labeling enhancements: ability to repeat labels along a line/multiline.
#
#    New in version 5.6.
#
#SHADOWCOLOR [r] [g] [b]
#    Color of drop shadow. A label with the same text will be rendered in this color before the main label is drawn, resulting in a shadow effect on the the label characters. The offset of the renderered shadow is set with SHADOWSIZE.
#
#SHADOWSIZE [x][y]|[attribute][attribute]|[x][attribute]|[attribute][y]
#
#    Shadow offset in pixels, see SHADOWCOLOR.
#
#    [Attribute] was introduced in version 6.0, and can be used like:
#
#    SHADOWSIZE 2 2
#    SHADOWSIZE [shadowsizeX] 2
#    SHADOWSIZE 2 [shadowsizeY]
#    SHADOWSIZE [shadowsize] [shadowsize]
#
#SIZE [double]|[tiny|small|medium|large|giant]|[attribute]
#
#        Text size. Use a number to give the size in pixels of your TrueType font based label, or any of the other 5 listed keywords for bitmap fonts.
#
#        When scaling is in effect (SYMBOLSCALEDENOM is specified for the LAYER), SIZE gives the size of the font to be used at the map scale 1:SYMBOLSCALEDENOM.
#
#        Starting from version 5.4, the value can also be a fractional value (and not only integer).
#
#        [Attribute] was introduced in version 5.0, to specify the item name in the attribute table to use for size values. The hard brackets [] are required. For example, if your shapefile's DBF has a field named "MYSIZE" that holds size values for each record, your LABEL object might contain:
#
#        LABEL
#          COLOR  150 150 150
#          OUTLINECOLOR 255 255 255
#          FONT "sans"
#          TYPE truetype
#          SIZE [MYSIZE]
#          POSITION AUTO
#          PARTIALS FALSE
#        END
#
#        The associated RFC document for this feature is MS RFC 19: Style & Label attribute binding.
#
#STYLE
#
#    The start of a STYLE object.
#
#    Label specific mechanisms of the STYLE object are the GEOMTRANSFORM options:
#
#    GEOMTRANSFORM [labelpnt|labelpoly]
#
#        Creates a geometry that can be used for styling the label.
#
#            labelpnt draws a marker on the geographic position the label is attached to. This corresponds to the center of the label text only if the label is in position CC.
#            labelpoly generates the bounding rectangle for the text, with 1 pixel of padding added in all directions.
#
#        The resulting geometries can be styled using the mechanisms available in the STYLE object.
#
#            Example - draw a red background rectangle for the labels (i.e. billboard) with a "shadow" in gray:
#
#            STYLE
#              GEOMTRANSFORM 'labelpoly'
#              COLOR 153 153 153
#              OFFSET 3 2
#            END # STYLE
#            STYLE
#              GEOMTRANSFORM 'labelpoly'
#              COLOR 255 0 0
#            END # STYLE
#
#    New in version 6.0.
#
#TEXT [string|expression]
#
#    Text to label features with (useful when multiple labels are used). Overrides values obtained from the LAYER LABELITEM and the CLASS TEXT. See TEXT in CLASS.
#
#        New in version 6.2.
#
#TYPE [bitmap|truetype]
#
#    Type of font to use. Generally bitmap fonts are faster to draw then TrueType fonts. However, TrueType fonts are scalable and available in a variety of faces. Be sure to set the FONT parameter if you select TrueType.
#
#    Note
#
#    Bitmap fonts are only supported with the AGG and GD renderers.
#
#WRAP [character]
#    Character that represents an end-of-line condition in label text, thus resulting in a multi-line label. Interacts with MAXLENGTH for conditional line wrapping after a given number of characters 
#################################################################################



class label(models.Model):

    POSITION_UL = 'ul'
    POSITION_UC = 'uc'
    POSITION_UR = 'ur'
    POSITION_CL = 'cl'
    POSITION_CC = 'cc'
    POSITION_CR = 'cr'
    POSITION_LL = 'll'
    POSITION_LC = 'lc'
    POSITION_LR = 'lr'
    POSITION_AUTO = 'auto'

    POSITION_CHOICES = (
        (POSITION_UL, POSITION_UL),
        (POSITION_UC, POSITION_UC),
        (POSITION_UR, POSITION_UR),
        (POSITION_CL, POSITION_CL),
        (POSITION_CC, POSITION_CC),
        (POSITION_CR, POSITION_CR),
        (POSITION_LL, POSITION_LL),
        (POSITION_LC, POSITION_LC),
        (POSITION_LR, POSITION_LR),
        (POSITION_AUTO, POSITION_AUTO),
    )

    TYPE_BITMAP = 'bitmap'
    TYPE_TRUETYPE = 'truetype'

    TYPE_CHOICES = (
        (TYPE_BITMAP, TYPE_BITMAP),
        (TYPE_TRUETYPE, TYPE_TRUETYPE),
    );

    align               = models.TextField(                  )
    angle               = models.TextField(                  )
    antialias           = models.BooleanField(               default=False)
    
    # fixme need to finish the color field class
    backgroundcolor     = ArrayField( models.IntegerField(), size=3)
    backgroundshadowcolor = ArrayField( models.IntegerField(), size=3)
    backgroundshadowsize  = ArrayField( models.IntegerField(), size=3)

    buffer              = models.IntegerField()
    color               = models.TextField(                  )
    encoding            = models.TextField(                  )
    expression          = models.TextField(                  )
    font                = models.TextField(                  )
    force               = models.help_text=()
    maxlength           = models.IntegerField()
    maxoverlapangle     = models.FloatField()
    maxscaledenom       = models.FloatField()
    maxsize             = models.FloatField()
    mindistance         = models.IntegerField()
    minfeaturesize      = models.TextField(                  )
    minscaledenom       = models.FloatField()
    minsize             = models.FloatField()
    offset              = ArrayField( models.IntegerField(), size=2)
    ourtlinecolor       = ArrayField( models.IntegerField(), size=3)
    outlinewidth        = models.IntegerField()
    partials            = models.NullBooleanField(           default=True)
    position            = models.TextField(                  choices = POSITION_CHOICES,
                                                             default = 'auto')
    proprity            = models.TextField(                  )
    repeatdistance      = models.IntegerField()
    shadowcolor         = ArrayField( models.IntegerField(), size=3)
    shadowsize          = ArrayField( models.IntegerField(), size=2)
    size                = models.IntegerField()
    style               = models.ManyToManyField(style)
    text                = models.TextField(                  )
    type                = models.TextField(                  choices = TYPE_CHOICES )
    wrap                = models.TextField(                  max_length=1)

    class Meta:
        verbose_name = _( "label" )
        verbose_name_plural = _( "label" )



################################################################################
## validation (child of web and layer and class)
#
#
#
#Because runtime substitution affects potentially sensitive areas of your mapfile, such as database columns and filenames, it is mandatory that you use pattern validation (since version 6.0)
#
#Pattern validation uses regular expressions, which are strings that describe how to compare strings to patterns. The exact functionality of your systems' regular expressions may vary, but you can find a lot of general information by a Google search for "regular expression tutorial".
#
#As of MapServer 5.4.0 the preferred mechanism is a VALIDATION block in the LAYER definition. This is only slightly different from the older METADATA mechanism. VALIDATION blocks can be used with CLASS, LAYER and WEB.
#
#VALIDATION
#  # %firstname% substitutions can only have letters and hyphens
#  'firstname'     '^[a-zA-Z\-]+$'
#
#  # %parcelid% must be numeric and between 5 and 8 characters
#  'parcelid'      '^[0-9]{5,8)$'
#
#  # %taxid% must be two capital letters and six digits
#  'taxid'         '^[A-Z]{2}[0-9]{6}$'
#END
#
#If identical keys appear in more than one validation block then keys in more specialised blocks override those in more generalised blocks. i.e. CLASS overrides LAYER which overrides WEB.
#
################################################################################

class validation(models.Model):
    varname             = models.TextField(                  )
    regex               = models.TextField(                  )


    class Meta:
        verbose_name = _( "validation" )
        verbose_name_plural = _( "validation" )




################################################################################
## class (child of layer)
#
#BACKGROUNDCOLOR [r] [g] [b] - deprecated
#
#    Deprecated since version 6.0: Use CLASS STYLEs.
#
#COLOR [r] [g] [b]
#
#    Deprecated since version 6.0: Use CLASS STYLEs.
#
#DEBUG [on|off]
#
#    Enables debugging of the class object. Verbose output is generated and sent to the standard error output (STDERR) or the MapServer logfile if one is set using the LOG parameter in the WEB object.
#
#    See also
#
#    MS RFC 28: Redesign of LOG/DEBUG output mechanisms
#
#EXPRESSION [string]
#
#    Four types of expressions are now supported to define which class a feature belongs to: String comparisons, regular expressions, logical expressions, and string functions (see Expressions). If no expression is given, then all features are said to belong to this class.
#
#        String comparisons are case sensitive and are the fastest to evaluate. No special delimiters are necessary although strings must be quoted if they contain special characters. (As a matter of good habit, it is recommended that you quote all strings). The attribute to use for comparison is defined in the LAYER CLASSITEM parameter.
#
#        Regular expression are limited using slashes (/regex/). The attribute to use for comparison is defined in the LAYER CLASSITEM parameter.
#
#        Logical expressions allow the building of fairly complex tests based on one or more attributes and therefore are only available with shapefiles. Logical expressions are delimited by parentheses "(expression)". Attribute names are delimited by square brackets "[ATTRIBUTE]". Attribute names are case sensitive and must match the items in the shapefile. For example:
#
#        EXPRESSION ([POPULATION] > 50000 AND '[LANGUAGE]' eq 'FRENCH')
#
#        The following logical operators are supported: =, >, <, <=, >=, =, or, and, lt, gt, ge, le, eq, ne, in, ~, ~*. As one might expect, this level of complexity is slower to process.
#
#            One string function exists: length(). It computes the length of a string:
#
#            EXPRESSION (length('[NAME_E]') < 8)
#
#    String comparisons and regular expressions work from the classitem defined at the layer level. You may mix expression types within the different classes of a layer.
#
#GROUP [string]
#
#    Allows for grouping of classes. It is only used when a CLASSGROUP at the LAYER level is set. If the CLASSGROUP parameter is set, only classes that have the same group name would be considered at rendering time. An example of a layer with grouped classes might contain:
#
#    LAYER
#      ...
#      CLASSGROUP "group1"
#      ...
#      CLASS
#        NAME "name1"
#        GROUP "group1"
#        ...
#      END
#      CLASS
#        NAME "name2"
#        GROUP "group2"
#        ...
#      END
#      CLASS
#        NAME "name3"
#        GROUP "group1"
#        ...
#      END
#      ...
#    END # layer
#
#KEYIMAGE [filename]
#    Full filename of the legend image for the CLASS. This image is used when building a legend (or requesting a legend icon via MapScript or the CGI application).
#
#LABEL
#    Signals the start of a LABEL object. A class can contain multiple labels (since MapServer 6.2).
#
#LEADER
#
#    Signals the start of a LEADER object. Use this along with a LABEL object to create label leader lines.
#
#    New in version 6.2.
#MAXSCALEDENOM [double]
#
#    Minimum scale at which this CLASS is drawn. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000. Implemented in MapServer 5.0, to replace the deprecated MAXSCALE parameter.
#
#    See also
#
#    Map Scale
#
#MAXSIZE [integer]
#
#    Deprecated since version 6.0: Use CLASS STYLEs.
#
#MINSCALEDENOM [double]
#
#    Maximum scale at which this CLASS is drawn. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000. Implemented in MapServer 5.0, to replace the deprecated MINSCALE parameter.
#
#    See also
#
#    Map Scale
#
#MINSIZE [integer]
#
#    Deprecated since version 6.0: Use CLASS STYLEs.
#
#NAME [string]
#    Name to use in legends for this class. If not set class won't show up in legend.
#
#OUTLINECOLOR [r] [g] [b]
#
#    Deprecated since version 6.0: Use CLASS STYLEs.
#
#SIZE [integer]
#
#    Deprecated since version 6.0: Use CLASS STYLEs.
#
#STATUS [on|off]
#    Sets the current display status of the class. Default turns the class on.
#
#STYLE
#    Signals the start of a STYLE object. A class can contain multiple styles. Multiple styles can be used create complex symbols (by overlay/stacking). See Cartographical Symbol Construction with MapServer for more information on advanced symbol construction.
#
#SYMBOL [integer|string|filename]
#
#    Deprecated since version 6.0: Use CLASS STYLEs.
#
#TEMPLATE [filename]
#    Template file or URL to use in presenting query results to the user. See Templating for more info.
#
#TEXT [string|expression]
#
#    Text to label features in this class with. This overrides values obtained from the LAYER LABELITEM. The string can contain references to feature attributes. This allows you to concatenate multiple attributes into a single label. You can for example concatenate the attributes FIRSTNAME and LASTNAME like this:
#
#    TEXT '[FIRSTNAME] [LASTNAME]'
#
#    More advanced Expressions can be used to specify the labels. Since version 6.0, there are functions available for formatting numbers:
#
#    TEXT ("Area is: " + tostring([area],"%.2f"))
#
#VALIDATION
#
#    Signals the start of a VALIDATION block.
#
#    As of MapServer 5.4.0, VALIDATION blocks are the preferred mechanism for specifying validation patterns for CGI param runtime substitutions. See Run-time Substitution.
#
#################################################################################

class Class(models.Model):
    #d backgroundcolor     = ArrayField( models.IntegerField(), size=3) */
    #d color               = ArrayField( models.IntegerField(), size=3) */
    #  DEBUG [on|off] */
    expression          = models.TextField(                  )
    group               = models.TextField(                  )
    keyimage            = models.TextField(                  )
    label               = models.ForeignKey('label')
    leader              = models.ForeignKey('leader')
    maxscaledenom       = models.FloatField()
    #d maxsize             = models.IntegerField() */
    minscaledenom       = models.FloatField()
    #d minsize             = models.IntegerField()*/
    name                = models.TextField(                  )
    #d outlinecolor        = ArrayField( models.IntegerField(), size=3) */
    #d size                = models.IntegerField()*/
    status              = models.BooleanField(           default=True)
    style               = models.ManyToManyField(style)
    #d symbol              = models.TextField(                  )
    template            = models.TextField(                  )
    text                = models.TextField(                  )
    validation          = models.ManyToManyField(validation)

    class Meta:
        verbose_name = _( "Class" )
        verbose_name_plural = _( "Class" )


################################################################################
## cluster (child of layer)
#
#Since version 6.0, MapServer has the ability to combine multiple features from a point layer into single (aggregated) features based on their relative positions. Only POINT layers are supported. This feature was added through MS RFC 69: Support for clustering of features in point layers.
#Supported Layer Types
#
#POINT
#Mapfile Parameters
#
#MAXDISTANCE [double]
#    Specifies the distance of the search region (rectangle or ellipse) in pixel positions.
#
#REGION [string]
#    Defines the search region around a feature in which the neighbouring features are negotiated. Can be 'rectangle' or 'ellipse'.
#
#BUFFER [double]
#    Defines a buffer region around the map extent in pixels. Default is 0. Using a buffer allows that the neighbouring shapes around the map are also considered during the cluster creation.
#
#GROUP [string]
#    This expression evaluates to a string and only the features that have the same group value are negotiated. This parameter can be omitted. The evaluated group value is available in the 'Cluster_Group' feature attribute.
#
#FILTER [string]
#    We can define the FILTER expression filter some of the features from the final output. This expression evaluates to a boolean value and if this value is false the corresponding shape is filtered out. This expression is evaluated after the the feature negotiation is completed, therefore the 'Cluster_FeatureCount' parameter can also be used, which provides the option to filter the shapes having too many or to few neighbors within the search region.
#
#Supported Processing Options
#
#The following processing options can be used with the cluster layers:
#
#CLUSTER_GET_ALL_SHAPES
#    Return all shapes contained by a cluster instead of a single shape. This setting affects both the drawing and the query processing.
#
#
################################################################################

class cluster(models.Model):
    maxdistance         = models.FloatField()
    region              = models.TextField(                  )
    Buffer              = models.FloatField()
    group               = models.TextField(                  )
    Filter              = models.TextField(                  )

    class Meta:
        verbose_name = _( "cluster" )
        verbose_name_plural = _( "cluster" )


################################################################################
## feature (child of layer)
################################################################################

class feature(models.Model):
    points              = ArrayField(ArrayField( models.IntegerField(), size=2))
    items               = models.TextField(                  )
    text                = models.TextField(                  )
    wkt                 = models.TextField(                  )

    class Meta:
        verbose_name = _( "feature" )
        verbose_name_plural = _( "feature" )


################################################################################
## grid (child of layer)
#
#
#The GRID object can be used to add labeled graticule lines to your map. Initially developed in 2003 by John Novak, the GRID object is designed to be used inside a LAYER object to allow multiple GRID objects for a single map (allowing for example: a lat/long GRID, a State Plane GRID, and a UTM GRID to be displayed on the same map image).
#Mapfile Parameters:
#
#LABELFORMAT [DD|DDMM|DDMMSS|C format string]
#    Format of the label. "DD" for degrees, "DDMM" for degrees minutes, and "DDMMSS" for degrees, minutes, seconds. A C-style formatting string is also allowed, such as  to show decimal degrees with a degree symbol. The default is decimal display of whatever SRS you're rendering the GRID with.
#
#MINARCS [double]
#    The minimum number of arcs to draw. Increase this parameter to get more lines. Optional.
#
#MAXARCS [double]
#    The maximum number of arcs to draw. Decrease this parameter to get fewer lines. Optional.
#
#MININTERVAL [double]
#    The minimum number of intervals to try to use. The distance between the grid lines, in the units of the grid's coordinate system. Optional.
#
#MAXINTERVAL [double]
#    The maximum number of intervals to try to use. The distance between the grid lines, in the units of the grid's coordinate system. Optional.
#
#MINSUBDIVIDE [double]
#    The minimum number of segments to use when rendering an arc. If the lines should be very curved, use this to smooth the lines by adding more segments. Optional.
#
#MAXSUBDIVIDE [double]
#    The maximum number of segments to use when rendering an arc. If the graticule should be very straight, use this to minimize the number of points for faster rendering. Optional, default 256.
#
#
################################################################################

class grid(models.Model):
    labelformat         = models.TextField(                  )
    minarcs             = models.FloatField()
    maxarcs             = models.FloatField()
    mininterval         = models.FloatField()
    maxinterval         = models.FloatField()
    minsubdivide        = models.FloatField()
    maxsubdivide        = models.FloatField()


    class Meta:
        verbose_name = _( "grid" )
        verbose_name_plural = _( "grid" )



################################################################################
## join (child of layer)
#
#Joins are defined within a LAYER object. It is important to understand that JOINs are ONLY available once a query has been processed. You cannot use joins to affect the look of a map. The primary purpose is to enable lookup tables for coded data (e.g. 1 => Forest) but there are other possible uses.
#Supported Formats
#
#    DBF/XBase files
#    CSV (comma delimited text file)
#    PostgreSQL tables
#    MySQL tables
#
#Mapfile Parameters:
#
#CONNECTION [string]
#
#    Parameters required for the join table's database connection (not required for DBF or CSV joins). The following is an example connection for PostgreSQL:
#
#    CONNECTION "host=127.0.0.1 port=5432 user=pg password=pg dbname=somename"
#    CONNECTIONTYPE POSTGRESQL
#
#CONNECTIONTYPE [csv|mysql|postgresql]
#    Type of connection (not required for DBF joins). For PostgreSQL use postgresql, for CSV use csv, for MySQL use mysql.
#
#FOOTER [filename]
#    Template to use after a layer's set of results have been sent. In other words, this header HTML will be displayed after the contents of the TEMPLATE HTML.
#
#FROM [column]
#    Join column in the dataset. This is case sensitive.
#
#HEADER [filename]
#    Template to use before a layer's set of results have been sent. In other words, this header HTML will be displayed before the contents of the TEMPLATE HTML.
#
#NAME [string]
#    Unique name for this join. Required.
#
#TABLE [filename|tablename]
#    For file-based joins this is the name of XBase or comma delimited file (relative to the location of the mapfile) to join TO. For PostgreSQL support this is the name of the PostgreSQL table to join TO.
#
#TEMPLATE [filename]
#    Template to use with one-to-many joins. The template is processed once for each record and can only contain substitutions for columns in the joined table. Refer to the column in the joined table in your template like [joinname_columnname], where joinname is the NAME specified for the JOIN object.
#
#TO [column]
#    Join column in the table to be joined. This is case sensitive.
#
#TYPE [ONE-TO-ONE|ONE-TO-MANY]
#    The type of join. Default is one-to-one.
#
################################################################################



class join(models.Model):


    CONNECTIONTYPE_CSV = 'csv'
    CONNECTIONTYPE_MYSQL = 'mysql'
    CONNECTIONTYPE_POSTGRESQL = 'postgresql'

    CONNECTIONTYPE_CHOICES = (
        (CONNECTIONTYPE_CSV, CONNECTIONTYPE_CSV),
        (CONNECTIONTYPE_MYSQL, CONNECTIONTYPE_MYSQL),
        (CONNECTIONTYPE_POSTGRESQL, CONNECTIONTYPE_POSTGRESQL),
    )


    TYPE_ONE_TO_ONE = 'ONE-TO-ONE'
    TYPE_ONE_TO_MANY = 'ONE-TO-MANY'


    TYPE_CHOICES = (
        (TYPE_ONE_TO_ONE, TYPE_ONE_TO_ONE),
        (TYPE_ONE_TO_MANY, TYPE_ONE_TO_MANY),
    )

    connection          = models.TextField(                  )
    connectiontype      = models.TextField(                  choices = CONNECTIONTYPE_CHOICES)
    footer              = models.TextField(                  )
    From                = models.TextField(                  )
    header              = models.TextField(                  )
    name                = models.TextField(                  )
    table               = models.TextField(                  )
    template            = models.TextField(                  )
    to                  = models.TextField(                  )
    Type                = models.TextField(                  choices = TYPE_CHOICES,
                                                             default = TYPE_ONE_TO_ONE)

    class Meta:
        verbose_name = _( "join" )
        verbose_name_plural = _( "join" )


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
    #( "wms_keywordlist_[vocabulary's name]_items", "wms_keywordlist_[vocabulary's name]_items" ),
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
    #( "wms_keywordlist_[vocabulary's name]_items", "wms_keywordlist_[vocabulary's name]_items" ),
    ( "wms_layer_group",                    "wms_layer_group" ),
    ( "wms_metadataurl_format",             "wms_metadataurl_format" ),
    ( "wms_metadataurl_href",               "wms_metadataurl_href" ),
    ( "wms_metadataurl_type",               "wms_metadataurl_type" ),
    ( "wms_opaque",                         "wms_opaque" ),
    ( "wms_srs",                            "wms_srs" ),
    #( "wms_style",                         "wms_style" ),
    #( "#wms_style_[style's_name]_legendurl_format", "#wms_style_[style's_name]_legendurl_format" ),
    #( "#wms_style_[style's_name]_legendurl_height", "#wms_style_[style's_name]_legendurl_height" ),
    #( "#wms_style_[style's_name]_legendurl_href", "#wms_style_[style's_name]_legendurl_href" ),
    #( "#wms_style_[style's_name]_legendurl_width", "#wms_style_[style's_name]_legendurl_width" ),
    ( "wms_timedefault",                    "wms_timedefault" ),
    ( "wms_timeextent",                     "wms_timeextent" ),
    ( "wms_timeitem",                       "wms_timeitem" ),
    ( "wms_title",                          "wms_title" )
)


################################################################################
# projection (child of map and layer)
################################################################################

class projection(models.Model):
    epsg               = models.TextField (                  )

    class Meta:
        verbose_name = _( "projection" )
        verbose_name_plural = _( "projection" )



################################################################################
# transform (child of layer)
################################################################################


class transform(models.Model):
    POSITION_UL = 'ul'
    POSITION_UC = 'uc'
    POSITION_UR = 'ur'
    POSITION_CL = 'cl'
    POSITION_CC = 'cc'
    POSITION_CR = 'cr'
    POSITION_LL = 'll'
    POSITION_LC = 'lc'
    POSITION_LR = 'lr'

    POSITION_CHOICES = (
        (POSITION_UL, POSITION_UL),
        (POSITION_UC, POSITION_UC),
        (POSITION_UR, POSITION_UR),
        (POSITION_CL, POSITION_CL),
        (POSITION_CC, POSITION_CC),
        (POSITION_CR, POSITION_CR),
        (POSITION_LL, POSITION_LL),
        (POSITION_LC, POSITION_LC),
        (POSITION_LR, POSITION_LR),
    )

    transform           = models.BooleanField(               default = True)
    position            = models.TextField(                  choices = POSITION_CHOICES,
                                                             default = POSITION_LR)

    class Meta:
        verbose_name = _( "transform" )
        verbose_name_plural = _( "transform" )



################################################################################
# layer (child of map)
#
#CLASS
#
#    Signals the start of a CLASS object.
#
#    Inside a layer, only a single class will be used for the rendering of a feature. Each feature is tested against each class in the order in which they are defined in the mapfile. The first class that matches the its min/max scale constraints and its EXPRESSION check for the current feature will be used for rendering.
#
#CLASSGROUP [string]
#    Specify the class's group that would be considered at rendering time. The CLASS object's GROUP parameter must be used in combination with CLASSGROUP.
#
#CLASSITEM [attribute]
#    Item name in attribute table to use for class lookups.
#
#CLUSTER
#
#    Signals the start of a CLUSTER object.
#
#    The CLUSTER configuration option provides to combine multiple features from the layer into single (aggregated) features based on their relative positions. Supported only for POINT layers.
#
#    See also
#
#    MS RFC 69: Support for clustering of features in point layers
#
#CONNECTION [string]
#
#    Database connection string to retrieve remote data.
#
#    An SDE connection string consists of a hostname, instance name, database name, username and password separated by commas.
#
#    A PostGIS connection string is basically a regular PostgreSQL connection string, it takes the form of "user=nobody password=****** dbname=dbname host=localhost port=5432"
#
#    An Oracle connection string: user/pass[@db]
#
#    See also
#
#    Vector Data for specific connection information for various data sources.
#
#CONNECTIONTYPE [contour|local|ogr|oraclespatial|plugin|postgis|sde|union|uvraster|wfs|wms]
#
#    Type of connection. Default is local. See additional documentation for any other type.
#
#    See also
#
#    Vector Data for specific connection information for various data sources. See Union Layer for combining layers, added in MapServer 6.0
#
#    Note
#
#    mygis is another connectiontype, but it is deprecated; please see the MySQL section of the Vector Data document for connection details.
#
#DATA [filename]|[sde parameters][postgis table/column][oracle table/column]
#
#    Full filename of the spatial data to process. No file extension is necessary for shapefiles. Can be specified relative to the SHAPEPATH option from the Map Object.
#
#    If this is an SDE layer, the parameter should include the name of the layer as well as the geometry column, i.e. "mylayer,shape,myversion".
#
#    If this is a PostGIS layer, the parameter should be in the form of "<columnname> from <tablename>", where "columnname" is the name of the column containing the geometry objects and "tablename" is the name of the table from which the geometry data will be read.
#
#    For Oracle, use "shape FROM table" or "shape FROM (SELECT statement)" or even more complex Oracle compliant queries! Note that there are important performance impacts when using spatial subqueries however. Try using MapServer's FILTER whenever possible instead. You can also see the SQL submitted by forcing an error, for instance by submitting a DATA parameter you know won't work, using for example a bad column name.
#
#    See also
#
#    Vector Data for specific connection information for various data sources.
#
#DEBUG [off|on|0|1|2|3|4|5]
#
#    Enables debugging of a layer in the current map.
#
#    Debugging with MapServer versions >= 5.0:
#
#    Verbose output is generated and sent to the standard error output (STDERR) or the MapServer errorfile if one is set using the "MS_ERRORFILE" environment variable. You can set the environment variable by using the CONFIG parameter at the MAP level of the mapfile, such as:
#
#    CONFIG "MS_ERRORFILE" "/ms4w/tmp/ms_error.txt"
#
#    You can also set the environment variable in Apache by adding the following to your httpd.conf:
#
#    SetEnv MS_ERRORFILE "/ms4w/tmp/ms_error.txt"
#
#    Once the environment variable is set, the DEBUG mapfile parameter can be used to control the level of debugging output. Here is a description of the possible DEBUG values:
#
#        DEBUG O or OFF - only msSetError() calls are logged to MS_ERRORFILE. No msDebug() output at all. This is the default and corresponds to the original behavior of MS_ERRORFILE in MapServer 4.x
#        DEBUG 1 or ON - includes all output from DEBUG 0 plus msDebug() warnings about common pitfalls, failed assertions or non-fatal error situations (e.g. missing or invalid values for some parameters, missing shapefiles in tileindex, timeout error from remote WMS/WFS servers, etc.)
#        DEBUG 2 - includes all output from DEBUG 1 plus notices and timing information useful for tuning mapfiles and applications
#        DEBUG 3 - all of DEBUG 2 plus some debug output useful in troubleshooting problems such as WMS connection URLs being called, database connection calls, etc. This is the recommended level for debugging mapfiles.
#        DEBUG 4 - DEBUG 3 plus even more details...
#        DEBUG 5 - DEBUG 4 plus any msDebug() output that might be more useful to the developers than to the users.
#
#    You can also set the debug level by using the "MS_DEBUGLEVEL" environment variable.
#
#    The DEBUG setting can also be specified for the entire map, by setting the DEBUG parameter in the MAP object.
#
#    For more details on this debugging mechanism, please see MS RFC 28: Redesign of LOG/DEBUG output mechanisms.
#
#    Debugging with MapServer versions < 5:
#
#    Verbose output is generated and sent to the standard error output (STDERR) or the MapServer logfile if one is set using the LOG parameter in the WEB object. Apache users will see timing details for drawing in Apache's error_log file. Requires MapServer to be built with the DEBUG=MSDEBUG option (-with-debug configure option).
#
#DUMP [true|false]
#
#    Since 6.0, DUMP is not used anymore. LAYER METADATA is used instead.
#
#    Switch to allow MapServer to return data in GML format. Useful when used with WMS GetFeatureInfo operations. "false" by default.
#
#    Deprecated since version 6.0: LAYER METADATA is used instead.
#
#    See also
#
#    WMS Server
#
#EXTENT [minx] [miny] [maxx] [maxy]
#    The spatial extent of the data. In most cases you will not need to specify this, but it can be used to avoid the speed cost of having MapServer compute the extents of the data. An application can also possibly use this value to override the extents of the map.
#
#FEATURE
#    Signals the start of a FEATURE object.
#
#FILTER [string]
#
#    This parameter allows for data specific attribute filtering that is done at the same time spatial filtering is done, but before any CLASS expressions are evaluated. For OGR and shapefiles the string is simply a mapserver regular expression. For spatial databases the string is a SQL WHERE clause that is valid with respect to the underlying database.
#
#    For example: FILTER ([type]='road' and [size]<2)
#
#FILTERITEM [attribute]
#    Item to use with simple FILTER expressions. OGR and shapefiles only.
#
#FOOTER [filename]
#    Template to use after a layer's set of results have been sent. Multiresult query modes only.
#
#GEOMTRANSFORM [<expression>|<Javascript file>]
#
#    Used to indicate that the current feature will be transformed. Introduced in version 6.4.
#
#        <expression>: Applies the given expression to the geometry.
#
#        Supported expressions:
#            (buffer([shape],dist)): Buffer the geometry ([shape]) using dist pixels as buffer distance. For polygons, a negative dist will produce a setback.
#            (simplify([shape],tolerance)): simplifies a geometry ([shape]) using the standard Douglas-Peucker algorithm.
#            (simplifypt([shape], tolerance)): simplifies a geometry ([shape]), ensuring that the result is a valid geometry having the same dimension and number of components as the input. tolerance must be non-negative.
#            (generalize([shape],tolerance)): simplifies a geometry ([shape]) in way comparable to FME's ThinNoPoint algorithm. See http://trac.osgeo.org/gdal/ticket/966 for more information.
#
#            (smoothsia([shape], smoothing_size, smoothing_iteration, preprocessing)): will smooth a geometry ([shape]) using the SIA algorithm
#
#            See also
#
#            Geometry Transformations and Shape Smoothing
#
#        There is a difference between STYLE and LAYER GEOMTRANSFORM. LAYER-level will receive ground coordinates (meters, degress, etc) and STYLE-level will receive pixel coordinates. The argument to methods such as simplify() must be in the same units as the coordinates of the shapes at that point of the rendering workflow, i.e. pixels at the STYLE-level and in ground units at the LAYER-level.
#
#        LAYER NAME "my_layer"
#            TYPE LINE
#            STATUS DEFAULT
#            DATA "lines.shp"
#            GEOMTRANSFORM (simplify([shape], 10))  ## 10 ground units
#            CLASS
#                STYLE
#                    GEOMTRANSFORM (buffer([shape], 5)  ## 5 pixels
#                    WIDTH 2
#                    COLOR 255 0 0
#                END
#            END
#        END
#
#        The [map_cellsize] variable is available if you need to pass a pixel value at the LAYER-level.
#
#        LAYER NAME "my_layer"
#            TYPE LINE
#            STATUS DEFAULT
#            DATA "lines.shp"
#            UNITS meters
#            # 10 * [map_cellsize] == 10 pixels converted to ground units
#            GEOMTRANSFORM (simplify([shape], [map_cellsize]*10))
#        ...
#
#        To get this variable working in the math expression parser, the [map_cellsize] has to be converted into the layer ground unit. If you choose to use [map_cellsize] in your GEOMTRANSFORM expression, you must explicitly set the UNITS option in the layer.
#
#        <Javascript file>: A Javascript file that returns a new geometry. See GEOMTRANSFORM Javascript.
#
#        LAYER
#          ...
#          GEOMTRANSFORM "javascript://transform.js" # relative path
#        END
#
#        or
#
#        LAYER
#          ...
#          GEOMTRANSFORM "javascript:///home/user/transform.js" # absolute path
#        END
#
#        New in version 7.0.
#
#        Note
#
#        Requires V8 MapScript Support.
#
#        See also
#
#        Geometry Transformations
#
#GRID
#    Signals the start of a GRID object.
#
#GROUP [name]
#
#    Name of a group that this layer belongs to. The group name can then be reference as a regular layer name in the template files, allowing to do things like turning on and off a group of layers at once.
#
#    If a group name is present in the LAYERS parameter of a CGI request, all the layers of the group are returned (the STATUS of the LAYERs have no effect).
#
#HEADER [filename]
#    Template to use before a layer's set of results have been sent. Multiresult query modes only.
#
#JOIN
#    Signals the start of a JOIN object.
#LABELANGLEITEM [attribute]
#
#    (As of MapServer 5.0 this parameter is no longer available. Please see the LABEL object's ANGLE parameter) For MapServer versions < 5.0, this is the item name in attribute table to use for class annotation angles. Values should be in degrees.
#
#    Deprecated since version 5.0.
#
#LABELCACHE [on|off]
#    Specifies whether labels should be drawn as the features for this layer are drawn, or whether they should be cached and drawn after all layers have been drawn. Default is on. Label overlap removal, auto placement etc... are only available when the label cache is active.
#
#LABELITEM [attribute]
#    Item name in attribute table to use for class annotation (i.e. labeling).
#
#LABELMAXSCALEDENOM [double]
#
#    Minimum scale at which this LAYER is labeled. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000. Implemented in MapServer 5.0, to replace the deprecated LABELMAXSCALE parameter.
#
#    See also
#
#    Map Scale
#
#LABELMINSCALEDENOM [double]
#
#    Maximum scale at which this LAYER is labeled. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000. Implemented in MapServer 5.0, to replace the deprecated LABELMINSCALE parameter.
#
#    See also
#
#    Map Scale
#
#LABELREQUIRES [expression]
#
#    Sets context for labeling this layer, for example:
#
#    LABELREQUIRES "![orthoquads]"
#
#    means that this layer would NOT be labeled if a layer named "orthoquads" is on. The expression consists of a boolean expression based on the status of other layers, each [layer name] substring is replaced by a 0 or a 1 depending on that layer's STATUS and then evaluated as normal. Logical operators AND and OR can be used.
#LABELSIZEITEM [attribute]
#
#    (As of MapServer 5.0 this parameter is no longer available. Please see the LABEL object's SIZE parameter) For MapServer versions < 5.0, this is the item name in attribute table to use for class annotation sizes. Values should be in pixels.
#
#    Deprecated since version 5.0.
#
#MASK [layername]
#
#    The data from the current layer will only be rendered where it intersects features from the [layername] layer. [layername] must reference the NAME of another LAYER defined in the current mapfile. can be any kind of mapserver layer, i.e. vector or raster. If the current layer has labelling configured, then only labels who's label-point fall inside the unmasked area will be added to the labelcache (the actual glyphs for the label may be rendered ontop of the masked-out area.
#
#    Note
#
#    Unless you want the features of [layername] to actually appear on the generated map, [layername] should usually be set to STATUS OFF.
#
#    See also
#
#    MS RFC 79: Layer Masking
#
#MAXFEATURES [integer]
#    Specifies the number of features that should be drawn for this layer in the CURRENT window. Has some interesting uses with annotation and with sorted data (i.e. lakes by area).
#
#MAXGEOWIDTH [double]
#
#    Maximum width, in the map's geographic units, at which this LAYER is drawn. If MAXSCALEDENOM is also specified then MAXSCALEDENOM will be used instead.
#
#    The width of a map in geographic units can be found by calculating the following from the extents:
#
#    [maxx] - [minx]
#
#    New in version 5.4.0.
#
#MAXSCALEDENOM [double]
#
#    Minimum scale at which this LAYER is drawn. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.
#
#    New in version 5.0.0: Replaced MAXSCALE.
#
#    See also
#
#    Map Scale
#
#METADATA
#
#    This keyword allows for arbitrary data to be stored as name value pairs. This is used with OGC WMS to define things such as layer title. It can also allow more flexibility in creating templates, as anything you put in here will be accessible via template tags.
#
#    Example:
#
#    METADATA
#        "title" "My layer title"
#        "author" "Me!"
#    END
#
#MINGEOWIDTH [double]
#
#    Minimum width, in the map's geographic units, at which this LAYER is drawn. If MINSCALEDENOM is also specified then MINSCALEDENOM will be used instead.
#
#    The width of a map in geographic units can be found by calculating the following from the extents:
#
#    [maxx] - [minx]
#
#    New in version 5.4.0.
#
#MINSCALEDENOM [double]
#
#    Maximum scale at which this LAYER is drawn. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000. Implemented in MapServer 5.0, to replace the deprecated MINSCALE parameter.
#
#    See also
#
#    Map Scale
#
#NAME [string]
#    Short name for this layer. This name is the link between the mapfile and web interfaces that refer to this name. They must be identical. The name should be unique, unless one layer replaces another at different scales. Use the GROUP option to associate layers with each other. It is recommended that the name not contain spaces, special characters, or begin with a number (which could cause problems through interfaces such as OGC services).
#
#OFFSITE [r] [g] [b]
#    Sets the color index to treat as transparent for raster layers.
#
#OPACITY [integer|alpha]
#
#    Sets the opacity level (or the inability to see through the layer) of all classed pixels for a given layer. The value can either be an integer in the range (0-100) or the named symbol "ALPHA". A value of 100 is opaque and 0 is fully transparent. Implemented in MapServer 5.0, to replace the deprecated TRANSPARENCY parameter.
#
#    The "ALPHA" symbol directs the MapServer rendering code to honor the indexed or alpha transparency of pixmap symbols used to style a layer. This is only needed in the case of RGB output formats, and should be used only when necessary as it is expensive to render transparent pixmap symbols onto an RGB map image.
#
#PLUGIN [filename]
#
#    Additional library to load by MapServer, for this layer. This is commonly used to load specific support for SDE and Microsoft SQL Server layers, such as:
#
#        CONNECTIONTYPE PLUGIN
#        CONNECTION "hostname,port:xxx,database,username,password"
#        PLUGIN "C:/ms4w/Apache/specialplugins/msplugin_sde_92.dll"
#        DATA "layername,geometrycolumn,SDE.DEFAULT"
#
#POSTLABELCACHE [true|false]
#    Tells MapServer to render this layer after all labels in the cache have been drawn. Useful for adding neatlines and similar elements. Default is false.
#
#PROCESSING [string]
#
#    Passes a processing directive to be used with this layer. The supported processing directives vary by layer type, and the underlying driver that processes them.
#
#        Attributes Directive - The ITEMS processing option allows to specify the name of attributes for inline layers or specify the subset of the attributes to be used by the layer, such as:
#
#        PROCESSING "ITEMS=itemname1,itemname2,itemname3"
#
#        Connection Pooling Directive - This is where you can enable connection pooling for certain layer layer types. Connection pooling will allow MapServer to share the handle to an open database or layer connection throughout a single map draw process. Additionally, if you have FastCGI enabled, the connection handle will stay open indefinitely, or according to the options specified in the FastCGI configuration. Oracle Spatial, ArcSDE, OGR and PostGIS/PostgreSQL currently support this approach.
#
#        PROCESSING "CLOSE_CONNECTION=DEFER"
#
#        Label Directive - The LABEL_NO_CLIP processing option can be used to skip clipping of shapes when determining associated label anchor points. This avoids changes in label position as extents change between map draws. It also avoids duplicate labels where features appear in multiple adjacent tiles when creating tiled maps.
#
#        PROCESSING "LABEL_NO_CLIP=True"
#
#        Line Rendering Directive - The POLYLINE_NO_CLIP processing option can be used to skip clipping of shapes when rendering styled lines (dashed or styled with symbols). This avoids changes in the line styling as extents change between map draws. It also avoids edge effects where features appear in multiple adjacent tiles when creating tiled maps.
#
#        PROCESSING "POLYLINE_NO_CLIP=True"
#
#        OGR Styles Directive - This directive can be used for obtaining label styles through MapScript. For more information see the MapServer's OGR document.
#
#        PROCESSING "GETSHAPE_STYLE_ITEMS=all"
#
#        AGG renderer tweaking - This directive can be used for setting the linear gamma to be used when rendering polygon features. The default value of 0.75 (that can be overriden at the OUTPUTFORMAT level) can be set to a lower value to limit/remove the faint outlines that appear between adjacent polygons. A value of 0.5 is usually good enough.
#
#        PROCESSING "GAMMA=0.5"
#
#        Raster Directives - All raster processing options are described in Raster Data. Here we see the SCALE and BANDs directives used to autoscale raster data and alter the band mapping.
#
#        PROCESSING "SCALE=AUTO"
#        PROCESSING "BANDS=3,2,1"
#
#PROJECTION
#    Signals the start of a PROJECTION object.
#
#REQUIRES [expression]
#    Sets context for displaying this layer (see LABELREQUIRES).
#
#SIZEUNITS [feet|inches|kilometers|meters|miles|nauticalmiles|pixels]
#    Sets the unit of CLASS object SIZE values (default is pixels). Useful for simulating buffering. nauticalmiles was added in MapServer 5.6.
#
#STATUS [on|off|default]
#
#    Sets the current status of the layer. Often modified by MapServer itself. Default turns the layer on permanently.
#
#    Note
#
#    In CGI mode, layers with STATUS DEFAULT cannot be turned off using normal mechanisms. It is recommended to set layers to STATUS DEFAULT while debugging a problem, but set them back to ON/OFF in normal use.
#
#    Note
#
#    For WMS, layers in the server mapfile with STATUS DEFAULT are always sent to the client.
#
#    Note
#
#    The STATUS of the individual layers of a GROUP has no effect when the group name is present in the LAYERS parameter of a CGI request - all the layers of the group will be returned.
#
#STYLEITEM [<attribute>|auto|<javascript file>]
#
#    Styling based on attributes or generated with Javascript
#
#        <attribute>: Item to use for feature specific styling. The style information may be represented by a separate attribute (style string) attached to the feature. MapServer supports the following style string representations:
#
#            MapServer STYLE definition - The style string can be represented as a MapServer STYLE block according to the following example:
#
#            STYLE BACKGROUNDCOLOR 128 0 0 COLOR 0 0 208 END
#
#            MapServer CLASS definition - By specifying the entire CLASS instead of a single style allows to use further options (like setting expressions, label attributes, multiple styles) on a per feature basis.
#
#            OGR Style String - MapServer support rendering the OGR style string format according to the OGR - Feature Style Specification documentation. Currently only a few data sources support storing the styles along with the features (like MapInfo, AutoCAD DXF, Microstation DGN), however those styles can easily be transferred to many other data sources as a separate attribute by using the ogr2ogr command line tool as follows:
#
#            ogr2ogr -sql "select *, OGR_STYLE from srclayer" "dstlayer" "srclayer"
#
#        AUTO: The value: AUTO can be used for automatic styling.
#            Automatic styling can be provided by the driver. Currently, only the OGR driver supports automatic styling.
#            When used for a Union Layer, the styles from the source layers will be used.
#
#        <Javascript file>: A Javascript file that returns a new string containing either a STYLE definition or a CLASS definition with one or multiple styles. See STYLEITEM Javascript.
#
#        LAYER
#          ...
#          STYLEITEM "javascript://myscript.js" # relative path
#          CLASS
#          END
#        END
#
#        or
#
#        LAYER
#          ...
#          STYLEITEM "javascript:///home/user/myscript.js" # absolute path
#          CLASS
#          END
#        END
#
#        New in version 6.6.
#
#        Note
#
#        Requires V8 MapScript Support.
#
#SYMBOLSCALEDENOM [double]
#
#    The scale at which symbols and/or text appear full size. This allows for dynamic scaling of objects based on the scale of the map. If not set then this layer will always appear at the same size. Scaling only takes place within the limits of MINSIZE and MAXSIZE as described above. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000. Implemented in MapServer 5.0, to replace the deprecated SYMBOLSCALE parameter.
#
#    See also
#
#    Map Scale
#
#TEMPLATE [file|url]
#    Used as a global alternative to CLASS TEMPLATE. See Templating for more info.
#
#TILEINDEX [filename|layername]
#
#    Name of the tileindex file or layer. A tileindex is similar to an ArcInfo library index. The tileindex contains polygon features for each tile. The item that contains the location of the tiled data is given using the TILEITEM parameter. When a file is used as the tileindex for shapefile or raster layers, the tileindex should be a shapefile. For CONNECTIONTYPE OGR layers, any OGR supported datasource can be a tileindex. Normally the location should contain the path to the tile file relative to the shapepath, not relative to the tileindex itself. If the DATA parameter contains a value then it is added to the end of the location. When a tileindex layer is used, it works similarly to directly referring to a file, but any supported feature source can be used (ie. postgres, oracle).
#
#    Note
#
#    All files in the tileindex should have the same coordinate system, and for vector files the same set of attributes in the same order.
#
#    Note
#
#    Starting with MapServer 6.4, raster layers can use a tileindex with tiles of different projections. For that, the TILESRS parameter must be specified.
#
#TILEITEM [attribute]
#    Item that contains the location of an individual tile, default is "location".
#
#TILESRS [attribute]
#
#    Name of the attribute that contains the SRS of an individual tile. That SRS can be expressed in WKT format, as an EPSG:XXXX code or as a PROJ.4 string. If the tileindex contains rasters in different projections, this option must be specified. If the tileindex has been generated with gdaltindex (GDAL >= 2.0), the value of TILESRS is the value of the -src_srs_name option of gdaltindex. See Tileindexes with tiles in different projections
#
#    Note
#
#    This option is currently available only on raster layers.
#
#TOLERANCE [double]
#    Sensitivity for point based queries (i.e. via mouse and/or map coordinates). Given in TOLERANCEUNITS. If the layer is a POINT or a LINE, the default is 3. For all other layer types, the default is 0. To restrict polygon searches so that the point must occur in the polygon set the tolerance to zero. This setting does not apply to WFS GetFeature operations.
#
#TOLERANCEUNITS [pixels|feet|inches|kilometers|meters|miles|nauticalmiles|dd]
#    Units of the TOLERANCE value. Default is pixels. Nauticalmiles was added in MapServer 5.6.
#
#TRANSPARENCY [integer|alpha] - deprecated
#
#    Deprecated since version 5.0: Use OPACITY instead.
#
#TRANSFORM [true|false ul|uc|ur|lc|cc|lr|ll|lc|lr]
#
#    Tells MapServer whether or not a particular layer needs to be transformed from some coordinate system to image coordinates. Default is true. This allows you to create shapefiles in image/graphics coordinates and therefore have features that will always be displayed in the same location on every map. Ideal for placing logos or text in maps. Remember that the graphics coordinate system has an origin in the upper left hand corner of the image, contrary to most map coordinate systems.
#
#    Version 4.10 introduces the ability to define features with coordinates given in pixels (or percentages, see UNITS), most often inline features, relative to something other than the UL corner of an image. That is what 'TRANSFORM FALSE' means. By setting an alternative origin it allows you to anchor something like a copyright statement to another portion of the image in a way that is independent of image size.
#
#TYPE [chart|circle|line|point|polygon|raster|query]
#
#    Specifies how the data should be drawn. Need not be the same as the shapefile type. For example, a polygon shapefile may be drawn as a point layer, but a point shapefile may not be drawn as a polygon layer. Common sense rules.
#
#    In order to differentiate between POLYGONs and POLYLINEs (which do not exist as a type), simply respectively use or omit the COLOR keyword when classifying. If you use it, it's a polygon with a fill color, otherwise it's a polyline with only an OUTLINECOLOR.
#
#    A circle must be defined by a a minimum bounding rectangle. That is, two points that define the smallest square that can contain it. These two points are the two opposite corners of said box. The following is an example using inline points to draw a circle:
#
#    LAYER
#      NAME 'inline_circles'
#      TYPE CIRCLE
#      STATUS ON
#      FEATURE
#        POINTS
#          74.01 -53.8
#          110.7 -22.16
#        END
#      END
#      CLASS
#        STYLE
#          COLOR 0 0 255
#        END
#      END
#    END
#
#    TYPE query means the layer can be queried but not drawn.
#
#    Note
#
#    TYPE annotation has been deprecated since version 6.2. Identical functionality can be obtained by adding LABEL level STYLE blocks, and do not require loading the datasets twice in two different layers as was the case with layers of TYPE annotation.
#
#    See also
#
#    The Dynamic Charting HowTo for TYPE chart.
#
#UNITS [dd|feet|inches|kilometers|meters|miles|nauticalmiles|percentages|pixels]
#    Units of the layer. percentages (in this case a value between 0 and 1) was added in MapServer 4.10 and is mostly geared for inline features. nauticalmiles was added in MapServer 5.6.
#
#VALIDATION
#
#    Signals the start of a VALIDATION block.
#
#    As of MapServer 5.4.0, VALIDATION blocks are the preferred mechanism for specifying validation patterns for CGI param runtime substitutions. See Run-time Substitution.
#
################################################################################

class layer(models.Model):


    CONNECTIONTYPE_LOCAL = 'local'
    CONNECTIONTYPE_OGR = 'ogr'
    CONNECTIONTYPE_ORACLESPATIAL = 'oraclespatial'
    CONNECTIONTYPE_PLUGIN = 'plugin'
    CONNECTIONTYPE_POSTGIS = 'postgis'
    CONNECTIONTYPE_SDE = 'sde'
    CONNECTIONTYPE_UNION = 'union'
    CONNECTIONTYPE_UVRASTER = 'uvraster'
    CONNECTIONTYPE_WFS = 'wfs'
    CONNECTIONTYPE_WMS = 'wms'


    CONNECTIONTYPE_CHOICES = (
        (CONNECTIONTYPE_LOCAL, CONNECTIONTYPE_LOCAL),
        (CONNECTIONTYPE_OGR, CONNECTIONTYPE_OGR),
        (CONNECTIONTYPE_ORACLESPATIAL, CONNECTIONTYPE_ORACLESPATIAL),
        (CONNECTIONTYPE_PLUGIN, CONNECTIONTYPE_PLUGIN),
        (CONNECTIONTYPE_POSTGIS, CONNECTIONTYPE_POSTGIS),
        (CONNECTIONTYPE_SDE, CONNECTIONTYPE_SDE),
        (CONNECTIONTYPE_UNION, CONNECTIONTYPE_UNION),
        (CONNECTIONTYPE_UVRASTER, CONNECTIONTYPE_UVRASTER),
        (CONNECTIONTYPE_WFS, CONNECTIONTYPE_WFS),
        (CONNECTIONTYPE_WMS, CONNECTIONTYPE_WMS),
    )

    SIZEUNITS_FEET = 'feet'
    SIZEUNITS_INCHES = 'inches'
    SIZEUNITS_KILOMETERS = 'kilometers'
    SIZEUNITS_METERS = 'meters'
    SIZEUNITS_MILES = 'miles'
    SIZEUNITS_NAUTICALMILES = 'nauticalmiles'
    SIZEUNITS_PIXELS = 'pixels'

    SIZEUNITS_CHOICES = (
        (SIZEUNITS_FEET, SIZEUNITS_FEET),
        (SIZEUNITS_INCHES, SIZEUNITS_INCHES),
        (SIZEUNITS_KILOMETERS, SIZEUNITS_KILOMETERS),
        (SIZEUNITS_METERS, SIZEUNITS_METERS),
        (SIZEUNITS_MILES, SIZEUNITS_MILES),
        (SIZEUNITS_NAUTICALMILES, SIZEUNITS_NAUTICALMILES),
        (SIZEUNITS_PIXELS, SIZEUNITS_PIXELS),
    )

    STATUS_OFF = 'off'
    STATUS_ON = 'on'
    STATUS_DEFAULT = 'default'

    STATUS_CHOICES = (
        (STATUS_OFF, STATUS_OFF),
        (STATUS_ON, STATUS_ON),
        (STATUS_DEFAULT, STATUS_DEFAULT),
    )

    TYPE_CHART = 'chart'
    TYPE_CIRCLE = 'circle'
    TYPE_LINE = 'line'
    TYPE_POINT = 'point'
    TYPE_POLYGON = 'polygon'
    TYPE_RASTER = 'raster'
    TYPE_QUERY = 'query'

    TYPE_CHOICES = (
        (TYPE_CHART, TYPE_CHART),
        (TYPE_CIRCLE, TYPE_CIRCLE),
        (TYPE_LINE, TYPE_LINE),
        (TYPE_POINT, TYPE_POINT),
        (TYPE_POLYGON, TYPE_POLYGON),
        (TYPE_RASTER, TYPE_RASTER),
        (TYPE_QUERY, TYPE_QUERY),
    )


    UNITS_DD = 'dd'
    UNITS_FEET = 'feet'
    UNITS_INCHES = 'inches'
    UNITS_KILOMETERS = 'kilometers'
    UNITS_METERS = 'meters'
    UNITS_MILES = 'miles'
    UNITS_NAUTICALMILES = 'nauticalmiles'
    UNITS_PERCENTAGES = 'percentages'
    UNITS_PIXELS = 'pixels'

    UNITS_CHOICES = (
        (UNITS_DD, UNITS_DD),
        (UNITS_FEET, UNITS_FEET),
        (UNITS_INCHES, UNITS_INCHES),
        (UNITS_KILOMETERS, UNITS_KILOMETERS),
        (UNITS_METERS, UNITS_METERS),
        (UNITS_MILES, UNITS_MILES),
        (UNITS_NAUTICALMILES, UNITS_NAUTICALMILES),
        (UNITS_PERCENTAGES, UNITS_PERCENTAGES),
        (UNITS_PIXELS, UNITS_PIXELS),
    )

    Class               = models.ForeignKey('Class')
    classgroup          = models.TextField(                  )
    classitem           = models.TextField(                  )
    cluster             = models.ForeignKey('cluster')
    connection          = models.TextField(                  )
    connectiontype      = models.TextField(                  choices = CONNECTIONTYPE_CHOICES,
                                                             default = CONNECTIONTYPE_LOCAL)
    data                = models.TextField(                  )
    #  DEBUG [off|on|0|1|2|3|4|5] */
    #d dump                = models.NullBooleanField()
    extent              = ArrayField( models.FloatField(), size=4)
    feature             = models.ManyToManyField(feature)
    Filter              = models.TextField(                  )
    filteritem          = models.TextField(                  )
    footer              = models.TextField(                  )
    grid                = models.ForeignKey('grid')
    group               = models.TextField(                  )
    header              = models.TextField(                  )
    join                = models.ForeignKey('join')
    #d labelangleitem      = models.TextField(                  )
    labelcache          = models.BooleanField(               default = True)
    labelitem           = models.TextField(                  )
    labelmaxscaledenom  = models.FloatField()
    labelminscaledenom  = models.FloatField()
    labelrequires       = models.TextField(                  )
    #d labelsizeitem       = models.TextField(                  )
    mask                = models.TextField(                  )
    maxfeatures         = models.IntegerField()
    maxgeowidth         = models.FloatField()
    maxscaledenom       = models.FloatField()
    metadata            = ArrayField( ArrayField(models.TextField(), size=2) )
    mimgeowidth         = models.FloatField()
    minscaledenom       = models.FloatField()
    name                = models.TextField(                  )
    offsite             = ArrayField( models.IntegerField(), size=3)
    opacity             = models.TextField(                  )
    plugin              = models.TextField(                  )
    postlabelcache      = models.BooleanField(               default = False )
    processing          = ArrayField( ArrayField(models.TextField(), size=2) )
    projection          = models.ForeignKey('projection')
    requires            = models.TextField(                  )
    sizeunits           = models.TextField(                  choices = SIZEUNITS_CHOICES,
                                                             default = SIZEUNITS_PIXELS)
    status              = models.TextField(                  choices = STATUS_CHOICES,
                                                             default = STATUS_DEFAULT)
    styleitem           = models.TextField(                  )
    symbolscaledenom    = models.FloatField()
    template            = models.TextField(                  )
    tileindex           = models.TextField(                  )
    tileitem            = models.TextField(                  )
    tolerance           = models.FloatField()
    toleranceunits      = models.TextField(                  )
    #d transparency        = models.NullBooleanField()*/
    transform           = models.ForeignKey('transform')
    Type                = models.TextField(                  choices = TYPE_CHOICES,
                                                             default = TYPE_RASTER)
    units               = models.TextField(                  choices = UNITS_CHOICES,
                                                             default=UNITS_MILES)
    validation          = models.ManyToManyField(validation)

    class Meta:
        verbose_name = _( "layer" )
        verbose_name_plural = _( "layer" )



################################################################################
# legend (child of map)
#
#The size of the legend image is NOT known prior to creation so be careful not to hard-code width and height in the <IMG> tag in the template file.
#
#IMAGECOLOR [r] [g] [b]
#    Color to initialize the legend with (i.e. the background).
#INTERLACE [on|off]
#
#    Default is [on]. This keyword is now deprecated in favor of using the FORMATOPTION "INTERLACE=ON" line in the OUTPUTFORMAT declaration.
#
#    Deprecated since version 4.6.
#
#KEYSIZE [x][y]
#    Size of symbol key boxes in pixels. Default is 20 by 10.
#
#KEYSPACING [x][y]
#    Spacing between symbol key boxes ([y]) and labels ([x]) in pixels. Default is 5 by 5.
#
#LABEL
#    Signals the start of a LABEL object
#
#OUTLINECOLOR [r] [g] [b]
#    Color to use for outlining symbol key boxes.
#
#POSITION [ul|uc|ur|ll|lc|lr]
#    Where to place an embedded legend in the map. Default is lr.
#
#POSTLABELCACHE [true|false]
#    Tells MapServer to render this legend after all labels in the cache have been drawn. Useful for adding neatlines and similar elements. Default is false.
#
#STATUS [on|off|embed]
#    Is the legend image to be created.
#
#TEMPLATE [filename]
#
#    HTML legend template file.
#
#    See also
#
#    HTML Legends with MapServer
#
#TRANSPARENT [on|off]
#
#    Should the background color for the legend be transparent. This flag is now deprecated in favor of declaring transparency within OUTPUTFORMAT declarations. Default is off.
#
#    Deprecated since version 4.6.
#
################################################################################



class legend(models.Model):

    STATUS_OFF = 'off'
    STATUS_ON = 'on'
    STATUS_EMBED = 'embed'

    STATUS_CHOICES = (
        (STATUS_OFF, STATUS_OFF),
        (STATUS_ON, STATUS_ON),
        (STATUS_EMBED, STATUS_EMBED),
    )

    POSITION_UL = 'ul'
    POSITION_UC = 'uc'
    POSITION_UR = 'ur'
    POSITION_LL = 'll'
    POSITION_LC = 'lc'
    POSITION_LR = 'lr'

    POSITION_CHOICES = (
        (POSITION_UL, POSITION_UL),
        (POSITION_UC, POSITION_UC),
        (POSITION_UR, POSITION_UR),
        (POSITION_LL, POSITION_LL),
        (POSITION_LC, POSITION_LC),
        (POSITION_LR, POSITION_LR),
    )


    imagecolor          = ArrayField( models.IntegerField(), size=3)
    #d interlace           = models.NullBooleanField()
    keysize             = ArrayField( models.IntegerField(), size=2)
    keyspacing          = ArrayField( models.IntegerField(), size=2)
    label               = models.ManyToManyField(label)
    outlinecolor        = ArrayField( models.IntegerField(), size=3)
    position            = models.TextField(                  choices = POSITION_CHOICES,
                                                             default = POSITION_LR)
    postlabelcache      = models.BooleanField(               default = False)
    status              = models.TextField(                  choices = STATUS_CHOICES,
                                                             default = STATUS_OFF)
    template            = models.TextField(                  )
    #d transparent         = models.NullBooleanField()

    class Meta:
        verbose_name = _( "legend" )
        verbose_name_plural = _( "legend" )


################################################################################
# querymap (child of map)

#COLOR [r] [g] [b]
#    Color in which features are highlighted. Default is yellow.
#
#SIZE [x][y]
#    Size of the map in pixels. Defaults to the size defined in the map object.
#
#STATUS [on|off]
#    Is the query map to be drawn?
#
#STYLE [normal|hilite|selected]
#
#    Sets how selected features are to be handled. Layers not queried are drawn as usual.
#
#        Normal: Draws all features according to the settings for that layer.
#        Hilite: Draws selected features using COLOR. Non-selected features are drawn normally.
#        Selected: draws only the selected features normally.
#
#
################################################################################

class querymap(models.Model):


    STYLE_NORMAL = 'normal'
    STYLE_HILITE = 'hilite'
    STYLE_SELECTED = 'selected'

    STYLE_CHOICES = (
        (STYLE_NORMAL, STYLE_NORMAL),
        (STYLE_HILITE, STYLE_HILITE),
        (STYLE_SELECTED, STYLE_SELECTED),
    )

    color               = ArrayField( models.IntegerField(), size=3)
    size                = ArrayField( models.IntegerField(), size=2)
    status              = models.BooleanField(               default=False)
    style               = models.TextField(                  choices = STYLE_CHOICES,
                                                             default=STYLE_NORMAL)

    class Meta:
        verbose_name = _( "querymap" )
        verbose_name_plural = _( "querymap" )


################################################################################
# reference (child of map)
#
#Three types of reference maps are supported. The most common would be one showing the extent of a map in an interactive interface. It is also possible to request reference maps as part of a query. Point queries will generate an image with a marker (see below) placed at the query point. Region based queries will depict the extent of the area of interest. Finally, feature based queries will display the selection feature(s) used.
#
#COLOR [r] [g] [b]
#    Color in which the reference box is drawn. Set any component to -1 for no fill. Default is red.
#
#EXTENT [minx][miny][maxx][maxy]
#    The spatial extent of the base reference image.
#
#IMAGE [filename]
#    Full filename of the base reference image. Must be a GIF image.
#
#MARKER [integer|string]
#    Defines a symbol (from the symbol file) to use when the box becomes too small (see MINBOXSIZE and MAXBOXSIZE below). Uses a crosshair by default.
#
#MARKERSIZE [integer]
#    Defines the size of the symbol to use instead of a box (see MARKER above).
#
#MINBOXSIZE [integer]
#    If box is smaller than MINBOXSIZE (use box width or height) then use the symbol defined by MARKER and MARKERSIZE.
#
#MAXBOXSIZE [integer]
#    If box is greater than MAXBOXSIZE (use box width or height) then draw nothing (Often the whole map gets covered when zoomed way out and it's perfectly obvious where you are).
#
#OUTLINECOLOR [r] [g] [b]
#    Color to use for outlining the reference box. Set any component to -1 for no outline.
#
#SIZE [x][y]
#    Size, in pixels, of the base reference image.
#
#STATUS [on|off]
#    Is the reference map to be created? Default it off. 
#
################################################################################

class reference(models.Model):
    color               = ArrayField( models.IntegerField(), size=3)
    extent              = ArrayField( models.FloatField(), size=4)
    image               = models.TextField(                  )
    marker              = models.TextField(                  )
    markersize          = models.IntegerField()
    minboxsize          = models.IntegerField()
    maxboxsize          = models.IntegerField()
    outlinecolor        = ArrayField( models.IntegerField(), size=3)
    size                = ArrayField( models.IntegerField(), size=2)
    status              = models.NullBooleanField(           default=False)


    class Meta:
        verbose_name = _( "reference" )
        verbose_name_plural = _( "reference" )


################################################################################
# scalebar (child of map)
#
#
#Scalebars currently do not make use of TrueType fonts. The size of the scalebar image is NOT known prior to rendering, so be careful not to hard-code width and height in the <IMG> tag in the template file. Future versions will make the image size available.
#
#ALIGN [left|center|right]
#
#    Defines how the scalebar is aligned within the scalebar image. Default is center. Available in versions 5.2 and higher.
#
#    New in version 5.2.
#
#BACKGROUNDCOLOR [r] [g] [b]
#    Color to use for scalebar background, not the image background.
#
#COLOR [r] [g] [b]
#    Color to use for drawing all features if attribute tables are not used.
#
#IMAGECOLOR [r] [g] [b]
#    Color to initialize the scalebar with (i.e. background).
#INTERLACE [true|false]
#
#    Should output images be interlaced? Default is [on]. This keyword is now deprecated in favour of using the FORMATOPTION "INTERLACE=ON" line in the OUTPUTFORMAT declaration.
#
#    Deprecated since version 4.6.
#
#INTERVALS [integer]
#    Number of intervals to break the scalebar into. Default is 4.
#
#LABEL
#    Signals the start of a LABEL object.
#
#OUTLINECOLOR [r] [g] [b]
#    Color to use for outlining individual intervals. Set any component to -1 for no outline which is the default.
#
#POSITION [ul|uc|ur|ll|lc|lr]
#    Where to place an embedded scalebar in the image. Default is lr.
#
#POSTLABELCACHE [true|false]
#    For use with embedded scalebars only. Tells the MapServer to embed the scalebar after all labels in the cache have been drawn. Default is false.
#
#SIZE [x][y]
#    Size in pixels of the scalebar. Labeling is not taken into account.
#
#STATUS [on|off|embed]
#    Is the scalebar image to be created, and if so should it be embedded into the image? Default is off. (Please note that embedding scalebars require that you define a markerset. In essence the scalebar becomes a custom marker that is handled just like any other annotation.)
#
#STYLE [integer]
#    Chooses the scalebar style. Valid styles are 0 and 1.
#TRANSPARENT [on|off]
#
#    Should the background color for the scalebar be transparent. This flag is now deprecated in favor of declaring transparency within OUTPUTFORMAT declarations. Default is off.
#
#    Deprecated since version 4.6.
#
#UNITS [feet|inches|kilometers|meters|miles|nauticalmiles]
#    Output scalebar units, default is miles. Used in conjunction with the map's units to develop the actual graphic. Note that decimal degrees are not valid scalebar units. Nauticalmiles was added in MapServer 5.6. 
################################################################################




class scalebar(models.Model):

    ALIGN_LEFT = 'left'
    ALIGN_CENTER = 'center'
    ALIGN_RIGHT = 'right'


    ALIGN_CHOICES = (
        (ALIGN_LEFT, ALIGN_LEFT),
        (ALIGN_CENTER, ALIGN_CENTER),
        (ALIGN_RIGHT, ALIGN_RIGHT),
    )

    UNITS_FEET = 'feet'
    UNITS_INCHES = 'inches'
    UNITS_KILOMETERS = 'kilometers'
    UNITS_METERS = 'meters'
    UNITS_MILES = 'miles'
    UNITS_NAUTICALMILES = 'nauticalmiles'

    UNITS_CHOICES = (
        (UNITS_FEET, UNITS_FEET),
        (UNITS_INCHES, UNITS_INCHES),
        (UNITS_KILOMETERS, UNITS_KILOMETERS),
        (UNITS_METERS, UNITS_METERS),
        (UNITS_MILES, UNITS_MILES),
        (UNITS_NAUTICALMILES, UNITS_NAUTICALMILES),
    )

    STATUS_OFF = 'off'
    STATUS_ON = 'on'
    STATUS_EMBED = 'embed'

    STATUS_CHOICES = (
        (STATUS_OFF, STATUS_OFF),
        (STATUS_ON, STATUS_ON),
        (STATUS_EMBED, STATUS_EMBED),
    )

    POSITION_UL = 'ul'
    POSITION_UC = 'uc'
    POSITION_UR = 'ur'
    POSITION_LL = 'll'
    POSITION_LC = 'lc'
    POSITION_LR = 'lr'

    POSITION_CHOICES = (
        (POSITION_UL, POSITION_UL),
        (POSITION_UC, POSITION_UC),
        (POSITION_UR, POSITION_UR),
        (POSITION_LL, POSITION_LL),
        (POSITION_LC, POSITION_LC),
        (POSITION_LR, POSITION_LR),
    )

    align               = models.TextField(                  choices = ALIGN_CHOICES,
                                                             default = ALIGN_CENTER)
    backgroundcolor     = ArrayField( models.IntegerField(), size=3)
    color               = ArrayField( models.IntegerField(), size=3)
    imagecolor          = ArrayField( models.IntegerField(), size=3)
    #d interlace           = models.NullBooleanField()
    intervals           = models.IntegerField()
    label               = models.ManyToManyField(label)
    outlinecolor        = ArrayField( models.IntegerField(), size=3)
    position            = models.TextField(                  choices = POSITION_CHOICES,
                                                             default=POSITION_LR)
    postlabelcache      = models.BooleanField(               default=False)
    size                = ArrayField( models.IntegerField(), size=2)
    status              = models.TextField(                  choices = STATUS_CHOICES,
                                                             default=STATUS_OFF )
    style               = models.IntegerField()
    #d transparent         = models.NullBooleanField()
    units               = models.TextField(                  choices = UNITS_CHOICES,
                                                             default=UNITS_MILES)

    class Meta:
        verbose_name = _( "scalebar" )
        verbose_name_plural = _( "scalebar" )



################################################################################
# symbol (child of map)
#
#
#    Symbol definitions can be included within the main map file or, more commonly, in a separate file. Symbol definitions in a separate file are designated using the SYMBOLSET keyword, as part of the MAP object. This recommended setup is ideal for re-using symbol definitions across multiple MapServer applications.
#    There are 3 main types of symbols in MapServer: Markers, Lines and Shadesets.
#    Symbol 0 is always the degenerate case for a particular class of symbol. For points, symbol 0 is a single pixel, for shading (i.e. filled polygons) symbol 0 is a solid fill, and for lines, symbol 0 is a single pixel wide line.
#    Symbol definitions contain no color information, colors are set within STYLE objects.
#    Line styling was moved to CLASS STYLE in MapServer version 5. The mechanisms are no longer available in SYMBOL.
#    For MapServer versions < 5 there is a maximum of 64 symbols per file. This can be changed by editing mapsymbol.h and changing the value of MS_MAXSYMBOLS at the top of the file. As of MapServer 5.0 there is no symbol limit.
#    More information can be found in the Construction of Cartographic Symbols document.
#
#ANCHORPOINT [x] [y]
#
#    Used to specify the location (within the symbol) that is to be used as an anchorpoint when rotating the symbol and placing the symbol on a map. Default is 0.5 0.5 (corresponding to the center of the symbol).
#
#        x: A double in the range [0,1] that specifies the location within the symbol along the x axis. 0 specifies the left edge of the symbol, 1 specifies the right edge of the symbol. 0.5 specifies the center of the symbol (in the x direction).
#
#        y: A double in the range [0,1] that specifies the location within the symbol along the y axis. 0 specifies the top edge of the symbol, 1 specifies the lower edge of the symbol. 0.5 specifies the center of the symbol (in the y direction).
#
#    ANCHORPOINT can be used with SYMBOLs of TYPE ellipse, pixmap, svg, truetype and vector. To ensure proper behaviour for vector symbols, the left and top edges of the bounding box of the symbol should be at 0.
#
#    New in version 6.2.
#
#ANTIALIAS [true|false]
#    Should TrueType fonts be antialiased. Only useful for GD (gif) rendering. Default is false. Has no effect for the other renderers (where anti-aliasing can not be turned off).
#
#CHARACTER [char]
#    Character used to reference a particular TrueType font character. You'll need to figure out the mapping from the keyboard character to font character.
#
#FILLED [true|false]
#
#    If true, the symbol will be filled with a user defined color (using STYLE COLOR). Default is false.
#
#    If true, symbols of TYPE ellipse and vector will be treated as polygons (fill color specified using STYLE COLOR and outline specified using STYLE OUTLINECOLOR and WIDTH).
#
#    If false, symbols of TYPE ellipse and vector will be treated as lines (the lines can be given a color using STYLE COLOR and a width using STYLE WIDTH).
#
#FONT [string]
#    Name of TrueType font to use as defined in the FONTSET.
#
#IMAGE [string]
#    Image (GIF or PNG) to use as a marker or brush for type pixmap symbols.
#
#NAME [string]
#    Alias for the symbol. To be used in CLASS STYLE objects.
#
#POINTS [x y] [x y] ... END
#
#    Signifies the start of a sequence of points that make up a symbol of TYPE vector or that define the x and y radius of a symbol of TYPE ellipse. The end of this section is signified with the keyword END. The x and y values can be given using decimal numbers. The maximum x and y values define the bounding box of the symbol. The size (actually height) of a symbol is defined in the STYLE. You can create non-contiguous paths by inserting "-99 -99" at the appropriate places.
#
#    x values increase to the right, y values increase downwards.
#
#    For symbols of TYPE ellipse, a single point is specified that defines the x and y radius of the ellipse. Circles are created when x and y are equal.
#
#    Note
#
#    If a STYLE using this symbol doesn't contain an explicit size, then the default symbol size will be based on the range of "y" values in the point coordinates. e.g. if the y coordinates of the points in the symbol range from 0 to 5, then the default size for this symbol will be assumed to be 5.
#
#TRANSPARENT [color index]
#
#    Sets a transparent color for the input image for pixmap symbols, or determines whether all shade symbols should have a transparent background. For shade symbols it may be desirable to have background features "show through" a transparent hatching pattern, creating a more complex map. By default a symbol's background is the same as the parent image (i.e. color 0). This is user configurable.
#
#    Note
#
#    The default (AGG) renderer does not support the TRANSPARENT parameter. It is supported by the GD renderer (GIF).
#
#TYPE [ellipse|hatch|pixmap|svg|truetype|vector]
#
#        ellipse: radius values in the x and y directions define an ellipse.
#        hatch: produces hatched lines throughout the (polygon) shape.
#        pixmap: a user supplied image will be used as the symbol.
#        svg: scalable vector graphics (SVG) symbol. Requires the libsvg-cairo library.
#        truetype: TrueType font to use as defined in the MAP FONTSET.
#        vector: a vector drawing is used to define the shape of the symbol.
#
#    Note
#
#    TYPE cartoline is no longer used. Dashed lines are specified using PATTERN, LINECAP, LINEJOIN and LINEJOINMAXSIZE in STYLE. Examples in Construction of Cartographic Symbols.
#
################################################################################



class symbol(models.Model):

    TYPE_ELLIPSE = 'ellipse'
    TYPE_HATCH = 'hatch'
    TYPE_PIXMAP = 'pixmap'
    TYPE_SVG = 'svg'
    TYPE_TRUETYPE = 'truetype'
    TYPE_VECTOR = 'vector'


    TYPE_CHOICES = (
        (TYPE_ELLIPSE, TYPE_ELLIPSE),
        (TYPE_HATCH, TYPE_HATCH),
        (TYPE_PIXMAP, TYPE_PIXMAP),
        (TYPE_SVG, TYPE_SVG),
        (TYPE_TRUETYPE, TYPE_TRUETYPE),
        (TYPE_VECTOR, TYPE_VECTOR),
    )
    anchorpoint         = ArrayField( models.IntegerField(), size=2)
    antialias           = models.BooleanField(               default=False)
    character           = models.TextField(                  max_length=1)
    filled              = models.BooleanField(               default=False)
    font                = models.TextField(                  )
    image               = models.TextField(                  )
    name                = models.TextField(                  )
    points              = ArrayField(ArrayField( models.IntegerField(), size=2))
    transparent         = models.TextField(                  )
    Type                = models.TextField(                  choices = TYPE_CHOICES)

    class Meta:
        verbose_name = _( "symbol" )
        verbose_name_plural = _( "symbol" )


################################################################################
# web (child of map)
#
#
#BROWSEFORMAT [mime-type]
#
#    Format of the interface output, using MapServer CGI. (added to MapServer 4.8.0) The default value is "text/html". Example:
#
#    BROWSEFORMAT "image/svg+xml"
#
#EMPTY [url]
#    URL to forward users to if a query fails. If not defined the value for ERROR is used.
#
#ERROR [url]
#    URL to forward users to if an error occurs. Ugly old MapServer error messages will appear if this is not defined
#
#FOOTER [filename]
#    Template to use AFTER anything else is sent. Multiresult query modes only.
#
#HEADER [filename]
#    Template to use BEFORE everything else has been sent. Multiresult query modes only.
#
#IMAGEPATH [path]
#    Path to the temporary directory fro writing temporary files and images. Must be writable by the user the web server is running as. Must end with a / or depending on your platform.
#
#IMAGEURL [path]
#    Base URL for IMAGEPATH. This is the URL that will take the web browser to IMAGEPATH to get the images.
#
#LEGENDFORMAT [mime-type]
#
#    Format of the legend output, using MapServer CGI. (added to MapServer 4.8.0) The default value is "text/html". Example:
#
#    LEGENDFORMAT "image/svg+xml"
#
#LOG [filename]
#
#    Since MapServer 5.0 the recommeded parameters to use for debugging are the MAP object's CONFIG and DEBUG parameters instead (see the Debugging MapServer document).
#
#    File to log MapServer activity in. Must be writable by the user the web server is running as.
#
#    Deprecated since version 5.0.
#
#MAXSCALEDENOM [double]
#
#    Minimum scale at which this interface is valid. When a user requests a map at a smaller scale, MapServer automatically returns the map at this scale. This effectively prevents user from zooming too far out. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000. Implemented in MapServer 5.0, to replace the deprecated MAXSCALE parameter.
#
#    See also
#
#    Map scale
#MAXSCALE [double] - deprecated
#
#    Since MapServer 5.0 the proper parameter to use is MAXSCALEDENOM instead. The deprecated MAXSCALE is the minimum scale at which this interface is valid. When a user requests a map at a smaller scale, MapServer automatically returns the map at this scale. This effectively prevents user from zooming too far out. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.
#
#    Deprecated since version 5.0.
#
#MAXTEMPLATE [file|url]
#    Template to be used if below the minimum scale for the app (the denominator of the requested scale is larger than MAXSCALEDENOM), useful for nesting apps.
#
#METADATA
#
#    This keyword allows for arbitrary data to be stored as name value pairs.
#
#        Used with OGC services (WMS Server, WFS Server, WCS Server, SOS Server, ...) to define things such as layer title.
#
#        It can also allow more flexibility in creating templates, as anything you put in here will be accessible via template tags.
#
#        If you have XMP support enabled, you can also embed XMP Metadata Support in your output images by specifying XMP tag information here. Example:
#
#        METADATA
#            title "My layer title"
#            author "Me!"
#            xmp_dc_Title "My Map Title"
#        END
#
#        labelcache_map_edge_buffer
#
#        For tiling, the amount of gutter around an image where no labels are to be placed is controlled by the parameter labelcache_map_edge_buffer. The unit is pixels. The value had to be a negative value for 6.0 and earlier versions. From 6.2 the absolute value is taken, so the sign does not matter.
#
#        METADATA
#            "labelcache_map_edge_buffer" "10"
#        END
#
#        ms_enable_modes
#
#        Enable / disable modes (see MS RFC 90: Enable/Disable Layers in OGC Web Services by IP Lists).
#
#        Use the asterisk "*" to specify all modes and a preceding exclamation sign "!" to negate the given condition
#
#        To disable all CGI modes:
#
#        METADATA
#          "ms_enable_modes" "!*"
#        END
#
#        To disable everything but MAP and LEGEND:
#
#        METADATA
#          "ms_enable_modes" "!* MAP LEGEND"
#        END
#
#MINSCALEDENOM [double]
#
#    Maximum scale at which this interface is valid. When a user reqests a map at a larger scale, MapServer automatically returns the map at this scale. This effectively prevents the user from zooming in too far. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000. Implemented in MapServer 5.0, to replace the deprecated MINSCALE parameter.
#
#    See also
#
#    Map scale
#MINSCALE [double] - deprecated
#
#    Since MapServer 5.0 the proper parameter to use is MINSCALEDENOM instead. The deprecated MINSCALE is the maximum scale at which this interface is valid. When a user reqests a map at a larger scale, MapServer automatically returns the map at this scale. This effectively prevents the user from zooming in too far. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.
#
#    Deprecated since version 5.0.
#
#MINTEMPLATE
#    Template to be used if above the maximum scale for the app (the denominator of the requested scale is smaller than MINSCALEDENOM), useful for nesting apps.
#
#QUERYFORMAT [mime-type]
#
#    Format of the query output. (added to MapServer 4.8.0) This works for mode=query (using query templates in CGI mode), but not for mode=browse. The default value is "text/html". Example:
#
#    QUERYFORMAT "image/svg+xml"
#
#TEMPLATE [filename|url]
#
#    Template file or URL to use in presenting the results to the user in an interactive mode (i.e. map generates map and so on ... ).
#
#    URL is not a remote file, rather a template. For example:
#
#    TEMPLATE 'http://someurl/somescript.cgi?mapext=[mapext]'
#
#TEMPPATH
#
#    Path for storing temporary files. If not set, the standard system temporary file path will be used (e.g. tmp for unix). TEMPPATH can also be set using the environment variable MS_TEMPPATH.
#
#    TEMPPATH is used in many contexts (see rfc66).
#
#    Make sure that that MapServer has sufficient rights to read and write files at the specified location.
#
#    New in version 6.0.
#
#VALIDATION
#
#    Signals the start of a VALIDATION block.
#
#    As of MapServer 5.4.0, VALIDATION blocks are the preferred mechanism for specifying validation patterns for CGI param runtime substitutions. See Run-time Substitution.
#
################################################################################

class web(models.Model):
    browseformat        = models.TextField(                  )
    empty               = models.TextField(                  )
    error               = models.TextField(                  )
    footer              = models.TextField(                  )
    header              = models.TextField(                  )
    imagepath           = models.TextField(                  )
    imageurl            = models.TextField(                  )
    legendformat        = models.TextField(                  )
    #d log = models.TextField(                  )*/
    maxscaledenom       = models.FloatField()
    #d maxscale            = models.FloatField()*/
    maxtemplate         = models.TextField(                  )
    metadata            = ArrayField( ArrayField(models.TextField(), size=2) )
    minscaledenom       = models.FloatField()
    #d minscale            = models.FloatField()*/
    mintemplate         = models.TextField(                  )
    queryformat         = models.TextField(                  )
    template            = models.TextField(                  )
    temppath            = models.TextField(                  )
    validation          = models.ManyToManyField(validation)



    class Meta:
        verbose_name = _( "web" )
        verbose_name_plural = _( "web" )


################################################################################
# outputformat (child of map)
#
#
#DRIVER [name]
#    The name of the driver to use to generate this output format. Some driver names include the definition of the format if the driver supports multiple formats. For AGG, the possbile driver names are "AGG/PNG" and "AGG/JPEG". For GD the possible driver names are "GD/Gif" and "GD/PNG". For output through OGR the OGR driver name is appended, such as "OGR/Mapinfo File". For output through GDAL the GDAL shortname for the format is appended, such as "GDAL/GTiff". Note that PNG, JPEG and GIF output can be generated with either GDAL or GD (GD is generally more efficient). TEMPLATE should be used for template based output. (mandatory)
#
#EXTENSION [type]
#    Provide the extension to use when creating files of this type. (optional)
#
#FORMATOPTION [option]
#
#    Provides a driver or format specific option. Zero or more FORMATOPTION statement may be present within a OUTPUTFORMAT declaration. (optional)
#
#        AGG/*: "GAMMA=n" is used to specify the gamma correction to apply to polygon rendering. Allowed values are [0.0,1.0] , default is 0.75. This value is used to prevent artifacts from appearing on the border of contiguous polygons. Set to 1.0 to disable gamma correction.
#
#        AGG/JPEG: The "QUALITY=n" option may be used to set the quality of jpeg produced (value from 0-100).
#
#        AGG/PNG: "COMPRESSION=n" is used to determine the ZLIB compression applied to the png creation. n is expected to be an integer value from 0 to 9, with 0 meaning no compression (not recommended), 1 meaning fastest compression, and 9 meaning best compression. The compression levels come at a cost (be it in terms of cpu processing or file size, chose the setting that suits you most). The default is COMPRESSION=6.
#
#        AGG/PNG supports quantizing from 24/32 bits to 8bits, in order to reduce the final image size (and therefore save bandwidth) (see also http://trac.osgeo.org/mapserver/ticket/2436#comment:4 for strategies when applying these options):
#            "QUANTIZE_FORCE=on" used to reduce an RGB or RGBA image into an 8bit (or less) paletted images. The colors used in the palette are selected to best fit the actual colors in the RGB or RGBA image.
#            "QUANTIZE_COLORS=256" used to specify the number of colors to be used when applying quantization. Maximum value is 256. Specifying anything between 17 and 255 is probably a waste of quality as each pixel is still encoded with a full byte. Specifying a value under 16 will produce tiny images, but severly degraded.
#
#            "PALETTE=/path/to/palette.txt" is used to define the absolute path where palette colors can be found. This file must contain 256 entries of r,g,b triplets for RGB imagemodes, or r,g,b,a quadruplets for RGBA imagemodes. The expected format is one triplet (or quadruplet) per line, each value separated by commas, and each triplet/quadruplet on a single line. If you want to use transparency with a palette, it is important to have these two colors in the palette file: 0,0,0,0 and 255,255,255,255.
#
#            Note
#
#            0,0,0,0 is important if you have fully transparent areas. 255,255,255,255 is opaque white. The important colors to have in your palette really depend on your actual map, although 0,0,0,0 , 0,0,0,255 , and 255,255,255,255 are very likely to show up most of the time.
#            "PALETTE_FORCE=on" is used to reduce image depth with a predefined palette. This option is incompatible with the previous quantization options. To allow additional colours for anti-aliasing other than those in the predefined palette, use with "QUANTIZE_COLORS".
#
#        CAIRO/PDF:
#
#            "GEO_ENCODING=ISO32000" or "GEO_ENCODING=OGC_BP": Geospatial PDF will be generated. Requires GDAL 1.10 with PDF driver. See the GDAL Geospatial PDF documentation for requirements.
#
#            New in version 6.2.
#
#            "METADATA_ITEM:option=value": Additional PDF options can be provided using the METADATA_ITEM prefix. The following options are available: AUTHOR, CREATOR, CREATION_DATE, KEYWORDS, PRODUCER, SUBJECT, TITLE.
#
#            New in version 6.2.
#
#        Example:
#
#        OUTPUTFORMAT
#          NAME pdf
#          DRIVER "CAIRO/PDF"
#          MIMETYPE "application/x-pdf"
#          IMAGEMODE RGB
#          EXTENSION "pdf"
#          FORMATOPTION "GEO_ENCODING=ISO32000"
#          FORMATOPTION "METADATA_ITEM:CREATOR=MapServer, with GDAL trunk"
#          FORMATOPTION "METADATA_ITEM:PRODUCER=MapServer, with GDAL trunk"
#        END
#
#        GD/PNG: The "INTERLACE=[ON/OFF]" option may be used to turn interlacing on or off.
#        GD/GIF: The "INTERLACE=[ON/OFF]" option may be used to turn interlacing on or off.
#
#        GDAL/GTiff: Supports the "TILED=YES", "BLOCKXSIZE=n", "BLOCKYSIZE=n", "INTERLEAVE=[PIXEL/BAND]" and "COMPRESS=[NONE,PACKBITS,JPEG,LZW,DEFLATE]" format specific options.
#        GDAL/*: All FORMATOPTIONs are passed onto the GDAL create function. Options supported by GDAL are described in the detailed documentation for each GDAL format.
#
#        GDAL/*: "NULLVALUE=n" is used in raw image modes (IMAGEMODE BYTE/INT16/FLOAT) to pre-initialize the raster and an attempt is made to record this in the resulting file as the nodata value. This is automatically set in WCS mode if rangeset_nullvalue is set.
#        OGR/*: See the OGR Output document for details of OGR format options.
#
#IMAGEMODE [PC256/RGB/RGBA/INT16/FLOAT32/FEATURE]
#
#    Selects the imaging mode in which the output is generated. Does matter for non-raster formats like Flash. Not all formats support all combinations. For instance GD supports only PC256. (optional)
#
#        PC256: Produced a pseudocolored result with up to 256 colors in the palette (legacy MapServer mode). Only supported for GD/GIF and GD/PNG.
#
#        RGB: Render in 24bit Red/Green/Blue mode. Supports all colors but does not support transparency.
#
#        RGBA: Render in 32bit Red/Green/Blue/Alpha mode. Supports all colors, and alpha based transparency. All features are rendered against an initially transparent background.
#
#        BYTE: Render raw 8bit pixel values (no presentation). Only works for RASTER layers (through GDAL) and WMS layers currently.
#
#        INT16: Render raw 16bit signed pixel values (no presentation). Only works for RASTER layers (through GDAL) and WMS layers currently.
#
#        FLOAT32: Render raw 32bit floating point pixel values (no presentation). Only works for RASTER layers (through GDAL) and WMS layers currently.
#
#        FEATURE: Output is a non-image result, such as features written via templates or OGR.
#
#MIMETYPE [type]
#    Provide the mime type to be used when returning results over the web. (optional)
#
#NAME [name]
#    The name to use in the IMAGETYPE keyword of the map file to select this output format. This name is also used in metadata describing wxs formats allowed, and can be used (sometimes along with mimetype) to select the output format via keywords in OGC requests. (optional)
#
#TRANSPARENT [ON/OFF]
#    Indicates whether transparency should be enabled for this format. Note that transparency does not work for IMAGEMODE RGB output. Not all formats support transparency (optional). When transparency is enabled for the typical case of 8-bit pseudocolored map generation, the IMAGECOLOR color will be marked as transparent in the output file palette. Any other map components drawn in this color will also be transparent, so for map generation with transparency it is best to use an otherwise unused color as the background color. 
################################################################################


class outputformat(models.Model):


    IMAGEMODE_PC256 = 'PC256'
    IMAGEMODE_RGB = 'RGB'
    IMAGEMODE_RGBA = 'RGBA'
    IMAGEMODE_INT16 = 'INT16'
    IMAGEMODE_FLOAT32 = 'FLOAT32'
    IMAGEMODE_BYTE = 'BYTE'
    IMAGEMODE_FEATURE = 'FEATURE'
    IMAGEMODE_NULL = 'NULL'

    IMAGEMODE_CHOICES = (
        (IMAGEMODE_PC256, IMAGEMODE_PC256),
        (IMAGEMODE_RGB, IMAGEMODE_RGB),
        (IMAGEMODE_RGBA, IMAGEMODE_RGBA),
        (IMAGEMODE_INT16, IMAGEMODE_INT16),
        (IMAGEMODE_FLOAT32, IMAGEMODE_FLOAT32),
        (IMAGEMODE_BYTE, IMAGEMODE_BYTE),
        (IMAGEMODE_FEATURE, IMAGEMODE_FEATURE),
        (IMAGEMODE_NULL, IMAGEMODE_NULL),
    )
    name                = models.TextField(                  )
    driver              = models.TextField(                  )
    extension           = models.TextField(                  )
    imagemode           = models.TextField(                   choices=IMAGEMODE_CHOICES)
    formatoption        = ArrayField( models.TextField()     )
    mimetype            = models.TextField(                  )
    transparent         = models.NullBooleanField()
    #fixme
    #formatoption        = models.TextField(                  )
    

    class Meta:
        verbose_name = _( "outputformat" )
        verbose_name_plural = _( "outputformat" )


# todo a symbolset table in the database, upload form, and choices for the symbolset in the map model
#todo imagetype should have choices based on the outputformat table


################################################################################
# map (child of mapfile)
# map class
#
#
#ANGLE [double]
#
#    Angle, given in degrees, to rotate the map. Default is 0. The rendered map will rotate in a clockwise direction. The following are important notes:
#
#        Requires a PROJECTION object specified at the MAP level and for each LAYER object (even if all layers are in the same projection).
#        Requires MapScript (SWIG, PHP MapScript). Does not work with CGI mode.
#        If using the LABEL object's ANGLE or the LAYER object's LABELANGLEITEM parameters as well, these parameters are relative to the map's orientation (i.e. they are computed after the MAP object's ANGLE). For example, if you have specified an ANGLE for the map of 45, and then have a layer LABELANGLEITEM value of 45, the resulting label will not appear rotated (because the resulting map is rotated clockwise 45 degrees and the label is rotated counter-clockwise 45 degrees).
#        More information can be found on the MapRotation Wiki Page.
#
#CONFIG [key] [value]
#
#    This can be used to specify several values at run-time, for both MapServer and GDAL/OGR libraries. Developers: values will be passed on to CPLSetConfigOption(). Details on GDAL/OGR options are found in their associated driver documentation pages (GDAL/OGR). The following options are available specifically for MapServer:
#
#    CGI_CONTEXT_URL [value]
#        This CONFIG parameter can be used to enable loading a map context from a URL. See the Map Context HowTo for more info.
#
#    MS_ENCRYPTION_KEY [filename]
#        This CONFIG parameter can be used to specify an encryption key that is used with MapServer's msencypt utility.
#
#    MS_ERRORFILE [filename]
#        This CONFIG parameter can be used to write MapServer errors to a file (as of MapServer 5.0). With MapServer 5.x, a full path (absolute reference) is required, including the filename. Starting with MapServer 6.0, a filename with relative path can be passed via this CONFIG directive, in which case the filename is relative to the mapfile location. Note that setting MS_ERRORFILE via an environment variable always requires an absolute path since there would be no mapfile to make the path relative to. For more on this see the DEBUG parameter below.
#
#    MS_NONSQUARE [yes|no]
#
#        This CONFIG parameter can be used to allow non-square pixels (meaning that the pixels represent non-square regions). For "MS_NONSQUARE" "yes" to work, the MAP, and each LAYER will have to have a PROJECTION object.
#
#        Note
#
#        Has no effect for WMS.
#
#    ON_MISSING_DATA [FAIL|LOG|IGNORE]
#
#        This CONFIG parameter can be used to tell MapServer how to handle missing data in tile indexes (as of MapServer 5.3-dev, r8015). Previous MapServer versions required a compile-time switch ("IGNORE_MISSING_DATA"), but this is no longer required.
#
#        FAIL
#
#            This will cause MapServer to throw an error and exit (to crash, in other words) on a missing file in a tile index. This is the default.
#
#            CONFIG "ON_MISSING_DATA" "FAIL"
#
#        LOG
#
#            This will cause MapServer to log the error message for a missing file in a tile index, and continue with the map creation. Note: DEBUG parameter and CONFIG "MS_ERRORFILE" need to be set for logging to occur, so please see the DEBUG parameter below for more information.
#
#            CONFIG "ON_MISSING_DATA" "LOG"
#
#        IGNORE
#
#            This will cause MapServer to not report or log any errors for missing files, and map creation will occur normally.
#
#            CONFIG "ON_MISSING_DATA" "IGNORE"
#
#    PROJ_LIB [path]
#
#        This CONFIG parameter can be used to define the location of your EPSG files for the Proj.4 library. Setting the [key] to PROJ_LIB and the [value] to the location of your EPSG files will force PROJ.4 to use this value. Using CONFIG allows you to avoid setting environment variables to point to your PROJ_LIB directory. Here are some examples:
#
#            Unix
#
#            CONFIG "PROJ_LIB" "/usr/local/share/proj/"
#
#            Windows
#
#            CONFIG "PROJ_LIB" "C:/somedir/proj/nad/"
#
#DATAPATTERN [regular expression]
#    This defines a regular expression to be applied to requests to change DATA parameters via URL requests (i.e. map.layer[layername]=DATA+...). If a pattern doesn't exist then web users can't monkey with support files via URLs. This allows you to isolate one application from another if you desire, with the default operation being very conservative. See also TEMPLATEPATTERN.
#
#DEBUG [off|on|0|1|2|3|4|5]
#
#    Enables debugging of all of the layers in the current map.
#
#    Debugging with MapServer versions >= 5.0:
#
#    Verbose output is generated and sent to the standard error output (STDERR) or the MapServer errorfile if one is set using the "MS_ERRORFILE" environment variable. You can set the environment variable by using the CONFIG parameter at the MAP level of the mapfile, such as:
#
#    CONFIG "MS_ERRORFILE" "/ms4w/tmp/ms_error.txt"
#
#    You can also set the environment variable in Apache by adding the following to your httpd.conf:
#
#    SetEnv MS_ERRORFILE "/ms4w/tmp/ms_error.txt"
#
#    Once the environment variable is set, the DEBUG mapfile parameter can be used to control the level of debugging output. Here is a description of the possible DEBUG values:
#
#        DEBUG O or OFF - only msSetError() calls are logged to MS_ERRORFILE. No msDebug() output at all. This is the default and corresponds to the original behavior of MS_ERRORFILE in MapServer 4.x.
#        DEBUG 1 or ON - includes all output from DEBUG 0 plus msDebug() warnings about common pitfalls, failed assertions or non-fatal error situations (e.g. missing or invalid values for some parameters, missing shapefiles in tileindex, timeout error from remote WMS/WFS servers, etc.).
#        DEBUG 2 - includes all output from DEBUG 1 plus notices and timing information useful for tuning mapfiles and applications.
#        DEBUG 3 - all of DEBUG 2 plus some debug output useful in troubleshooting problems such as WMS connection URLs being called, database connection calls, etc. This is the recommended level for debugging mapfiles.
#        DEBUG 4 - DEBUG 3 plus even more details...
#        DEBUG 5 - DEBUG 4 plus any msDebug() output that might be more useful to the developers than to the users.
#
#    You can also set the debug level by using the "MS_DEBUGLEVEL" environment variable.
#
#    The DEBUG setting can also be specified for a layer, by setting the DEBUG parameter in the LAYER object.
#
#    For more details on this debugging mechanism, please see the Debugging MapServer document.
#
#    Debugging with MapServer versions < 5:
#
#    Verbose output is generated and sent to the standard error output (STDERR) or the MapServer logfile if one is set using the LOG parameter in the WEB object. Apache users will see timing details for drawing in Apache's error_log file. Requires MapServer to be built with the DEBUG=MSDEBUG option (-with-debug configure option).
#
#DEFRESOLUTION [int]
#
#    Sets the reference resolution (pixels per inch) used for symbology. Default is 72.
#
#    Used to automatically scale the symbology when RESOLUTION is changed, so the map maintains the same look at each resolution. The scale factor is RESOLUTION / DEFRESOLUTION.
#
#    New in version 5.6.
#
#EXTENT [minx] [miny] [maxx] [maxy]
#    The spatial extent of the map to be created. In most cases you will need to specify this, although MapServer can sometimes (expensively) calculate one if it is not specified.
#FONTSET [filename]
#    Filename of fontset file to use. Can be a path relative to the mapfile, or a full path.
#
#IMAGECOLOR [r] [g] [b]
#    Color to initialize the map with (i.e. background color). When transparency is enabled (TRANSPARENT ON in OUTPUTFORMAT) for the typical case of 8-bit pseudocolored map generation, this color will be marked as transparent in the output file palette. Any other map components drawn in this color will also be transparent, so for map generation with transparency it is best to use an otherwise unused color as the background color.
#IMAGEQUALITY [int]
#
#    Deprecated Use FORMATOPTION "QUALITY=n" in the OUTPUTFORMAT declaration to specify compression quality for JPEG output.
#
#    Deprecated since version 4.6.
#
#IMAGETYPE [jpeg|pdf|png|svg|...|userdefined]
#    Output format (raster or vector) to generate. The name used here must match the 'NAME' of a user defined or internally available OUTPUTFORMAT. For a complete list of available IMAGEFORMATs, see the OUTPUTFORMAT section.
#INTERLACE [on|off]
#
#    Deprecated Use FORMATOPTION "INTERLACE=ON" in the OUTPUTFORMAT declaration to specify if the output images should be interlaced.
#
#    Deprecated since version 4.6.
#
#LAYER
#    Signals the start of a LAYER object.
#
#LEGEND
#    Signals the start of a LEGEND object.
#
#MAXSIZE [integer]
#    Sets the maximum size of the map image. This will override the default value. For example, setting this to 2048 means that you can have up to 2048 pixels in both dimensions (i.e. max of 2048x2048). Default is 2048.
#
#NAME [name]
#    Prefix attached to map, scalebar and legend GIF filenames created using this mapfile. It should be kept short.
#
#PROJECTION
#    Signals the start of a PROJECTION object.
#
#QUERYMAP
#    Signals the start of a QUERYMAP object.
#
#REFERENCE
#    Signals the start of a REFERENCE MAP object.
#
#RESOLUTION [int] Sets the pixels per inch for output, only affects
#    scale computations. Default is 72.
#
#SCALEDENOM [double]
#
#    Computed scale of the map. Set most often by the application. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000. Implemented in MapServer 5.0, to replace the deprecated SCALE parameter.
#
#    See also
#
#    Map Scale
#
#SCALEBAR
#    Signals the start of a SCALEBAR object.
#
#SHAPEPATH [filename]
#    Path to the directory holding the shapefiles or tiles. There can be further subdirectories under SHAPEPATH.
#
#SIZE [x][y]
#    Size in pixels of the output image (i.e. the map).
#
#STATUS [on|off]
#    Is the map active? Sometimes you may wish to turn this off to use only the reference map or scale bar.
#
#SYMBOLSET [filename]
#
#    Filename of the symbolset to use. Can be a path relative to the mapfile, or a full path.
#
#    Note
#
#    The SYMBOLSET file must start with the word SYMBOLSET and end with the word END.
#SYMBOL
#    Signals the start of a SYMBOL object.
#
#TEMPLATEPATTERN [regular expression]
#    This defines a regular expression to be applied to requests to change the TEMPLATE parameters via URL requests (i.e. map.layer[layername].template=...). If a pattern doesn't exist then web users can't monkey with support files via URLs. This allows you to isolate one application from another if you desire, with the default operation being very conservative. See also DATAPATTERN.
#
#TRANSPARENT [on|off]
#
#    Deprecated since version 4.6.
#
#    Use TRANSPARENT ON in the OUTPUTFORMAT declaration to specify if the output images should be transparent.
#
#UNITS [dd|feet|inches|kilometers|meters|miles|nauticalmiles]
#    Units of the map coordinates. Used for scalebar and scale computations. Nauticalmiles was added in MapServer 5.6.
#
#WEB
#    Signals the start of a WEB object. 
################################################################################


class Map(models.Model):
    
    STATUS_OFF = 'OFF'
    STATUS_ON = 'ON'
    STATUS_DEFAULT = 'DEFAULT'

    STATUS_CHOICES = (
        (STATUS_OFF, STATUS_OFF),
        (STATUS_ON, STATUS_ON),
        (STATUS_DEFAULT, STATUS_DEFAULT),
    )

    DEBUG_OFF = 'OFF'
    DEBUG_ON = 'ON'
    
    DEBUG_CHOICES = (
        (DEBUG_OFF, DEBUG_OFF),
        (DEBUG_ON, DEBUG_ON),
    )

    UNITS_DD = 'dd'
    UNITS_FEET = 'feet'
    UNITS_INCHES = 'inches'
    #UNITS_KILOMETERS = 'kilometers'
    UNITS_METERS = 'meters'
    UNITS_MILES = 'miles'
    UNITS_NAUTICALMILES = 'nauticalmiles'
    UNITS_PIXELS = 'pixels'

    UNITS_CHOICES = (
        (UNITS_DD, UNITS_DD),
        (UNITS_FEET, UNITS_FEET),
        (UNITS_INCHES, UNITS_INCHES),
        #(UNITS_KILOMETERS, UNITS_KILOMETERS),
        (UNITS_METERS, UNITS_METERS),
        (UNITS_MILES, UNITS_MILES),
        (UNITS_NAUTICALMILES, UNITS_NAUTICALMILES),
        (UNITS_PIXELS, UNITS_PIXELS),
    )
    angle               = models.FloatField(                 help_text='Angle, given in degrees, to rotate the map in a clockwise direction.',
                                                             default = 0.0)
    config              = ArrayField( ArrayField(models.TextField(), size=2) )
    datapattern         = models.TextField(                  )
    debug               = models.IntegerField(               DEBUG_CHOICES,
                                                             default = DEBUG_OFF)
    defresolution       = models.IntegerField(               help_text='Sets the reference resolution (pixels per inch) used for symbology.',
                                                             default = 72)
    extent              = ArrayField( models.FloatField(), size=4)
    fontset             = models.TextField(                  )
    imagecolor          = ArrayField( models.IntegerField(), help_text='Color to initialize the map with (i.e. background color)',
                                                             size=3)
    #d imagequality        = models.IntegerField()*/
    imagetype           = models.TextField(                  )
    #d interlace           = models.NullBooleanField()
    layer               = models.ManyToManyField(layer)
    legend              = models.ForeignKey('legend')
    name                = models.TextField(                  max_length = 25)
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
    shapepath           = models.TextField(                  )
    size                = ArrayField( models.IntegerField(), help_text='Size in pixels of the output image (i.e. the map).',
                                                             size=2,
                                                             default=[256,256])
    status              = models.IntegerField(               STATUS_CHOICES,
                                                             default = STATUS_ON)
    symbolset           = models.TextField(                  )
    symbol              = models.ManyToManyField(symbol)
    templatepattern     = models.TextField(                  )
    #d transparent      = models.NullBooleanField()
    units               = models.IntegerField(               help_text='Units of the map coordinates. Used for scale computations',
                                                             choices = UNITS_CHOICES,
                                                             )
    web                 = models.ForeignKey('web')


    class Meta:
        verbose_name = _( "Map" )
        verbose_name_plural = _( "Map" )





################################################################################
# mapfile
################################################################################

#class mapfile(models.Model): (
#    Map                 = models.ForeignKey('Map')
#    ts                  = models.DateTimeField(auto_now=False, auto_now_add=False)



