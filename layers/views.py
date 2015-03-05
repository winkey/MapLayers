################################################################################
#
# Project: NewWorld
# App:     Layers
#
# viewsfor layer info storage
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

from django.http import HttpResponse
from django.http import Http404
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.shortcuts import get_object_or_404, render_to_response
from django.contrib.auth import authenticate, login, logout

# from django.core import serializers

from layers.serializers import layertreenodeSerializer

from . import models
from . import forms



def tree( request ):
    return render_to_response( "layers/tree.html",
                          {'nodes':models.layertreenode.objects.all()},
                          context_instance = RequestContext( request ) )



from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser


class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders it's content into JSON.
    """
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)
        
def treejson( request ):
    
    objects = models.layertreenode.objects.all()
    base_objects = models.layertreenode.base_objects.all()
    
    #print objects
    #print base_objects
    #print layertreenode
    serializer = layertreenodeSerializer( objects )

    return JSONResponse(serializer.data)


def get( request, layer_id ):
    try:
        layer = models.layertreenode.objects.get( pk = layer_id )
    except layer.DoesNotExist:
        raise Http404
    return HttpResponse( str( layer ) )



def add( request ):
    form_args = {}
    if request.method == 'POST':
        
        if False: # request.POST['nodetype'] == 'ArcGISCache':
            pass # form = forms.ArcGISCacheForm( request.POST )
        elif request.POST['nodetype'] == 'ArcGIS93Rest':
            form = forms.ArcGIS93RestForm( request.POST )
        elif request.POST['nodetype'] == 'ArcIMS':
            form = forms.ArcIMSForm( request.POST )
        elif request.POST['nodetype'] == 'Bing':
            form = forms.BingForm( request.POST )
        elif request.POST['nodetype'] == 'GeoRSS':
            form = forms.GeoRSSForm( request.POST )
        elif request.POST['nodetype'] == 'Google':
            form = forms.GoogleForm( request.POST )
        elif request.POST['nodetype'] == 'Googlev3':
            form = forms.Googlev3Form( request.POST )
        elif request.POST['nodetype'] == 'KaMap':
            form = forms.KaMapForm( request.POST )
        elif request.POST['nodetype'] == 'KaMapCache':
            form = forms.KaMapCacheForm( request.POST )
        # elif request.POST['nodetype'] == 'MapGuide':
        #    form = forms.MapGuideForm( request.POST )
        elif request.POST['nodetype'] == 'MapServer':
            form = forms.MapServerForm( request.POST )
        elif request.POST['nodetype'] == 'OSM':
            form = forms.OSMForm( request.POST )
        elif request.POST['nodetype'] == 'TileCache':
            form = forms.TileCacheForm( request.POST )
        elif request.POST['nodetype'] == 'TMS':
            form = forms.TMSForm( request.POST )
        elif request.POST['nodetype'] == 'WMS':
            form = forms.WMSForm( request.POST )
        elif request.POST['nodetype'] == 'WMTS':
            form = forms.WMTSForm( request.POST )
        elif request.POST['nodetype'] == 'WorldWind':
            form = forms.WorldWindForm( request.POST )
        elif request.POST['nodetype'] == 'XYZ':
            form = forms.XYZForm( request.POST )
        else:
            return HttpResponse( form.errors )
        
        if form.is_valid():
            form.save( commit = True )
            return HttpResponse( "form saved" )
        else:
            return HttpResponse( form.errors )
            
    else:
        # layers_form = layersForm( **form_args )

        return render_to_response( 'layers/add.html',
            {
                'layers_form': forms.layersForm( **form_args ),
                # 'ArcGISCache': forms.ArcGISCacheForm( **form_args ),
                'ArcGIS93Rest': forms.ArcGIS93RestForm( **form_args ),
                'ArcIMS': forms.ArcIMSForm( **form_args ),
                'Bing': forms.BingForm( **form_args ),
                'GeoRSS': forms.GeoRSSForm( **form_args ),
                'Google': forms.GoogleForm( **form_args ),
                'Googlev3': forms.Googlev3Form( **form_args ),
                'KaMap': forms.KaMapForm( **form_args ),
                'KaMapCache': forms.KaMapCacheForm( **form_args ),
                # 'MapGuide': forms.MapGuideForm( **form_args ),
                'MapServer': forms.MapServerForm( **form_args ),
                'OSM': forms.OSMForm( **form_args ),
                'TileCache': forms.TileCacheForm( **form_args ),
                'TMS': forms.TMSForm( **form_args ),
                'WMS': forms.WMSForm( **form_args ),
                'WMTS': forms.WMTSForm( **form_args ),
                'WorldWind': forms.WorldWindForm( **form_args ),
                'XYZ': forms.XYZForm( **form_args ),

            },
            context_instance = RequestContext( request )
            
        )

def addfolder( request ):
    form_args = {}
    if request.method == 'POST':
        if request.POST['nodetype'] == 'Folder':
            form = forms.FolderForm( request.POST )
        elif request.POST['nodetype'] == 'Radio':
            form = forms.RadioForm( request.POST )
        elif request.POST['nodetype'] == 'Animation':
            form = forms.AnimationForm( request.POST )

        if form.is_valid():
            form.save( commit = True )
            return HttpResponse( "form saved" )
        else:
            return HttpResponse( form.errors )
            
    else:

        return render_to_response( 'layers/addfolder.html',
            {
                'layers_form': forms.foldersForm( **form_args ),
                'Folder': forms.FolderForm( **form_args ),
                'Radio': forms.RadioForm( **form_args ),
                'Animation': forms.AnimationForm( **form_args ),
            },
            context_instance = RequestContext( request )
        )

# from django.shortcuts import render

# def my_view(request):
#    if not request.user.is_authenticated():
#        return render(request, 'myapp/login_error.html')
# if request.user.is_authenticated():
#    # Do something for authenticated users.
# else:
#    # Do something for anonymous users.



