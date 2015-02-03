from django.conf.urls import patterns, include, url
from django.contrib.auth.views import  login, logout
from django.contrib import admin

#from django.views.generic import ListView
#from django.views.generic import CreateView

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

#from mapfile.models import pattern, patternForm
#from mapfile.models import extent, extentForm
#from mapfile.models import style, styleForm
#from mapfile.models import leader, leaderForm
#from mapfile.models import label, labelForm
#from mapfile.models import validation, validationForm
#from mapfile.models import Class, ClassForm
#from mapfile.models import cluster, clusterForm
#from mapfile.models import points, pointsForm
#from mapfile.models import feature, featureForm
#from mapfile.models import grid, gridForm
#from mapfile.models import join, joinForm
#from mapfile.models import metadata, metadataForm
#from mapfile.models import projection, projectionForm
#from mapfile.models import config, configForm
#from mapfile.models import transform, transformForm
#from mapfile.models import layer, layerForm
#from mapfile.models import legend, legendForm
#from mapfile.models import querymap, querymapForm
#from mapfile.models import reference, referenceForm
#from mapfile.models import scalebar, scalebarForm
#from mapfile.models import symbol, symbolForm
#from mapfile.models import web, webForm
#from mapfile.models import outputformat, outputformatForm
#from mapfile.models import Map, MapForm


urlpatterns = patterns('',
    url( r'^map/$', 'map.views.index' ),
    url( r'^map/settings$', 'map.views.settingsjson' ) ,
    url( r'^layers/$', 'layers.views.index' ),
    url( r'^layers/(?P<layer_id>\d+)/$', 'layers.views.get' ),
    url( r'^layers/add$', 'layers.views.add' ),
    url( r'^layers/tree$', 'layers.views.tree' ),
    url( r'^layers/treejson$', 'layers.views.treejson' ),
    url( r'^layers/addfolder$', 'layers.views.addfolder' ),
    url( r'^login/$', 'django.contrib.auth.views.login' ),
    url( r'^postlogin$', 'map.views.postlogin' ),
    url( r'^logout/$', 'django.contrib.auth.views.logout' ),
    url( r'^postlogout$', 'map.views.postlogout' ),
    url( r'^isLoggedin', 'map.views.isLoggedin' ),


    #url(r'^mapfile/pattern/list$', ListView.as_view( model=pattern, )),
    #url(r'^mapfile/extent/list$', ListView.as_view( model=extent, )),
    #url(r'^mapfile/style/list$', ListView.as_view( model=style, )),
    #url(r'^mapfile/leader/list$', ListView.as_view( model=leader, )),
    #url(r'^mapfile/label/list$', ListView.as_view( model=label, )),
    #url(r'^mapfile/validation/list$', ListView.as_view( model=validation, )),
    #url(r'^mapfile/Class/list$', ListView.as_view( model=Class, )),
    #url(r'^mapfile/cluster/list$', ListView.as_view( model=cluster, )),
    #url(r'^mapfile/points/list$', ListView.as_view( model=points, )),
    #url(r'^mapfile/feature/list$', ListView.as_view( model=feature, )),
    #url(r'^mapfile/grid/list$', ListView.as_view( model=grid, )),
    #url(r'^mapfile/join/list$', ListView.as_view( model=join, )),
    #url(r'^mapfile/metadata/list$', ListView.as_view( model=metadata, )),
    #url(r'^mapfile/projection/list$', ListView.as_view( model=projection, )),
    #url(r'^mapfile/config/list$', ListView.as_view( model=config, )),
    #url(r'^mapfile/transform/list$', ListView.as_view( model=transform, )),
    #url(r'^mapfile/layer/list$', ListView.as_view( model=layer, )),
    #url(r'^mapfile/legend/list$', ListView.as_view( model=legend, )),
    #url(r'^mapfile/querymap/list$', ListView.as_view( model=querymap, )),
    #url(r'^mapfile/reference/list$', ListView.as_view( model=reference, )),
    #url(r'^mapfile/scalebar/list$', ListView.as_view( model=scalebar, )),
    #url(r'^mapfile/symbol/list$', ListView.as_view( model=symbol, )),
    #url(r'^mapfile/web/list$', ListView.as_view( model=web, )),
    #url(r'^mapfile/outputformat/list$', ListView.as_view( model=outputformat, )),
    #url(r'^mapfile/Map/list$', ListView.as_view( model=Map, )),

    #url(r'^mapfile/pattern/create$', CreateView.as_view( model=pattern, form_class = patternForm, )),
    #url(r'^mapfile/extent/create$', CreateView.as_view( model=extent, form_class = extentForm, )),
    #url(r'^mapfile/style/create$', CreateView.as_view( model=style, form_class = styleForm, )),
    #url(r'^mapfile/leader/create$', CreateView.as_view( model=leader, form_class = leaderForm, )),
    #url(r'^mapfile/label/create$', CreateView.as_view( model=label, form_class = labelForm, )),
    #url(r'^mapfile/validation/create$', CreateView.as_view( model=validation, form_class = validationForm, )),
    #url(r'^mapfile/Class/create$', CreateView.as_view( model=Class, form_class = ClassForm, )),
    #url(r'^mapfile/cluster/create$', CreateView.as_view( model=cluster, form_class = clusterForm, )),
    #url(r'^mapfile/points/create$', CreateView.as_view( model=points, form_class = pointsForm, )),
    #url(r'^mapfile/feature/create$', CreateView.as_view( model=feature, form_class = featureForm, )),
    #url(r'^mapfile/grid/create$', CreateView.as_view( model=grid, form_class = gridForm, )),
    #url(r'^mapfile/join/create$', CreateView.as_view( model=join, form_class = joinForm, )),
    #url(r'^mapfile/metadata/create$', CreateView.as_view( model=metadata, form_class = metadataForm, )),
    #url(r'^mapfile/projection/create$', CreateView.as_view( model=projection, form_class = projectionForm, )),
    #url(r'^mapfile/config/create$', CreateView.as_view( model=config, form_class = configForm, )),
    #url(r'^mapfile/transform/create$', CreateView.as_view( model=transform, form_class = transformForm, )),
    #url(r'^mapfile/layer/create$', CreateView.as_view( model=layer, form_class = layerForm, )),
    #url(r'^mapfile/legend/create$', CreateView.as_view( model=legend, form_class = legendForm, )),
    #url(r'^mapfile/querymap/create$', CreateView.as_view( model=querymap, form_class = querymapForm, )),
    #url(r'^mapfile/reference/create$', CreateView.as_view( model=reference, form_class = referenceForm, )),
    #url(r'^mapfile/scalebar/create$', CreateView.as_view( model=scalebar, form_class = scalebarForm, )),
    #url(r'^mapfile/symbol/create$', CreateView.as_view( model=symbol, form_class = symbolForm, )),
    #url(r'^mapfile/web/create$', CreateView.as_view( model=web, form_class = webForm, )),
    #url(r'^mapfile/outputformat/create$', CreateView.as_view( model=outputformat, form_class = outputformatForm, )),
    #url(r'^mapfile/Map/create$', CreateView.as_view( model=Map, form_class = MapForm, )),

    #url( r'^mapfile/$',                     'mapfile.views.index' ),
    #url( r'^mapfile/add$',                  'mapfile.views.add' ),

    
    # Examples:
    # url(r'^$', 'NewWorld.views.home', name='home'),
    # url(r'^NewWorld/', include('NewWorld.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    #url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    #url(r'^admin/', include(admin.site.urls)),


)
