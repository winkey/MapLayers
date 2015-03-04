################################################################################
#
# Project: NewWorld
# App:     tilecache
#
# signals for tilecache config
#
################################################################################
# Copyright (c) 2013-2014,  Brian Case 
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

from django.db.models.signals import post_save
from django.db.models.signals import pre_delete

from tilecache.models import config

from layers.models import WMS, ArcIMS

##### signal handlers #####



def post_save_handler(sender, **kwargs):

    instance=kwargs['instance']
    created=kwargs['created']
    raw=kwargs['raw']
    #using=kwargs['using']
    update_fields=kwargs['update_fields']

    ##### if its new make a new row #####

    if created == True:
        c = config( )

    ##### update of exsiting layer #####

    else:
        c = config.objects.get(lid=instance.layertreenode_ptr_id)

    c.lid     = instance.layertreenode_ptr_id
    c.name    = instance.layertreenode_ptr_id
    c.url     = instance.url
    
    ##### set these here to get around default value bug in django #####

    c.bbox = [ -180, -90, 180, 90 ]
    c.size = [ 256, 256 ]
    c.metaSize = [ 5, 5 ]
    c.metaBuffer = [ 10, 10 ]

    if instance.gutter is not None and instance.gutter > 0:
        c.metaTile      = True
        c.metaBuffer    = [ instance.gutter, instance.gutter ]
        
    if isinstance(instance, WMS):
        c.layers = [ instance.layers ]
    elif isinstance(obj, ArcIMS):
        c.layers = [ instance.serviceName ]


    c.save()


def pre_delete_handler(sender, **kwargs):
    instance=kwargs['instance']
    #using=kwargs['using']
    
    c = config.objects.get(lid=instance.layertreenode_ptr_id)
    c.delete()



post_save.connect(post_save_handler, sender=WMS, weak=True, dispatch_uid="post_save_handler")
post_save.connect(post_save_handler, sender=ArcIMS, weak=True, dispatch_uid="post_save_handler")


pre_delete.connect(pre_delete_handler, sender=WMS, weak=True, dispatch_uid="post_delete_handler")
pre_delete.connect(pre_delete_handler, sender=ArcIMS, weak=True, dispatch_uid="post_delete_handler")


