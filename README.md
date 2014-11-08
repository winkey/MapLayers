needs

django 1.3



edit setings.py 

set the timezone

set a new secret key


run

createdb 'NewWorld'                    
psql NewWorld
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
\q


python manage.py syncdb

python manage.py collectstatic

python manage.py runserver

point your browser at 127.0.0.1:8000/map

