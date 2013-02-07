from django.conf.urls.defaults import patterns, include, url
from django.contrib.auth.views import  login, logout
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url( r'^map/$', 'map.views.index' ),
    url( r'^map/settings$', 'map.views.settingsjson' ),
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
    
    # Examples:
    # url(r'^$', 'NewWorld.views.home', name='home'),
    # url(r'^NewWorld/', include('NewWorld.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
