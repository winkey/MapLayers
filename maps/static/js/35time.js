/*******************************************************************************
 *
 * Project: NewWorld
 * App:     javascript timeslider
 *
 * 
 *
 *******************************************************************************
 * Copyright (c) 2014,  Brian Case 
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

    NewWorld.Time = new Object();
    NewWorld.Time.timer = null;
    NewWorld.Time.updatetimer = null;
    NewWorld.Time.firstplay = false;
    
    NewWorld.Time.TSList = new DLList();
    NewWorld.Time.TSCurrentNode = null;
    NewWorld.Time.BegList = new DLList();
    NewWorld.Time.EndList = new DLList();
    NewWorld.Time.BegCurrentNode = null;
    NewWorld.Time.EndCurrentNode = null;
    
    NewWorld.Time.SliderMinValue = null;
    NewWorld.Time.SliderMaxValue = null;
    NewWorld.Time.IgnoreSliderChange = false;
    
    NewWorld.Time.time = null;
    NewWorld.Time.loop = false;
    NewWorld.Time.rock = false;
    NewWorld.Time.backwards = false;
    NewWorld.Time.speed = 1000;
    NewWorld.Time.incr = 1 * 60 * 60 * 1000;
    
    require(["dojo/fx/Toggler"], function(Toggler) {

        NewWorld.Time.hidetoggler = new Toggler({
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

    
function NewWorld_Time_Node(treenode, timestamp) {
    this.treenode = treenode;
    this.timestamp = timestamp;

}

function NewWorld_Time_CreateSlider() {
    
    //fixme grab the hash vars!
    if (NewWorld.Settings.debug) console.log("NewWorld_Time_CreateSlider()");

    
    NewWorld.Time.toolbar = new dijit.Toolbar({}, "timebar");

    /***** play/pause button *****/
    
    NewWorld.Time.playbutton = new dijit.form.Button({
            label: "Play",
            showLabel: true,
            onClick: NewWorld_Time_Interval_Play
    }, "playbutton");

    NewWorld.Time.toolbar.addChild(NewWorld.Time.playbutton)
    NewWorld.Time.playbutton.startup();

    /***** forward button *****/

    NewWorld.Time.forwardbutton = new dijit.form.ToggleButton({
            label: "Fwd",
            showLabel: true,
            checked: true,
            onChange: function(val){ NewWorld.Time.backwards = !val; }
    }, "forwardbutton");

    NewWorld.Time.toolbar.addChild(NewWorld.Time.forwardbutton)
    NewWorld.Time.forwardbutton.startup();

    /***** time slider *****/
    
    NewWorld.Time.Timeslider = new dijit.form.HorizontalSlider({
        value: 50,
        minimum: 0,
        maximum: 100000,
        intermediateChanges: true, //discreteValues
        style: "width:200px;",
        onChange: NewWorld_Time_Timeslider_change
    }, "timeslider");

    NewWorld.Time.toolbar.addChild(NewWorld.Time.Timeslider)
    NewWorld.Time.Timeslider.startup();

    
    /***** loop button *****/

    NewWorld.Time.loopbutton = new dijit.form.ToggleButton({
            label: "Loop",
            showLabel: true,
            checked: false,
            onChange: function(val){
                NewWorld.Time.loop = val
                if (val) {
                    NewWorld.Time.rockbutton.set("checked", false);
                }
            }
    }, "loopbutton");

    NewWorld.Time.toolbar.addChild(NewWorld.Time.loopbutton)
    NewWorld.Time.loopbutton.startup();

    /***** rock button *****/

    NewWorld.Time.rockbutton = new dijit.form.ToggleButton({
            label: "Rock",
            showLabel: true,
            checked: false,
            onChange: function(val){
                NewWorld.Time.rock = val
                if (val) {
                    NewWorld.Time.loopbutton.set("checked", false);
                }
            }
            
    }, "rockbutton");

    NewWorld.Time.toolbar.addChild(NewWorld.Time.rockbutton)
    NewWorld.Time.rockbutton.startup();

    /***** increment chooser *****/
    
    NewWorld.Time.incrStore = new dojo.store.Memory({
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

    NewWorld.Time.Incrbox = new dijit.form.ComboBox({
        id: "timeincrbox",
        name: "state",
        value: "Hour",
        store: NewWorld.Time.incrStore,
        searchAttr: "name",
        labelAttr: "name",
        onChange: NewWorld_Time_Incrbox_change
    }, "timeincrbox");

    NewWorld.Time.toolbar.addChild(NewWorld.Time.Incrbox)
    NewWorld.Time.Incrbox.startup();

/*    
    /***** speed slider ****
    
    NewWorld.Time.Speedslider = new Ext.slider.SingleSlider({
            fieldLabel: "Time",
            width: 200,
            value: NewWorld.Time.speed,
            increment: 125,
            minValue: 250,
            maxValue: 10000,
            hideLabel: true,
            useTips: false
    });
    
    NewWorld.Time.Speedslider.addListener('change', NewWorld_Time_Speedslider_change)
    */

    NewWorld_Time_setVisible(false);

    
    NewWorld.Time.toolbar.placeAt("TimebarPane");
    NewWorld.Time.toolbar.startup();

}



/******************************************************************************
 * 
 * @brief function to hide/show the time slider controlls
 * 
 * 
******************************************************************************/

function NewWorld_Time_setVisible(bool) {

    if (NewWorld.Settings.debug) console.log("NewWorld_Time_setVisible(bool)", bool);
    
    if (bool) { 
        NewWorld.Time.hidetoggler.show();
    } else {
        NewWorld.Time.hidetoggler.hide();
    }

}

/******************************************************************************
 * 
 * @brief callback function for when the speed slider changes
 * 
 * 
******************************************************************************/

function NewWorld_Time_Speedslider_change( newValueb ) {
    
    if (NewWorld.Settings.debug) console.log("NewWorld_Time_Speedslider_change( newValue )",newValue);
    
    /***** set the new value *****/

    NewWorld.Time.speed = newValue;
    
    /***** restart the timer with the new speed *****/
    
    NewWorld_Time_Interval_Pause();
    NewWorld_Time_Interval_Play();
}

/******************************************************************************
 * 
 * @brief function to turn off the remaining layers 
 * 
 * 
******************************************************************************/

function NewWorld_Time_expire_remaining() {
    
    if (NewWorld.Settings.debug) console.log("NewWorld_Time_expire_remaining()");
    
    var node;

    if (NewWorld.Time.backwards) {
    
        for (node = NewWorld.Time.BegCurrentNode ; node ; node = node.prev) {
            if (node.data.treenode.layer.getVisibility() ) {
                node.data.treenode.layer.setVisibility(false);
            }
        }
        
    } else {
        
        for (node = NewWorld.Time.EndCurrentNode ; node ; node = node.next) {
            if (node.data.treenode.layer.getVisibility() ) {
                node.data.treenode.layer.setVisibility(false);
            }
        }
    }

    if (NewWorld.Time.TSCurrentNode) {
        NewWorld.Time.TSCurrentNode.data.treenode.layer.setVisibility(false);
    }

}

function NewWorld_Time_Switch(list, CurrentNode, ts, forward, action ) {
    var node;
    
    if (NewWorld.Settings.debug) console.log("NewWorld_Time_Switch(list, CurrentNode, ts, forward, action)", list, CurrentNode, ts, forward, action);
    
    if (forward) {
        /***** if the currentspannode is null, reset to head *****/
        /***** i dont think this can happen *****/

        if (CurrentNode == null)
            CurrentNode = list.head;
        
        /***** starting at the current begin node loop *****/

        for (   node = CurrentNode ;
                node && ts >= node.data.timestamp;
                node = node.next) {
            action(node)
        }

    } else {

        /***** if the currentspannode is null, reset to tail *****/
        /***** i dont think this can happen *****/

        if (CurrentNode == null)
            CurrentNode = list.tail;
        
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

function NewWorld_Time_Advance() {

    if (NewWorld.Settings.debug) console.log("NewWorld_Time_Advance() ", NewWorld.Time.time);

    /***** we turn off before we turn on so you dont ever see 2 *****/

    NewWorld.Time.EndCurrentNode = NewWorld_Time_Switch(
        NewWorld.Time.EndList,
        NewWorld.Time.EndCurrentNode,
        NewWorld.Time.time,
        true,
        function (node) {
            node.data.treenode.layer.setVisibility(false);
        }
    );

    NewWorld.Time.BegCurrentNode = NewWorld_Time_Switch(
        NewWorld.Time.BegList,
        NewWorld.Time.BegCurrentNode,
        NewWorld.Time.time,
        true,
        function (node) {
            node.data.treenode.layer.setVisibility(true);
        }
    );
    
    NewWorld.Time.TSCurrentNode = NewWorld_Time_Switch(
        NewWorld.Time.TSList,
        NewWorld.Time.TSCurrentNode,
        NewWorld.Time.time,
        true,
        function (node) {
            NewWorld.Time.TSCurrentNode.data.treenode.layer.setVisibility(false);
            node.data.treenode.layer.setVisibility(true);
            NewWorld.Time.TSCurrentNode = node;
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

function NewWorld_Time_Retard() {

    if (NewWorld.Settings.debug) console.log("NewWorld_Time_Retard() ", NewWorld.Time.time);
    
    /***** we turn off before we turn on so you dont ever see 2 *****/

    NewWorld.Time.BegCurrentNode = NewWorld_Time_Switch(
        NewWorld.Time.BegList,
        NewWorld.Time.BegCurrentNode,
        NewWorld.Time.time,
        false,
        function (node) {
            node.data.treenode.layer.setVisibility(false);
        }
    );

    NewWorld.Time.EndCurrentNode = NewWorld_Time_Switch(
        NewWorld.Time.EndList,
        NewWorld.Time.EndCurrentNode,
        NewWorld.Time.time,
        false,
        function (node) {
            node.data.treenode.layer.setVisibility(true);
        }
    );
    
    NewWorld.Time.TSCurrentNode = NewWorld_Time_Switch(
        NewWorld.Time.TSList,
        NewWorld.Time.TSCurrentNode,
        NewWorld.Time.time,
        false,
        function (node) {
            NewWorld.Time.TSCurrentNode.data.treenode.layer.setVisibility(false);
            node.data.treenode.layer.setVisibility(true);
            NewWorld.Time.TSCurrentNode = node;
        }
    );


}

/******************************************************************************
 * 
 * @brief callback function for when the time slider changes
 * 
 * 
******************************************************************************/

function NewWorld_Time_Timeslider_change( newValue ) {
    
    if (NewWorld.Settings.debug) console.log("NewWorld_Time_Timeslider_change( newValue)", newValue);
    
    if (NewWorld.Time.IgnoreSliderChange) return;
    

    /***** stop if playing *****/
    
    if (NewWorld.Time.timer != null) {
        NewWorld_Time_Interval_Pause();
    }
    
    /***** move backwards? *****/
    
    if (newValue < NewWorld.Time.time ) {
    
        NewWorld.Time.time = newValue;

        /***** update the hash *****/
        
        NewWorld_Hash_Replace("timeslider", NewWorld.Time.time);

        /***** now we can go ahead and update the display *****/
        
        NewWorld_Time_Retard();
    
    /***** forward move *****/
    
    } else {

        NewWorld.Time.time = newValue;

        /***** update the hash *****/
        
        NewWorld_Hash_Replace("timeslider", NewWorld.Time.time);

        /***** now we can go ahead and update the display *****/
        
        NewWorld_Time_Advance();

    }

}

/******************************************************************************
 * 
 * @brief callback function for when the time slider changes
 * 
 * 
******************************************************************************/

function NewWorld_Time_Incrbox_change( newValue ) {
    
    if (NewWorld.Settings.debug) console.log("NewWorld_Time_Incrbox_change( newValue )", newValue );
    
    /***** set the new value *****/
    var incr = NewWorld.Time.incrStore.query({name:newValue})[0];
    
    NewWorld.Time.incr = incr.value;
    
    /***** restart the timer with the new speed *****/
    
    NewWorld_Time_Interval_Pause();
    NewWorld_Time_Interval_Play();

}

/******************************************************************************
 * 
 * @brief function to update the animation with the timer
 * 
 * 
******************************************************************************/

/***** fixme this only works on timespans not timestamps *****/

function NewWorld_Time_Interval_Update() {

    if (NewWorld.Settings.debug) console.log("NewWorld_Time_Interval_Update() ");

    var stopped = false;
    var looped = false;
    var node = null;
   
    var incr = NewWorld.Time.incr;
    
    var lastvalue = NewWorld.Time.time;


    /***** are we going backwards? *****/

    if (NewWorld.Time.backwards) {
        NewWorld.Time.time = lastvalue - incr;

        /***** past the begining? *****/

        if (NewWorld.Time.time < NewWorld.Time.SliderMinValue ) {
        
            /***** is the loop or rock button pressed *****/
            
            if ( NewWorld.Time.loop && ! NewWorld.Time.rock ) {
                NewWorld_Time_Interval_Pause();
                stopped = true
            }
            
            /***** rock? *****/
                //fixme if were rocking should we still wait a cycle to incr?

            if (NewWorld.Time.rock) {
                NewWorld.Time.time = NewWorld.Time.SliderMinValue;
                NewWorld.Time.backwards = false;
                NewWorld.Time.forwardbutton.set("checked", true);

                NewWorld.Time.BegCurrentNode = NewWorld.Time.BegList.head;
                NewWorld.Time.EndCurrentNode = NewWorld.Time.EndList.head;
                NewWorld.Time.tsCurrentNode = NewWorld.Time.TSList.head;

            /***** loop *****/

            } else {
                NewWorld.Time.time = NewWorld.Time.SliderMaxValue;
                NewWorld_Time_expire_remaining();
    
                NewWorld.Time.BegCurrentNode = NewWorld.Time.BegList.tail;
                NewWorld.Time.EndCurrentNode = NewWorld.Time.EndList.tail;
                NewWorld.Time.TSCurrentNode = NewWorld.Time.TSList.tail;
            }

        }

    /***** were going forwards *****/

    } else {
        NewWorld.Time.time = lastvalue + incr;
        
        /***** past the end time? *****/

        if (NewWorld.Time.time > NewWorld.Time.SliderMaxValue ) {
            
            /***** is the loop or rock button pressed *****/
            
            if ( ! NewWorld.Time.loop && ! NewWorld.Time.rock ) {
                NewWorld_Time_Interval_Pause();
                stopped = true
            }
            
            /***** rock? *****/
                //fixme if were rocking should we still wait a cyckle to incr?

            if (NewWorld.Time.rock) {
                NewWorld.Time.time = NewWorld.Time.SliderMaxValue;
                NewWorld.Time.backwards = true;
                NewWorld.Time.forwardbutton.set("checked", false);

                NewWorld.Time.BegCurrentNode = NewWorld.Time.BegList.tail;
                NewWorld.Time.EndCurrentNode = NewWorld.Time.EndList.tail;
                NewWorld.Time.TSCurrentNode = NewWorld.Time.TSList.tail;

            /***** loop *****/

            } else {
                NewWorld.Time.time = NewWorld.Time.SliderMinValue;
                NewWorld_Time_expire_remaining();
        
                NewWorld.Time.BegCurrentNode = NewWorld.Time.BegList.head;
                NewWorld.Time.EndCurrentNode = NewWorld.Time.EndList.head;
                NewWorld.Time.TSCurrentNode = NewWorld.Time.TSList.head;
            }

        }
    }

    /***** update the time slider *****/

    NewWorld.Time.Timeslider.set("value", NewWorld.Time.time, false);
    //NewWorld.Time.Timeslider._lastValueReported=null;

    /***** update the hash *****/
    
    NewWorld_Hash_Replace("timeslider", NewWorld.Time.time);
    
    /***** update the display *****/
    
    if (NewWorld.Time.backwards) {
        NewWorld_Time_Retard();
    } else {
        NewWorld_Time_Advance();
    }
    
}

/******************************************************************************
 * 
 * @brief function to start the animation
 * 
******************************************************************************/

function NewWorld_Time_Interval_Play() {
    
    if (NewWorld.Settings.debug) console.log("NewWorld_Time_Interval_Play()");
    
    NewWorld.Time.firstplay = true;
    
    if (NewWorld.Time.timer == null) {
        
        NewWorld.Time.timer = setInterval( NewWorld_Time_Interval_Update ,
                                           NewWorld.Time.speed);
                                           
        NewWorld.Time.playbutton.set('label', 'Pause');
        NewWorld.Time.Timeslider.set("intermediateChanges", false); // this helps prevent the onchange event from fireing
        NewWorld.Time.playbutton.set( 'onClick', NewWorld_Time_Interval_Pause);
        NewWorld_Hash_Replace("play", true);
    }
    
}

/******************************************************************************
 * 
 * @brief function to stop the animation
 * 
******************************************************************************/

function NewWorld_Time_Interval_Pause() {
    
    if (NewWorld.Settings.debug) console.log("NewWorld_Time_Interval_Pause()");
    
    if (NewWorld.Time.timer != null) {
        clearInterval(NewWorld.Time.timer);
        NewWorld.Time.timer = null;
        
        NewWorld.Time.playbutton.set('label', ' Play'); 
        NewWorld.Time.Timeslider.set("intermediateChanges", true); // this helps prevent the onchange event from fireing
        NewWorld.Time.playbutton.set( 'onClick', NewWorld_Time_Interval_Play);
        NewWorld_Hash_Replace("play", "");
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


function NewWorld_Time_setends(begin, end) {
        
    if (NewWorld.Settings.debug) console.log("NewWorld_Time_setends(begin, end)", begin, end);
    
    NewWorld.Time.IgnoreSliderChange = true;
    
    /***** update the time slider *****/
    
    if (NewWorld.Time.SliderMinValue == null) {
        NewWorld.Time.SliderMinValue = begin;
        NewWorld.Time.SliderMaxValue = end;
    
        NewWorld.Time.Timeslider.set( 'minimum', NewWorld.Time.SliderMinValue, false );
        NewWorld.Time.Timeslider._lastValueReported=null;
        NewWorld.Time.Timeslider.set( 'maximum', NewWorld.Time.SliderMaxValue, false );
        NewWorld.Time.Timeslider._lastValueReported=null;
    
        /***** make the ui visible *****/
        
        NewWorld_Time_setVisible(true);
            
    }
    
    else {
        NewWorld.Time.SliderMinValue = MIN ( begin,
                                             NewWorld.Time.SliderMinValue
                                           );
        NewWorld.Time.SliderMaxValue = MAX ( end,
                                             NewWorld.Time.SliderMaxValue
                                           );
        NewWorld.Time.Timeslider.set( 'minimum', NewWorld.Time.SliderMinValue, false );
        NewWorld.Time.Timeslider._lastValueReported=null;
        NewWorld.Time.Timeslider.set( 'maximum', NewWorld.Time.SliderMaxValue, false );
        NewWorld.Time.Timeslider._lastValueReported=null;
    
    }
    
    if (!NewWorld.Time.firstplay) {
        
        /***** update the time slider value *****/
        
        NewWorld.Time.time = NewWorld.Time.SliderMinValue
        last= NewWorld.Time.Timeslider.get("intermediateChanges")


        NewWorld.Time.Timeslider.set("intermediateChanges", false); // this helps prevent the onchange event from fireing
        NewWorld.Time.Timeslider.set( "value", NewWorld.Time.time, false );
        NewWorld.Time.Timeslider.set("intermediateChanges", last); // this helps prevent the onchange event from fireing
        NewWorld.Time.Timeslider._lastValueReported=null;
        NewWorld.Time.TSCurrentNode = NewWorld.Time.TSList.head;
        NewWorld.Time.BegCurrentNode = NewWorld.Time.BegList.head;
        NewWorld.Time.EndCurrentNode = NewWorld.Time.EndList.head;
    }
    
    
    NewWorld.Time.IgnoreSliderChange = false;
}

//fixme this is slow mo, use a circular list and test the dir to go
// actualy theres something else wrong our test data is in backwars so the loop N#EVER iterates
// so we need to fixme anyway

function NewWorld_Time_Insert_Node_Before(list, newnode, ts) {

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

function NewWorld_Time_addnode(treenode) {

    if (NewWorld.Settings.debug) console.log("NewWorld_Time_addnode(treenode)", treenode);
    
    var timestamp = null;
    var begin = null;
    var end = null;
    var node = null;
    NewWorld_Time_setVisible(true)
    
    //treenode.layer.setVisibility(true);
    //treenode.layer.div.style.visibility = "hidden";
                       
    /***** fix tyhe flicker *****/
    
    //treenode.layer.options.removeBackBufferDelay=0;
    
    /***** is it a timestamp? *****/
    
    if (treenode.timestamp != null) {
        
        /***** convert the timestamp to an int *****/
        
        timestamp = moment( treenode.timestamp ).valueOf();
        
        /***** create a new time node *****/
        
        var newnode = new NewWorld_Time_Node( treenode, timestamp);
        
        NewWorld_Time_Insert_Node_Before(NewWorld.Time.TSList, newnode, timestamp);

        /***** update the time slider *****/
        
        NewWorld_Time_setends( NewWorld.Time.TSList.head.data.timestamp,
                               NewWorld.Time.TSList.tail.data.timestamp
                            );
        
    }
    
    /***** timespan *****/
    
    else if (treenode.begin_timespan != null && treenode.end_timespan != null ) {
        begin = moment( treenode.begin_timespan ).valueOf();
        end = moment( treenode.end_timespan ).valueOf();
        
        /***** begin list *****/
        
        var newnode = new NewWorld_Time_Node( treenode, begin);
        
        NewWorld_Time_Insert_Node_Before(NewWorld.Time.BegList, newnode, begin);
        
        /***** end list ******/

        newnode = new NewWorld_Time_Node( treenode, end);
        
        NewWorld_Time_Insert_Node_Before(NewWorld.Time.EndList, newnode, end);
        
        /***** update the time slider *****/
        
        NewWorld_Time_setends( NewWorld.Time.BegList.head.data.timestamp,
                               NewWorld.Time.EndList.tail.data.timestamp
                            );
        
    }

    /***** we need to update the screen but not every time a node is added *****/
    /***** this timer should only expire after all the nodes are added     *****/


    if (NewWorld.Time.updatetimer) {
        window.clearInterval(NewWorld.Time.updatetimer);
    }
    NewWorld.Time.updatetimer = setInterval(
        function () {
            window.clearInterval(NewWorld.Time.updatetimer);
            NewWorld.Time.updatetimer = null;
            NewWorld_Time_Advance();
        },
        5000
    );
    
}

function NewWorld_Time_removenode_sub (list, treenode) {

    var node;
    for (node = list.head; node ; node = next) {
        next = node.next;
        if (treenode.id == node.data.treenode.id) {
            NewWorld.Time.TSCurrentNode.data.treenode.layer.setVisibility(false);
            DLList_delete(list, node);
            break;
        }
    }
    
    /***** TURN OFF THE VIS *****/
    
    treenode.layer.setVisibility(false);
    
    return node;
}

function NewWorld_Time_removenode(treenode) {
    
    if (NewWorld.Settings.debug) console.log("NewWorld_Time_removenode(treenode)", treenode);
    
    var node = null;
    var bext = null;
    var found = 0;


    /***** is it a timestamp? *****/
    
    if (treenode.timestamp != null) {
        
        node = NewWorld_Time_removenode_sub(TSList, treenode);
        
        if (NewWorld.Time.TSCurrentNode.data.treenode.id == node.data.treenode.id) {
            NewWorld.Time.TSCurrentNode = null;
        }

        /***** update the time slider *****/
        
        if (NewWorld.Time.TSList.head) {
            NewWorld_Time_setends( NewWorld.Time.TSList.head.data.timestamp,
                                   NewWorld.Time.TSList.tail.data.timestamp
                                );
        }    
    }
    
    /***** timespan *****/
    
    else if (treenode.begin_timespan != null && treenode.end_timespan != null ) {
        
        node = NewWorld_Time_removenode_sub(BegList, treenode);
        if (NewWorld.Time.BegCurrentNode.data.treenode.id == node.data.treenode.id) {
            NewWorld.Time.BegCurrentNode = null;
        }

        node = NewWorld_Time_removenode_sub(EndList, treenode);
        if (NewWorld.Time.EndCurrentNode.data.treenode.id == node.data.treenode.id) {
            NewWorld.Time.EndCurrentNode = null;
        }

        
        /***** update the time slider *****/
        
        if (NewWorld.Time.spanlist.head) {
            NewWorld_Time_setends( NewWorld.Time.BegList.head.data.timestamp,
                                   NewWorld.Time.EndList.tail.data.timestamp
                                );
        }
    }
    
    /***** hide the ui when there is no more nodes *****/
    
    if ( NewWorld.Time.TSList.head == null &&
         NewWorld.Time.spanlist.head == null
    ) {
        NewWorld_Time_setVisible(false);
    }
    
}

