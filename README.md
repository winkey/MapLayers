needs

django 1.3



edit setings.py 

set the timezone

set a new secret key


run

#!/bin/bash


dropdb NewWorld
createdb 'NewWorld'

psql NewWorld << EOF

CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology; \q

EOF

#python manage.py syncdb

python manage.py migrate contenttypes
python manage.py migrate 

#echo "restarting apache with sudo"

#sudo /etc/init.d/apache2 restart
touch wsgi.py
