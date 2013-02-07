
/**************************************************************************//**
 *
 * @brief function to fetch the layer tree 
 * 
******************************************************************************/

function NewWorld_Tree_GetJson() {
	
	$.getJSON( "/layers/treejson", {},
		function(data) {
			 NewWorld_Tree_Parse( data, {}, [] );
			 finishup();
	    }
	);
}

/**************************************************************************//**
 *
 *  @brief fuction to get the login status json
 * 
******************************************************************************/


function NewWorld_Login_GetJson() {
	
	$.getJSON( "/isLoggedin", {}, 
		function(data) {
			NewWorld_Settings.isLoggedin = data.isLoggedin;
			NewWorld_OLMap_Create();
			NewWorld_Tree_GetJson();
		}
	);
}

/**************************************************************************//**
 *
 *  @brief fuction to get the settings json
 * 
******************************************************************************/


function NewWorld_Settings_GetJson() {
	
	$.getJSON( "/map/settings", {}, 
		function(data) {
			NewWorld_Settings_Set(data);
			NewWorld_Login_GetJson();
		}
	);
}

Ext.onReady(function() {
	NewWorld_Settings_GetJson();
});
