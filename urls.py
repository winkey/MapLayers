################################################################################
#
# Project: NewWorld
# App:     
#
# urls
#
################################################################################
# Copyright (c) 2013-2015,  Brian Case
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

from django.conf.urls import patterns, include, url
from django.contrib.auth.views import  login, logout
import django

from django.contrib import admin

#import layers, maps


if django.VERSION < (1,7):
    admin.autodiscover()


urlpatterns = patterns('',
    url( r'^login/$',       'django.contrib.auth.views.login' ),
    url( r'^logout/$',      'django.contrib.auth.views.logout' ),
    url( r'^postlogin$',    'maps.views.postlogin'),
    url( r'^postlogout$',   'maps.views.postlogout'),

    url(r'^layers/',        include('layers.urls')),
    url(r'^map/',           include('maps.urls')),
    url(r'^tilecache/',     include('tilecache.urls')),
    url(r'^admin/',         include(admin.site.urls))
)




