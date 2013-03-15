/*******************************************************************************
 *
 * Project: NewWorld
 * App:     javascript timeslider
 *
 * 
 *
 *******************************************************************************
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
******************************************************************************/

/***** fixme some of these shoiuld get stored in the hash     *****/
/***** if you were to share a link or bookmark the current    *****/
/***** time, loop settings, speed settings, and incr settings *****/

Ext.onReady(function() {
	NewWorld.Time = new Object();
	NewWorld.Time.timer = null;
	NewWorld.Time.firstplay = false;
	
	NewWorld.Time.list = new DLList();
	NewWorld.Time.currentlistnode = null;
	NewWorld.Time.spanlist = new DLList();
	NewWorld.Time.currentspannodebegin = null;
	NewWorld.Time.currentspannodeend = null;
	
	NewWorld.Time.SliderMinValue = null;
	NewWorld.Time.SliderMaxValue = null;
	NewWorld.Time.IgnoreSliderChange = false;
	
	NewWorld.Time.time = null;
	NewWorld.Time.loop = false;
	NewWorld.Time.speed = 1000;
	NewWorld.Time.incr = null;
	
});

function MIN (a,b) {
	return a < b ? a : b;
}
	
function MAX (a,b) {
	return a > b ? a : b;
}
	
function NewWorld_Time_Node(treenode, timestamp, begin, end) {
	this.treenode = treenode;
	this.timestamp = timestamp;
	this.begin = begin;
	this.end = end;
}

function NewWorld_Time_CreateSlider() {
	
	NewWorld.Time.placeholder = new Ext.Toolbar.Button({
		text: '',
		width: 1,
	});
	/***** play/pause button *****/
	
	NewWorld.Time.playbutton = new Ext.Toolbar.Button({
		text: ' Play',
		width: 45,
	    handler: NewWorld_Time_Interval_Play
	});
	
	/***** time slider *****/
	
	NewWorld.Time.Timeslider = new Ext.slider.SingleSlider({
		    fieldLabel: "Time",
		    width: 200,
		    value: 50,
		    increment: 1,
		    minValue: 0,
		    maxValue: 100000,
		    hideLabel: true,
		    useTips: false
	});
	
	NewWorld.Time.Timeslider.addListener('change', NewWorld_Time_Timeslider_change)
	
	/***** loop button *****/
	
	NewWorld.Time.loopbutton = new Ext.Toolbar.Button({
		text: "loop",
		width: 45,
    	enableToggle: true,
    	handler: NewWorld_Time_toggleloop
    });
    
	/***** increment chooser *****/
	
    var incrs = [
        [ "Second",     [ 1,   "s" ] ],
        [ "5 Seconds",  [ 5,   "s" ] ],
        [ "10 Seconds", [ 10,  "s" ] ],
        [ "15 Seconds", [ 15,  "s" ] ],
        [ "20 Seconds", [ 20,  "s" ] ],
        [ "30 Seconds", [ 30,  "s" ] ],
        [ "Minute",     [ 1,   "m" ] ],
        [ "5 Minutes",  [ 5,   "m" ] ],
        [ "10 Minutes", [ 10,  "m" ] ],
        [ "15 Minutes", [ 15,  "m" ] ],
        [ "20 Minutes", [ 20,  "m" ] ],
        [ "30 Minutes", [ 30,  "m" ] ],
        [ "Hour",       [ 1,   "h" ] ],
        [ "2 Hour",     [ 2,   "h" ] ],
        [ "3 Hour",     [ 3,   "h" ] ],
        [ "4 Hour",     [ 4,   "h" ] ],
        [ "6 Hour",     [ 6,   "h" ] ],
        [ "12 Hour",    [ 12,  "h" ] ],
        [ "Day",   	    [ 1,   "d" ] ],
        [ "2 Days",     [ 2,   "d" ] ],
        [ "4 Days",     [ 4,   "d" ] ],
        [ "Week",       [ 1,   "w" ] ],
        [ "2 Weeks",    [ 2,   "w" ] ],
        [ "15 Days",    [ 15,  "d" ] ],
        [ "3 Weeks",    [ 2,   "w" ] ],
        [ "4 Weeks",    [ 2,   "w" ] ],
        [ "Month",      [ 1,   "M" ] ],
        [ "2 Month",    [ 2,   "M" ] ],
        [ "3 Month",    [ 3,   "M" ] ],
        [ "6 Month",    [ 6,   "M" ] ],
		[ "Year",       [ 1,   "y" ] ],
        [ "2 Years",    [ 2,   "y" ] ],
        [ "5 Years",    [ 5,   "y" ] ],
        [ "Decade",     [ 10,  "y" ] ],
        [ "2 Decades",  [ 20,  "y" ] ],
        [ "5 Decades",  [ 50,  "y" ] ],
        [ "Century",    [ 100, "y" ] ],
        [ "2 Centurys", [ 200, "y" ] ],
        [ "5 Centurys", [ 500, "y" ] ],
    ];


	var incrstore = new Ext.data.ArrayStore({
        id: 0,
        fields: [ 'name', 'incr', 'seconds' ],
        data: incrs
    });
    
	NewWorld.Time.Incrbox = new Ext.form.ComboBox({
	    fieldLabel: 'incr',
	    typeAhead: true,
	    triggerAction: 'all',
	    lazyRender:true,
	    mode: 'local',
	    store: incrstore,
	    valueField: 'incr',
	    displayField: 'name',
	    width: 100,
	    labelWidth: 130,
	    value: incrs[10][1]
	});

	/***** fixme this dont work *****/
	
	NewWorld.Time.Incrbox.addListener('change', NewWorld_Time_Incrbox_change)
	
	/***** speed slider *****/
	
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
	
	var timebbar = [
	    NewWorld.Time.placeholder,
	    NewWorld.Time.playbutton, 
	    NewWorld.Time.Timeslider,
	    NewWorld.Time.loopbutton,
	    NewWorld.Time.Incrbox,
	    NewWorld.Time.Speedslider
	];

	NewWorld_Time_setVisible(false);

	
	return timebbar

}

/******************************************************************************
 * 
 * @brief function to toggle the loop var when the button is pressed
 * 
 * 
******************************************************************************/

function NewWorld_Time_toggleloop() {
	
	if (NewWorld.Time.loop)
		NewWorld.Time.loop = false;
	else
		NewWorld.Time.loop = true;
		
}



/******************************************************************************
 * 
 * @brief function to hide/show the time slider controlls
 * 
 * 
******************************************************************************/

function NewWorld_Time_setVisible(bool) {
	NewWorld.Time.playbutton.setVisible(bool);
	NewWorld.Time.Timeslider.setVisible(bool);
	NewWorld.Time.loopbutton.setVisible(bool);
	NewWorld.Time.Incrbox.setVisible(bool);
	NewWorld.Time.Speedslider.setVisible(bool);
}

/******************************************************************************
 * 
 * @brief callback function for when the speed slider changes
 * 
 * 
******************************************************************************/

function NewWorld_Time_Speedslider_change( slider, newValue, thumb ) {
	
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
	
	var node;
	
	for (node = NewWorld.Time.currentspannode ; node ; node = node.next) {
		node.data.treenode.attributes.layer.setVisibility(false);
	}
	
}

/******************************************************************************
 * 
 * @brief function go forward though the layers to turn on/off layes for
 * the current timestamp
 * 
******************************************************************************/

/***** fixme fix flicker *****/

function NewWorld_Time_Advance() {
	var node;
	
		/***** if the currentspannode is null, reset to head *****/
	
	if (NewWorld.Time.currentspannode == null)
		NewWorld.Time.currentspannode = NewWorld.Time.spanlist.head
	
	/***** starting at the current node loop *****/
	
	for (node = NewWorld.Time.currentspannode ; node ; node = node.next) {
		
		/***** are we  past the event? *****/
		
		if (NewWorld.Time.time >= node.data.timestamp) {
			if ( NewWorld.Time.time >= node.data.begin &&
				 NewWorld.Time.time < node.data.end
			   ) { 
				if (!node.data.treenode.attributes.layer.getVisibility() ) {
					node.data.treenode.attributes.layer.setVisibility(true);
				}
			}
			
			else {
					
				if (node.data.treenode.attributes.layer.getVisibility() )
					node.data.treenode.attributes.layer.setVisibility(false);
			}
			
			NewWorld.Time.currentspannode = node;
		}
		
		/***** if the next event hasnt expired yet just stop the loop *****/
		
		else {
			break;
		}
	}
}


/******************************************************************************
 * 
 * @brief callback function for when the time slider changes
 * 
 * 
******************************************************************************/

function NewWorld_Time_Timeslider_change( slider, newValue, thumb ) {
	
	if (NewWorld.Time.IgnoreSliderChange)
		return;
		
		
	alert("gotcha");
	/***** stop if playing *****/
	
	if (NewWorld.Time.timer != null) {
		NewWorld_Time_Interval_Pause();
	}
	
	/***** if the move was backwards, turn off whats on *****/
	
	if (newValue < NewWorld.Time.time ) {
	
		NewWorld.Time.time = newValue;
		NewWorld_Time_expire_remaining();
		
		NewWorld.Time.currentspannode = NewWorld.Time.spanlist.head;
	}
	
	/***** forward move, update the time only *****/
	
	else {
		NewWorld.Time.time = newValue;
	}
	
	/***** now we can go ahead and update the display *****/
	
	NewWorld_Time_Advance();
}
	
/******************************************************************************
 * 
 * @brief callback function for when the time slider changes
 * 
 * 
******************************************************************************/

function NewWorld_Time_Incrbox_change( slider, newValue, thumb ) {
	
	/***** set the new value *****/

	NewWorld.Time.incr = newValue;
	
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

function NewWorld_Time_Interval_Update() {
	var stopped = false;
	var looped = false;
	var node = null;
	
	/***** fixme read a var not call a function *****/
	
	var incr = NewWorld.Time.Incrbox.getValue();
	
	/***** make sure the slider is in sync with the var *****/
	
	if (NewWorld.Time.time == null)
		NewWorld.Time.time = NewWorld.Time.SliderMinValue;
	
	/***** incr the time *****/
	
	lasttime = moment( NewWorld.Time.time );
	lasttime.add(incr[0], incr[1])
	
	NewWorld.Time.time = lasttime.valueOf();
	
	/***** are we past the end time *****/
	
	if (NewWorld.Time.time > NewWorld.Time.SliderMaxValue) {
		
		/***** is the loop button pressed *****/
		
		if ( ! NewWorld.Time.loop) {
			NewWorld_Time_Interval_Pause();
			stopped = true
		}
		
		NewWorld.Time.time = NewWorld.Time.SliderMinValue
		
		NewWorld_Time_expire_remaining();
		
		NewWorld.Time.currentspannode = NewWorld.Time.spanlist.head;
			
	}
	
	/***** update the time slider *****/
	
	NewWorld.Time.IgnoreSliderChange = true;
	NewWorld.Time.Timeslider.setValue( NewWorld.Time.time, true );
	NewWorld.Time.IgnoreSliderChange = false;
	
	/***** update the display *****/
	
	NewWorld_Time_Advance();
	
}

/******************************************************************************
 * 
 * @brief function to start the animation
 * 
******************************************************************************/

function NewWorld_Time_Interval_Play() {
	
	NewWorld.Time.firstplay = true;
	
	if (NewWorld.Time.timer == null) {
		
		NewWorld.Time.timer = setInterval( NewWorld_Time_Interval_Update ,
										   NewWorld.Time.speed);
										   
		NewWorld.Time.playbutton.setText('Pause'); 
		NewWorld.Time.playbutton.setHandler(NewWorld_Time_Interval_Pause);
		
	}
	
}

/******************************************************************************
 * 
 * @brief function to stop the animation
 * 
******************************************************************************/

function NewWorld_Time_Interval_Pause() {
	
	if (NewWorld.Time.timer != null) {
		clearInterval(NewWorld.Time.timer);
		NewWorld.Time.timer = null;
		
		NewWorld.Time.playbutton.setText(' Play'); 
		NewWorld.Time.playbutton.setHandler(NewWorld_Time_Interval_Play);
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
		
	NewWorld.Time.IgnoreSliderChange = true;
	
	/***** update the time slider *****/
	
	if (NewWorld.Time.SliderMinValue == null) {
		NewWorld.Time.SliderMinValue = begin;
		NewWorld.Time.SliderMaxValue = end;
	
		NewWorld.Time.Timeslider.setMinValue( NewWorld.Time.SliderMinValue );
		NewWorld.Time.Timeslider.setMaxValue( NewWorld.Time.SliderMaxValue );
	
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
		NewWorld.Time.Timeslider.setMinValue( NewWorld.Time.SliderMinValue );
		NewWorld.Time.Timeslider.setMaxValue( NewWorld.Time.SliderMaxValue );
	
	}
	
	if (!NewWorld.Time.firstplay) {
		
		/***** update the time slider value *****/
		
		NewWorld.Time.Timeslider.setValue( NewWorld.Time.SliderMinValue )
		NewWorld.Time.time = NewWorld.Time.SliderMinValue;
	}
	
	
	NewWorld.Time.IgnoreSliderChange = false;
}
	
	
/******************************************************************************
 * 
 * @brief function to add a layer to be animated
 * 
 * @param treenode		the ext layer tree node to add
 * 
 * @returns nothing
 * 
******************************************************************************/

/***** fixme we need to see if they need turned on when the nodes are added *****/

function NewWorld_Time_addnode(treenode) {
	var timestamp = null;
	var begin = null;
	var end = null;
	var node = null;
	NewWorld_Time_setVisible(true)
	
	//treenode.attributes.layer.setVisibility(true);
	//treenode.attributes.layer.div.style.visibility = "hidden";
			   		
	/***** fix tyhe flicker *****/
	
	//treenode.attributes.layer.options.removeBackBufferDelay=0;
	
	/***** is it a timestamp? *****/
	
	if (treenode.attributes.timestamp != null) {
		
		/***** convert the timestamp to an int *****/
		
		timestamp = moment( treenode.attributes.timestamp ).valueOf();
		
		/***** create a new time node *****/
		
		var timenode = new NewWorld_Time_Node( treenode, timestamp, null, null)
		
		/***** sort the list by time on insert *****/
		
		for (node = NewWorld.Time.list.head; node ; node = node.next) {
			if (timestamp < node.data.timestamp) {
				DLList_insert_before ( NewWorld.Time.list, node, timenode );
				break;
			}
		}
		
		/***** if node is null there was no insert     *****/
		/***** either the list was empty or the        *****/
		/***** timestamp is greater than the last node *****/
		
		if (!node) {
			DLList_append(NewWorld.Time.list, timenode);
		}
		
		/***** update the time slider *****/
		
		NewWorld_Time_setends( NewWorld.Time.list.head.data.timestamp,
							   NewWorld.Time.list.tail.data.timestamp
							);
		
	}
	
	/***** timespan *****/
	
	else if (treenode.attributes.begin_timespan != null && treenode.attributes.end_timespan != null ) {
		begin = moment( treenode.attributes.begin_timespan ).valueOf();
		end = moment( treenode.attributes.end_timespan ).valueOf();
		
			/***** create a new time node *****/
		
		var timenode = new NewWorld_Time_Node( treenode, begin, begin, end)
		
		/***** sort the list by begin time on insert *****/
		
		for (node = NewWorld.Time.spanlist.head; node ; node = node.next) {
			if (begin < node.data.timestamp) {
				node = DLList_insert_before ( NewWorld.Time.spanlist, node, timenode );
				break;
			}
		}
		
		/***** if node is null there was no insert      *****/
		/***** either the list was empty or the         *****/
		/***** begin time is greater than the last node *****/
		
		if (!node) {
			DLList_append(NewWorld.Time.spanlist, timenode);
		}
		
		var timenode = new NewWorld_Time_Node( treenode, end, begin, end)
		
		/***** sort the list by end time on insert *****/
		
		for ( ; node ; node = node.next) {
			if (end > node.data.timestamp) {
				DLList_insert_after ( NewWorld.Time.spanlist, node, timenode );
				break;
			}
		}
		
		/***** if node is null there was no insert *****/
		/***** either the list was empty or the    *****/
		/***** end time is less than the last node *****/
		
		if (!node) {
			DLList_append(NewWorld.Time.spanlist, timenode);
		}
		
		/***** update the time slider *****/
		
		NewWorld_Time_setends( NewWorld.Time.spanlist.head.data.timestamp,
							   NewWorld.Time.spanlist.tail.data.timestamp
							);
		
	}
	
}

function NewWorld_Time_removenode(treenode) {
	
	var node = null;
	var bext = null;
	var found = 0;


	/***** is it a timestamp? *****/
	
	if (treenode.attributes.timestamp != null) {
		
		for (node = NewWorld.Time.list.head; node ; node = next) {
			next = node.next;
			if (treenode.attributes.id == node.data.treenode.attributes.id) {
				DLList_delete(NewWorld.Time.list, node);
				break;
			}
		}
		
		/***** update the time slider *****/
		
		if (NewWorld.Time.list.head) {
			NewWorld_Time_setends( NewWorld.Time.list.head.data.timestamp,
								   NewWorld.Time.list.tail.data.timestamp
								);
		}	
	}	
	
	/***** timespan *****/
	
	else if (treenode.attributes.begin_timespan != null && treenode.attributes.end_timespan != null ) {
		
		
		for ( node = NewWorld.Time.spanlist.head, found = 0;
			  node && found < 2;
			  node = next
			) {
			
			next = node.next;
			if (treenode.attributes.id == node.data.treenode.attributes.id) {
				DLList_delete(NewWorld.Time.spanlist, node);
				
				/***** it should only be in the list twice *****/

				found++;
			}
		}
		
		/***** update the time slider *****/
		
		if (NewWorld.Time.spanlist.head) {
			NewWorld_Time_setends( NewWorld.Time.spanlist.head.data.timestamp,
								   NewWorld.Time.spanlist.tail.data.timestamp
								);
		}
	}
	
	/***** hide the ui when there is no more nodes *****/
	
	if ( NewWorld.Time.list.head == null &&
		 NewWorld.Time.spanlist.head == null
	) {
		NewWorld_Time_setVisible(false);
	}
	
	

}

