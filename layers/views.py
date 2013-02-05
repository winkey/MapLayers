from layers.models import layertreenode, layersForm, foldersForm
from django.http import HttpResponse
from django.http import Http404
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.shortcuts import get_object_or_404, render_to_response
from django.contrib.auth import authenticate, login, logout

from django.core import serializers


def tree( request ):
    return render_to_response( "layers/tree.html",
                          {'nodes':layertreenode.objects.all()},
                          context_instance = RequestContext( request ) )

def treejson( request ):

    layer_list = layertreenode.objects.all()
    data = serializers.serialize( 'json', layer_list )
    return HttpResponse( data, mimetype = 'application/json' )

def get( request, layer_id ):
    try:
        layer = layertreenode.objects.get( pk = layer_id )
    except layers.DoesNotExist:
        raise Http404
    return HttpResponse( str( layer ) )



def add( request ):
    form_args = {}
    if request.method == 'POST':
        form = layersForm( request.POST )

        if form.is_valid():
            form.save( commit = True )
            return HttpResponse( "form saved" )
        else:
            return HttpResponse( form.errors )
            
    else:
        layers_form = layersForm( **form_args )

        return render_to_response( 'layers/edit.html',
            {
                'layers_form': layers_form
            },
            context_instance = RequestContext( request )
        )

def addfolder( request ):
    form_args = {}
    if request.method == 'POST':
        form = foldersForm( request.POST )

        if form.is_valid():
            form.save( commit = True )
            return HttpResponse( "form saved" )
        else:
            return HttpResponse( form.errors )
            
    else:
        layers_form = foldersForm( **form_args )

        return render_to_response( 'layers/edit.html',
            {
                'layers_form': layers_form
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



