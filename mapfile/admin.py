from django.contrib import admin
from mapfile.models import pattern, patternForm
from mapfile.models import extent, extentForm
from mapfile.models import style, styleForm
from mapfile.models import leader, leaderForm
from mapfile.models import label, labelForm
from mapfile.models import validation, validationForm
from mapfile.models import Class, ClassForm
from mapfile.models import cluster, clusterForm
from mapfile.models import points, pointsForm
from mapfile.models import feature, featureForm
from mapfile.models import grid, gridForm
from mapfile.models import join, joinForm
from mapfile.models import metadata, metadataForm
from mapfile.models import projection, projectionForm
from mapfile.models import config, configForm
from mapfile.models import transform, transformForm
from mapfile.models import layer, layerForm
from mapfile.models import legend, legendForm
from mapfile.models import querymap, querymapForm
from mapfile.models import reference, referenceForm
from mapfile.models import scalebar, scalebarForm
from mapfile.models import symbol, symbolForm
from mapfile.models import web, webForm
from mapfile.models import outputformat, outputformatForm
from mapfile.models import Map, MapForm


admin.site.register( pattern )
admin.site.register( extent )
admin.site.register( style )
admin.site.register( leader )
admin.site.register( label )
admin.site.register( validation )
admin.site.register( Class )
admin.site.register( cluster )
admin.site.register( points )
admin.site.register( feature )
admin.site.register( grid )
admin.site.register( join )
admin.site.register( metadata )
admin.site.register( projection )
admin.site.register( config )
admin.site.register( transform )
admin.site.register( layer )
admin.site.register( legend )
admin.site.register( querymap )
admin.site.register( reference )
admin.site.register( scalebar )
admin.site.register( symbol )
admin.site.register( web )
admin.site.register( outputformat )
admin.site.register( Map )

