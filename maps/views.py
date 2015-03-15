################################################################################
#
# Project: NewWorld
# App:     maps
#
# views
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

from maps.models import Settings
from django.http import HttpResponse
from django.http import Http404
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.shortcuts import get_object_or_404, render_to_response
# from django.contrib.auth import authenticate, login, logout
# from django.contrib.auth.views import logout
from django.core import serializers
import simplejson as json

def index( request ):
        
        return render_to_response( 'Base.html', { },
            context_instance = RequestContext( request ) )
   

def settingsjson( request ):

    data_list = Settings.objects.all()
    data = serializers.serialize( 'json', data_list )
    return HttpResponse( data, content_type = 'application/json' )

def postlogin( request ):
        
        return render_to_response( 'registration/postlogin.html', { },
            context_instance = RequestContext( request ) )
def postlogout( request ):
        
        return render_to_response( 'registration/postlogout.html', { },
            context_instance = RequestContext( request ) )

def isLoggedin( request ):
    
    result = {'isLoggedin': False}

    if request.user.is_authenticated():
        result['isLoggedin'] = True
        
    return HttpResponse( json.dumps( result ), content_type = 'application/json' )

def kmlrepeater( request ):
    kml = request.POST.get('kml')

    return HttpResponse( kml, content_type = 'application/vnd.google-earth.kml', Content_Disposition = "attachment; filename=map.kml", Content_Title = 'map')



