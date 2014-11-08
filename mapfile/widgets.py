# =============================================================================
# yourapp/widgets.py
# =============================================================================

from django import forms
from django.conf import settings
from django.utils.safestring import mark_safe

class FKAdd(forms.select):

    def __init__(self, language=None, attrs=None):
        self.language = language or settings.LANGUAGE_CODE[:2]
        super(FKAdd, self).__init__(attrs=attrs)

    def render(self, name, value, attrs=None):
        rendered = super(FKAdd, self).render(name, value, attrs)
        return rendered + mark_safe(u'''
<script type="text/javascript">
$('#id_%s').ColorPicker({
	onSubmit: function(hsb, hex, rgb, el) {
		$(el).val(hex);
		$(el).ColorPickerHide();
	},
	onBeforeShow: function () {
		$(this).ColorPickerSetColor(this.value);
	}
}).bind('keyup', function(){
	$(this).ColorPickerSetColor(this.value);
});
</script>''' % name)





