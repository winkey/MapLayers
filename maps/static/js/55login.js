/*******************************************************************************
 *
 * Project: MapLayers
 * App:     javascript login button
 *
 * 
 *
 *******************************************************************************
 * Copyright (c) 2013-2015,  Brian Case 
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
******************************************************************************/


dojo.require("dojo");

dojo.ready(function() {

    MapLayers.login = new Object();
    MapLayers.login.loginbutton = {};
    
});

function MapLayers_login() {
    
    window.open(
        "../login/",
        'login',
        'height=200,width=300,left=10,top=10,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no'
    );
    

}
function MapLayers_login_Finish() {
    MapLayers.login.isLoggedin = true;
    MapLayers.login.loginbutton.set('label', 'Logout')
    MapLayers.login.loginbutton.set('onClick', MapLayers_logout)

    /***** need to get a fresh tree *****/ 
    /***** parse hash layer list *****/ 
    
}
    
function MapLayers_logout() {
    
    window.open(
        "../logout/",
        'logout',
        'height=200,width=300,left=10,top=10,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no'
    );
    
    
}
function MapLayers_logout_Finish() {
    MapLayers.login.isLoggedin = false;
    MapLayers.login.loginbutton.set('label', 'Login')
    MapLayers.login.loginbutton.set('onClick', MapLayers_login)
    
    /***** need to get a fresh tree *****/
    /***** parse hash layer list *****/
}
