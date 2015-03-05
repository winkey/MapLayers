from django.contrib import admin

from . import models

from . import forms

admin.site.register( models.style )
admin.site.register( models.leader )
admin.site.register( models.label )
admin.site.register( models.validation )
admin.site.register( models.Class )
admin.site.register( models.cluster )
admin.site.register( models.feature )
admin.site.register( models.grid )
admin.site.register( models.join )
admin.site.register( models.projection )
admin.site.register( models.transform )
admin.site.register( models.layer )
admin.site.register( models.legend )
admin.site.register( models.querymap )
admin.site.register( models.reference )
admin.site.register( models.scalebar )
admin.site.register( models.symbol )
admin.site.register( models.web )
admin.site.register( models.outputformat )
admin.site.register( models.Map )

