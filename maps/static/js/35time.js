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
dojo.require("dijit/form/HorizontalSlider");
dojo.require("dijit/form/ToggleButton");
dojo.require("dijit/form/Button");
dojo.require("dijit.Toolbar");
dojo.require("dojo/store/Memory");
dojo.require("dijit/form/ComboBox");
//dojo.require("dojo/dom-style");
dojo.require("dojo/fx/Toggler");
dojo.require("dijit/form/DateTextBox");
dojo.require("dijit/form/TimeTextBox");
dojo.require("dijit/Tooltip");

dojo.ready(function() {

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

    require(["dojo/fx/Toggler"], function(Toggler) {

        MapLayers.Time.hidetoggler = new Toggler({
            node: "TimebarPane",
            showDuration: 1000,
            hideDuration: 1000
        });
    });    
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
 function to create the playbutton for the timeslider
*******************************************************************************/

function MapLayers_Time_CreatePlayButton() {

    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_CreatePlayButton()");

    /***** play/pause button *****/
    
    MapLayers.Time.PlayButton = new dijit.form.Button({
        label: "Play",
        showLabel: true,
        style: "width:6ch;",
        onClick: MapLayers_Time_Interval_Play
    }, "PlayButton");

    MapLayers.Time.Toolbar.addChild(MapLayers.Time.PlayButton);
    MapLayers.Time.PlayButton.startup();
}

/*******************************************************************************
 function to create the forward button for the timeslider
*******************************************************************************/

function MapLayers_Time_CreateForwardButton() {

    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_CreateForwardButton()");

    /***** forward button *****/

    var fwd_state = MapLayers_Hash_Get("forward");
    if ( !fwd_state ) fwd_state = false;

    MapLayers.Time.ForwardButton = new dijit.form.ToggleButton({
        label: "Fwd",
        showLabel: true,
        checked: fwd_state,
        style: "width:6ch;",
        onChange: function(val){

            /***** update the hash *****/

            MapLayers_Hash_Replace("forward", val);

            MapLayers.Time.BackwardsState = !val;
        }
    }, "ForwardButton");

    MapLayers.Time.Toolbar.addChild(MapLayers.Time.ForwardButton);
    MapLayers.Time.ForwardButton.startup();
}

/*******************************************************************************
 function to create the time slider for the timeslider
*******************************************************************************/

function MapLayers_Time_CreateTimeSlider() {

    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_CreateTimeSlider()");

    /***** time slider *****/
    
    var slider_min = 0;
    if ( MapLayers.Time.SliderMinValue ) {
        slider_min = MapLayers.Time.SliderMinValue;
    }

    var slider_max = 50;
    if ( MapLayers.Time.SliderMaxValue ) {
        slider_max = MapLayers.Time.SliderMaxValue;
    }

    var TimeSlider_state = MapLayers_Hash_Get("time");
    if ( !TimeSlider_state ) {
        TimeSlider_state = 0;
    } else {
        MapLayers.Time.Time = TimeSlider_state;
    }

    MapLayers.Time.TimeSlider = new dijit.form.HorizontalSlider({
        id: "TimeSlider",
        value: TimeSlider_state,
        minimum: slider_min,
        maximum: slider_max,
        intermediateChanges: true, //discreteValues
        style: "width:200px;",
        onChange: MapLayers_Time_TimeSlider_change
    }, "timeslider");

    MapLayers.Time.TimeSlider_tooltip = new dijit.Tooltip({
        connectId: ["TimeSlider"],
        label: "Time Slider"
    });

    MapLayers.Time.Toolbar.addChild(MapLayers.Time.TimeSlider);
    MapLayers.Time.TimeSlider.startup();
}

/******************************************************************************
 * 
 * @brief callback function for when the time slider changes
 * 
 * 
******************************************************************************/

function MapLayers_Time_TimeSlider_change( newValue ) {
    
    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_TimeSlider_change( newValue)", newValue);
    
    if (MapLayers.Time.IgnoreSliderChange) return;
    

    /***** stop if playing *****/
    
    if (MapLayers.Time.Timer != null) {
        MapLayers_Time_Interval_Pause();
    }
    
    /***** move backwards? *****/
    
    if (newValue < MapLayers.Time.Time ) {
    
        MapLayers.Time.Time = newValue;

        /***** update the hash *****/
        
        MapLayers_Hash_Replace("timeslider", MapLayers.Time.Time);

        /***** now we can go ahead and update the display *****/
        
        MapLayers_Time_Retard( false, true, false );
    
    /***** forward move *****/
    
    } else {

        MapLayers.Time.Time = newValue;

        /***** update the hash *****/
        
        MapLayers_Hash_Replace("timeslider", MapLayers.Time.Time);

        /***** now we can go ahead and update the display *****/
        
        MapLayers_Time_Advance( false, true, false);

    }
}

/*******************************************************************************
 function to create the loop button for the timeslider
*******************************************************************************/

function MapLayers_Time_CreateLoopButton() {

    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_CreateLoopButton()");

    /***** loop button *****/

    var loop_state = MapLayers_Hash_Get("loop");
    if ( !loop_state ) loop_state = false;

    MapLayers.Time.LoopButton = new dijit.form.ToggleButton({
        label: "Loop",
        showLabel: true,
        checked: loop_state,
        style: "width:7ch;",
        onChange: function(val){
            MapLayers.Time.LoopState = val

            /***** update the hash *****/

            MapLayers_Hash_Replace("loop", val);

            if (val) {
                MapLayers.Time.RockButton.set("checked", false);
            }
        }
    }, "LoopButton");

    MapLayers.Time.Toolbar.addChild(MapLayers.Time.LoopButton);
    MapLayers.Time.LoopButton.startup();
}


/*******************************************************************************
 function to create the rock button for the timeslider
*******************************************************************************/

function MapLayers_Time_CreateRockButton() {

    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_CreateRockButton()");

    /***** rock button *****/

    var rock_state = MapLayers_Hash_Get("rock");
    if ( !rock_state ) rock_state = false;

    MapLayers.Time.RockButton = new dijit.form.ToggleButton({
        label: "Rock",
        showLabel: true,
        checked: rock_state,
        style: "width:7ch;",
        onChange: function(val){
            MapLayers.Time.RockState = val
            /***** update the hash *****/

            MapLayers_Hash_Replace("rock", val);

            if (val) {
                MapLayers.Time.LoopButton.set("checked", false);
            }
        }
            
    }, "RockButton");

    MapLayers.Time.Toolbar.addChild(MapLayers.Time.RockButton);
    MapLayers.Time.RockButton.startup();


}

/*******************************************************************************
 function to create the increment chooser for the timeslider
*******************************************************************************/

function MapLayers_Time_CreateIncrBox() {

    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_CreateIncrBox()");

    /***** increment chooser *****/
    
    MapLayers.Time.IncrStore = new dojo.store.Memory({
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

    var IncrBox_state = MapLayers_Hash_Get("incr");
    if ( !IncrBox_state ) IncrBox_state = "Hour";

    MapLayers.Time.IncrBox = new dijit.form.ComboBox({
        id: "timeincrbox",
        name: "timeincrbox",
        value: IncrBox_state,
        store: MapLayers.Time.IncrStore,
        searchAttr: "name",
        labelAttr: "name",
        style: "width:12ch;",
        onChange: MapLayers_Time_IncrBox_change
    }, "timeincrbox");

    MapLayers.Time.Toolbar.addChild(MapLayers.Time.IncrBox);
    MapLayers.Time.IncrBox.startup();
}

/******************************************************************************
 * 
 * @brief callback function for when the time slider changes
 * 
 * 
******************************************************************************/

function MapLayers_Time_IncrBox_change( newValue ) {
    
    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_IncrBox_change( newValue )", newValue );
    
    /***** set the new value *****/
    var incr = MapLayers.Time.IncrStore.query({name:newValue})[0];
    
    MapLayers.Time.Incr = incr.value;
    
    /***** update the hash *****/
        
    MapLayers_Hash_Replace("incr", newValue);

    /***** restart the timer with the new speed *****/
    
    if ( MapLayers.Time.Timer ) {
        MapLayers_Time_Interval_Pause();
        MapLayers_Time_Interval_Play();
    }

}

/*******************************************************************************
 function to create the speed slider for the timeslider
*******************************************************************************/

function MapLayers_Time_CreateSpeedSlider() {

    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_CreateSpeedSlider()");

    /***** speed slider *****/
    
    var SpeedSlider_state = MapLayers_Hash_Get("speed");
    if ( !SpeedSlider_state ) {
        SpeedSlider_state = MapLayers.Time.Speed;
    } else {
        MapLayers.Time.Speed = SpeedSlider_state;
    }

    MapLayers.Time.SpeedSlider = new dijit.form.HorizontalSlider({
        id: "SpeedSlider",
        value: SpeedSlider_state,
        minimum: 100,
        maximum: 10000,
        intermediateChanges: true, //discreteValues
        style: "width:100px;",
        onChange: MapLayers_Time_SpeedSlider_change
    }, "speedslider");

    MapLayers.Time.TimeSlider_tooltip = new dijit.Tooltip({
        connectId: ["SpeedSlider"],
        label: "Speed Slider"
    });

    MapLayers.Time.Toolbar.addChild(MapLayers.Time.SpeedSlider);
    MapLayers.Time.SpeedSlider.startup();

}

/******************************************************************************
 * 
 * @brief callback function for when the speed slider changes
 * 
 * 
******************************************************************************/

function MapLayers_Time_SpeedSlider_change( newValue ) {
    
    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_SpeedSlider_change( newValue )",newValue);
    
    /***** set the new value *****/

    MapLayers.Time.Speed = newValue;
    
    /***** restart the timer with the new speed *****/
    
    if ( MapLayers.Time.Timer ) {
        MapLayers_Time_Interval_Pause();
        MapLayers_Time_Interval_Play();
    }

}

/*******************************************************************************
 function to create the date box for the timeslider
*******************************************************************************/

function MapLayers_Time_CreateDateBox() {

    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_CreateDateBox()");

    /***** date box *****/

    MapLayers.Time.DateBox = new dijit.form.DateTextBox({
        id: "DateBox",
        name: "DateBox",
        style: "width:12ch;",
        onChange: MapLayers_Time_DateBox_change
    }, "DateBox" );

    MapLayers.Time.Toolbar.addChild(MapLayers.Time.DateBox);
    MapLayers.Time.DateBox.startup();
}

/******************************************************************************
 * 
 * @brief callback function for when the date box changes
 * 
 * 
******************************************************************************/

function MapLayers_Time_DateBox_change( newValue ) {
    
    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_DateBox_change( newValue)", newValue);
    
    if (MapLayers.Time.IgnoreSliderChange) return;
    

    /***** stop if playing *****/
    
    if (MapLayers.Time.Timer != null) {
        MapLayers_Time_Interval_Pause();
    }
    
    /***** get the date value *****/

    var mytime = MapLayers.Time.TimeBox.get('value')

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
        
        MapLayers_Hash_Replace("timeslider", MapLayers.Time.Time);

        /***** now we can go ahead and update the display *****/
        
        MapLayers_Time_Retard( false, false, true );
    
    /***** forward move *****/
    
    } else {

        MapLayers.Time.Time = ts;

        /***** update the hash *****/
        
        MapLayers_Hash_Replace("timeslider", MapLayers.Time.Time);

        /***** now we can go ahead and update the display *****/
        
        MapLayers_Time_Advance( false, false, true );

    }
}



/*******************************************************************************
 function to create the time box for the timeslider
*******************************************************************************/

function MapLayers_Time_CreateTimeBox() {

    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_CreateTimeBox()");

    /***** time box *****/

    MapLayers.Time.TimeBox = new dijit.form.TimeTextBox({
        ID: "TimeBox",
        name: "TimeBox",
        style: "width:11ch;",
        onChange: MapLayers_Time_TimeBox_change,
        constraints: {
            timePattern: 'HH:mm:ss'
        }
    });

    MapLayers.Time.Toolbar.addChild(MapLayers.Time.TimeBox);
    MapLayers.Time.TimeBox.startup();


}

/******************************************************************************
 * 
 * @brief callback function for when the time box changes
 * 
 * 
******************************************************************************/

function MapLayers_Time_TimeBox_change( newValue ) {
    
    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_TimeBox_change( newValue)", newValue);
    
    if (MapLayers.Time.IgnoreSliderChange) return;
    

    /***** stop if playing *****/
    
    if (MapLayers.Time.Timer != null) {
        MapLayers_Time_Interval_Pause();
    }
    

    /***** get the date value *****/

    var mydate = MapLayers.Time.DateBox.get('value')

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
        
        MapLayers_Hash_Replace("timeslider", MapLayers.Time.Time);

        /***** now we can go ahead and update the display *****/
        
        MapLayers_Time_Retard( false, false, true );
    
    /***** forward move *****/
    
    } else {

        MapLayers.Time.Time = ts;

        /***** update the hash *****/
        
        MapLayers_Hash_Replace("timeslider", MapLayers.Time.Time);

        /***** now we can go ahead and update the display *****/
        
        MapLayers_Time_Advance( false, false, true );

    }
}

/*******************************************************************************
 function to create the toolbar for the timeslider
*******************************************************************************/

function MapLayers_Time_CreateSlider() {

    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_CreateSlider()");

    
    MapLayers.Time.Toolbar = new dijit.Toolbar({}, "timebar");

    MapLayers_Time_CreatePlayButton();
    MapLayers_Time_CreateForwardButton();
    MapLayers_Time_CreateTimeSlider();
    MapLayers_Time_CreateLoopButton();
    MapLayers_Time_CreateRockButton();
    MapLayers_Time_CreateIncrBox();
    MapLayers_Time_CreateSpeedSlider();
    MapLayers_Time_CreateDateBox();
    MapLayers_Time_CreateTimeBox();

    
    if ( MapLayers.Time.SliderMinValue ) {
        MapLayers_Time_TimeBox_setends ( moment(MapLayers.Time.SliderMinValue),
                                         moment(MapLayers.Time.SliderMaxValue) );
        MapLayers_Time_UpdateToobar(MapLayers.Time.Time, true, false);
    
    }
    
    if ( MapLayers.Time.SliderMinValue ) {
        MapLayers_Time_setVisible(true);
    } else {
        MapLayers_Time_setVisible(false);
    }


    MapLayers.Time.Toolbar.placeAt("TimebarPane");
    MapLayers.Time.Toolbar.startup();

}



/******************************************************************************
 * 
 * @brief function to hide/show the time slider controlls
 * 
 * 
******************************************************************************/

function MapLayers_Time_setVisible(bool) {

    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_setVisible(bool)", bool);
    
    if ( MapLayers.Time.Toolbar ) {
        if ( bool ) { 
            MapLayers.Time.hidetoggler.show();
        } else {
            MapLayers.Time.hidetoggler.hide();
        }
    }
}




/******************************************************************************
 * 
 * @brief function to turn off the remaining layers 
 * 
 * 
******************************************************************************/

function MapLayers_Time_expire_remaining() {
    
    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_expire_remaining()");
    
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

}

function MapLayers_Time_UpdateToobar(ts, FromSlider, FromDateTimeBox) {

    if(!FromSlider) {
        MapLayers.Time.TimeSlider.set("value", ts, false);
    }

    if (!FromDateTimeBox) {
        var date = moment(ts).toDate();

        /***** temp remove the constraints becase its slow *****/

        if ( MapLayers.Time.DateBox.constraints.min != undefined ) {
            var date_min = MapLayers.Time.DateBox.constraints.min;
            delete MapLayers.Time.DateBox.constraints.min;
        }
        if ( MapLayers.Time.DateBox.constraints.max != undefined ) {
            var date_max = MapLayers.Time.DateBox.constraints.max;
            delete MapLayers.Time.DateBox.constraints.max;
        }

        MapLayers.Time.DateBox.set("value", date, false);

        if ( date_min != undefined ) {
            MapLayers.Time.DateBox.constraints.min = date_min;
        }
        if ( date_max != undefined ) {
            MapLayers.Time.DateBox.constraints.max = date_max;
        }


        if ( MapLayers.Time.TimeBox.constraints.min != undefined ) {
            var time_min = MapLayers.Time.TimeBox.constraints.min;
            delete MapLayers.Time.TimeBox.constraints.min;
        }
        if ( MapLayers.Time.TimeBox.constraints.max != undefined ) {
            var time_max = MapLayers.Time.TimeBox.constraints.max;
            delete MapLayers.Time.TimeBox.constraints.max;
        }

        MapLayers.Time.TimeBox.set("value", date, false);

        if ( time_min != undefined ) {
            MapLayers.Time.DateBox.constraints.min = time_min;
        }
        if ( time_max != undefined ) {
            MapLayers.Time.DateBox.constraints.max = time_max;
        }

    }

}

function MapLayers_Time_TimeBox_setends ( beg_date, end_date ) {
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

}

/******************************************************************************
 * 
 * @brief function go forward though the layers to turn on/off layers for the current timeslider value
 * 
******************************************************************************/

function MapLayers_Time_Advance( fromaddnode, FromSlider, FromDateTimeBox ) {

    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_Advance()");

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
                MapLayers_Time_UpdateToobar( Beg.data.timestamp,
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
                MapLayers_Time_UpdateToobar( TS.data.timestamp,
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

    MapLayers_Time_TimeBox_setends ( moment(MapLayers.Time.SliderMinValue),
                                     moment(MapLayers.Time.SliderMaxValue) );

}

/******************************************************************************
 * 
 * @brief function go backwards though the layers to turn on/off layes for
 * the current timestamp
 * 
******************************************************************************/

function MapLayers_Time_Retard( fromaddnode, FromSlider, FromDateTimeBox) {

    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_Retard()");

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
                MapLayers_Time_UpdateToobar( End.data.timestamp,
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
                MapLayers_Time_UpdateToobar( TS.data.timestamp,
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

    MapLayers_Time_TimeBox_setends ( moment(MapLayers.Time.SliderMinValue),
                                     moment(MapLayers.Time.SliderMaxValue) );

}







/******************************************************************************
 * 
 * @brief function to update the animation with the timer
 * 
 * 
******************************************************************************/

/***** fixme this only works on timespans not timestamps *****/

function MapLayers_Time_Interval_Update() {

    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_Interval_Update() ");

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
                MapLayers_Time_Interval_Pause();
                stopped = true
            }
            
            /***** rock? *****/
                //fixme if were rocking should we still wait a cycle to incr?

            if (MapLayers.Time.RockState) {
                MapLayers.Time.Time = MapLayers.Time.SliderMinValue;
                MapLayers.Time.BackwardsState = false;
                MapLayers.Time.ForwardButton.set("checked", true);

                MapLayers.Time.BegCurrentNode = MapLayers.Time.BegList.head;
                MapLayers.Time.EndCurrentNode = MapLayers.Time.EndList.head;
                MapLayers.Time.tsCurrentNode = MapLayers.Time.TSList.head;

            /***** loop *****/

            } else {
                MapLayers.Time.Time = MapLayers.Time.SliderMaxValue;
                MapLayers_Time_expire_remaining();
    
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
                MapLayers_Time_Interval_Pause();
                stopped = true
            }
            
            /***** rock? *****/
                //fixme if were rocking should we still wait a cyckle to incr?

            if (MapLayers.Time.RockState) {
                MapLayers.Time.Time = MapLayers.Time.SliderMaxValue;
                MapLayers.Time.BackwardsState = true;
                MapLayers.Time.ForwardButton.set("checked", false);

                MapLayers.Time.BegCurrentNode = MapLayers.Time.BegList.tail;
                MapLayers.Time.EndCurrentNode = MapLayers.Time.EndList.tail;
                MapLayers.Time.TSCurrentNode = MapLayers.Time.TSList.tail;

            /***** loop *****/

            } else {
                MapLayers.Time.Time = MapLayers.Time.SliderMinValue;
                MapLayers_Time_expire_remaining();
        
                MapLayers.Time.BegCurrentNode = MapLayers.Time.BegList.head;
                MapLayers.Time.EndCurrentNode = MapLayers.Time.EndList.head;
                MapLayers.Time.TSCurrentNode = MapLayers.Time.TSList.head;
                // is this suposed to be here i forgot why
                MapLayers_Time_Advance(true, false, false);
            }
        }
    }

    /***** update the time slider *****/

    //MapLayers.Time.TimeSlider.set("value", MapLayers.Time.Time, false);

    //MapLayers.Time.TimeSlider._lastValueReported=null;

    /***** update the hash *****/
    
    MapLayers_Hash_Replace("timeslider", MapLayers.Time.Time);
    
    /***** update the display *****/
    
    if (MapLayers.Time.BackwardsState) {
        MapLayers_Time_Retard(false, false, false);
    } else {
        MapLayers_Time_Advance(false, false, false);
    }
    
}

/******************************************************************************
 * 
 * @brief function to start the animation
 * 
******************************************************************************/

function MapLayers_Time_Interval_Play() {
    
    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_Interval_Play()");
    
    MapLayers.Time.FirstPlayState = true;
    
    if (MapLayers.Time.Timer == null) {
        
        MapLayers.Time.Timer = setInterval( MapLayers_Time_Interval_Update ,
                                            MapLayers.Time.Speed);
                                           
        MapLayers.Time.PlayButton.set('label', 'Pause');
        MapLayers.Time.TimeSlider.set("intermediateChanges", false); // this helps prevent the onchange event from fireing
        MapLayers.Time.PlayButton.set( 'onClick', MapLayers_Time_Interval_Pause);
        //MapLayers_Hash_Replace("play", true);
    }
    
}

/******************************************************************************
 * 
 * @brief function to stop the animation
 * 
******************************************************************************/

function MapLayers_Time_Interval_Pause() {
    
    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_Interval_Pause()");
    
    if (MapLayers.Time.Timer != null) {
        clearInterval(MapLayers.Time.Timer);
        MapLayers.Time.Timer = null;
        
        MapLayers.Time.PlayButton.set('label', ' Play'); 
        MapLayers.Time.TimeSlider.set("intermediateChanges", true); // this helps prevent the onchange event from fireing
        MapLayers.Time.PlayButton.set( 'onClick', MapLayers_Time_Interval_Play);
        MapLayers_Hash_Replace("play", "");
    }
    
}

/******************************************************************************
 * 
 * @brief function to set the ends of the timeslider
 * 
 * @param begin
 * @param end
 * 
 * 
******************************************************************************/


function MapLayers_Time_setends_sub(begin, end) {

    if (MapLayers.Time.Toolbar) {
        MapLayers.Time.TimeSlider.set( 'minimum', begin, false );
        MapLayers.Time.TimeSlider._lastValueReported=null;
        MapLayers.Time.TimeSlider.set( 'maximum', end, false );
        MapLayers.Time.TimeSlider._lastValueReported=null;

        var beg_date = moment(begin);
        MapLayers.Time.DateBox.constraints.min = beg_date.toDate() ;

        var end_date = moment(end);
        MapLayers.Time.DateBox.constraints.max = end_date.toDate() ;

        MapLayers_Time_TimeBox_setends ( beg_date, end_date );
    }
}

function MapLayers_Time_setends(begin, end) {
        
    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_setends(begin, end)", begin, end);
    
    MapLayers.Time.IgnoreSliderChange = true;
    
    
    /***** update the time slider *****/
    
    if (MapLayers.Time.SliderMinValue == null) {
        MapLayers.Time.SliderMinValue = begin;
        MapLayers.Time.SliderMaxValue = end;
    
        if (!MapLayers.Time.FirstPlayState) {
        
        /***** update the time slider value *****/
        
            MapLayers.Time.Time = MapLayers.Time.SliderMinValue;
        }

        MapLayers_Time_setends_sub( MapLayers.Time.SliderMinValue,
                                    MapLayers.Time.SliderMaxValue );

        /***** make the ui visible *****/
        
        MapLayers_Time_setVisible(true);
            
    }
    
    else {
        MapLayers.Time.SliderMinValue = MIN ( begin,
                                             MapLayers.Time.SliderMinValue
                                           );
        MapLayers.Time.SliderMaxValue = MAX ( end,
                                             MapLayers.Time.SliderMaxValue
                                           );
        MapLayers_Time_setends_sub( MapLayers.Time.SliderMinValue,
                                    MapLayers.Time.SliderMaxValue );

    }
    




    if (!MapLayers.Time.FirstPlayState) {
        
        /***** update the time slider value *****/
        
        MapLayers.Time.Time = MapLayers.Time.SliderMinValue;
        last= MapLayers.Time.TimeSlider.get("intermediateChanges")


        MapLayers.Time.TimeSlider.set("intermediateChanges", false); // this helps prevent the onchange event from fireing
        MapLayers_Time_UpdateToobar( MapLayers.Time.Time,
                                     false,
                                     false);

        MapLayers.Time.TimeSlider.set("intermediateChanges", last); // this helps prevent the onchange event from fireing
        MapLayers.Time.TimeSlider._lastValueReported=null;
        MapLayers.Time.TSCurrentNode = MapLayers.Time.TSList.head;
        MapLayers.Time.BegCurrentNode = MapLayers.Time.BegList.head;
        MapLayers.Time.EndCurrentNode = MapLayers.Time.EndList.head;
    }
    
    
    MapLayers.Time.IgnoreSliderChange = false;
}

/******************************************************************************
 * 
 * 
 * 
 * 
******************************************************************************/

//fixme this is slow mo, use a circular list and test the dir to go


function MapLayers_Time_Insert_Node_Before(list, newnode, ts) {

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
}
     
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

function MapLayers_Time_addnode(treenode) {

    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_addnode(treenode)", treenode);
    
    var timestamp = null;
    var begin = null;
    var end = null;
    var node = null;
    MapLayers_Time_setVisible(true)
    
    //treenode.layer.setVisibility(true);
    //treenode.layer.div.style.visibility = "hidden";
                       
    /***** fix tyhe flicker *****/
    
    //treenode.layer.options.removeBackBufferDelay=0;
    
    /***** turn off the transition effect *****/

    treenode.layer.transitionEffect = null;

    /***** is it a timestamp? *****/
    
    if (treenode.timestamp != null) {
        
        /***** convert the timestamp to an int *****/
        
        timestamp = moment( treenode.timestamp ).valueOf();
        
        /***** create a new time node *****/
        
        var newnode = new MapLayers_Time_Node( treenode, timestamp);
        
        MapLayers_Time_Insert_Node_Before(MapLayers.Time.TSList, newnode, timestamp);

        /***** update the time slider *****/
        
        MapLayers_Time_setends( MapLayers.Time.TSList.head.data.timestamp,
                               MapLayers.Time.TSList.tail.data.timestamp
                            );
        
    }
    
    /***** timespan *****/
    
    else if (treenode.begin_timespan != null && treenode.end_timespan != null ) {
        begin = moment( treenode.begin_timespan ).valueOf();
        end = moment( treenode.end_timespan ).valueOf();
        
        /***** begin list *****/
        
        var newnode = new MapLayers_Time_Node( treenode, begin);
        
        MapLayers_Time_Insert_Node_Before(MapLayers.Time.BegList, newnode, begin);
        
        /***** end list ******/

        newnode = new MapLayers_Time_Node( treenode, end);
        
        MapLayers_Time_Insert_Node_Before(MapLayers.Time.EndList, newnode, end);
        
        /***** update the time slider *****/
        
        MapLayers_Time_setends( MapLayers.Time.BegList.head.data.timestamp,
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
            window.clearInterval(MapLayers.Time.UpdateTimer);
            MapLayers.Time.UpdateTimer = null;
            MapLayers_Time_Advance( true, false, false);
        },
        5000
    );
    
}

/******************************************************************************
 * 
 * 
 * 
 * 
******************************************************************************/

function MapLayers_Time_removenode_sub (list, treenode) {

    
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
}

function MapLayers_Time_removenode(treenode) {
    
    //if (MapLayers.Settings.debug)  console.log("MapLayers_Time_removenode(treenode)", treenode);
    
    var node = null;
    var bext = null;
    var found = 0;

    /***** stop if playing *****/
    
    if (MapLayers.Time.Timer != null) {
        MapLayers_Time_Interval_Pause();
    }

    /***** is it a timestamp? *****/
    
    if (treenode.timestamp != null) {
        
        node = MapLayers_Time_removenode_sub(TSList, treenode);
        
        if ( MapLayers.Time.TSCurrentNode
             && MapLayers.Time.TSCurrentNode.data.treenode.id == node.data.treenode.id
           ) {
            MapLayers.Time.TSCurrentNode = null;
        }

        /***** update the time slider *****/
        
        if (MapLayers.Time.TSList.head) {
            MapLayers_Time_setends( MapLayers.Time.TSList.head.data.timestamp,
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
            MapLayers_Time_setends( MapLayers.Time.BegList.head.data.timestamp,
                                   MapLayers.Time.EndList.tail.data.timestamp
                                );
        }
    }
    
    /***** hide the ui when there is no more nodes *****/
    
    if ( MapLayers.Time.TSList.head == null &&
         MapLayers.Time.BegList.head == null
    ) {
        MapLayers_Time_setVisible(false);
    }
    
}

