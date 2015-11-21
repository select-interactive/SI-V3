///<reference path="main.js">
///<reference path="admin.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	var
        settings = {
        	// base itemId and webservice URL
        	itemId: -1,

        	// load data ws function, params, callback (optional)
        	load: {
        		callback: loadItem
        	},

        	// save function
        	save: {
        		fn: 'saveItem'
        	},

        	// if the default delete behavior should be used
        	del: true,

        	// the Parse object of data
        	item: 'Category',

        	// how the option text should be set
        	//   using the Parse obj
        	setOptionText: function( obj ) {
        		return obj.get( 'category' );
        	}
        },

        // Parse settings
        //   object = the Parse cloud object
        //   querySort = the column to sort items by
        parse = {
        	object: 'BlogCategory',
        	querySort: 'category'
        },

        // events for buttons/inputs (file upload)
        inputEvents = [
            {
            	el: doc.getElementById( 'btn-item-save' ),
            	evtName: 'click',
            	handler: saveItem
            }
        ],

        // optional other data for the item
        otherData = {};

	// call the admin init function passing this pages specific data/items
	app.admin.init( settings, parse, inputEvents, otherData, saveItem );

	function loadItem() {
		app.forms.checkActive();
	}

	function saveItem() {
		var params = app.admin.collectData(),
            isValid = app.admin.validateReqFields();

		if ( isValid ) {
			params.url = app.admin.createUrl( params.category );
			app.admin.saveItem( settings.save.fn, params );
		}
	}

}( document ) );