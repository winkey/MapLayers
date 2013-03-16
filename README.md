needs

django 1.4



edit setings.py 

set the timezone

set a new secret key


run

createdb 'NewWorld' -T template_postgis

python manage.py syncdb

python manage.py collectstatic

python manage.py runserver

point your browser at 127.0.0.1:8000/map

