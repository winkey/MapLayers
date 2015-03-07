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

import datetime

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

    c.lid               = instance.layertreenode_ptr_id
    c.name              = instance.layertreenode_ptr_id
    c.url               = instance.url
    c.srs               = 'EPSG:900913'
    c.expired           = datetime.datetime.now()
    c.extension         = 'png'
    c.tms_type          = 'google'
    c.levels            = 24
    c.spherical_mercator= True
    c.resolutions       = [ 156543.03390000000000000000, 78271.51695000000000000000,
                             39135.75847500000000000000, 19567.87923750000000000000,
                              9783.93961875000000000000,  4891.96980937500000000000,
                              2445.98490468750000000000,  1222.99245234375000000000,
                               611.49622617187500000000,   305.74811308593750000000,
                               152.87405654296875000000,    76.43702827148437500000,
                                38.21851413574218750000,    19.10925706787109375000,
                                 9.55462853393554687500,     4.77731426696777343750,
                                 2.38865713348388671875,     1.19432856674194335937,
                                  .59716428337097167968,      .29858214168548583984,
                                  .14929107084274291992,      .07464553542137145996,
                                  .03732276771068572998,      .01866138385534286499,
                                  .00933069192767143249 ]
    
    c.bbox = [ -10346242.7549695,5224626.24288968,-9656475.01868158,5964781.03196305 ]
    
    ##### set these here to get around default value bug in django #####
    
    c.size = [ 256, 256 ]
    c.metasize = [ 5, 5 ]
    c.metabuffer = [ 10, 10 ]
    
    if instance.gutter is not None and instance.gutter > 0:
        c.metaTile      = True
        c.metaBuffer    = [ instance.gutter, instance.gutter ]
        
    if isinstance(instance, WMS):
        c.layers = [ instance.layers ]
        c.type = config.WMS
    elif isinstance(instance, ArcIMS):
        c.layers = [ instance.serviceName ]
        c.type = config.ArcIMS

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


