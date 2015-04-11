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

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

def layer2tc (layer):
    if layer.tile_cache:
        if isinstance(layer, models.WMS) or isinstance(layer, models.ArcIMS):

            tc = models.WMS( id                       = layer.id,
                             polymorphic_ctype_id     = layer.polymorphic_ctype_id,
                             lft                      = layer.lft,
                             rght                     = layer.rght,
                             tree_id                  = layer.tree_id,
                             level                    = layer.level,
                             parent_id                = layer.parent_id,
                             nodetype                 = 'WMS',
                             added                    = layer.added,
                             modified                 = layer.modified,
                             owner_id                 = layer.owner_id,
                             groups_id                = layer.groups_id,
                             timestamp                = layer.timestamp,
                             begin_timespan           = layer.begin_timespan,
                             end_timespan             = layer.end_timespan,
                             tile_cache               = layer.tile_cache,
                             tooltip                  = layer.tooltip,
                             metadata                 = layer.metadata,
                             name                     = layer.name,
                             url                      = '../tilecache/',
                             layers                   = layer.layertreenode_ptr_id,
                             opacity                  = layer.opacity,
                             attribution              = layer.attribution,
                             isBaseLayer              = layer.isBaseLayer)
            return tc
    return layer
    


def subtc (qs):

    newlayers = []
    for layer in qs:
        newlayers.append( layer2tc(layer) )

    return newlayers


#@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@api_view([ 'GET' ])

################################################################################
#
# @brief function to retrieve, update or delete a layer instance. 
#
# @param request
#
################################################################################

def query(request, myid = None):

    ##### get method #####

    if request.method == 'GET':

        if myid is None:
            myid = request.GET.get('id', None)
            myparent = request.GET.get('parent', None)

        if myid is not None:
            try:
                layers = models.layertreenode.objects.all().filter( id = myid)
            except models.layertreenode.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            newlayers = subtc( layers )
            serializer = layertreenodeSerializer(newlayers[0])

            return JSONResponse(serializer.data)

        elif myparent is not None:
            try:
                layers = models.layertreenode.objects.all().filter( parent = myparent)
            except models.layertreenode.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            newlayers = subtc( layers )
            serializer = layertreenodeSerializer(newlayers)

            return JSONResponse(serializer.data)
        
        else:
            serializer = layertreenodeSerializer([])

            return JSONResponse(serializer.data)
    ##### post method, adding a new layer #####

    #elif request.method == 'POST':
    #    serializer = layertreenodeSerializer(data=request.data)
    #    if serializer.is_valid():
    #        serializer.save()
    #        return Response(serializer.data, status=status.HTTP_201_CREATED)
    #    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    ##### put method, modifying a layer #####

    #elif request.method == 'PUT':
    #    serializer = layertreenodeSerializer(layer, data=request.data)
    #    if serializer.is_valid():
    #        serializer.save()
    #        return Response(serializer.data)
    #    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    ##### delete method, removing a layer #####

    #elif request.method == 'DELETE':
    #    layer.delete()
    #    return Response(status=status.HTTP_204_NO_CONTENT)


################################################################################
#
# @brief our old view function
#
################################################################################

def treejson( request, id ):

    layers = models.layertreenode.objects.all()
    newlayers = subtc( layers )

    serializer = layertreenodeSerializer( newlayers )

    return JSONResponse(serializer.data)

################################################################################
#old stuff below





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
        



#get_queryset_ancestors(queryset, include_self=False)
#Returns a queryset containing the ancestors of all nodes in the given queryset.
#If include_self=True, nodes in queryset will also be included in the result.

#Take a look at get_queryset_ancestors. If you already know the starting (topmost) node and the ending (leaf) node, then this may do what you need:

#qs = MyMPTTModel.objects.filter(id = leaf_node_id)
#MyMPTTModel.objects.get_queryset_ancestors(qs).filter(lft__gte = starting_node_lft)

#or, if you have something against lefthandedness...

#MyMPTTModel.objects.get_queryset_ancestors(qs).filter(rght__lte = starting_node_rght)
import gc

def treeinit( request ):

    myopen = request.GET.get('open')
    mylayers = request.GET.get('layers')


    if myopen and not mylayers:
        qs = models.layertreenode.objects.all().filter( parent_id__in = myopen.split(",") ).distinct('id')

    elif mylayers and not myopen:
        qs = models.layertreenode.objects.all().filter( id__in = mylayers.split(",") ).distinct('id')
    
    elif mylayers and myopen:
        qs = (models.layertreenode.objects.all().filter( parent_id__in = myopen.split(",") ) | 
              models.layertreenode.objects.all().filter( id__in = mylayers.split(",") ).distinct('id') )

    else:
        qs = models.layertreenode.objects.all().filter( id = 1 )

    print gc.get_referrers( models.layertreenode.objects)   
    print 'qs'
    print qs
    layers = models.layertreenode.objects.all().get_queryset_ancestors(qs, include_self=True).distinct('id')
    print 'layers'
    print layers
    newlayers = subtc( qs )

    serializer = layertreenodeSerializer( newlayers )

    return JSONResponse(serializer.data)


def treebranch( request ):

    myid = request.GET.get('id')

    layers = models.layertreenode.objects.all().filter( parent = myid )
    newlayers = subtc( layers )

    serializer = layertreenodeSerializer( newlayers )

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



