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

from layers.models import layertreenode, layersForm, foldersForm, layertreenodeSerializer
from layers.models import Folder, FolderForm
from layers.models import Radio, RadioForm
from layers.models import Animation, AnimationForm
# from layers.models import ArcGISCache, ArcGISCacheForm
from layers.models import ArcGIS93Rest, ArcGIS93RestForm
from layers.models import ArcIMS, ArcIMSForm
from layers.models import Bing, BingForm
from layers.models import GeoRSS, GeoRSSForm
from layers.models import Google, GoogleForm
from layers.models import Googlev3, Googlev3Form
from layers.models import KaMap, KaMapForm
from layers.models import KaMapCache, KaMapCacheForm
# from layers.models import MapGuide, MapGuideForm
from layers.models import MapServer, MapServerForm
from layers.models import OSM, OSMForm
from layers.models import TileCache, TileCacheForm
from layers.models import TMS, TMSForm
from layers.models import WMS, WMSForm
from layers.models import WMTS, WMTSForm
from layers.models import WorldWind, WorldWindForm
from layers.models import XYZ, XYZForm

def tree( request ):
    return render_to_response( "layers/tree.html",
                          {'nodes':layertreenode.objects.all()},
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
    
    objects = layertreenode.objects.all()
    base_objects = layertreenode.base_objects.all()
    
    print objects
    #print base_objects
    #print layertreenode
    serializer = layertreenodeSerializer( objects )

    return JSONResponse(serializer.data)


def get( request, layer_id ):
    try:
        layer = layertreenode.objects.get( pk = layer_id )
    except layer.DoesNotExist:
        raise Http404
    return HttpResponse( str( layer ) )



def add( request ):
    form_args = {}
    if request.method == 'POST':
        
        if False: # request.POST['nodetype'] == 'ArcGISCache':
            pass # form = ArcGISCacheForm( request.POST )
        elif request.POST['nodetype'] == 'ArcGIS93Rest':
            form = ArcGIS93RestForm( request.POST )
        elif request.POST['nodetype'] == 'ArcIMS':
            form = ArcIMSForm( request.POST )
        elif request.POST['nodetype'] == 'Bing':
            form = BingForm( request.POST )
        elif request.POST['nodetype'] == 'GeoRSS':
            form = GeoRSSForm( request.POST )
        elif request.POST['nodetype'] == 'Google':
            form = GoogleForm( request.POST )
        elif request.POST['nodetype'] == 'Googlev3':
            form = Googlev3Form( request.POST )
        elif request.POST['nodetype'] == 'KaMap':
            form = KaMapForm( request.POST )
        elif request.POST['nodetype'] == 'KaMapCache':
            form = KaMapCacheForm( request.POST )
        # elif request.POST['nodetype'] == 'MapGuide':
        #    form = MapGuideForm( request.POST )
        elif request.POST['nodetype'] == 'MapServer':
            form = MapServerForm( request.POST )
        elif request.POST['nodetype'] == 'OSM':
            form = OSMForm( request.POST )
        elif request.POST['nodetype'] == 'TileCache':
            form = TileCacheForm( request.POST )
        elif request.POST['nodetype'] == 'TMS':
            form = TMSForm( request.POST )
        elif request.POST['nodetype'] == 'WMS':
            form = WMSForm( request.POST )
        elif request.POST['nodetype'] == 'WMTS':
            form = WMTSForm( request.POST )
        elif request.POST['nodetype'] == 'WorldWind':
            form = WorldWindForm( request.POST )
        elif request.POST['nodetype'] == 'XYZ':
            form = XYZForm( request.POST )
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
                'layers_form': layersForm( **form_args ),
                # 'ArcGISCache': ArcGISCacheForm( **form_args ),
                'ArcGIS93Rest': ArcGIS93RestForm( **form_args ),
                'ArcIMS': ArcIMSForm( **form_args ),
                'Bing': BingForm( **form_args ),
                'GeoRSS': GeoRSSForm( **form_args ),
                'Google': GoogleForm( **form_args ),
                'Googlev3': Googlev3Form( **form_args ),
                'KaMap': KaMapForm( **form_args ),
                'KaMapCache': KaMapCacheForm( **form_args ),
                # 'MapGuide': MapGuideForm( **form_args ),
                'MapServer': MapServerForm( **form_args ),
                'OSM': OSMForm( **form_args ),
                'TileCache': TileCacheForm( **form_args ),
                'TMS': TMSForm( **form_args ),
                'WMS': WMSForm( **form_args ),
                'WMTS': WMTSForm( **form_args ),
                'WorldWind': WorldWindForm( **form_args ),
                'XYZ': XYZForm( **form_args ),

            },
            context_instance = RequestContext( request )
            
        )

def addfolder( request ):
    form_args = {}
    if request.method == 'POST':
        if request.POST['nodetype'] == 'Folder':
            form = FolderForm( request.POST )
        elif request.POST['nodetype'] == 'Radio':
            form = RadioForm( request.POST )
        elif request.POST['nodetype'] == 'Animation':
            form = AnimationForm( request.POST )

        if form.is_valid():
            form.save( commit = True )
            return HttpResponse( "form saved" )
        else:
            return HttpResponse( form.errors )
            
    else:

        return render_to_response( 'layers/addfolder.html',
            {
                'layers_form': foldersForm( **form_args ),
                'Folder': FolderForm( **form_args ),
                'Radio': RadioForm( **form_args ),
                'Animation': AnimationForm( **form_args ),
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



