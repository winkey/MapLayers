import os

os.environ.setdefault( "DJANGO_SETTINGS_MODULE", "settings" )

# This application object is used by the development server
# as well as any WSGI server configured to use this file.


# django 1.3 broken with this
#from django.core.wsgi import get_wsgi_application
#application = get_wsgi_application()

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()


