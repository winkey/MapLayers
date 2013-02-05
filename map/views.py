from django.http import HttpResponse
from django.http import Http404
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.shortcuts import get_object_or_404, render_to_response
from django.contrib.auth import authenticate, login, logout



def index( request ):
        
        return render_to_response( 'Base.html', { },
            context_instance = RequestContext( request ) )
        
def js( request, pathname ):
        print 'js/' + pathname
        return render_to_response( 'js/' + pathname, { },
            context_instance = RequestContext( request ) )

