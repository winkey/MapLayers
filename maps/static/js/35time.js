/*******************************************************************************
 *
 * Project: MapLayers
 * App:     javascript timeslider
 *
 * 
 *
 *******************************************************************************
 * Copyright (c) 2014-2015,  Brian Case 
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

//dojo.require("dojo/dom-style");

dojo.require("dijit/Tooltip");

require(['dojo/_base/declare'], function(declare) {

    MapLayers.Time = new Object();
    MapLayers.Time.Timer = null;
    MapLayers.Time.UpdateTimer = null;
    MapLayers.Time.FirstPlayState = false;
    
    MapLayers.Time.TSList = new DLList();
    MapLayers.Time.TSCurrentNode = null;
    MapLayers.Time.BegList = new DLList();
    MapLayers.Time.EndList = new DLList();
    MapLayers.Time.BegCurrentNode = null;
    MapLayers.Time.EndCurrentNode = null;
    
    MapLayers.Time.SliderMinValue = null;
    MapLayers.Time.SliderMaxValue = null;
    MapLayers.Time.IgnoreSliderChange = false;
    
    MapLayers.Time.Time = null;
    MapLayers.Time.LoopState = false;
    MapLayers.Time.RockState = false;
    MapLayers.Time.BackwardsState = false;
    MapLayers.Time.Speed = 500;
    MapLayers.Time.Incr = 1 * 60 * 60 * 1000;
    
    MapLayers.Time.Toolbar = null;
});

function MIN (a,b) {
    return a < b ? a : b;
}
    
function MAX (a,b) {
    return a > b ? a : b;
}

    
function MapLayers_Time_Node(treenode, timestamp) {
    this.treenode = treenode;
    this.timestamp = timestamp;

}

/*******************************************************************************
 playbutton object
*******************************************************************************/

require( ['dojo/_base/declare', "dijit/form/Button"],
         function(declare, Button) {

    declare("MapLayers.Time._PlayButton", null, {

        Form: null,

        log:  function () {
            if (MapLayers.Settings.debug) {
                //console.log("MapLayers.Time._PlayButton. : ", this, " : ", arguments);
            }
        },

        /***********************************************************************
         constructor
        ***********************************************************************/

        constructor: function (Toolbar) {

            this.log("create");

            /***** play/pause button *****/
            
            this.Form = new Button({
                label: "Play",
                showLabel: true,
                style: "width:6ch;",
                onClick: this.OnClick,
            }, "PlayButton");

            Toolbar.addChild( this.Form );
            this.Form.startup();
        },

        /***********************************************************************
         function to init from the url hash
        ***********************************************************************/

        InitFromHash: function () {

            this.log("InitFromHash");
        },

        OnClick: function() {
            MapLayers.Time.Toolbar.IntervalPlay();
        }
    });
});


/*******************************************************************************
 ForwardButton object
*******************************************************************************/

require( ['dojo/_base/declare', "dijit/form/Button"],
         function(declare, Button) {

    declare("MapLayers.Time._ForwardButton", null, {

        Form: null,

        log:  function () {
            if (MapLayers.Settings.debug) {
                //console.log("MapLayers.Time._PlayButton. : ", this, " : ", arguments);
            }
        },

        /***********************************************************************
         constructor
        ***********************************************************************/

        constructor: function (Toolbar) {

            this.log("create");

            /***** forward button *****/

            this.Form = new dijit.form.ToggleButton({
                label: "Fwd",
                showLabel: true,
                checked: false,
                style: "width:6ch;",
                onChange: function(val){

                    /***** update the hash *****/

                    MapLayers_Hash_Replace("forward", val);

                    MapLayers.Time.BackwardsState = !val;
                }
            }, "ForwardButton");

            Toolbar.addChild(this.Form);
            this.Form.startup();
        },

        /***********************************************************************
         function to init from the url hash
        ***********************************************************************/

        InitFromHash: function () {
            this.log("InitFromHash");

            var state = MapLayers_Hash_Get("forward");
            if ( !state ) state = false;
            this.Form.set('checked', state);
        }

    });
});

/*******************************************************************************
 TimeSlider object
*******************************************************************************/

require( ['dojo/_base/declare', "dijit/form/HorizontalSlider"],
         function(declare, HorizontalSlider) {

    declare("MapLayers.Time._TimeSlider", null, {

        Form: null,
        
        log:  function () {
            if (MapLayers.Settings.debug) {
                //console.log("MapLayers.Time._TimeSlider. : ", this, " : ", arguments);
            }
        },

        /***********************************************************************
         constructor
        ***********************************************************************/

        constructor: function (Toolbar) {

            this.log("create");

            this.Form = new HorizontalSlider({
                id: "TimeSlider",
                value: 0,
                minimum: 0,
                maximum: 200,
                intermediateChanges: true, //discreteValues
                style: "width:200px;",
                onChange: this.OnChange,
            }, "timeslider");

           /*MapLayers.Time.TimeSlider_tooltip = new dijit.Tooltip({
                connectId: ["TimeSlider"],
                label: "Time Slider"
            });
            */

            Toolbar.addChild(this.Form);
            this.Form.startup();
        },

        /***********************************************************************
         function to get the time from the url hash
        ***********************************************************************/

        GetHash: function() {
            var state = MapLayers_Hash_Get("time");
            if ( !state ) state = 0;
            return state;
        },

        /***********************************************************************
         function to init from the url hash
        ***********************************************************************/

        InitFromHash: function () {

            this.log("InitFromHash");

            var state = MapLayers_Hash_Get("time");
            if ( !state ) {
                state = 0;
            } else {
                MapLayers.Time.Time = Number(state);
            }
            this.Update(Number(state), false, false);
        },

        /***********************************************************************
         * 
         * @brief callback function for when the time slider changes
         * 
         * 
        ***********************************************************************/

        OnChange: function ( newValue ) {

            MapLayers.Time.TimeSlider.log("OnChange ( newValue ) ", newValue);
            
            //FIXME do we need this?            
            if (MapLayers.Time.IgnoreSliderChange) return;

            /***** stop if playing *****/
            
            if (MapLayers.Time.Timer != null) {
                MapLayers.Time.Toolbar.IntervalPause();
            }
            
            /***** move backwards? *****/
            
            if (newValue < MapLayers.Time.Time ) {
            
                MapLayers.Time.Time = newValue;

                /***** update the hash *****/
                
                MapLayers_Hash_Replace("time", MapLayers.Time.Time);

                /***** now we can go ahead and update the display *****/
                
                MapLayers.Time.Toolbar.Retard( false, true, false );
            
            /***** forward move *****/
            
            } else {

                MapLayers.Time.Time = newValue;

                /***** update the hash *****/
                
                MapLayers_Hash_Replace("time", MapLayers.Time.Time);

                /***** now we can go ahead and update the display *****/
                
                MapLayers.Time.Toolbar.Advance( false, true, false);

            }
        },

        SetEnds: function (begin, end) {

            this.log("SetEnds ( begin, end ) ", begin, end);

            this.Form.set( 'minimum', begin, false );
            this.Form._lastValueReported=null;
            this.Form.set( 'maximum', end, false );
            this.Form._lastValueReported=null;

        },

        Update: function (ts, FromSlider, FromDateTimeBox) {

            this.log("Update(ts, FromSlider, FromDateTimeBox) ", ts, FromSlider, FromDateTimeBox);
            if(!FromSlider) {
                MapLayers.Time.TimeSlider.Form.set("value", ts, false);
            }
        }


    });
});

/*******************************************************************************
 LoopButton object
*******************************************************************************/

require( ['dojo/_base/declare', "dijit/form/ToggleButton"],
         function(declare, ToggleButton) {

    declare("MapLayers.Time._LoopButton", null, {

        Form: null,

        log:  function () {
            if (MapLayers.Settings.debug) {
                //console.log("MapLayers.Time._LoopButton. : ", this, " : ", arguments);
            }
        },

        /***********************************************************************
         constructor
        ***********************************************************************/

        constructor: function (Toolbar) {

            this.log("create");

            this.Form = new ToggleButton({
                label: "Loop",
                showLabel: true,
                checked: false,
                style: "width:7ch;",
                onChange: function(val){
                    MapLayers.Time.LoopState = val

                    /***** update the hash *****/

                    if (val == true || val == false) {
                        MapLayers_Hash_Replace("loop", val);
                    }

                    if (val) {
                        MapLayers.Time.RockButton.Form.set("checked", false);
                    }
                }
            }, "LoopButton");

            Toolbar.addChild(this.Form);
            this.Form.startup();
        },

        /***********************************************************************
         function to init from the url hash
        ***********************************************************************/

        InitFromHash: function () {

            this.log("InitFromHash");

            var state = MapLayers_Hash_Get("loop");
            if ( !state ) loop_state = false;

            this.Form.set('checked', state);
        }
        

    });
});

/*******************************************************************************
 RockButton object
*******************************************************************************/

require( ['dojo/_base/declare', "dijit/form/ToggleButton"],
         function(declare, ToggleButton) {

    declare("MapLayers.Time._RockButton", null, {

        Form: null,

        log:  function () {
            if (MapLayers.Settings.debug) {
                //console.log("MapLayers.Time._RockButton. : ", this, " : ", arguments);
            }
        },

        /***********************************************************************
         constructor
        ***********************************************************************/

        constructor: function (Toolbar) {

            this.log("create");

            this.Form = new ToggleButton({
                label: "Rock",
                showLabel: true,
                checked: false,
                style: "width:7ch;",
                onChange: function(val){
                    MapLayers.Time.RockState = val;

                    /***** update the hash *****/

                    if (val == true || val == false) {
                        MapLayers_Hash_Replace("rock", val);
                    }
                    if (val) {
                        MapLayers.Time.LoopButton.Form.set("checked", false);
                    }
                }
                    
            }, "RockButton");

            Toolbar.addChild(this.Form);
            this.Form.startup();


        },

        /***********************************************************************
         function to init from the url hash
        ***********************************************************************/

        InitFromHash: function () {

            this.log("InitFromHash");

            var state = MapLayers_Hash_Get("rock");
            if ( !state ) state = false;

            this.Form.set('checked', state);
        }

    });
});

/*******************************************************************************
 incrbox object
*******************************************************************************/

require( ['dojo/_base/declare', "dijit/form/ComboBox", "dojo/store/Memory"],
         function(declare, ComboBox, Memory) {

    declare("MapLayers.Time._IncrBox", null, {

        Store: null,
        Form: null,

        log:  function () {
            if (MapLayers.Settings.debug) {
                //console.log("MapLayers.Time._IncrBox. : ", this, " : ", arguments);
            }
        },

        /***********************************************************************
         constructor
        ***********************************************************************/

        constructor: function (Toolbar) {

            this.log("create");

            this.Store = new Memory({
                data: [
                    { name:"Second",     value: 1 * 1 * 1000},
                    { name:"5 Seconds",  value: 5 * 1 * 1000},
                    { name:"10 Seconds", value: 10 * 1 * 1000},
                    { name:"15 Seconds", value: 15 * 1 * 1000},
                    { name:"20 Seconds", value: 20 * 1 * 1000},
                    { name:"30 Seconds", value: 30 * 1 * 1000},
                    { name:"Minute",     value: 1 * 60 * 1000},
                    { name:"5 Minutes",  value: 5 * 60 * 1000},
                    { name:"10 Minutes", value: 10 * 60 * 1000},
                    { name:"15 Minutes", value: 15 * 60 * 1000},
                    { name:"20 Minutes", value: 20 * 60 * 1000},
                    { name:"30 Minutes", value: 30 * 60 * 1000},
                    { name:"Hour",       value: 1 * 60 * 60 * 1000},
                    { name:"2 Hour",     value: 2 * 60 * 60 * 1000},
                    { name:"3 Hour",     value: 3 * 60 * 60 * 1000},
                    { name:"4 Hour",     value: 4 * 60 * 60 * 1000},
                    { name:"6 Hour",     value: 6 * 60 * 60 * 1000},
                    { name:"12 Hour",    value: 12 * 60 * 60 * 1000},
                    { name:"Day",        value: 1 * 60 * 60 * 24 * 1000},
                    { name:"2 Days",     value: 2 * 60 * 60 * 24 * 1000},
                    { name:"4 Days",     value: 4 * 60 * 60 * 24 * 1000},
                    { name:"Week",       value: 1 * 60 * 60 * 24 * 7 * 1000},
                    { name:"2 Weeks",    value: 2 * 60 * 60 * 24 * 7 * 1000},
                    { name:"15 Days",    value: 15 * 60 * 60 * 24 * 1000},
                    { name:"3 Weeks",    value: 2 * 60 * 60 * 24 * 7 * 1000},
                    { name:"4 Weeks",    value: 2 * 60 * 60 * 24 * 7 * 1000},
                    { name:"Month",      value: 1 * 60 * 60 * 24 * 7 * 30 * 1000},
                    { name:"2 Month",    value: 2 * 60 * 60 * 24 * 7 * 30 * 1000},
                    { name:"3 Month",    value: 3 * 60 * 60 * 24 * 7 * 30 * 1000},
                    { name:"6 Month",    value: 6 * 60 * 60 * 24 * 7 * 30 * 1000},
                    { name:"Year",       value: 1 * 60 * 60 * 24 * 7 * 30 * 365 * 1000},
                    { name:"2 Years",    value: 2 * 60 * 60 * 24 * 7 * 30 * 365 * 1000},
                    { name:"5 Years",    value: 5 * 60 * 60 * 24 * 7 * 30 * 365 * 1000},
                    { name:"Decade",     value: 10 * 60 * 60 * 24 * 7 * 30 * 365 * 1000},
                    { name:"2 Decades",  value: 20 * 60 * 60 * 24 * 7 * 30 * 365 * 1000},
                    { name:"5 Decades",  value: 50 * 60 * 60 * 24 * 7 * 30 * 365 * 1000},
                    { name:"Century",    value: 100 * 60 * 60 * 24 * 7 * 30 * 365 * 1000},
                    { name:"2 Centurys", value: 200 * 60 * 60 * 24 * 7 * 30 * 365 * 1000},
                    { name:"5 Centurys", value: 500 * 60 * 60 * 24 * 7 * 30 * 365 * 1000}
                ]
            });

            this.Form = new ComboBox({
                id: "timeincrbox",
                name: "timeincrbox",
                value: "Hour",
                store: this.Store,
                searchAttr: "name",
                labelAttr: "name",
                style: "width:12ch;",
                onChange: this.OnChange
            }, "timeincrbox");

            Toolbar.addChild(this.Form);
            this.Form.startup();
        },

        /***********************************************************************
         function to init from the url hash
        ***********************************************************************/

        InitFromHash: function () {

            this.log("InitFromHash");

            var state = MapLayers_Hash_Get("incr");
            if ( !state ) state = "Hour";
            this.Form.set('value', state);
        },

        /***********************************************************************
         * 
         * @brief callback function for when the time slider changes
         * 
         * 
        ***********************************************************************/

        OnChange: function ( newValue ) {
            
            MapLayers.Time.IncrBox.log("OnChange ( newValue ) ", newValue);
            
            /***** set the new value *****/
            var incr = MapLayers.Time.IncrBox.Store.query({name:newValue})[0];
            
            MapLayers.Time.Incr = incr.value;
            
            /***** update the hash *****/
                
            MapLayers_Hash_Replace("incr", newValue);

            /***** restart the timer with the new speed *****/
            
            if ( MapLayers.Time.Timer ) {
                MapLayers.Time.Toolbar.IntervalPause();
                MapLayers.Time.Toolbar.IntervalPlay();
            }

        }

    });
});

/*******************************************************************************
 SpeedSlider object
*******************************************************************************/

require( ['dojo/_base/declare', "dijit/form/HorizontalSlider"],
         function(declare, HorizontalSlider) {

    declare("MapLayers.Time._SpeedSlider", null, {

        Form: null,

        log:  function () {
            if (MapLayers.Settings.debug) {
                //console.log("MapLayers.Time._SpeedSlider. : ", this, " : ", arguments);
            }
        },

        /***********************************************************************
         constructor
        ***********************************************************************/

        constructor: function (Toolbar) {

            this.log("create");

            this.Form = new HorizontalSlider({
                id: "SpeedSlider",
                value: MapLayers.Time.Speed,
                minimum: 100,
                maximum: 10000,
                intermediateChanges: true, //discreteValues
                style: "width:100px;",
                onChange: this.OnChange
            }, "speedslider");

//FIXME this does not work
            /*MapLayers.Time.TimeSlider_tooltip = new dijit.Tooltip({
                connectId: ["SpeedSlider"],
                label: "Speed Slider"
            });*/

            Toolbar.addChild(this.Form);
            this.Form.startup();

        },

        /***********************************************************************
         function to init from the url hash
        ***********************************************************************/

        InitFromHash: function () {

            this.log("InitFromHash");

            /***** speed slider *****/
            
            var state = MapLayers_Hash_Get("speed");
            if ( !state ) {
                state = MapLayers.Time.Speed;
            } else {
                MapLayers.Time.Speed = state;
            }
            this.Form.set('value', state);
        },

        /***********************************************************************
         * 
         * @brief callback function for when the speed slider changes
         * 
         * 
        ***********************************************************************/

        OnChange: function ( newValue ) {
            
            MapLayers.Time.SpeedSlider.log("OnChange ( newValue ) ", newValue);
            
            /***** set the new value *****/

            MapLayers.Time.Speed = newValue;
            
            /***** restart the timer with the new speed *****/
            
            if ( MapLayers.Time.Timer ) {
                MapLayers.Time.Toolbar.IntervalPause();
                MapLayers.Time.Toolbar.IntervalPlay();
            }

        }

    });
});

/*******************************************************************************
 DateBox object
*******************************************************************************/

require( ['dojo/_base/declare', "dijit/form/DateTextBox"],
         function(declare, DateTextBox) {

    declare("MapLayers.Time._DateBox", null, {

        Form: null,

        log:  function () {
            if (MapLayers.Settings.debug) {
                //console.log("MapLayers.Time._DateBox. : ", this, " : ", arguments);
            }
        },

        /***********************************************************************
         constructor
        ***********************************************************************/

        constructor: function (Toolbar) {

            this.log("create");

            this.Form = new DateTextBox({
                id: "DateBox",
                name: "DateBox",
                style: "width:12ch;",
                onChange: this.OnChange
            }, "DateBox" );

            Toolbar.addChild(this.Form);
            this.Form.startup();
        },

        /***********************************************************************
         function to init from the url hash
        ***********************************************************************/

        InitFromHash: function () {

            this.log("InitFromHash");

            var state = MapLayers_Hash_Get("time");
            if ( !state ) {
                state = 0;
            } else {
                MapLayers.Time.Time = Number(state);
            }
            this.Update(Number(state), false, false);
        },

        /***********************************************************************
         * 
         * @brief callback function for when the date box changes
         * 
         * 
        ***********************************************************************/

        OnChange: function ( newValue ) {
            
            MapLayers.Time.DateBox.log("OnChange ( newValue ) ", newValue);

//FIXME do we need this?
            if (MapLayers.Time.IgnoreSliderChange) return;
            
            /***** stop if playing *****/
            
            if (MapLayers.Time.Timer != null) {
                this.IntervalPause();
            }
            
            /***** get the date value *****/

            var mytime = MapLayers.Time.TimeBox.Form.get('value')

            var time = mytime.getTime();

            newValue.setTime(time)

            var ts = moment(newValue).valueOf();

            if (ts > MapLayers.Time.SliderMaxValue) {
                ts = MapLayers.Time.SliderMaxValue;

                //fixme fix the current time box value
            }

            if (ts < MapLayers.Time.SliderMinValue) {
                ts = MapLayers.Time.SliderMinValue;

                //fixme fix the current time box value

            }

            /***** move backwards? *****/
            
            if (ts < MapLayers.Time.Time ) {
            
                MapLayers.Time.Time = ts;

                /***** update the hash *****/
                
                MapLayers_Hash_Replace("time", MapLayers.Time.Time);

                /***** now we can go ahead and update the display *****/
                
                MapLayers.Time.Toolbar.Retard( false, false, true );
            
            /***** forward move *****/
            
            } else {

                MapLayers.Time.Time = ts;

                /***** update the hash *****/
                
                MapLayers_Hash_Replace("time", MapLayers.Time.Time);

                /***** now we can go ahead and update the display *****/
                
                MapLayers.Time.Toolbar.Advance( false, false, true );

            }
        },

        SetEnds: function ( beg_date, end_date ) {

            this.Form.constraints.min = beg_date.toDate() ;
            this.Form.constraints.max = end_date.toDate() ;
        },

        Update: function (ts, FromSlider, FromDateTimeBox) {
            this.log("Update(ts, FromSlider, FromDateTimeBox) ", ts, FromSlider, FromDateTimeBox);

            MapLayers.Time.TimeSlider.Update(ts, FromSlider, FromDateTimeBox);

            if (!FromDateTimeBox) {
                var date = moment(ts).toDate();

                /***** temp remove the constraints becase its slow *****/

                if ( MapLayers.Time.DateBox.Form.constraints.min != undefined ) {
                    var date_min = MapLayers.Time.DateBox.Form.constraints.min;
                    delete MapLayers.Time.DateBox.Form.constraints.min;
                }
                if ( MapLayers.Time.DateBox.Form.constraints.max != undefined ) {
                    var date_max = MapLayers.Time.DateBox.Form.constraints.max;
                    delete MapLayers.Time.DateBox.Form.constraints.max;
                }

                //console.log("gotcha", date) 
                MapLayers.Time.DateBox.Form.set("value", date, false);

                if ( date_min != undefined ) {
                    MapLayers.Time.DateBox.Form.constraints.min = date_min;
                }
                if ( date_max != undefined ) {
                    MapLayers.Time.DateBox.Form.constraints.max = date_max;
                }

            }

        }

    });
});

/*******************************************************************************
 TimeBox object
*******************************************************************************/

require( ['dojo/_base/declare', "dijit/form/TimeTextBox"],
         function(declare, TimeTextBox) {

    declare("MapLayers.Time._TimeBox", null, {

        Form: null,

        log:  function () {
            if (MapLayers.Settings.debug) {
                //console.log("MapLayers.Time._TimeBox. : ", this, " : ", arguments);
            }
        },

        /***********************************************************************
         constructor
        ***********************************************************************/

        constructor: function (Toolbar) {

            this.log("create");

            this.Form = new TimeTextBox({
                ID: "TimeBox",
                name: "TimeBox",
                style: "width:11ch;",
                onChange: this.OnChange,
                constraints: {
                    timePattern: 'HH:mm:ss'
                }
            });

            Toolbar.addChild(this.Form);
            this.Form.startup();


        },

        /***********************************************************************
         function to init from the url hash
        ***********************************************************************/

        InitFromHash: function () {

            this.log("InitFromHash");

            var state = MapLayers_Hash_Get("time");
            if ( !state ) {
                state = 0;
            } else {
                MapLayers.Time.Time = Number(state);
            }
            this.Update(Number(state), false, false);
        },

        /***********************************************************************
         * 
         * @brief callback function for when the time box changes
         * 
         * 
        ***********************************************************************/

        OnChange: function ( newValue ) {
            
            MapLayers.Time.TimeBox.log("OnChange ( newValue ) ", newValue);
            
            if (MapLayers.Time.IgnoreSliderChange) return;
            

            /***** stop if playing *****/
            
            if (MapLayers.Time.Timer != null) {
                this.IntervalPause();
            }
            

            /***** get the date value *****/

            var mydate = MapLayers.Time.DateBox.Form.get('value')

            var day = mydate.getUTCDate();
            var month = mydate.getUTCMonth();
            var year = mydate.getUTCFullYear();

            newValue.setUTCFullYear(year, month, day);

            var ts = moment(newValue).valueOf();

            if (ts > MapLayers.Time.SliderMaxValue) {
                ts = MapLayers.Time.SliderMaxValue;
            }
            if (ts < MapLayers.Time.SliderMinValue) {
                ts = MapLayers.Time.SliderMinValue;
            }


            /***** move backwards? *****/
            
            if (ts < MapLayers.Time.Time ) {
            
                MapLayers.Time.Time = ts;

                /***** update the hash *****/
                
                MapLayers_Hash_Replace("time", MapLayers.Time.Time);

                /***** now we can go ahead and update the display *****/
                
                MapLayers.Time.Toolbar.Retard( false, false, true );
            
            /***** forward move *****/
            
            } else {

                MapLayers.Time.Time = ts;

                /***** update the hash *****/
                
                MapLayers_Hash_Replace("time", MapLayers.Time.Time);

                /***** now we can go ahead and update the display *****/
                
                MapLayers.Time.Toolbar.Advance( false, false, true );

            }
        },

        SetEnds: function ( beg_date, end_date ) {
            
            this.log("SetEnds ( beg_date, end_date ) ", beg_date, end_date);

           return; 
            if ( moment(MapLayers.Time.Time).isSame( beg_date, "year") 
                 && moment(MapLayers.Time.Time).isSame( beg_date, "month") 
                 && moment(MapLayers.Time.Time).isSame( beg_date, "day")
               ) {
                 var beg_time = beg_date.toDate();
                 MapLayers.Time.TimeBox.constraints.min = beg_time;

                 if ( MapLayers.Time.TimeBox.constraints.max ) {
                    delete MapLayers.Time.TimeBox.constraints.max;
                 }
                 
            } else if ( moment(MapLayers.Time.Time).isSame( end_date, "year") 
                        && moment(MapLayers.Time.Time).isSame( end_date, "month") 
                        && moment(MapLayers.Time.Time).isSame( end_date, "day")
               ) {
                 if ( MapLayers.Time.TimeBox.constraints.min ) {
                    delete MapLayers.Time.TimeBox.constraints.min;
                 }

                 var end_time = end_date.toDate();
                 MapLayers.Time.TimeBox.constraints.max = end_time;

            } else {
                
                 if ( MapLayers.Time.TimeBox.constraints.min ) {
                    delete MapLayers.Time.TimeBox.constraints.min;
                 }

                 if ( MapLayers.Time.TimeBox.constraints.max ) {
                    delete MapLayers.Time.TimeBox.constraints.max;
                 }
            }

        },

        Update: function (ts, FromSlider, FromDateTimeBox) {
            this.log("Update(ts, FromSlider, FromDateTimeBox) ", ts, FromSlider, FromDateTimeBox);

            if (!FromDateTimeBox) {

                var date = moment(ts).toDate();

                if ( MapLayers.Time.TimeBox.Form.constraints.min != undefined ) {
                    var time_min = MapLayers.Time.TimeBox.Form.constraints.min;
                    delete MapLayers.Time.TimeBox.Form.constraints.min;
                }
                if ( MapLayers.Time.TimeBox.Form.constraints.max != undefined ) {
                    var time_max = MapLayers.Time.TimeBox.Form.constraints.max;
                    delete MapLayers.Time.TimeBox.Form.constraints.max;
                }

                MapLayers.Time.TimeBox.Form.set("value", date, false);

                if ( time_min != undefined ) {
                    MapLayers.Time.DateBox.Form.constraints.min = time_min;
                }
                if ( time_max != undefined ) {
                    MapLayers.Time.DateBox.Form.constraints.max = time_max;
                }

            }

        }

    });
});

/*******************************************************************************
 timeslider Toolbar object
*******************************************************************************/

require( ['dojo/_base/declare', "dijit/Toolbar", "dojo/fx/Toggler"],
         function(declare, Toolbar, Toggler) {

    declare("MapLayers.Time._TimeBar", null, {

        Toolbar: null,
        Toggler: null,

        log:  function () {
            if (MapLayers.Settings.debug) {
                //console.log("MapLayers.Time._TimeBar. : ", this, " : ", arguments);
            }
        },

        /***********************************************************************
         constructor
        ***********************************************************************/

        constructor: function () {

            this.log("create");

            this.Toggler = new Toggler({
                node: "TimebarPane",
                showDuration: 1000,
                hideDuration: 1000
            });

            this.Toolbar = new dijit.Toolbar({}, "timebar");

            MapLayers.Time.PlayButton = new MapLayers.Time._PlayButton(this.Toolbar );
            MapLayers.Time.ForwardButton = new MapLayers.Time._ForwardButton(this.Toolbar );
            MapLayers.Time.TimeSlider = new MapLayers.Time._TimeSlider(this.Toolbar );
            MapLayers.Time.LoopButton = new MapLayers.Time._LoopButton(this.Toolbar );
            MapLayers.Time.RockButton = new MapLayers.Time._RockButton(this.Toolbar );
            MapLayers.Time.IncrBox = new MapLayers.Time._IncrBox(this.Toolbar );
            MapLayers.Time.SpeedSlider = new MapLayers.Time._SpeedSlider(this.Toolbar );
            MapLayers.Time.DateBox = new MapLayers.Time._DateBox(this.Toolbar );
            MapLayers.Time.TimeBox = new MapLayers.Time._TimeBox(this.Toolbar );

            this.setVisible(false);

            
            if ( MapLayers.Time.SliderMinValue ) {
                MapLayers.Time.TimeBox.SetEnds ( moment(MapLayers.Time.SliderMinValue),
                                                 moment(MapLayers.Time.SliderMaxValue) );
                this.UpdateToobar(MapLayers.Time.Time, true, false);
            
            }
            

            this.Toolbar.placeAt("TimebarPane");
            this.Toolbar.startup();

        },

        /***********************************************************************
         function to init from the url hash
        ***********************************************************************/

        InitFromHash: function () {

            this.log("InitFromHash");

            MapLayers.Time.PlayButton.InitFromHash();
            MapLayers.Time.ForwardButton.InitFromHash();
            MapLayers.Time.TimeSlider.InitFromHash();
            MapLayers.Time.LoopButton.InitFromHash();
            MapLayers.Time.RockButton.InitFromHash();
            MapLayers.Time.IncrBox.InitFromHash();
            MapLayers.Time.SpeedSlider.InitFromHash();
            MapLayers.Time.DateBox.InitFromHash();
            MapLayers.Time.TimeBox.InitFromHash();

            MapLayers.Time.Toolbar.Init();
        },

        /***********************************************************************
         * 
         * @brief function to hide/show the time slider controlls
         * 
         * 
        ***********************************************************************/

        setVisible: function (bool) {

            this.log("setVisible(bool) ", bool);
            
            if ( bool ) { 
                this.Toggler.show();
            } else {
                this.Toggler.hide();
            }

        },

        UpdateToobar: function (ts, FromSlider, FromDateTimeBox) {
            this.log("UpdateToobar(ts, FromSlider, FromDateTimeBox) ", ts, FromSlider, FromDateTimeBox);

            MapLayers.Time.TimeSlider.Update(ts, FromSlider, FromDateTimeBox);
            MapLayers.Time.DateBox.Update(ts, FromSlider, FromDateTimeBox);
            MapLayers.Time.TimeBox.Update(ts, FromSlider, FromDateTimeBox);

        },


        /******************************************************************************
         * 
         * @brief function to turn off the remaining layers 
         * 
         * 
        ******************************************************************************/

        ExpireRemaining: function() {
            
            //if (MapLayers.Settings.debug)  console.log("ExpireRemaining()");
            
            var node;

            if (MapLayers.Time.BackwardsState) {
            
                for (node = MapLayers.Time.BegCurrentNode ; node ; node = node.prev) {
                    node.data.treenode.Layer_off();
                }
                
            } else {
                
                for (node = MapLayers.Time.EndCurrentNode ; node ; node = node.next) {
                    node.data.treenode.Layer_off();
                }
            }

            if (MapLayers.Time.TSCurrentNode) {
                MapLayers.Time.TSCurrentNode.data.treenode.Layer_off();
            }

        },


        Init: function() {

            this.log("Init()");

            var last_timespan;
            var stop = false;
            var timee = MapLayers.Time.Time;

            var End = MapLayers.Time.EndCurrentNode;
            var Beg = MapLayers.Time.BegCurrentNode;
            var TS = MapLayers.Time.TSCurrentNode;

            while ( ! stop
                    && (
                            ( End && timee >= End.data.timestamp )
                          ||
                            ( Beg && timee >= Beg.data.timestamp )
                          ||
                            ( TS  && timee >= TS.data.timestamp )
                       )
                  ) {

            
                var last_off = null;

                /***** timespans *****/

                if ( End && timee >= End.data.timestamp ) {

                    /***** if there is layers left go ahead and advance *****/

                    if ( End.next ) {
                        MapLayers.Time.EndCurrentNode = End.next;
                        End = MapLayers.Time.EndCurrentNode;
                        
                    /***** no layers left but but still timpstamp *****/
                    /***** layers, just turn our layer off        *****/

                    } else if ( MapLayers.Time.TSList.tail
                                && MapLayers.Time.TSList.tail.data.timestamp
                                   > End.data.timestamp
                              ) {
                        last_off = End.data.treenode.id;

                    /***** there is not timpstamp layers left either  *****/
                    /***** so lets hold this one on and stop the loop *****/

                    } else {
                        stop = true;
                    }
                        
                }

                if ( Beg && timee >= Beg.data.timestamp ) {
                    
                    /***** if there is layers left go ahead and advance *****/

                    if ( (last_off && last_off != Beg.data.treenode.id) ) {
        //fixme                Beg.data.treenode.Layer_on();
                        last_timespan = Beg.data.timestamp;
                    }

                    if ( Beg.next ) {            
                        MapLayers.Time.BegCurrentNode = Beg.next;
                        Beg = MapLayers.Time.BegCurrentNode;

                    /***** no layers left but but still timpstamp layers *****/

                    } else if ( MapLayers.Time.TSList.tail
                                && MapLayers.Time.TSList.tail.data.timestamp
                                   > Beg.data.timestamp
                              ) {

                    /***** there is not timpstamp layers left either stop the loop *****/

                    } else {
                        stop = true;
                    }
                }

                /***** sync the timpstamps in with the time spans          *****/
                /***** if theres no (more?) timespans we can advance       *****/
                /***** or we can advance if the last timespan is also past *****/


                if ( TS && timee >= TS.data.timestamp 
                     && ( ! Beg || TS.data.timestamp >= last_timespan )

                   ) {

                    /***** if there is layers left go ahead and advance *****/

                    if ( TS.next ) {
                        MapLayers.Time.TSCurrentNode = TS.next;
                        TS = MapLayers.Time.TSCurrentNode;
        //fixme                TS.data.treenode.Layer_on();

                    /***** there is not timespan layers left either   *****/
                    /***** so lets hold this one on and stop the loop *****/

                    } else {
                        stop = true;
                    }
                }
            }

            if (Beg) Beg.data.treenode.Layer_on();
            if (TS) TS.data.treenode.Layer_on();

        },


        /******************************************************************************
         * 
         * @brief function go forward though the layers to turn on/off layers for the current timeslider value
         * 
        ******************************************************************************/

        Advance: function( fromaddnode, FromSlider, FromDateTimeBox ) {

            this.log("Advance()");

            var last_timespan;
            var stop = false;
            var timee = MapLayers.Time.Time;

            var End = MapLayers.Time.EndCurrentNode;
            var Beg = MapLayers.Time.BegCurrentNode;
            var TS = MapLayers.Time.TSCurrentNode;

            while ( ! stop
                    && (
                            ( End && timee >= End.data.timestamp )
                          ||
                            ( Beg && timee >= Beg.data.timestamp )
                          ||
                            ( TS  && timee >= TS.data.timestamp )
                       )
                  ) {

            
                var last_off = null;

                /***** timespans *****/

                if ( End && timee >= End.data.timestamp ) {

                    /***** if there is layers left go ahead and advance *****/

                    if ( End.next ) {
                        End.data.treenode.Layer_off();
                        last_off = End.data.treenode.id;

                        MapLayers.Time.EndCurrentNode = End.next;
                        End = MapLayers.Time.EndCurrentNode;
                        
                    /***** no layers left but but still timpstamp *****/
                    /***** layers, just turn our layer off        *****/

                    } else if ( MapLayers.Time.TSList.tail
                                && MapLayers.Time.TSList.tail.data.timestamp
                                   > End.data.timestamp
                              ) {
                        End.data.treenode.Layer_off();
                        last_off = End.data.treenode.id;

                    /***** there is not timpstamp layers left either  *****/
                    /***** so lets hold this one on and stop the loop *****/

                    } else {
                        stop = true;
                    }
                        
                }

                if ( Beg && timee >= Beg.data.timestamp ) {
                    
                    /***** if there is layers left go ahead and advance *****/

                    if (fromaddnode || (last_off && last_off != Beg.data.treenode.id) ) {
                        Beg.data.treenode.Layer_on();
                        MapLayers.Time.Toolbar.UpdateToobar( Beg.data.timestamp,
                                                     FromSlider,
                                                     FromDateTimeBox);
                        last_timespan = Beg.data.timestamp;
                    }

                    if ( Beg.next ) {            
                        MapLayers.Time.BegCurrentNode = Beg.next;
                        Beg = MapLayers.Time.BegCurrentNode;

                    /***** no layers left but but still timpstamp layers *****/

                    } else if ( MapLayers.Time.TSList.tail
                                && MapLayers.Time.TSList.tail.data.timestamp
                                   > Beg.data.timestamp
                              ) {

                    /***** there is not timpstamp layers left either stop the loop *****/

                    } else {
                        stop = true;
                    }
                }

                /***** sync the timpstamps in with the time spans          *****/
                /***** if theres no (more?) timespans we can advance       *****/
                /***** or we can advance if the last timespan is also past *****/


                if ( TS && timee >= TS.data.timestamp 
                     && ( ! Beg || TS.data.timestamp >= last_timespan )

                   ) {

                    /***** if there is layers left go ahead and advance *****/

                    if ( TS.next ) {
                        TS.data.treenode.Layer_off();
                        MapLayers.Time.TSCurrentNode = TS.next;
                        TS = MapLayers.Time.TSCurrentNode;
                        TS.data.treenode.Layer_on();
                        MapLayers.Time.Toolbar.UpdateToobar( TS.data.timestamp,
                                                     FromSlider,
                                                     FromDateTimeBox);

                    /***** no layers left but but still timespan *****/
                    /***** layers, just turn our layer off       *****/

                    } else if ( MapLayers.Time.EndList.tail
                                && MapLayers.Time.EndList.tail.data.timestamp
                                   > MapLayers.Time.TSCurrentNode.data.timestamp
                              ) {
                       TS.data.treenode.Layer_off();

                    /***** there is not timespan layers left either   *****/
                    /***** so lets hold this one on and stop the loop *****/

                    } else {
                        stop = true;
                    }
                }
            }

            MapLayers.Time.TimeBox.SetEnds ( moment(MapLayers.Time.SliderMinValue),
                                             moment(MapLayers.Time.SliderMaxValue) );

        },

        /******************************************************************************
         * 
         * @brief function go backwards though the layers to turn on/off layes for
         * the current timestamp
         * 
        ******************************************************************************/

        Retard: function( fromaddnode, FromSlider, FromDateTimeBox) {

            this.log("Retard()");

            var last_timespan;
            var stop = false;
            var timee = MapLayers.Time.Time;

            var End = MapLayers.Time.EndCurrentNode;
            var Beg = MapLayers.Time.BegCurrentNode;
            var TS = MapLayers.Time.TSCurrentNode;

            while ( ! stop
                    && (
                            ( End && timee <= End.data.timestamp )
                          ||
                            ( Beg && timee <= Beg.data.timestamp )
                          ||
                            ( TS  && timee <= TS.data.timestamp )
                       )
                  ) {
                
                var last_off = null;

                /***** timespans *****/

                if ( Beg && timee <= Beg.data.timestamp ) {

                    /***** if there is layers left go ahead and advance *****/

                    if ( Beg.prev ) {
                        Beg.data.treenode.Layer_off();
                        last_off = Beg.data.treenode.id;

                        MapLayers.Time.BegCurrentNode = Beg.prev;
                        Beg = MapLayers.Time.BegCurrentNode;

                    /***** no layers left but but still timpstamp *****/
                    /***** layers, just turn our layer off        *****/

                    } else if ( MapLayers.Time.TSList.tail
                                && MapLayers.Time.TSList.tail.data.timestamp
                                   < Beg.data.timestamp
                              ) {
                        Beg.data.treenode.Layer_off();
                        last_off = Beg.data.treenode.id;

                    /***** there is not timpstamp layers left either  *****/
                    /***** so lets hold this one on and stop the loop *****/

                    } else {
                        stop = true;
                    }
                        
                }

                if ( End && timee <= End.data.timestamp ) {
                    
                    /***** if there is layers left go ahead and advance *****/

                    if (fromaddnode || (last_off && last_off != End.data.treenode.id) ) {
                        End.data.treenode.Layer_on();
                        MapLayers.Time.Toolbar.UpdateToobar( End.data.timestamp,
                                                     FromSlider,
                                                     FromDateTimeBox);
                        last_timespan = End.data.timestamp;
                    }

                    if (End.prev) {
                        MapLayers.Time.EndCurrentNode = End.prev;
                        End = MapLayers.Time.EndCurrentNode;

                    /***** no layers left but but still timpstamp layers *****/

                    } else if ( MapLayers.Time.TSList.tail
                                && MapLayers.Time.TSList.tail.data.timestamp
                                   < End.data.timestamp
                              ) {

                    /***** there is not timpstamp layers left either stop the loop *****/

                    } else {
                        stop = true;
                    }
                }

                /***** sync the timpstamps in with the time spans          *****/
                /***** if theres no (more?) timespans we can advance       *****/
                /***** or we can advance if the last timespan is also past *****/


                if ( TS && timee <= TS.data.timestamp 
                     && ( ! Beg || TS.data.timestamp >= last_timespan )

                   ) {

                    /***** if there is layers left go ahead and advance *****/

                    if ( TS.prev ) {
                        TS.data.treenode.Layer_off();
                        MapLayers.Time.TSCurrentNode = TS.prev;
                        TS = MapLayers.Time.TSCurrentNode;
                        TS.data.treenode.Layer_on();
                        MapLayers.Time.Toolbar.UpdateToobar( TS.data.timestamp,
                                                     FromSlider,
                                                     FromDateTimeBox);

                    /***** no layers left but but still timespan *****/
                    /***** layers, just turn our layer off       *****/

                    } else if ( MapLayers.Time.BegList.tail
                                && MapLayers.Time.BegList.tail.data.timestamp
                                   < MapLayers.Time.TSCurrentNode.data.timestamp
                              ) {
                       TS.data.treenode.Layer_off();

                    /***** there is not timespan layers left either   *****/
                    /***** so lets hold this one on and stop the loop *****/

                    } else {
                        stop = true;
                    }
                }
            }

            MapLayers.Time.TimeBox.SetEnds ( moment(MapLayers.Time.SliderMinValue),
                                             moment(MapLayers.Time.SliderMaxValue) );

        },







        /******************************************************************************
         * 
         * @brief function to update the animation with the timer
         * 
         * 
        ******************************************************************************/

        /***** fixme this only works on timespans not timestamps *****/

        IntervalUpdate: function() {

            MapLayers.Time.Toolbar.log("IntervalUpdate() ");

            var stopped = false;
            var looped = false;
            var node = null;
           
            var incr = MapLayers.Time.Incr;
            
            var lastvalue = MapLayers.Time.Time;


            /***** are we going backwards? *****/

            if (MapLayers.Time.BackwardsState) {
                MapLayers.Time.Time = lastvalue - incr;

                /***** past the begining? *****/

                if (MapLayers.Time.Time <= MapLayers.Time.SliderMinValue ) {
                
                    /***** is the loop or rock button pressed *****/
                    
                    if ( MapLayers.Time.LoopState && ! MapLayers.Time.RockState ) {
                        MapLayers.Time.Toolbar.IntervalPause();
                        stopped = true
                    }
                    
                    /***** rock? *****/
                        //fixme if were rocking should we still wait a cycle to incr?

                    if (MapLayers.Time.RockState) {
                        MapLayers.Time.Time = MapLayers.Time.SliderMinValue;
                        MapLayers.Time.BackwardsState = false;
                        MapLayers.Time.ForwardButton.Form.set("checked", true);

                        MapLayers.Time.BegCurrentNode = MapLayers.Time.BegList.head;
                        MapLayers.Time.EndCurrentNode = MapLayers.Time.EndList.head;
                        MapLayers.Time.tsCurrentNode = MapLayers.Time.TSList.head;

                    /***** loop *****/

                    } else {
                        MapLayers.Time.Time = MapLayers.Time.SliderMaxValue;
                        MapLayers.Time.Toolbar.ExpireRemaining();
            
                        MapLayers.Time.BegCurrentNode = MapLayers.Time.BegList.tail;
                        MapLayers.Time.EndCurrentNode = MapLayers.Time.EndList.tail;
                        MapLayers.Time.TSCurrentNode = MapLayers.Time.TSList.tail;
                    }

                }

            /***** were going forwards *****/

            } else {
                MapLayers.Time.Time = lastvalue + incr;
                
                /***** past the end time? *****/

                if (MapLayers.Time.Time >= MapLayers.Time.SliderMaxValue ) {
                    
                    /***** is the loop or rock button pressed *****/
                    
                    if ( ! MapLayers.Time.LoopState && ! MapLayers.Time.RockState ) {
                        MapLayers.Time.Toolbar.IntervalPause();
                        stopped = true
                    }
                    
                    /***** rock? *****/
                        //fixme if were rocking should we still wait a cyckle to incr?

                    if (MapLayers.Time.RockState) {
                        MapLayers.Time.Time = MapLayers.Time.SliderMaxValue;
                        MapLayers.Time.BackwardsState = true;
                        MapLayers.Time.ForwardButton.Form.set("checked", false);

                        MapLayers.Time.BegCurrentNode = MapLayers.Time.BegList.tail;
                        MapLayers.Time.EndCurrentNode = MapLayers.Time.EndList.tail;
                        MapLayers.Time.TSCurrentNode = MapLayers.Time.TSList.tail;

                    /***** loop *****/

                    } else {
                        MapLayers.Time.Time = MapLayers.Time.SliderMinValue;
                        MapLayers.Time.Toolbar.ExpireRemaining();
                
                        MapLayers.Time.BegCurrentNode = MapLayers.Time.BegList.head;
                        MapLayers.Time.EndCurrentNode = MapLayers.Time.EndList.head;
                        MapLayers.Time.TSCurrentNode = MapLayers.Time.TSList.head;
                        // is this suposed to be here i forgot why
                        MapLayers.Time.Toolbar.Advance(true, false, false);
                    }
                }
            }

            /***** update the time slider *****/

            //MapLayers.Time.TimeSlider.set("value", MapLayers.Time.Time, false);

            //MapLayers.Time.TimeSlider._lastValueReported=null;

            /***** update the hash *****/
            
            MapLayers_Hash_Replace("time", MapLayers.Time.Time);
            
            /***** update the display *****/
            
            if (MapLayers.Time.BackwardsState) {
                MapLayers.Time.Toolbar.Retard(false, false, false);
            } else {
                MapLayers.Time.Toolbar.Advance(false, false, false);
            }
            
        },

        /******************************************************************************
         * 
         * @brief function to start the animation
         * 
        ******************************************************************************/

        IntervalPlay: function() {
            
            MapLayers.Time.Toolbar.log("IntervalPlay()");
            
            MapLayers.Time.FirstPlayState = true;
            
            if (MapLayers.Time.Timer == null) {
                
                MapLayers.Time.Timer = setInterval( MapLayers.Time.Toolbar.IntervalUpdate ,
                                                    MapLayers.Time.Speed);
                                                   
                MapLayers.Time.PlayButton.Form.set('label', 'Pause');
                MapLayers.Time.TimeSlider.Form.set("intermediateChanges", false); // this helps prevent the onchange event from fireing
                MapLayers.Time.PlayButton.Form.set( 'onClick', MapLayers.Time.Toolbar.IntervalPause);
                //MapLayers_Hash_Replace("play", true);
            }
            
        },

        /******************************************************************************
         * 
         * @brief function to stop the animation
         * 
        ******************************************************************************/

        IntervalPause: function() {
            
            MapLayers.Time.Toolbar.log("IntervalPause()");
            
            if (MapLayers.Time.Timer != null) {
                clearInterval(MapLayers.Time.Timer);
                MapLayers.Time.Timer = null;
                
                MapLayers.Time.PlayButton.Form.set('label', ' Play'); 
                MapLayers.Time.TimeSlider.Form.set("intermediateChanges", true); // this helps prevent the onchange event from fireing
                MapLayers.Time.PlayButton.Form.set( 'onClick', MapLayers.Time.Toolbar.IntervalPlay);
                MapLayers_Hash_Replace("play", "");
            }
            
        },

        /******************************************************************************
         * 
         * @brief function to set the ends of the timeslider
         * 
         * @param begin
         * @param end
         * 
         * 
        ******************************************************************************/


        SetEndsSub: function(begin, end) {

            if (MapLayers.Time.Toolbar) {

                MapLayers.Time.TimeSlider.SetEnds(begin, end);

                var beg_date = moment(begin);
                var end_date = moment(end);

                MapLayers.Time.DateBox.SetEnds ( beg_date, end_date );
                MapLayers.Time.TimeBox.SetEnds ( beg_date, end_date );
            }
        },

         SetEnds: function(begin, end) {
                
            this.log("SetEnds(begin, end)", begin, end);
            
            MapLayers.Time.IgnoreSliderChange = true;
            
            
            /***** update the time slider *****/
            
            if (MapLayers.Time.SliderMinValue == null) {
                MapLayers.Time.SliderMinValue = begin;
                MapLayers.Time.SliderMaxValue = end;
            
                if (!MapLayers.Time.FirstPlayState && ! MapLayers.Time.TimeSlider.GetHash()) {
                
                /***** update the time slider value *****/
                
                    MapLayers.Time.Time = MapLayers.Time.SliderMinValue;
                }

                this.SetEndsSub( MapLayers.Time.SliderMinValue,
                                            MapLayers.Time.SliderMaxValue );

                /***** make the ui visible *****/
                
                MapLayers.Time.Toolbar.setVisible(true);
                    
            }
            
            else {
                MapLayers.Time.SliderMinValue = MIN ( begin,
                                                     MapLayers.Time.SliderMinValue
                                                   );
                MapLayers.Time.SliderMaxValue = MAX ( end,
                                                     MapLayers.Time.SliderMaxValue
                                                   );
                this.SetEndsSub( MapLayers.Time.SliderMinValue,
                                            MapLayers.Time.SliderMaxValue );

            }
            
            if (!MapLayers.Time.FirstPlayState) {
                
                /***** update the time slider value *****/
                
                MapLayers.Time.Time = MapLayers.Time.SliderMinValue;
                last= MapLayers.Time.TimeSlider.Form.get("intermediateChanges")


                MapLayers.Time.TimeSlider.Form.set("intermediateChanges", false); // this helps prevent the onchange event from fireing
                MapLayers.Time.Toolbar.UpdateToobar( MapLayers.Time.Time,
                                             false,
                                             false);

                MapLayers.Time.TimeSlider.Form.set("intermediateChanges", last); // this helps prevent the onchange event from fireing
                MapLayers.Time.TimeSlider.Form._lastValueReported=null;
                MapLayers.Time.TSCurrentNode = MapLayers.Time.TSList.head;
                MapLayers.Time.BegCurrentNode = MapLayers.Time.BegList.head;
                MapLayers.Time.EndCurrentNode = MapLayers.Time.EndList.head;
            }
            
            
            MapLayers.Time.IgnoreSliderChange = false;
        },

        /******************************************************************************
         * 
         * 
         * 
         * 
        ******************************************************************************/

        //fixme this is slow mo, use a circular list and test the dir to go


        InsertNodeBefore: function(list, newnode, ts) {

            var node;

            /***** sort the list by begin time on insert *****/
            
            for (node = list.head; node ; node = node.next) {
                if (ts < node.data.timestamp) {
                    node = DLList_insert_before ( list, node, newnode );
                    break;
                }
            }
            
            /***** if node is null there was no insert      *****/
            /***** either the list was empty or the         *****/
            /***** begin time is greater than the last node *****/
            
            if (!node) {
                DLList_append(list, newnode);
            }
        },
             
        /******************************************************************************
         * 
         * @brief function to add a layer to be animated
         * 
         * @param treenode        the ext layer tree node to add
         * 
         * @returns nothing
         * 
        ******************************************************************************/

        /***** fixme we need to see if they need turned on when the nodes are added *****/

         AddNode: function(treenode) {

            this.log("AddNode(treenode)", treenode);
            
            var timestamp = null;
            var begin = null;
            var end = null;
            var node = null;
            MapLayers.Time.Toolbar.setVisible(true)
            
            //treenode.layer.setVisibility(true);
            
            /***** turn off the transition effect *****/

            treenode.layer.transitionEffect = null;

            /***** is it a timestamp? *****/
            
            if (treenode.timestamp != null) {
                
                /***** convert the timestamp to an int *****/
                
                timestamp = moment( treenode.timestamp ).valueOf();
                
                /***** create a new time node *****/
                
                var newnode = new MapLayers_Time_Node( treenode, timestamp);
                
                this.InsertNodeBefore(MapLayers.Time.TSList, newnode, timestamp);

                /***** update the time slider *****/
                
                this.SetEnds( MapLayers.Time.TSList.head.data.timestamp,
                                       MapLayers.Time.TSList.tail.data.timestamp
                                    );
                
            }
            
            /***** timespan *****/
            
            else if (treenode.begin_timespan != null && treenode.end_timespan != null ) {
                begin = moment( treenode.begin_timespan ).valueOf();
                end = moment( treenode.end_timespan ).valueOf();
                
                /***** begin list *****/
                
                var newnode = new MapLayers_Time_Node( treenode, begin);
                
                this.InsertNodeBefore(MapLayers.Time.BegList, newnode, begin);
                
                /***** end list ******/

                newnode = new MapLayers_Time_Node( treenode, end);
                
                this.InsertNodeBefore(MapLayers.Time.EndList, newnode, end);
                
                /***** update the time slider *****/
                
                this.SetEnds( MapLayers.Time.BegList.head.data.timestamp,
                                       MapLayers.Time.EndList.tail.data.timestamp
                                    );
                
            }

            /***** we need to update the screen but not every time a node is added *****/
            /***** this timer should only expire after all the nodes are added     *****/


            if (MapLayers.Time.UpdateTimer) {
                window.clearInterval(MapLayers.Time.UpdateTimer);
            }
            MapLayers.Time.UpdateTimer = setInterval(
                function () {
                    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_addnode timer ", MapLayers.Time.Time);
                    window.clearInterval(MapLayers.Time.UpdateTimer);
                    MapLayers.Time.UpdateTimer = null;
                    MapLayers.Time.Toolbar.Advance( true, false, false);
                },
                5000
            );
            
        },

        /******************************************************************************
         * 
         * 
         * 
         * 
        ******************************************************************************/

        RemoveNodeSub: function (list, treenode) {

            
            /***** TURN OFF THE VIS *****/
            
            treenode.Layer_off();

            var node;
            for (node = list.head; node ; node = next) {
                next = node.next;
                if (treenode.id == node.data.treenode.id) {
                    DLList_delete(list, node);
                    break;
                }
            }

            
            return node;
        },

        RemoveNode: function(treenode) {
            
            this.log("RemoveNode(treenode)", treenode);
            
            var node = null;
            var bext = null;
            var found = 0;

            /***** stop if playing *****/
            
            if (MapLayers.Time.Timer != null) {
                this.IntervalPause();
            }

            /***** is it a timestamp? *****/
            
            if (treenode.timestamp != null) {
                
                node = this.RemoveNodeSub(TSList, treenode);
                
                if ( MapLayers.Time.TSCurrentNode
                     && MapLayers.Time.TSCurrentNode.data.treenode.id == node.data.treenode.id
                   ) {
                    MapLayers.Time.TSCurrentNode = null;
                }

                /***** update the time slider *****/
                
                if (MapLayers.Time.TSList.head) {
                    this.SetEnds( MapLayers.Time.TSList.head.data.timestamp,
                                           MapLayers.Time.TSList.tail.data.timestamp
                                        );
                }    
            }
            
            /***** timespan *****/
            
            else if (treenode.begin_timespan != null && treenode.end_timespan != null ) {
                
                node = MapLayers_Time_removenode_sub(MapLayers.Time.BegList, treenode);
                if ( MapLayers.Time.BegCurrentNode
                     && MapLayers.Time.BegCurrentNode.data.treenode.id == node.data.treenode.id
                   ) {
                    MapLayers.Time.BegCurrentNode = null;
                }

                node = MapLayers_Time_removenode_sub(MapLayers.Time.EndList, treenode);
                if ( MapLayers.Time.EndCurrentNode
                     && MapLayers.Time.EndCurrentNode.data.treenode.id == node.data.treenode.id
                   ) {
                    MapLayers.Time.EndCurrentNode = null;
                }

                
                /***** update the time slider *****/
                
                if (MapLayers.Time.BegList.head) {
                    this.SetEnds( MapLayers.Time.BegList.head.data.timestamp,
                                           MapLayers.Time.EndList.tail.data.timestamp
                                        );
                }
            }
            
            /***** hide the ui when there is no more nodes *****/
            
            if ( MapLayers.Time.TSList.head == null &&
                 MapLayers.Time.BegList.head == null
            ) {
                MapLayers.Time.Toolbar.setVisible(false);
            }
            
        },

    });    
});  

/*******************************************************************************
 wrap the oop stuff function to create the toolbar for the timeslider
*******************************************************************************/

function MapLayers_Time_CreateSlider() {

MapLayers.Time.
Toolbar = new MapLayers.Time._TimeBar();

}

