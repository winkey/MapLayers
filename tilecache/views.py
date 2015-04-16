#
# Project: NewWorld
# App:     tilecache
#
# views for tilecache config
#
################################################################################
# Copyright (c) 2013,  Brian Case 
#
# Permission is hereby granted, free of charge, to any person obtaining a
# copy of this software and associated documentation files (the 'Software'),
# to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense,
# and/or sell copies of the Software, and to permit persons to whom the
# Software is furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included
# in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS
# OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.
################################################################################ 
import sys, traceback

from os.path import abspath, dirname, join


#wee need this to make tc work right, mayby if we use a globaly installred one
sys.path.insert(0, abspath( dirname( __file__ ) ))

from tilecache.TileCache.Service import Service, TileCacheException

from paste.request import parse_formvars
from django.http import Http404, HttpResponseServerError, HttpResponse
from django.shortcuts import render_to_response

#from twod.wsgi import call_wsgi_app

#fixme use our configfile


cfgfiles=[ join(abspath( dirname( __file__ ) ), "tilecache.cfg") ]

myservice = Service.load(cfgfiles)

def tilecache(request, *xtra):

    try:

        path_info = host = ""

        if "HTTP_X_FORWARDED_HOST" in request.META:
            host = "http://" + request.META["HTTP_X_FORWARDED_HOST"]

        elif "HTTP_HOST" in request.META:
            host = "http://" +request.META["HTTP_HOST"]

        host += request.META["SCRIPT_NAME"]
        req_method = request.META["REQUEST_METHOD"]
        path_info = request.META["PATH_INFO"]

        fields = parse_formvars(request.META)
        
        ##### test configs for changes #####
        
        myservice.checkchange()

        format, image = myservice.dispatchRequest( fields, path_info, req_method, host )
        headers = [( 'Content-Type', format.encode('utf-8') )]

    except TileCacheException, E:
        return HttpResponseServerError(["An error occurred: %s\n%s\n" % (
                                  str(E), 
                                  "".join(traceback.format_tb(sys.exc_traceback)))])

    except Exception, E:
        return HttpResponseServerError(["An error occurred: %s\n%s\n" % (
                                  str(E), 
                                  "".join(traceback.format_tb(sys.exc_traceback)))])

    return HttpResponse(image, content_type=format)



# #       if service.cache.sendfile and format.startswith("image/"):
#            return []
#        else:
#            return HttpResponse(image, mimetype=format)





