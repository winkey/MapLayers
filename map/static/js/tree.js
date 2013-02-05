

/**************************************************************************//**
 * @brief function to build the openlayers options object from NodeNata
 * 
 * @param {Object} NodeData	object of json items for the layer
 * 
 * @returns openlayers options object
 * 
******************************************************************************/

function NewWorld_OL_options( NodeData ) {
	var options = new Object();
	options.lid=NodeData.pk;
    if (NodeData.fields.isBaseLayer == undefined || NodeData.fields.isBaseLayer == false) {
      	options.perm = true;
    }
    
	if (NodeData.fields.extent != undefined) {
       options.myExtent = new OpenLayers.Bounds( NodeData.fields.extent);
    }
    
    var members = [
    	"isBaseLayer",
    	"visibility",
    	"attribution",
    	"displayInLayerSwitcher",
    	"opacity",
    	"singleTile"];
	
	for (var i = 0; i < members.length; i++) {
    	if (NodeData.fields[members[i]] != undefined) {
        	options[members[i]] = NodeData.fields[members[i]];
    	}
    }
	
	return options;
}

/**************************************************************************//**
 * @brief function to build the openlayers params object from NodeNata
 * 
 * @param {Object} NodeData	object of json items for the layer
 * 
 * @returns openlayers params object
 * 
******************************************************************************/

function NewWorld_OL_params( NodeData ) {
	var params = new Object();
	params.layers = NodeData.fields.layers;
	params.format = NodeData.fields.format;
	if (NodeData.fields.transparency != undefined) {
	    params.transparency = NodeData.fields.transparency;
	}
	        
	return params;
}

/**************************************************************************//**
 *
 *  @brief recursive funtion to parse the json array into the geoext tree
 * 
 *  @param NodesArray
 *  @param ParentNode
 *  @param LayerArray
 * 
******************************************************************************/

function NewWorld_ParseTree( NodesArray, ParentNode, LayerArray ) {
	
	/***** loop over the array of tree data *****/
	
	while (NodesArray.length > 0) {
		var NodeData = NodesArray[0];
		NodesArray.shift();
		
		/***** is this the root node? *****/
		
		if ( NodeData.pk == 1) {
			var newLayerArray = new Array();
	            
			layerRoot = new Ext.tree.TreeNode({
	            text: NodeData.fields.name,
	            expanded: true});
	        
	        NewWorld_ParseTree( NodesArray, layerRoot, newLayerArray );
	        
	        continue;
	    }
	        
		
		switch(NodeData.fields.nodetype) {
	    	
	        case 'normal':
	            var newLayerArray = new Array();
	            
	            var folder = new GeoExt.tree.OverlayLayerContainer({
		            text: NodeData.fields.name,
		            leaf: false,
		            nodeType: "gx_overlaylayercontainer",
		            expanded: true,
		            applyLoader: false });
			                  
	            NewWorld_ParseTree( NodesArray, folder, newLayerArray )
	                
	            ParentNode.appendChild(folder);
	            
	            continue;
	        
	        case 'radio':
	        
	            var newLayerArray = new Array();
	            
	            var folder = new GeoExt.tree.BaseLayerContainer({
	                text: NodeData.fields.name,
	                map: map,
	                draggable:false,
	                expanded: true });
	            
	            NewWorld_ParseTree( NodesArray, folder, newLayerArray )
	        
	            ParentNode.appendChild(folder);
	            continue;
	
	        case 'animation':
	        
	            
	            continue;
	
	        case 'ArcGISCache':
	            continue;
	
	        case 'ArcGIS93Rest':
	            var layer = new OpenLayers.Layer.ArcGIS93Rest( NodeData.fields.name,
		                                                            NodeData.fields.url,
		           							                        NewWorld_OL_params( NodeData ) );
		           							                        
	            ParentNode.appendChild( new GeoExt.tree.LayerNode(layer));
	            
	            if (NodeData.fields.isBaseLayer == true) {
	            	map.addLayers([layer]);
	            }
	            
	            continue;
	        case 'ArcIMS':
	            continue;
	
	        case 'Bing':
	            continue;
	
	        case 'GeoRSS':
	            continue;
	
	        case 'Google':
	        	
	        	var options = NewWorld_OL_options( NodeData );
	            options.sphericalMercator = true;
	            
	            
	            /* fixme i dont think this is a string type: G_PHYSICAL_MAP */
	            
	            var layer = new OpenLayers.Layer.Google( NodeData.fields.name,
	                                                     options );
	                  
	            ParentNode.appendChild( new GeoExt.tree.LayerNode(layer));
	            
	            if (NodeData.fields.isBaseLayer == true) {
	            	map.addLayers([layer]);
	            }
	            
	            continue;
	                   
	        case 'Googlev3':
	            continue;
	
	        case 'OSM':
	        	var layer = new OpenLayers.Layer.OSM( NodeData.fields.name,
		        	                                  NodeData.fields.url,
		           		                              NewWorld_OL_options( NodeData ) );
	            
	            ParentNode.appendChild( new GeoExt.tree.LayerNode(layer));
	            
	            if (NodeData.fields.isBaseLayer == true) {
	            	map.addLayers([layer]);
	            }
	            
	            continue;
	            
	        case 'TMS':
	        case 'WMS':
		        var layer = new OpenLayers.Layer.WMS( NodeData.fields.name,
		                                              NodeData.fields.url,
		           							          NewWorld_OL_params( NodeData ),
		           							          NewWorld_OL_options( NodeData ) );

	            ParentNode.appendChild( new GeoExt.tree.LayerNode(layer));
	            
	            if (NodeData.fields.isBaseLayer == true) {
	            	map.addLayers([layer]);
	            }
	            
	            continue;
	            
	        case 'WMTS':
	            continue;
	
	        case 'WorldWind':
	            continue;
	
	        case 'XYZ':
	            LayerArray.push( new OpenLayers.Layer.XYZ( NodeData.fields.name,
		        	                                       NodeData.fields.url,
		           							               NewWorld_OL_options( NodeData )
		           							             ));
	            continue;
	    }
	}        
}

/**************************************************************************//**
 *
 * @brief callback function to parse the json into a js object
 * 
******************************************************************************/

function NewWorld_ParseJsonTree(data) {
	/***** var TreeData = $.parseJSON(json);****/
	NewWorld_ParseTree( data, {}, [] );
	finishup()
}
	

/**************************************************************************//**
 *
 * @brief function to fetch the layer tree 
 * 
******************************************************************************/

function NewWorld_FetchJsonTree() {
	
	$.getJSON( "/layers/treejson", {}, NewWorld_ParseJsonTree );
	
	/*.error(function(){ 	
	     alert("Error!");
    });
    */
}




Ext.onReady(function() {
	NewWorld_FetchJsonTree();
});


