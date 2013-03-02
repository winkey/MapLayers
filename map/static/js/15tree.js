/*****************************************************************************
 function for the trees checkchange
*****************************************************************************/

function treeCheckChange(node, checked) {

    /***** new permalink add/remove *****/
    
    if(checked) {
        AddLayerToHashLayers(node.layer.lid);
        
    }
    else {
        RemoveLayerFromHashLayers(node.layer.lid);
        
    }

    /***** keep the layers out of the map to keep the map fast *****/
    
    if (node.layer.isBaseLayer === false) {
    
        /***** dont add or remove from the map if perm is true *****/
    
        if (node.layer.isbaselayer != true) {
            if(checked) {
                map.addLayer(node.layer);
            } else {
                map.removeLayer(node.layer, 'TRUE');
            }
        }

    /***** set the zoom on the map when baselayer is changed *****/

    } else {
        node.layer.onMapResize();
        var center = map.getCenter();
    
        if (map.baseLayer != null && center != null) {
            var zoom = map.getZoom();
            map.zoom = null;
            map.setCenter(center, zoom);
        }
    }
    
}


/*****************************************************************************
 function for the trees context menu
*****************************************************************************/

function treeContextMenu(node, e) {

    if (node && node.layer) {
        node.select();
        if (node.layer.isBaseLayer) {
            var c = node.getOwnerTree().baseLayerContextMenu;
            c.showAt(e.getXY());
        } else if (node.layer instanceof OpenLayers.Layer.Vector) {
            //var c = node.getOwnerTree().vectorOverlayContextMenu;
            //c.showAt(e.getXY());
            1+1;
        } else {
            var c = node.getOwnerTree().rasterOverlayContextMenu;
            c.showAt(e.getXY());
        }
    }
    
}

/******************************************************************************
    recursive function to parse the tree to turn on the requested layers
******************************************************************************/

function parsetree(root, layers) {

    var nodes = root.childNodes;
    
    if (nodes && layers) {
        
        /***** loop over the nodes children *****/
            
        var iNode;
        for ( iNode = 0; iNode < nodes.length ; iNode++ ) {
            
            /***** is the node a laayer *****/
            mynode = nodes[iNode];
            if ( nodes[iNode].attributes.nodeType == "gx_layer" ) {
                
                /***** loop over the layers in the url *****/

                var lays = layers.split(",");
                var iLid;
                for ( var iLid = 0; iLid < lays.length; iLid++ ) {
                    
                    /***** if this node is in the url list select it *****/
                    
                    if ( nodes[iNode].layer.lid == lays[iLid] ) {
                        nodes[iNode].getUI().toggleCheck(true);
                    }
                }
                
            /***** node must be a container *****/
   
            } else {
                
                /***** open and close the container *****/
                //nodes[iNode].expand(true);
                nodes[iNode].collapse(true);
                
                parsetree(nodes[iNode], layers);
            }
        }
    }    
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

function NewWorld_Tree_Parse( NodesArray, ParentNode) {
	
	/***** loop over the array of tree data *****/
	
	while (NodesArray.length > 0 &&
		     ( NodesArray[0].parent == null ||
		   	   NodesArray[0].parent == ParentNode.attributes.fid
		     )
		  ) {
		
		var layer = null;
		var folder = null;
		
	    /***** pop the node off the array *****/
	    
	    var NodeData = NodesArray[0];
		NodesArray.shift();
		
		switch(NodeData.nodetype) {
	    	
	        case 'Folder':
	        	
	        	/***** is this the root node? *****/
		
				/***** fixme layerroot needs to go in a global object *****/
					
				folder = new Ext.tree.TreeNode({
	            		text: NodeData.name,
	            		expanded: true,
	            		fid: NodeData.id,
	            		parent: NodeData.parent,
	            		lft: NodeData.lft,
						rght: NodeData.rght,
						tree_id: NodeData.tree_id,
						level: NodeData.level
	            	});
	            
	    		if ( ParentNode == null) {
					
					layerRoot = folder;
				}
	    		
	    		/*} else {
	           
	            	folder = new GeoExt.tree.OverlayLayerContainer({
		        	    leaf: false,
		            	nodeType: "gx_overlaylayercontainer",
		            	text: NodeData.name,
	            		expanded: true,
		            	applyLoader: false,
	            		fid: NodeData.id,
	            		parent: NodeData.parent,
	            		lft: NodeData.lft,
						rght: NodeData.rght,
						tree_id: NodeData.tree_id,
						level: NodeData.level
					});
		       	
			    }*/
			                  
	            break;
	        
	        case 'Radio':
	        
	            folder = new GeoExt.tree.BaseLayerContainer({
	                text: NodeData.name,
	                map: map,
	                draggable:false,
	                expanded: true,
	            		fid: NodeData.id,
	            		parent: NodeData.parent,
	            		lft: NodeData.lft,
						rght: NodeData.rght,
						tree_id: NodeData.tree_id,
						level: NodeData.level
				});
	            
	            break;
	            
	        case 'Animation':
	        
	            
	            continue;
	
	        case 'ArcGISCache':
	            continue;
	
	        case 'ArcGIS93Rest':
	            layer = new OpenLayers.Layer.ArcGIS93Rest( NodeData.name,
		                                                   NodeData.url,
		        						                   NodeData.options
		                                                 );
		        break;
		        
	        case 'ArcIMS':
	            layer = new OpenLayers.Layer.ArcIMS( NodeData.name,
		                                             NodeData.url,
		        						             NodeData.options
		                                           );
		        break;
	
	        case 'Bing':
	            layer = new OpenLayers.Layer.Bing( NodeData.name,
		                                           NodeData.type,
		        						           NodeData.key,
		        						           NodeData.options
		                                          );
		        break;
		        
	        case 'GeoRSS':
	        	
	        	NodeData.popupSize = new OpenLayers.Size(NodeData.popupSize[0],
	        		                                     NodeData.popupSize[1]);
      			NodeData.projection = new OpenLayers.Projection("EPSG:" + NodeData.projection);
      			
	            layer = new OpenLayers.Layer.GeoRSS( NodeData.name,
		                                             NodeData.url,
		        						             NodeData.popupSize,
		        						             NodeData.projection,
		        						             NodeData.options
		                                           );
		        break;
		        
	        case 'Google':

	        	switch (NodeData.options.type) {
	        		case 'G_SATELLITE_MAP':
	        			NodeData.options.type = G_SATELLITE_MAP;
	        			break;
					case 'G_HYBRID_MAP':
						NodeData.options.type = G_HYBRID_MAP;
	        			break;
					case 'G_PHYSICAL_MAP':
						NodeData.options.type = G_PHYSICAL_MAP
						break;
	        	}
	            
	            layer = new OpenLayers.Layer.Google( NodeData.name,
		                                             NodeData.options
		                                           );
		        break;
	                   
	        case 'Googlev3':
	        	switch (NodeData.options.type) {
	        		case 'SATELLITE':
	        			NodeData.options.type = google.maps.MapTypeId.SATELLITE;
	        			break;
					case 'HYBRID':
						NodeData.options.type = google.maps.MapTypeId.HYBRID;
	        			break;
					case 'TERRAIN':
						NodeData.options.type = google.maps.MapTypeId.TERRAIN;
	        			break;
					case 'ROADMAP':
						NodeData.options.type = google.maps.MapTypeId.ROADMAP;
	        			break;
	        	}
	        	
	            layer = new OpenLayers.Layer.Googlev3( NodeData.name,
		                                               NodeData.options
		                                             );
		        break;

	        case 'KaMap':
	        	layer = new OpenLayers.Layer.KaMap( NodeData.name,
		                                            NodeData.url,
		        						            NodeData.params,
		        						            NodeData.options
		                                          );
		        break;
		        
	        case 'KaMapCache':
	        	layer = new OpenLayers.Layer.KaMapCache( NodeData.name,
		                                                 NodeData.url,
		        						                 NodeData.params,
		        						                 NodeData.options
		                                               );
		        break;
		        
	        case 'MapGuide':
	        	continue;
		        
	        case 'MapServer':
	        	layer = new OpenLayers.Layer.MapServer( NodeData.name,
		                                                NodeData.url,
		        						                NodeData.params,
		        						                NodeData.options
		                                              );
		        break;
		        
	        case 'OSM':
	        	layer = new OpenLayers.Layer.OSM( NodeData.name,
		                                          NodeData.url,
		        						          NodeData.options
		                                        );
		        break;
		        
	        case 'TMS':
	        	layer = new OpenLayers.Layer.TMS( NodeData.name,
		                                          NodeData.url,
		        						          NodeData.options
		                                        );
		        break;
		        
	        case 'WMS':
		        layer = new OpenLayers.Layer.WMS( NodeData.name,
		                                          NodeData.url,
		        						          NodeData.params,
		                                          NodeData.options
		                                         );
	            break;
	            
	        case 'WMTS':
	        	layer = new OpenLayers.Layer.WMTS( NodeData.options
		        	                             );
	            break;
	
	        case 'WorldWind':
	        	NodeData.options.tileSize = new OpenLayers.Size(NodeData.options.tileSize[0],
	        													NodeData.options.tileSize[1] );
	        	layer = new OpenLayers.Layer.WorldWind( NodeData.name,
		        	                                    NodeData.url,
		        	                                    NodeData.lzd,
		        	                                    NodeData.zoomLevels,
		        	                                    NodeData.params,
		        	                                    NodeData.options
		        	                                   );
	            break;
	
	        case 'XYZ':
	            layer = new OpenLayers.Layer.XYZ( NodeData.name,
		        	                              NodeData.url,
		           							      NodeData.options
		           							    );
	            break;
	    }
	    
	    if ( layer != null) {
	    	
	    	/***** append the layer to its parent folder *****/
	    	
	    	alert ("adding " + NodeData.name + " to " +  ParentNode.attributes.text)
	    	ParentNode.appendChild( new GeoExt.tree.LayerNode(layer));
	        
	        /***** add a baselayer to the map now *****/
	           
	        if (NodeData.options.isBaseLayer == true) {
	        	map.addLayers([layer]);
	        }
	    }
	    
	    if ( folder != null) {
	    	
	    	NewWorld_Tree_Parse( NodesArray, folder)
	        
	        if ( ParentNode != null) {
	        	ParentNode.appendChild(folder);
	        }
	    }
	    
	}        
}
