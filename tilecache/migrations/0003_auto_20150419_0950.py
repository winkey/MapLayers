# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tilecache', '0002_auto_20150419_0933'),
    ]

    operations = [
        migrations.RunSQL('''
CREATE OR REPLACE FUNCTION layers_add_tilecache_cgf_by_id
(
    int
) RETURNS void AS
$$
DECLARE
    layer_row layers_layertreenode;
    wms_row layers_wms;
    arcims_row layers_arcims;
    ctype_row django_content_type;
    tc_row tilecache_config;
    wmstype integer;
    arcimstype integer;
BEGIN

/***** get the wms types *****/

    select id into wmstype from django_content_type where app_label = 'layers' and model = 'wms';
    select id into arcimstype from django_content_type where app_label = 'layers' and model = 'arcims';


/***** use a loop, testing if the row exsists *****/

    FOR layer_row IN EXECUTE 'SELECT * FROM layers_layertreenode WHERE id = $1' USING $1 LOOP
        IF layer_row.polymorphic_ctype_id = wmstype OR
           layer_row.polymorphic_ctype_id = arcimstype THEN
            
            IF layer_row.polymorphic_ctype_id = wmstype THEN
                EXECUTE 'SELECT * FROM layers_wms WHERE layertreenode_ptr_id = $1' INTO wms_row USING $1;
            END IF;

            IF layer_row.polymorphic_ctype_id = arcimstype THEN
                EXECUTE 'SELECT * FROM layers_arcims WHERE layertreenode_ptr_id = $1' INTO arcims_row USING $1;
            END IF;

            tc_row.id := $1;
            tc_row.lid := $1;
            tc_row.name := $1;
            tc_row.srs := 'EPSG:900913';
            tc_row.expired := now();
            tc_row.extension := 'png';
            tc_row.tms_type := 'google';
            tc_row.levels := 24;
            tc_row.resolutions :=
                ARRAY [ 156543.03390000000000000000, 78271.51695000000000000000,
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
                              .00933069192767143249 ];
            tc_row.spherical_mercator := true;
            tc_row.bbox := 
                ARRAY [ -10346242.7549695,  5224626.24288968,
                        -9656475.01868158, 5964781.03196305 ];

            tc_row.size := ARRAY [ 256, 256 ];
            tc_row.metasize := ARRAY [ 5, 5 ];
            tc_row.metabuffer := ARRAY [ 10, 10 ];
            tc_row.metaTile := false;
            
            IF layer_row.polymorphic_ctype_id = wmstype THEN
                tc_row.url := wms_row.url;
                tc_row.layers := ARRAY [ wms_row.layers ];
                tc_row.type := 'WMS';

                IF wms_row.gutter IS NOT NULL THEN
                    tc_row.metaTile := True;
                    tc_row.metaBuffer := ARRAY [ wms_row.gutter, wms_row.gutter ];
                END IF;
            END IF;

            IF layer_row.polymorphic_ctype_id = arcimstype THEN
                tc_row.url := arcims_row.url;
                tc_row.layers := ARRAY [ arcims_row.serviceName ];
                tc_row.type := 'ArcIMS';

                IF wms_row.gutter IS NOT NULL THEN
                    tc_row.metaTile := True;
                    tc_row.metaBuffer :=
                        ARRAY [ arcims_row.gutter, arcims_row.gutter ];
                END IF;
            END IF;


            INSERT
            INTO tilecache_config
            SELECT (tc_row).*;

        END IF;
    END LOOP;



END;

$$ LANGUAGE plpgsql;
''')
    ]
