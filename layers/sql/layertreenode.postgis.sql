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
 
/*CREATE SCHEMA postgis;
#ALTER DATABASE "NewWorld" SET search_path="$user", public, postgis,topology;
#GRANT ALL ON SCHEMA postgis TO public;
#ALTER EXTENSION postgis SET SCHEMA postgis;
*/




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
 @param tile_cache
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
        tile_cache            ,
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
    integer,
    timestamp with time zone,
    timestamp with time zone,
    timestamp with time zone
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
 @param tile_cache
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

WITH parent(id) AS (
    select id
    FROM search_layers($1, 1)
)
SELECT layers_delete_all_contents( id )
FROM parent
;

$$ LANGUAGE SQL;
