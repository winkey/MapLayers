
function NewWorld_login() {
	
	window.open(
    	"/login/",
    	'login',
    	'height=200,width=300,left=10,top=10,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no'
    );
	

}
function NewWorld_login_Finish() {
	NewWorld_Objects.loginbutton.setText('logout'); 
	NewWorld_Objects.loginbutton.setHandler(NewWorld_logout);
	
	/***** need to get a fresh tree *****/ 
	/***** parse hash layer list *****/ 
	
}
	
function NewWorld_logout() {
	
	window.open(
    	"/logout/",
    	'logout',
    	'height=200,width=300,left=10,top=10,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no'
    );
	
	
}
function NewWorld_logout_Finish() {
	NewWorld_Objects.loginbutton.setText('login'); 
	NewWorld_Objects.loginbutton.setHandler(NewWorld_login); 
	
	/***** need to get a fresh tree *****/
	/***** parse hash layer list *****/
}