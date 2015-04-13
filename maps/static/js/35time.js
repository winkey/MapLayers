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

/***** fixme some of these shoiuld get stored in the hash     *****/
/***** if you were to share a link or bookmark the current    *****/
/***** time, loop settings, speed settings, and incr settings *****/

dojo.require("dojo");
dojo.require("dijit/form/HorizontalSlider");
dojo.require("dijit/form/ToggleButton");
dojo.require("dijit/form/Button");
dojo.require("dijit.Toolbar");
dojo.require("dojo/store/Memory");
dojo.require("dijit/form/ComboBox");
//dojo.require("dojo/dom-style");
dojo.require("dojo/fx/Toggler");

dojo.ready(function() {

    MapLayers.Time = new Object();
    MapLayers.Time.timer = null;
    MapLayers.Time.updatetimer = null;
    MapLayers.Time.firstplay = false;
    
    MapLayers.Time.TSList = new DLList();
    MapLayers.Time.TSCurrentNode = null;
    MapLayers.Time.BegList = new DLList();
    MapLayers.Time.EndList = new DLList();
    MapLayers.Time.BegCurrentNode = null;
    MapLayers.Time.EndCurrentNode = null;
    
    MapLayers.Time.SliderMinValue = null;
    MapLayers.Time.SliderMaxValue = null;
    MapLayers.Time.IgnoreSliderChange = false;
    
    MapLayers.Time.time = null;
    MapLayers.Time.loop = false;
    MapLayers.Time.rock = false;
    MapLayers.Time.backwards = false;
    MapLayers.Time.speed = 1000;
    MapLayers.Time.incr = 1 * 60 * 60 * 1000;
    
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

function MapLayers_Time_CreateSlider() {
    
    //fixme grab the hash vars!
    //if (MapLayers.Settings.debug) console.log("MapLayers_Time_CreateSlider()");

    
    MapLayers.Time.toolbar = new dijit.Toolbar({}, "timebar");

    /***** play/pause button *****/
    
    MapLayers.Time.playbutton = new dijit.form.Button({
            label: "Play",
            showLabel: true,
            onClick: MapLayers_Time_Interval_Play
    }, "playbutton");

    MapLayers.Time.toolbar.addChild(MapLayers.Time.playbutton)
    MapLayers.Time.playbutton.startup();

    /***** forward button *****/

    MapLayers.Time.forwardbutton = new dijit.form.ToggleButton({
            label: "Fwd",
            showLabel: true,
            checked: true,
            onChange: function(val){ MapLayers.Time.backwards = !val; }
    }, "forwardbutton");

    MapLayers.Time.toolbar.addChild(MapLayers.Time.forwardbutton)
    MapLayers.Time.forwardbutton.startup();

    /***** time slider *****/
    
    MapLayers.Time.Timeslider = new dijit.form.HorizontalSlider({
        value: 50,
        minimum: 0,
        maximum: 100000,
        intermediateChanges: true, //discreteValues
        style: "width:200px;",
        onChange: MapLayers_Time_Timeslider_change
    }, "timeslider");

    MapLayers.Time.toolbar.addChild(MapLayers.Time.Timeslider)
    MapLayers.Time.Timeslider.startup();

    
    /***** loop button *****/

    MapLayers.Time.loopbutton = new dijit.form.ToggleButton({
            label: "Loop",
            showLabel: true,
            checked: false,
            onChange: function(val){
                MapLayers.Time.loop = val
                if (val) {
                    MapLayers.Time.rockbutton.set("checked", false);
                }
            }
    }, "loopbutton");

    MapLayers.Time.toolbar.addChild(MapLayers.Time.loopbutton)
    MapLayers.Time.loopbutton.startup();

    /***** rock button *****/

    MapLayers.Time.rockbutton = new dijit.form.ToggleButton({
            label: "Rock",
            showLabel: true,
            checked: false,
            onChange: function(val){
                MapLayers.Time.rock = val
                if (val) {
                    MapLayers.Time.loopbutton.set("checked", false);
                }
            }
            
    }, "rockbutton");

    MapLayers.Time.toolbar.addChild(MapLayers.Time.rockbutton)
    MapLayers.Time.rockbutton.startup();

    /***** increment chooser *****/
    
    MapLayers.Time.incrStore = new dojo.store.Memory({
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

    MapLayers.Time.Incrbox = new dijit.form.ComboBox({
        id: "timeincrbox",
        name: "state",
        value: "Hour",
        store: MapLayers.Time.incrStore,
        searchAttr: "name",
        labelAttr: "name",
        onChange: MapLayers_Time_Incrbox_change
    }, "timeincrbox");

    MapLayers.Time.toolbar.addChild(MapLayers.Time.Incrbox)
    MapLayers.Time.Incrbox.startup();

/*    
    /***** speed slider ****
    
    MapLayers.Time.Speedslider = new Ext.slider.SingleSlider({
            fieldLabel: "Time",
            width: 200,
            value: MapLayers.Time.speed,
            increment: 125,
            minValue: 250,
            maxValue: 10000,
            hideLabel: true,
            useTips: false
    });
    
    MapLayers.Time.Speedslider.addListener('change', MapLayers_Time_Speedslider_change)
    */

    MapLayers_Time_setVisible(false);

    
    MapLayers.Time.toolbar.placeAt("TimebarPane");
    MapLayers.Time.toolbar.startup();

}



/******************************************************************************
 * 
 * @brief function to hide/show the time slider controlls
 * 
 * 
******************************************************************************/

function MapLayers_Time_setVisible(bool) {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Time_setVisible(bool)", bool);
    
    if (bool) { 
        MapLayers.Time.hidetoggler.show();
    } else {
        MapLayers.Time.hidetoggler.hide();
    }

}

/******************************************************************************
 * 
 * @brief callback function for when the speed slider changes
 * 
 * 
******************************************************************************/

function MapLayers_Time_Speedslider_change( newValueb ) {
    
    //if (MapLayers.Settings.debug) console.log("MapLayers_Time_Speedslider_change( newValue )",newValue);
    
    /***** set the new value *****/

    MapLayers.Time.speed = newValue;
    
    /***** restart the timer with the new speed *****/
    
    MapLayers_Time_Interval_Pause();
    MapLayers_Time_Interval_Play();
}

/******************************************************************************
 * 
 * @brief function to turn off the remaining layers 
 * 
 * 
******************************************************************************/

function MapLayers_Time_expire_remaining() {
    
    //if (MapLayers.Settings.debug) console.log("MapLayers_Time_expire_remaining()");
    
    var node;

    if (MapLayers.Time.backwards) {
    
        for (node = MapLayers.Time.BegCurrentNode ; node ; node = node.prev) {
            if (node.data.treenode.layer.getVisibility()) {
                node.data.treenode.layer.setVisibility(false);
            }
        }
        
    } else {
        
        for (node = MapLayers.Time.EndCurrentNode ; node ; node = node.next) {
            if (node.data.treenode.layer.getVisibility()) {
                node.data.treenode.layer.setVisibility(false);
            }
        }
    }

    if (MapLayers.Time.TSCurrentNode) {
        if (node.data.treenode.layer.getVisibility()) {
            MapLayers.Time.TSCurrentNode.data.treenode.layer.setVisibility(false);
        }
    }

}

/******************************************************************************
 * 
 * fixme this is all wrong
 * both timespan lists need to be parsed at the same time
 * 
******************************************************************************/

function MapLayers_Time_Switch(list, CurrentNode, ts, forward, action ) {
    var node;
    
    //if (MapLayers.Settings.debug) console.log("MapLayers_Time_Switch(list, CurrentNode, ts, forward, action)", list, CurrentNode, ts, forward, action);
    
    if (forward) {
        /***** if the currentspannode is null, reset to head *****/
        /***** i dont think this can happen *****/

        //if (CurrentNode == null)
        //    CurrentNode = list.head;
        
        /***** starting at the current begin node loop *****/

        for (   node = CurrentNode ;
                node && ts >= node.data.timestamp;
                node = node.next) {
            action(node)
        }

    } else {

        /***** if the currentspannode is null, reset to tail *****/
        /***** i dont think this can happen *****/

        //if (CurrentNode == null)
        //    CurrentNode = list.tail;
        
        /***** starting at the current begin node loop *****/

        for (   node = CurrentNode ;
                node && ts <= node.data.timestamp;
                node = node.prev) {
            action(node) 
        }
    }

    return node;
}


/******************************************************************************
 * 
 * @brief function go forward though the layers to turn on/off layes for
 * the current timestamp
 * 
******************************************************************************/

/***** fixme fix flicker *****/

function MapLayers_Time_Advance() {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Time_Advance() ", MapLayers.Time.time);

    /***** we turn off before we turn on so you dont ever see 2 *****/

    MapLayers.Time.EndCurrentNode = MapLayers_Time_Switch(
        MapLayers.Time.EndList,
        MapLayers.Time.EndCurrentNode,
        MapLayers.Time.time,
        true,
        function (node) {
            //console.log(" getvisibility: ", node.data.treenode.layer.getVisibility());
            if (node.data.treenode.layer.getVisibility()) {
                node.data.treenode.layer.setVisibility(false);
            }
        }
    );

    MapLayers.Time.BegCurrentNode = MapLayers_Time_Switch(
        MapLayers.Time.BegList,
        MapLayers.Time.BegCurrentNode,
        MapLayers.Time.time,
        true,
        function (node) {
            //console.log(" getvisibility: ", node.data.treenode.layer.getVisibility());
            if (!node.data.treenode.layer.getVisibility()) {
                node.data.treenode.layer.setVisibility(true);
            }
        }
    );
    
    MapLayers.Time.TSCurrentNode = MapLayers_Time_Switch(
        MapLayers.Time.TSList,
        MapLayers.Time.TSCurrentNode,
        MapLayers.Time.time,
        true,
        function (node) {
            if (node.data.treenode.layer.getVisibility()) {
                MapLayers.Time.TSCurrentNode.data.treenode.layer.setVisibility(false);
            }
            if (!node.data.treenode.layer.getVisibility()) {
                node.data.treenode.layer.setVisibility(true);
            }
            MapLayers.Time.TSCurrentNode = node;
        }
    );

}

/******************************************************************************
 * 
 * @brief function go backwards though the layers to turn on/off layes for
 * the current timestamp
 * 
******************************************************************************/

/***** fixme fix flicker *****/

function MapLayers_Time_Retard() {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Time_Retard() ", MapLayers.Time.time);
    
    /***** we turn off before we turn on so you dont ever see 2 *****/

    MapLayers.Time.BegCurrentNode = MapLayers_Time_Switch(
        MapLayers.Time.BegList,
        MapLayers.Time.BegCurrentNode,
        MapLayers.Time.time,
        false,
        function (node) {
            if (node.data.treenode.layer.getVisibility()) {
                node.data.treenode.layer.setVisibility(false);
            }
        }
    );

    MapLayers.Time.EndCurrentNode = MapLayers_Time_Switch(
        MapLayers.Time.EndList,
        MapLayers.Time.EndCurrentNode,
        MapLayers.Time.time,
        false,
        function (node) {
            if (!node.data.treenode.layer.getVisibility()) {
                node.data.treenode.layer.setVisibility(true);
            }
        }
    );
    
    MapLayers.Time.TSCurrentNode = MapLayers_Time_Switch(
        MapLayers.Time.TSList,
        MapLayers.Time.TSCurrentNode,
        MapLayers.Time.time,
        false,
        function (node) {
            if (node.data.treenode.layer.getVisibility) {
                MapLayers.Time.TSCurrentNode.data.treenode.layer.setVisibility(false);
            }
            if (!node.data.treenode.layer.getVisibility()) {
                node.data.treenode.layer.setVisibility(true);
            }
            MapLayers.Time.TSCurrentNode = node;
        }
    );


}

/******************************************************************************
 * 
 * @brief callback function for when the time slider changes
 * 
 * 
******************************************************************************/

function MapLayers_Time_Timeslider_change( newValue ) {
    
    //if (MapLayers.Settings.debug) console.log("MapLayers_Time_Timeslider_change( newValue)", newValue);
    
    if (MapLayers.Time.IgnoreSliderChange) return;
    

    /***** stop if playing *****/
    
    if (MapLayers.Time.timer != null) {
        MapLayers_Time_Interval_Pause();
    }
    
    /***** move backwards? *****/
    
    if (newValue < MapLayers.Time.time ) {
    
        MapLayers.Time.time = newValue;

        /***** update the hash *****/
        
        MapLayers_Hash_Replace("timeslider", MapLayers.Time.time);

        /***** now we can go ahead and update the display *****/
        
        MapLayers_Time_Retard();
    
    /***** forward move *****/
    
    } else {

        MapLayers.Time.time = newValue;

        /***** update the hash *****/
        
        MapLayers_Hash_Replace("timeslider", MapLayers.Time.time);

        /***** now we can go ahead and update the display *****/
        
        MapLayers_Time_Advance();

    }

}

/******************************************************************************
 * 
 * @brief callback function for when the time slider changes
 * 
 * 
******************************************************************************/

function MapLayers_Time_Incrbox_change( newValue ) {
    
    //if (MapLayers.Settings.debug) console.log("MapLayers_Time_Incrbox_change( newValue )", newValue );
    
    /***** set the new value *****/
    var incr = MapLayers.Time.incrStore.query({name:newValue})[0];
    
    MapLayers.Time.incr = incr.value;
    
    /***** restart the timer with the new speed *****/
    
    MapLayers_Time_Interval_Pause();
    MapLayers_Time_Interval_Play();

}

/******************************************************************************
 * 
 * @brief function to update the animation with the timer
 * 
 * 
******************************************************************************/

/***** fixme this only works on timespans not timestamps *****/

function MapLayers_Time_Interval_Update() {

    //if (MapLayers.Settings.debug) console.log("MapLayers_Time_Interval_Update() ");

    var stopped = false;
    var looped = false;
    var node = null;
   
    var incr = MapLayers.Time.incr;
    
    var lastvalue = MapLayers.Time.time;


    /***** are we going backwards? *****/

    if (MapLayers.Time.backwards) {
        MapLayers.Time.time = lastvalue - incr;

        /***** past the begining? *****/

        if (MapLayers.Time.time < MapLayers.Time.SliderMinValue ) {
        
            /***** is the loop or rock button pressed *****/
            
            if ( MapLayers.Time.loop && ! MapLayers.Time.rock ) {
                MapLayers_Time_Interval_Pause();
                stopped = true
            }
            
            /***** rock? *****/
                //fixme if were rocking should we still wait a cycle to incr?

            if (MapLayers.Time.rock) {
                MapLayers.Time.time = MapLayers.Time.SliderMinValue;
                MapLayers.Time.backwards = false;
                MapLayers.Time.forwardbutton.set("checked", true);

                MapLayers.Time.BegCurrentNode = MapLayers.Time.BegList.head;
                MapLayers.Time.EndCurrentNode = MapLayers.Time.EndList.head;
                MapLayers.Time.tsCurrentNode = MapLayers.Time.TSList.head;

            /***** loop *****/

            } else {
                MapLayers.Time.time = MapLayers.Time.SliderMaxValue;
                MapLayers_Time_expire_remaining();
    
                MapLayers.Time.BegCurrentNode = MapLayers.Time.BegList.tail;
                MapLayers.Time.EndCurrentNode = MapLayers.Time.EndList.tail;
                MapLayers.Time.TSCurrentNode = MapLayers.Time.TSList.tail;
            }

        }

    /***** were going forwards *****/

    } else {
        MapLayers.Time.time = lastvalue + incr;
        
        /***** past the end time? *****/

        if (MapLayers.Time.time > MapLayers.Time.SliderMaxValue ) {
            
            /***** is the loop or rock button pressed *****/
            
            if ( ! MapLayers.Time.loop && ! MapLayers.Time.rock ) {
                MapLayers_Time_Interval_Pause();
                stopped = true
            }
            
            /***** rock? *****/
                //fixme if were rocking should we still wait a cyckle to incr?

            if (MapLayers.Time.rock) {
                MapLayers.Time.time = MapLayers.Time.SliderMaxValue;
                MapLayers.Time.backwards = true;
                MapLayers.Time.forwardbutton.set("checked", false);

                MapLayers.Time.BegCurrentNode = MapLayers.Time.BegList.tail;
                MapLayers.Time.EndCurrentNode = MapLayers.Time.EndList.tail;
                MapLayers.Time.TSCurrentNode = MapLayers.Time.TSList.tail;

            /***** loop *****/

            } else {
                MapLayers.Time.time = MapLayers.Time.SliderMinValue;
                MapLayers_Time_expire_remaining();
        
                MapLayers.Time.BegCurrentNode = MapLayers.Time.BegList.head;
                MapLayers.Time.EndCurrentNode = MapLayers.Time.EndList.head;
                MapLayers.Time.TSCurrentNode = MapLayers.Time.TSList.head;
            }

        }
    }

    /***** update the time slider *****/

    MapLayers.Time.Timeslider.set("value", MapLayers.Time.time, false);
    //MapLayers.Time.Timeslider._lastValueReported=null;

    /***** update the hash *****/
    
    MapLayers_Hash_Replace("timeslider", MapLayers.Time.time);
    
    /***** update the display *****/
    
    if (MapLayers.Time.backwards) {
        MapLayers_Time_Retard();
    } else {
        MapLayers_Time_Advance();
    }
    
}

/******************************************************************************
 * 
 * @brief function to start the animation
 * 
******************************************************************************/

function MapLayers_Time_Interval_Play() {
    
    //if (MapLayers.Settings.debug) console.log("MapLayers_Time_Interval_Play()");
    
    MapLayers.Time.firstplay = true;
    
    if (MapLayers.Time.timer == null) {
        
        MapLayers.Time.timer = setInterval( MapLayers_Time_Interval_Update ,
                                           MapLayers.Time.speed);
                                           
        MapLayers.Time.playbutton.set('label', 'Pause');
        MapLayers.Time.Timeslider.set("intermediateChanges", false); // this helps prevent the onchange event from fireing
        MapLayers.Time.playbutton.set( 'onClick', MapLayers_Time_Interval_Pause);
        MapLayers_Hash_Replace("play", true);
    }
    
}

/******************************************************************************
 * 
 * @brief function to stop the animation
 * 
******************************************************************************/

function MapLayers_Time_Interval_Pause() {
    
    //if (MapLayers.Settings.debug) console.log("MapLayers_Time_Interval_Pause()");
    
    if (MapLayers.Time.timer != null) {
        clearInterval(MapLayers.Time.timer);
        MapLayers.Time.timer = null;
        
        MapLayers.Time.playbutton.set('label', ' Play'); 
        MapLayers.Time.Timeslider.set("intermediateChanges", true); // this helps prevent the onchange event from fireing
        MapLayers.Time.playbutton.set( 'onClick', MapLayers_Time_Interval_Play);
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


function MapLayers_Time_setends(begin, end) {
        
    //if (MapLayers.Settings.debug) console.log("MapLayers_Time_setends(begin, end)", begin, end);
    
    MapLayers.Time.IgnoreSliderChange = true;
    
    /***** update the time slider *****/
    
    if (MapLayers.Time.SliderMinValue == null) {
        MapLayers.Time.SliderMinValue = begin;
        MapLayers.Time.SliderMaxValue = end;
    
        MapLayers.Time.Timeslider.set( 'minimum', MapLayers.Time.SliderMinValue, false );
        MapLayers.Time.Timeslider._lastValueReported=null;
        MapLayers.Time.Timeslider.set( 'maximum', MapLayers.Time.SliderMaxValue, false );
        MapLayers.Time.Timeslider._lastValueReported=null;
    
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
        MapLayers.Time.Timeslider.set( 'minimum', MapLayers.Time.SliderMinValue, false );
        MapLayers.Time.Timeslider._lastValueReported=null;
        MapLayers.Time.Timeslider.set( 'maximum', MapLayers.Time.SliderMaxValue, false );
        MapLayers.Time.Timeslider._lastValueReported=null;
    
    }
    
    if (!MapLayers.Time.firstplay) {
        
        /***** update the time slider value *****/
        
        MapLayers.Time.time = MapLayers.Time.SliderMinValue
        last= MapLayers.Time.Timeslider.get("intermediateChanges")


        MapLayers.Time.Timeslider.set("intermediateChanges", false); // this helps prevent the onchange event from fireing
        MapLayers.Time.Timeslider.set( "value", MapLayers.Time.time, false );
        MapLayers.Time.Timeslider.set("intermediateChanges", last); // this helps prevent the onchange event from fireing
        MapLayers.Time.Timeslider._lastValueReported=null;
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
// actualy theres something else wrong our test data is in backwars so the loop N#EVER iterates
// so we need to fixme anyway

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

    //if (MapLayers.Settings.debug) console.log("MapLayers_Time_addnode(treenode)", treenode);
    
    var timestamp = null;
    var begin = null;
    var end = null;
    var node = null;
    MapLayers_Time_setVisible(true)
    
    //treenode.layer.setVisibility(true);
    //treenode.layer.div.style.visibility = "hidden";
                       
    /***** fix tyhe flicker *****/
    
    //treenode.layer.options.removeBackBufferDelay=0;
    
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


    if (MapLayers.Time.updatetimer) {
        window.clearInterval(MapLayers.Time.updatetimer);
    }
    MapLayers.Time.updatetimer = setInterval(
        function () {
            window.clearInterval(MapLayers.Time.updatetimer);
            MapLayers.Time.updatetimer = null;
            MapLayers_Time_Advance();
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

    var node;
    for (node = list.head; node ; node = next) {
        next = node.next;
        if (treenode.id == node.data.treenode.id) {
            MapLayers.Time.TSCurrentNode.data.treenode.layer.setVisibility(false);
            DLList_delete(list, node);
            break;
        }
    }
    
    /***** TURN OFF THE VIS *****/
    
    treenode.layer.setVisibility(false);
    
    return node;
}

function MapLayers_Time_removenode(treenode) {
    
    //if (MapLayers.Settings.debug) console.log("MapLayers_Time_removenode(treenode)", treenode);
    
    var node = null;
    var bext = null;
    var found = 0;


    /***** is it a timestamp? *****/
    
    if (treenode.timestamp != null) {
        
        node = MapLayers_Time_removenode_sub(TSList, treenode);
        
        if (MapLayers.Time.TSCurrentNode.data.treenode.id == node.data.treenode.id) {
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
        
        node = MapLayers_Time_removenode_sub(BegList, treenode);
        if (MapLayers.Time.BegCurrentNode.data.treenode.id == node.data.treenode.id) {
            MapLayers.Time.BegCurrentNode = null;
        }

        node = MapLayers_Time_removenode_sub(EndList, treenode);
        if (MapLayers.Time.EndCurrentNode.data.treenode.id == node.data.treenode.id) {
            MapLayers.Time.EndCurrentNode = null;
        }

        
        /***** update the time slider *****/
        
        if (MapLayers.Time.spanlist.head) {
            MapLayers_Time_setends( MapLayers.Time.BegList.head.data.timestamp,
                                   MapLayers.Time.EndList.tail.data.timestamp
                                );
        }
    }
    
    /***** hide the ui when there is no more nodes *****/
    
    if ( MapLayers.Time.TSList.head == null &&
         MapLayers.Time.spanlist.head == null
    ) {
        MapLayers_Time_setVisible(false);
    }
    
}

