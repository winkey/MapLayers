# =============================================================================
# yourapp/widgets.py
# =============================================================================

from django import forms
from django.conf import settings
from django.utils.safestring import mark_safe

class popup_Select(forms.Select):

    def __init__(self, language=None, attrs=None):
        self.language = language or settings.LANGUAGE_CODE[:2]
        super(popup_relation, self).__init__(attrs=attrs)

    def render(self, name, value=None, attrs=None):
        rendered = super(popup_relation, self).render(name, value, attrs)
        return rendered + mark_safe(u'''
<div class="popup_relation">
<a
        href="/{{ module }}/%s/create"
        id="add_id_{{ field }}"
        onclick="return showAddAnotherPopup(this);">
            <img src="/static/admin/img/admin/icon_addlink.gif" width="10" height="10" alt="Add Another"/>
</a>
<a
        href="/{{ module }}/%s/view"
        class="popup_relation"
        id="add_id_{{ field }}"
        onclick="return showAddAnotherPopup(this);">
            <img src="/static/admin/img/admin/icon_addlink.gif" width="10" height="10" alt="Add Another"/>
</a>
<a
        href="/{{ module }}/%s/edit"
        class="popup_relation"
        id="add_id_{{ field }}"
        onclick="return showAddAnotherPopup(this);">
            <img src="/static/admin/img/admin/icon_addlink.gif" width="10" height="10" alt="Add Another"/>
</a>
<a
        href="/{{ module }}/%s/create"
        class="popup_relation"
        id="add_id_{{ field }}"
        onclick="return showAddAnotherPopup(this);">
            <img src="/static/admin/img/admin/icon_addlink.gif" width="10" height="10" alt="Add Another"/>
</a>
''' % name)


    <a
        href="/{{ module }}/{{ field }}/create"
        class="add-another"
        id="add_id_{{ field }}"
        onclick="return showAddAnotherPopup(this);">
            <img src="/static/admin/img/admin/icon_addlink.gif" width="10" height="10" alt="Add Another"/>
    </a>



