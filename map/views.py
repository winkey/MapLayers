from map.models import Settings
from django.http import HttpResponse
from django.http import Http404
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.shortcuts import get_object_or_404, render_to_response
from django.contrib.auth import authenticate, login, logout

from django.core import serializers


def index( request ):
        
        return render_to_response( 'Base.html', { },
            context_instance = RequestContext( request ) )
        

def settingsjson( request ):

    data_list = Settings.objects.all()
    data = serializers.serialize( 'json', data_list )
    return HttpResponse( data, mimetype = 'application/json' )

def postlogin( request ):
        
        return render_to_response( 'registration/postlogin.html', { },
            context_instance = RequestContext( request ) )
def postlogout( request ):
        
        return render_to_response( 'registration/postlogout.html', { },
            context_instance = RequestContext( request ) )
