needs

django
geodjango
django-mptt

edit the 2 full paths in settings


createdb 'NewWorld' -T template_postgis
python manage.py syncdb
python manage.py collectstatic

