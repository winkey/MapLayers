################################################################################
#
# Project: NewWorld
# App:     mapfile
#
# views for mapfile info storage
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
from django.forms.models import inlineformset_factory

# from django.core import serializers


from mapfile.models import style, styleForm
from mapfile.models import leader, leaderForm
from mapfile.models import label, labelForm
from mapfile.models import validation, validationForm
from mapfile.models import Class, ClassForm
from mapfile.models import cluster, clusterForm
from mapfile.models import feature, featureForm
from mapfile.models import grid, gridForm
from mapfile.models import join, joinForm
from mapfile.models import projection, projectionForm
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
#from mapfile.models import mapfile mapfileForm



def index( request ):
        
        return render_to_response( 'Base.html', { },
            context_instance = RequestContext( request ) )




def add( request ):
    form_args = {}

    #MapfileFormSet = inlineformset_factory( myextent, Map)

    #    pattern,
    #    extent,
    #    style,
    #    leader,
    #    label,
    #    validation,
    #    Class,
    #    cluster,
    #    points,
    #    feature,
    #    grid,
    #    join,
    #    metadata,
    #    projection,
    #    config,
    #    transform,
    #    layer,
    #    legend,
    #    querymap,
    #    reference,
    #    scalebar,
    #    symbol,
    #    web,
    #    outputformat,
    #    Map)

    if request.method == 'POST':
        
        if request.POST['nodetype'] == 'Map':
            form = MapForm( request.POST )
        else:
            return HttpResponse( form.errors )
        
        if form.is_valid():
            form.save( commit = True )
            return HttpResponse( "form saved" )
        else:
            return HttpResponse( form.errors )
            
    else:
        # map_form = MapForm( **form_args )

        return render_to_response( 'mapfile/edit.html',
            {
                'Mapfile': MapForm( **form_args ),
            },
            context_instance = RequestContext( request )
            
        )

