################################################################################
#
# Project: NewWorld
# App:     Mapfile
#
# forms for mapfile storage
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

from django.template.loader import render_to_string
import django.forms as forms

from django.forms import ModelForm
from . import models

class SelectWithPop(forms.Select):
    def render(self, name, *args, **kwargs):
        html = super(SelectWithPop, self).render(name, *args, **kwargs)
        popupplus = render_to_string("form/popupplus.html", {'field': name, 'module': 'mapfile' })
        return html+popupplus

class MultipleSelectWithPop(forms.SelectMultiple):
    def render(self, name, *args, **kwargs):
        html = super(MultipleSelectWithPop, self).render(name, *args, **kwargs)
        popupplus = render_to_string("form/popupplus.html", {'field': name, 'module': 'mapfile'})
        return html+popupplus



class styleForm( ModelForm ):
    class Meta:
        model = models.style
        exclude = ()

class leaderForm( ModelForm ):
    
    style           = forms.models.ModelMultipleChoiceField(  models.style.objects, widget=MultipleSelectWithPop)
    class Meta:
        model = models.leader
        exclude = ()

class labelForm( ModelForm ):
    
    style           = forms.models.ModelMultipleChoiceField(  models.style.objects, widget=MultipleSelectWithPop)
    class Meta:
        model = models.label
        exclude = ()

class validationForm( ModelForm ):

    class Meta:
        model = models.validation
        exclude = ()

class ClassForm( ModelForm ):
    
    label           = forms.models.ModelChoiceField(  models.label.objects, widget=SelectWithPop)
    leader          = forms.models.ModelChoiceField(  models.leader.objects, widget=SelectWithPop)
    style           = forms.models.ModelMultipleChoiceField(  models.style.objects, widget=MultipleSelectWithPop)
    validation      = forms.models.ModelMultipleChoiceField(  models.validation.objects, widget=MultipleSelectWithPop)
    class Meta:
        model = models.Class
        exclude = ()

class clusterForm( ModelForm ):

    class Meta:
        model = models.cluster
        exclude = ()

class featureForm( ModelForm ):

    class Meta:
        model = models.feature
        exclude = ()

class gridForm( ModelForm ):

    class Meta:
        model = models.grid
        exclude = ()

class joinForm( ModelForm ):

    class Meta:
        model = models.join
        exclude = ()

class transformForm( ModelForm ):

    class Meta:
        model = models.transform
        exclude = ()

class projectionForm( ModelForm ):

    class Meta:
        model = models.projection
        exclude = ()

class layerForm( ModelForm ):

    Class           = forms.models.ModelChoiceField(  models.Class.objects, widget=SelectWithPop)
    cluster         = forms.models.ModelChoiceField(  models.cluster.objects, widget=SelectWithPop)
    feature         = forms.models.ModelMultipleChoiceField(  models.feature.objects, widget=MultipleSelectWithPop)
    grid            = forms.models.ModelChoiceField(  models.grid.objects, widget=SelectWithPop)
    join            = forms.models.ModelChoiceField(  models.join.objects, widget=SelectWithPop)
    projection      = forms.models.ModelChoiceField(  models.projection.objects, widget=SelectWithPop)
    transform       = forms.models.ModelChoiceField(  models.transform.objects, widget=SelectWithPop)
    class Meta:
        model = models.layer
        exclude = ()


class legendForm( ModelForm ):

    label           = forms.models.ModelMultipleChoiceField(  models.label.objects, widget=MultipleSelectWithPop)
    class Meta:
        model = models.legend
        exclude = ()

class querymapForm( ModelForm ):

    class Meta:
        model = models.querymap
        exclude = ()

class referenceForm( ModelForm ):

    class Meta:
        model = models.reference
        exclude = ()

class scalebarForm( ModelForm ):

    label           = forms.models.ModelMultipleChoiceField(  models.label.objects, widget=MultipleSelectWithPop)
    class Meta:
        model = models.scalebar
        exclude = ()

class symbolForm( ModelForm ):

    class Meta:
        model = models.symbol
        exclude = ()


class webForm( ModelForm ):


    validation      = forms.models.ModelMultipleChoiceField(  models.validation.objects, widget=MultipleSelectWithPop)
    class Meta:
        model = models.web
        exclude = ()

class outputformatForm( ModelForm ):

    class Meta:
        model = models.outputformat
        exclude = ()


class MapForm( ModelForm ):

    layer           = forms.models.ModelMultipleChoiceField(  models.layer.objects, widget=MultipleSelectWithPop)
    legend          = forms.models.ModelChoiceField(  models.legend.objects, widget=SelectWithPop)
    outputformat    = forms.models.ModelMultipleChoiceField(  models.outputformat.objects, widget=MultipleSelectWithPop)
    projection      = forms.models.ModelChoiceField(  models.projection.objects, widget=SelectWithPop)
    querymap        = forms.models.ModelChoiceField(  models.querymap.objects, widget=SelectWithPop)
    reference       = forms.models.ModelChoiceField(  models.reference.objects, widget=SelectWithPop)
    scalebar        = forms.models.ModelChoiceField(  models.scalebar.objects, widget=SelectWithPop)
    symbol          = forms.models.ModelMultipleChoiceField(  models.symbol.objects, widget=MultipleSelectWithPop)
    web             = forms.models.ModelChoiceField(  models.web.objects, widget=SelectWithPop)

    class Meta:
        model = models.Map
        exclude = ()
        



