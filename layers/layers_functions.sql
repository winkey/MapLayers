/*******************************************************************************
* Copyright (c) 2013,  Brian Case 
*
* Permission is hereby granted, free of charge, to any person obtaining a
* copy of this software and associated documentation files (the "Software"),
* to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
* OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
* THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
* DEALINGS IN THE SOFTWARE.
*******************************************************************************/
 
CREATE SCHEMA postgis;
ALTER DATABASE NewWorld SET search_path="$user", public, postgis,topology;
GRANT ALL ON SCHEMA postgis TO public;
ALTER EXTENSION postgis SET SCHEMA postgis;





/*******************************************************************************
 @brief function to add a folder

 @param level       depth of the tree node, root is 0
 @param parent      the parent id of the node to add the node too
 @param owner_id    the owner id of this new node (CAN BE NULL)
 @param groups_id   the group id of this new node (CAN BE NULL)
 @param name        the name of the node to add
 @param tooltip
 @param metadata


 @return nothing

 @details function for adding a folder node to the layer tree
*******************************************************************************/

CREATE OR REPLACE FUNCTION add_layers_Folder(
    integer,
    integer,
    integer,
    integer,
    text,
    text,
    text
) RETURNS void AS
$$
  
WITH layernode AS
(
INSERT
INTO layers_layertreenode
    (
        polymorphic_ctype_id ,
        lft                  ,
        rght                 ,
        tree_id              ,
        level                ,
        parent_id            ,
        nodetype             ,
        added                ,
        modified             ,
        owner_id             ,
        groups_id            ,
        tooltip              ,
        metadata
    )
SELECT
    dct.id   ,
    0        ,
    0        ,
    1        ,
    $1       ,
    $2       ,
    'Folder' ,
    now()    ,
    now()    ,
    $3       ,
    $4       ,
    $6       ,
    $7
FROM django_content_type dct
WHERE dct.name = 'Folder' and app_label = 'layers'
RETURNING id
)
INSERT
INTO layers_Folder
    (
        layertreenode_ptr_id ,
        name
    )
SELECT
        ln.id ,
        $5
FROM layernode ln
;

$$ LANGUAGE SQL;

/*******************************************************************************
 @brief function to add a radio folder

 @param level       depth of the tree node, root is 0
 @param parent      the parent id of the node to add the node too
 @param owner_id    the owner id of this new node (CAN BE NULL)
 @param groups_id   the group id of this new node (CAN BE NULL)
 @param name        the name of the node to add
 @param tooltip
 @param metadata

 @return nothing

 @details function for adding a radio folder node to the layer tree

*******************************************************************************/

CREATE OR REPLACE FUNCTION add_layers_radio(
    integer,
    integer,
    integer,
    integer,
    text,
    text,
    text
) RETURNS void AS
$$
  
WITH layernode AS
(
INSERT
INTO layers_layertreenode
    (
        polymorphic_ctype_id ,
        lft                  ,
        rght                 ,
        tree_id              ,
        level                ,
        parent_id            ,
        nodetype             ,
        added                ,
        modified             ,
        owner_id             ,
        groups_id            ,
        tooltip              ,
        metadata
    )
SELECT
    dct.id   ,
    0        ,
    0        ,
    1        ,
    $1       ,
    $2       ,
    'Radio' ,
    now()    ,
    now()    ,
    $3       ,
    $4       ,
    $6       ,
    $7
FROM django_content_type dct
WHERE dct.name = 'Radio' and app_label = 'layers'
RETURNING id
)
INSERT
INTO layers_radio
    (
        layertreenode_ptr_id ,
        name
    )
SELECT
        ln.id ,
        $5
FROM layernode ln
;

$$ LANGUAGE SQL;

/*******************************************************************************
@brief function to add a animation folder

 @param level       depth of the tree node, root is 0
 @param parent      the parent id of the node to add the node too
 @param owner_id    the owner id of this new node (CAN BE NULL)
 @param groups_id   the group id of this new node (CAN BE NULL)
 @param name        the name of the node to add
 @param tooltip
 @param metadata

 @return nothing

 @details function for adding a animation folder node to the layer tree

*******************************************************************************/

CREATE OR REPLACE FUNCTION add_layers_animation(
    integer,
    integer,
    integer,
    integer,
    text,
    text,
    text
) RETURNS void AS
$$
  
WITH layernode AS
(
INSERT
INTO layers_layertreenode
    (
        polymorphic_ctype_id ,
        lft                  ,
        rght                 ,
        tree_id              ,
        level                ,
        parent_id            ,
        nodetype             ,
        added                ,
        modified            ,
        owner_id             ,
        groups_id            ,
        tooltip              ,
        metadata
    )
SELECT
    dct.id   ,
    0        ,
    0        ,
    1        ,
    $1       ,
    $2       ,
    'Folder' ,
    now()    ,
    now()    ,
    $3       ,
    $4       ,
    $6       ,
    $7
FROM django_content_type dct
WHERE dct.name = 'Folder' and app_label = 'layers'
RETURNING id
)
INSERT
INTO layers_animation
    (
        layertreenode_ptr_id ,
        name
    )
SELECT
        ln.id ,
        $5
FROM layernode ln
;

$$ LANGUAGE SQL;

/*******************************************************************************
@brief function to add a wms layer

 @param level           depth of the tree node, root is 0
 @param parent          the parent id of the node to add the node too
 @param owner_id        the owner id of this new node (CAN BE NULL)
 @param groups_id       the group id of this new node (CAN BE NULL)
 @param timestamp
 @param begin_timespan
 @param end_timespan
 @param tilecache
 @param name            the name of the node to add
 @param tooltip
 @param metadata
 @param url                  ,
 @param layers               ,
 @param format               ,
 @param transparency         ,
 @param opacity              ,
 @param singleTile           ,
 @param attribution          ,
 @param isBaseLayer          ,
 @param gutter 

 @return nothing

 @details function for adding a wms layer node to the layer tree

*******************************************************************************/

CREATE OR REPLACE FUNCTION add_layers_wms(
    integer,
    integer,
    integer,
    integer,
    timestamp with time zone,
    timestamp with time zone,
    timestamp with time zone,
    boolean,
    text,
    text,
    text,
    text,
    text,
    text,
    boolean,
    double precision,
    boolean,
    text,
    boolean,
    integer
)
 RETURNS void AS
$$
  
WITH layernode AS
(
INSERT
INTO layers_layertreenode
    (
        polymorphic_ctype_id ,
        lft                  ,
        rght                 ,
        tree_id              ,
        level                ,
        parent_id            ,
        nodetype             ,
        added                ,
        modified             ,
        owner_id             ,
        groups_id            ,
        timestamp            ,
        begin_timespan       ,
        end_timespan         ,
        tilecache            ,
        tooltip              ,
        metadata
    )
SELECT
    dct.id   ,
    0        ,
    0        ,
    1        ,
    $1       ,
    $2       ,
    'WMS' ,
    now()    ,
    now()    ,
    $3       ,
    $4       ,
    $5       ,
    $6       ,
    $7       ,
    $8       ,
    $10      ,
    $11

FROM django_content_type dct
WHERE dct.name = 'WMS' and app_label = 'layers'
RETURNING id
)
INSERT
INTO layers_wms
    (
        layertreenode_ptr_id ,
        name                 ,
        url                  ,
        layers               ,
        format               ,
        transparency         ,
        opacity              ,
        "singleTile"           ,
        attribution          ,
        "isBaseLayer"          ,
        gutter 
    )
SELECT
        ln.id        ,
        $9           ,
        $12          ,
        $13          ,
        $14          ,
        $15          ,
        $16          ,
        $17          ,
        $18          ,
        $19          ,
        $20
FROM layernode ln
;



$$ LANGUAGE SQL;

/*******************************************************************************
@brief function to update a layer when the data changes

 @param id                  id of the node to update
 @param timestamp           can be null
 @param begin_timespan      can be null
 @param end_timespan        can be null

 @return nothing



*******************************************************************************/

CREATE OR REPLACE FUNCTION update_layers(
    integer
    timestamp with time zone,
    timestamp with time zone,
    timestamp with time zone,
) RETURNS void AS
$$
UPDATE layers_layertreenode
SET
    modified       = now(),
    timestamp      = $2,
    begin_timespan = $3,
    end_timespan   = $4
WHERE
    id = $1
;

$$ LANGUAGE SQL;

/*******************************************************************************
@brief function to get the table name from a ctype

 @param id                  ctype id

 @return table name

 @param ctype

 @return the table name for the ctype

*******************************************************************************/

CREATE OR REPLACE FUNCTION layers_ctype2table(
    integer
) returns text AS
$$

   select app_label || '_' || model FROM django_content_type where  id = $1;
$$ LANGUAGE SQL;


/*******************************************************************************
@brief 

 @param  
*******************************************************************************/

CREATE or replace FUNCTION search_layers(
    text[],
    integer
) RETURNS layers_layertreenode AS
$$
DECLARE
    layer text := $1[array_lower($1,1)];
    rest text[] := $1[array_lower($1,1)+1:array_upper($1,1)];
    layer_row layers_layertreenode;
    result layers_layertreenode;
    tname text;
    c integer := 0;
BEGIN

/**** loop over the layers with the parent id we were passed *****/

    FOR layer_row IN EXECUTE 'SELECT * FROM layers_layertreenode WHERE parent_id = $1' USING $2 LOOP
        
/****   get the name of the table for the layer data *****/

        tname := layers_ctype2table(layer_row.polymorphic_ctype_id);

/****   see if the name matches *****/

        EXECUTE 'SELECT name FROM ' || tname || ' WHERE name = $1 AND  layertreenode_ptr_id = $2' USING layer, layer_row.id;
        GET DIAGNOSTICS c = ROW_COUNT;
        IF c > 0 THEN
            
/*****      if theres more layers to serch, recurse *****/

            IF rest IS NOT NULL AND rest != '{}' THEN
                result = search_layers(rest, layer_row.id );
                EXIT WHEN result IS NOT NULL;

/*****      no more layers to search *****/

            ELSE
                result = layer_row;
                EXIT;

            END IF;


        END IF;
    END LOOP;

    RETURN result;


END;
$$ LANGUAGE plpgsql;



/*******************************************************************************

 @param parent          an aray that describes the parent by name
 @param owner_id    the owner id of this new node (CAN BE NULL)
 @param groups_id   the group id of this new node (CAN BE NULL)
 @param name        the name of the node to add
 @param tooltip
 @param metadata

 @return nothing
*******************************************************************************/

CREATE OR REPLACE FUNCTION layers_add_folder_by_name
(
    text[],
    integer,
    integer,
    text,
    text,
    text
) RETURNS void AS
$$

WITH parent(id, level) AS (
    select id, level
    FROM search_layers($1, 1)
)
SELECT add_layers_Folder( level + 1, id, $2, $3, $4, $5, $6 )
FROM PARENT
;

$$ LANGUAGE SQL;

/*******************************************************************************

 @param parent          an aray that describes the parent by name
 @param owner_id    the owner id of this new node (CAN BE NULL)
 @param groups_id   the group id of this new node (CAN BE NULL)
 @param name        the name of the node to add
 @param tooltip
 @param metadata

 @return nothing
*******************************************************************************/

CREATE OR REPLACE FUNCTION layers_add_radio_by_name
(
    text[],
    integer,
    integer,
    text,
    text,
    text
) RETURNS void AS
$$

WITH parent(id, level) AS (
    select id, level
    FROM search_layers($1, 1)
)
SELECT add_layers_Radio( level + 1, id, $2, $3, $4, $5, $6 )
FROM PARENT
;

$$ LANGUAGE SQL;

/*******************************************************************************

 @param parent          an aray that describes the parent by name
 @param owner_id    the owner id of this new node (CAN BE NULL)
 @param groups_id   the group id of this new node (CAN BE NULL)
 @param name        the name of the node to add
 @param tooltip
 @param metadata

 @return nothing
*******************************************************************************/

CREATE OR REPLACE FUNCTION layers_add_animation_by_name
(
    text[],
    integer,
    integer,
    text,
    text,
    text
) RETURNS void AS
$$

WITH parent(id, level) AS (
    select id, level
    FROM search_layers($1, 1)
)
SELECT add_layers_animation( level + 1, id, $2, $3, $4, $5, $6 )
FROM PARENT
;

$$ LANGUAGE SQL;

/*******************************************************************************

 @param parent          an aray that describes the parent by name
 @param owner_id        the owner id of this new node (CAN BE NULL)
 @param groups_id       the group id of this new node (CAN BE NULL)
 @param timestamp
 @param begin_timespan
 @param end_timespan
 @param tilecache
 @param name            the name of the node to add
 @param tooltip
 @param metadata
 @param url                  ,
 @param layers               ,
 @param format               ,
 @param transparency         ,
 @param opacity              ,
 @param singleTile           ,
 @param attribution          ,
 @param isBaseLayer          ,
 @param gutter 

 @return nothing
*******************************************************************************/

CREATE OR REPLACE FUNCTION layers_add_wms_by_name
(
    text[],
    integer,
    integer,
    timestamp with time zone,
    timestamp with time zone,
    timestamp with time zone,
    boolean,
    text,
    text,
    text,
    text,
    text,
    text,
    boolean,
    double precision,
    boolean,
    text,
    boolean,
    integer
) RETURNS void AS
$$

WITH parent(id, level) AS (
    select id, level
    FROM search_layers($1, 1)
)
SELECT add_layers_wms( level + 1, id, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19 )
FROM parent
;

$$ LANGUAGE SQL;

/*******************************************************************************
*******************************************************************************/

CREATE OR REPLACE FUNCTION layers_delete_all_contents
(
    integer
) RETURNS void AS
$$
DECLARE
    layer_row layers_layertreenode;
    tname text;
    foldertype integer;
    radiotype integer;
    animationtype integer;
BEGIN

/***** get the folder types *****/

    select id into foldertype from django_content_type where app_label = 'layers' and model = 'folder';
    select id into radiotype from django_content_type where app_label = 'layers' and model = 'radio';
    select id into animationtype from django_content_type where app_label = 'layers' and model = 'animation';


/**** loop over the layers with the parent id we were passed *****/

    FOR layer_row IN EXECUTE 'SELECT * FROM layers_layertreenode WHERE parent_id = $1' USING $1 LOOP
        
/****   get the name of the table for the layer data *****/

        tname := layers_ctype2table(layer_row.polymorphic_ctype_id);

/***** if its a folder type, recurse *****/

        IF layer_row.polymorphic_ctype_id = foldertype OR
           layer_row.polymorphic_ctype_id = radiotype OR
           layer_row.polymorphic_ctype_id = animationtype THEN

            PERFORM layers_delete_all_contents(layer_row.id);
        END IF;

/****   delete the matching row see if the name matches *****/

        EXECUTE 'DELETE FROM ' || tname || ' layertreenode_ptr_id = $1' USING layer_row.id;
        EXECUTE 'DELETE FROM layers_layertreenode WHERE id = $1 ' USING layer_row.id;

    END LOOP;



END;
$$ LANGUAGE plpgsql;

/*******************************************************************************
*******************************************************************************/

CREATE OR REPLACE FUNCTION layers_delete_all_contents_by_name
(
    text[]
) RETURNS void AS
$$

WITH parent(id, level) AS (
    select id
    FROM search_layers($1, 1)
)
SELECT layers_delete_all_contents( id )
FROM parent
;
$$ LANGUAGE SQL;


/*******************************************************************************
*******************************************************************************/

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

