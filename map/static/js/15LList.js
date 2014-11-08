/*******************************************************************************
 *
 * Project: NewWorld
 * App:     javascript double linked list
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

function DLList_node (data) {
	
	this.prev = null;
	this.next = null;
	this.data = data;

}

function DLList () {

	this.length = 0;
	this.head = null;
	this.tail = null;

}

/*******************************************************************************
	function to add a node to the head of a double linked list
	
	Arguments:
				list	the linked list
				data	the data you wish to store in the linked list
	
	returns:
				the New node
				null on error
				
*******************************************************************************/

function DLList_prepend ( list, data) {
	
	var New = new DLList_node(data);

	New.next = list.head;
	New.prev = null;
	list.head = New;

	/***** empty list? *****/

	if (!list.tail)
		list.tail = New;
	else
		New.next.prev = New;
		
	list.length++;
	
	return New;
}

/*******************************************************************************
	function to add a node to the tail of a double linked list
	
	Arguments:
				list	the linked list
				data	the data you wish to store in the linked list
	
	returns:
				the New node
				null on error
				
*******************************************************************************/

function DLList_append (list, data) {

	var New = new DLList_node(data);

	New.next = null;
	New.prev = list.tail;
	list.tail = New;

	/***** empty list? *****/

	if (!list.head)
		list.head = New;
	else
		New.prev.next = New;
		
	list.length++;

	return New;
}

/*******************************************************************************
	function to add a node after any node in a double linked list
	
	Arguments:
				list	the linked list
				node	the node you wish to place the New node after
				data	the data you wish to store in the linked list
		
	returns:
				the New node
				null on error

  note:
        if node is null or the list is empty the New node will be appended to
        the list
 
*******************************************************************************/

function DLList_insert_after ( list, node, data) {
	var New = new DLList_node(data);

	New.next = null;
	New.prev = null;

	/***** empty list? *****/

	if (!list.head && !list.tail) {
		list.head = New;
		list.tail = New;
	}
    
    /***** last entry or node is null *****/

	else if (list.tail == node || !node) {
		New.prev = list.tail;
		list.tail.next = New;
		list.tail = New;

	}

	/***** middle entry *****/

	else {
		New.prev = node;
		New.next = node.next;
		node.next.prev = New;
		node.next = New;
	}
		
	list.length++;

	return New;
}

/*******************************************************************************
	function to add a node before any node in a double linked list
	
	Arguments:
				list	the linked list
				node	the node you wish to place the New node before
				data	the data you wish to store in the linked list
	
	returns:
				the New node
				null on error
  
  note:
        if node is null or the list is empty the New node will be prepended to
        the list
 
*******************************************************************************/

function DLList_insert_before ( list, node, data) {
	var New = new DLList_node(data);

	New.next = null;
	New.prev = null;

	/***** empty list? *****/

	if (!list.head && !list.tail) {
		list.head = New;
		list.tail = New;
	}

	/***** first entry or node is null *****/

	else if (list.head == node || !node) {
		New.next = list.head;
		list.head.prev = New;
		list.head = New;
	}

	/***** middle entry *****/

	else {
		New.prev = node.prev;
		New.next = node;
		node.prev.next = New;
		node.prev = New;
	}
		
	list.length++;

	return New;
}

/*******************************************************************************
	function to delete a node from a double linked list
	
	Arguments:
				list	the linked list
				node	the node you wish to delete
	
	returns:
				the data the node held
				
*******************************************************************************/

function DLList_delete ( list, node) {
	var result = node.data;

	/***** only entry *****/

	if (list.head == node && list.tail == node) {
		list.head = null;
		list.tail = null;
	}

	/***** last entry *****/

	else if (node == list.tail) {
		node.prev.next = null;
		list.tail = node.prev;
	}

	/***** first entry *****/

	else if (node == list.head) {
		node.next.prev = null;
		list.head = node.next;
	}

	/***** middle entry? *****/

	else {
		node.prev.next = node.next;
		node.next.prev = node.prev;
	}

	//free (node);
	list.length--;

	return result;
}

/*******************************************************************************
	function to delete the node after a node in a double linked list
	
	Arguments:
				list	the linked list
				node	the node before the node you wish to delete
	
	returns:
				the data the node held
				
*******************************************************************************/

function DLList_delete_after ( list, node) {
	var next = null;
	var result = null;

	/***** node only entry? *****/

	if (list.head == node && list.tail == node) {
	}

	/***** node last entry? *****/

	else if (node == list.tail) {
	}

	else {
    	next = node.next;
		result = next.data;

		/***** last entry *****/

		if (next == list.tail) {
			node.next = null;
			list.tail = node;
		}

		/***** middle entry? *****/

		else {
			next.next.prev = node;
			node.next = next.next;
		}

		//free (next);
    
		list.length--;
	}

	return result;
}

/*******************************************************************************
	function to delete the node before a node in a double linked list
	
	Arguments:
				list	the linked list
				node	the node after the node you wish to delete
	
	returns:
				the data the node held
				
*******************************************************************************/

function DLList_delete_before ( list, node) {
	var prev = null;
	var result = null;

	/***** node only entry? *****/

	if (list.head == node && list.tail == node) {
	}

	/***** node first entry? *****/

	else if (node == list.head) {
	}

	else {
    prev = node.prev;
		result = prev.data;

		/***** first entry *****/

		if (prev == list.head) {
			node.prev = null;
			list.head = node;
		}

		/***** middle entry? *****/

		else {
			prev.prev.next = node;
			node.prev = prev.prev;
		}

		//free (prev);
		
		list.length--;
	}

	return result;
}


/*******************************************************************************
	function to count the nodes in a double linked list
	
	Arguments:
				list	the linked list
	
	returns:
				the number of nodes in the linked list

*******************************************************************************/

function DLList_length ( list) {
	var result = list.length;

	return result;
}

/*******************************************************************************
	function to iterate a double linked list
	
	Arguments:
				list 		the linked list
				callback	the function to pass each node to for processing
				extra		extra data to pass to/from the proccessing function
	
	return:
			the non null returned from the proccessing function that stops the
			iteration
			null if the end of the linked list was reached

*******************************************************************************/

function DLList_iterate ( list, callback, extra) {
	var node = null;
	var next = null;
	var result = null;

	for (node = list.head; node && !result; node = next) {
		next = node.next;
		result = callback (list, node, node.data, extra);
	}

	return result;
}

/*******************************************************************************
	slave function to delete all the nodes in a linked list
*******************************************************************************/

function DLList_delete_all_iterate ( list, node, data, extra) {
	var data_free = extra;

	data_free (node.data);

	DLList_delete (list, node);

	return null;
}

/*******************************************************************************
	function to delete all the nodes in a double linked list
	
	Arguments:
				list		the linked list
				data_free	the function to call to free the data

	returns:
				nothing

*******************************************************************************/

function DLList_delete_all ( list, data_free) {

	DLList_iterate (list, DLList_delete_all_iterate, data_free);
	
	return;
}

/*******************************************************************************
	function to move another double linked list to the head of a double linked
	list
	
	Arguments:
				dest	the linked list you want to move the src to
				src		the linked list you want to move to the dest
	
	returns:
				nothing

*******************************************************************************/

function DLList_prepend_list ( dest, src) {

	/***** is src an empty list *****/

	if (!src.head) {
	}

	else {
		
		if (dest.head)
			dest.head.prev = src.tail;
		
		src.tail.next = dest.head;
		dest.head = src.head;
	}

	dest.length += src.length;
	src.head = null;
	src.tail = null;
	src.length = 0;

	return;
}

/*******************************************************************************
	function to move another double linked list to the tail of a double linked
	list
	
	Arguments:
				dest	the linked list you want to move the src to
				src		the linked list you want to move to the dest
	
	returns:
				nothing

*******************************************************************************/

function DLList_append_list ( dest, src) {

	/***** is dest empty list? *****/

	if (!dest.head) {
		dest.head = src.head;
		dest.tail = src.tail;
	}

	/***** is src an empty list *****/

	else if (!src.head) {
	}

	/*****  neither is empty? *****/

	else {
		dest.tail.next = src.head;
		src.head.prev = dest.tail;
		dest.tail = src.tail;
	}

	dest.length += src.length;
	src.head = null;
	src.tail = null;
	src.length = 0;

	return;
}

/*******************************************************************************
	function to move another double linked list to the middle of a double linked
	list, after a particular node
	
	Arguments:
				dest	the linked list you want to move the src to
				src		the linked list you want to move to the dest
				node	the node you wish to insert src after
	returns:
				nothing
	
	if node is null src is appended to dest

*******************************************************************************/

function DLList_insert_list_after ( dest, src, node) {
	
	/***** is node null? then append *****/

	if (!node)
		DLList_append_list (dest, src);

	/***** if node is tail were appending *****/
	
	else if (node == dest.tail)
		DLList_append_list (dest, src);
	
	/***** is dest empty list? *****/

	else if (!dest.head) {
		dest.head = src.head;
		dest.tail = src.tail;
	}

	/***** is src an empty list *****/

	else if (!src.head) {
	}

	else {

		src.tail.next = node.next;
		node.next.prev = src.tail;
		node.next = src.head;
		src.head.prev = node;
		
	}

	dest.length += src.length;
	src.head = null;
	src.tail = null;
	src.length = 0;

	return;
}

/*******************************************************************************
	function to move another double linked list to the middle of a double linked
	list, before a particular node
	
	Arguments:
				dest	the linked list you want to move the src to
				src		the linked list you want to move to the dest
				node	the node you wish to insert src before

	returns:
				nothing
	
	notes:
				if node is null src is appended to dest

*******************************************************************************/

function DLList_insert_list_before ( dest, src, node) {
	
	/***** is node null? then prepend *****/

	if (!node)
		DLList_prepend_list (dest, src);

	/***** if node is head were prepending *****/
	
	else if (node == dest.head)
		DLList_prepend_list (dest, src);
	
	/***** is dest empty list? *****/

	else if (!dest.head) {
		dest.head = src.head;
		dest.tail = src.tail;
	}

	/***** is src an empty list *****/

	else if (!src.head) {
	}

	else {
		node.prev.next = src.head;
		src.head.prev = node.prev;
		node.prev = src.tail;
		src.tail.next = node;
	}

	dest.length += src.length;
	src.head = null;
	src.tail = null;
	src.length = 0;

	return;
}

/*******************************************************************************
	function to copy another list to the head of a double linked list
	
	
	Arguments:
				dest		the linked list you want to copy the src to
				src			the linked list you want to copy to the dest
				copy_func	function to copy the data held in each node
	
	returns:
				null on success
				the src node we were trying to copy when malloc failed
	
	notes:
				you can cast a SLList, stackLList , QLList, or DQLList to DLList
				for the src argument
				
*******************************************************************************/

function DLList_prepend_list_copy ( dest, src, copy_func) {
	var node = null;
	var Newdata = null;
	var result = null;
	var prev = null;

	for (node = src.head; node && !result; node = node.next) {

		/***** copy the data *****/

		if (!(Newdata = copy_func (node.data))) {
			result = node;
		}

		else {

			/***** first node we copy? *****/

			if (!prev) {
				if (!(prev = DLList_prepend (dest, Newdata)))
					result = node;
			}

			/***** nope insert the node after the last one we copyed *****/

			else if (!(prev = DLList_insert_after (dest, prev, Newdata)))
				result = node;
		}
	}

	return result;
}

/*******************************************************************************
	function to copy another list to the tail of a double linked list
	
	
	Arguments:
				dest		the linked list you want to copy the src to
				src			the linked list you want to copy to the dest
				copy_func	function to copy the data held in each node
	
	returns:
				null on success
				the src node we were trying to copy when malloc failed
	
	notes:
				you can cast a SLList, stackLList , QLList, or DQLList to DLList
				for the src argument
				
*******************************************************************************/

function DLList_append_list_copy ( dest, src, copy_func) {
	var node = null;
	var Newdata = null;
	var result = null;
  
	for (node = src.head; node && !result; node = node.next) {

		/***** copy the data *****/

		if (!(Newdata = copy_func (node.data))) {
			result = node;
		}
		/**** append the node *****/

		else if (!DLList_append (dest, Newdata))
			result = node;
	}

	return result;
}

/*******************************************************************************
	function to copy another list to the middle of a double linked list, after
	a particular node

	
	Arguments:
				dest		the linked list you want to copy the src to
				src			the linked list you want to copy to the dest
				node		the dest node you wish to copy the data after
				copy_func	function to copy the data held in each node
	
	returns:
				null on success
				the src node we were trying to copy when malloc failed
	
	notes:
				you can cast a SLList, stackLList , QLList, or DQLList to DLList
				for the src argument
				
*******************************************************************************/

function DLList_insert_list_after_copy ( dest, src, node, copy_func) {
	var srcnode = null;
	var Newdata = null;
	var result = null;
	var prev = node;

	for (srcnode = src.head; srcnode && !result; srcnode = srcnode.next) {

		/***** copy the data *****/

		if (!(Newdata = copy_func (srcnode.data)))
			result = srcnode;

		/**** insert the node *****/

		else if (!(prev = DLList_insert_after (dest, prev, Newdata)))
			result = srcnode;
	}

	return result;
}

/*******************************************************************************
	function to copy another list to the middle of a double linked list, before
	a particular node

	
	Arguments:
				dest		the linked list you want to copy the src to
				src			the linked list you want to copy to the dest
				node		the dest node you wish to copy the data before
				copy_func	function to copy the data held in each node
	
	returns:
				null on success
				the src node we were trying to copy when malloc failed
	
	notes:
				you can cast a SLList, stackLList , QLList, or DQLList to DLList
				for the src argument
				
*******************************************************************************/

function DLList_insert_list_before_copy ( dest, src, node, copy_func) {
	var srcnode = null;
	var Newdata = null;
	var result = null;
	var prev = null;
  
  for (srcnode = src.head; srcnode && !result; srcnode = srcnode.next) {

		/***** copy the data *****/

		if (!(Newdata = copy_func (srcnode.data)))
			result = srcnode;

		/**** insert the node *****/

		else if (!(prev = DLList_insert_before (dest, node, Newdata)))
				result = srcnode;
	}

	return result;
}

/*******************************************************************************
	function to sort a double linked list
	
	Arguments:
				list		the linked list to sort
				cmp_func	function to compare the data in 2 nodes
	
	Returns:
				nothing

	Notes:


*******************************************************************************/

function DLList_sort ( list, cmp_func) {
	a = new DLList();
	b = new DLList();
	New = new DLList();
    next = null;
  
	mergesize = 1;
	merges;
	i;
  
	/***** if the list has one or less nodes its already sorted *****/

	if (list.length < 2)
		return;

	/***** assign the list to New *****/

	New = list;
  
	do {
		merges = 0;

		/***** assign New to a *****/
    
		a = New;
    
    /***** clear New *****/
    
    New.head = New.tail = null;

		for (b.head = a.head; a.head; a.head = b.head) {
			merges++;
      
      a.length = 0;
      
      /***** make b point to mergesize nodes after a *****/
      
			for (i = 0 ; b.head && i < mergesize; i++) {
				a.length++;
				b.head = b.head.next;
			}

			b.length = mergesize;
      
      /***** merge while a or b has something to merge *****/
      
			while (a.length > 0 || (b.length > 0 && b.head)) {
        
        /***** is a empty? *****/

        if (a.length == 0)
          next = b;

        /***** is b empty or a lower than b? *****/

        else if (b.length == 0 || !b.head ||
             cmp_func (a.head.data, b.head.data) <= 0)
          next = a;

        /***** b is lower *****/

        else
          next = b;

        /***** ad next to the New list *****/
        
        /***** is New empty? *****/
        if (!New.head) {
          New.head = New.tail = next.head;
          New.head.prev = null;
        }
        else {
          next.head.prev = New.tail;
          New.tail = New.tail.next = next.head;
        }

        /***** next is pointing at a or b make its head   *****/
        /***** point at its next node and decr its length *****/

        next.length--;
        next.head = next.head.next;
        
        New.tail.next = null;

      }
    }

	/***** double the mergesize *****/

		mergesize *= 2;

	/***** loop till theres one or less merges *****/

	} while (merges > 1);

	/***** reassign the sorted list to the list *****/

	list.head = New.head;
	list.tail = New.tail;
  
	return;
}
