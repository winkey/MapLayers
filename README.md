needs

note for now it all comes with

django_tag_parser-2.0.1-py2.7.egg-info
future-0.14.3-py2.7.egg-info 
twod.wsgi-2.0b1-py2.7.egg-info

django 1.7
django_mptt-0.6.1-py2.7.egg-info
django_polymorphic-0.6.1-py2.7.egg-info
django_polymorphic_tree-1.0.1-py2.7.egg-info

tilecache
mapserver

rest_framework

/Paste-1.7.5.1-py2.7-nspkg.pth


edit setings.py 
    set the timezone
    set a new secret key

edit tilecache/tilecache.cfg

run




dropdb NewWorld
createdb 'NewWorld'

psql NewWorld << EOF

CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology; \q

EOF

python manage.py migrate contenttypes
python manage.py migrate 

python manage.py collectstatic

python manage.py createsuperuser

