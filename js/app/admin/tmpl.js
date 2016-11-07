///<reference path="main.js">
/**
 * Copyright 2016 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	let adminForm = new app.AdminForm( {
		labelItemText: '',
		labelItemsText: '',
		loadItems: {
			fn: '',
			params: {},
			rowTmpl: '<div class="admin-grid-row{{rowClass}}" data-id="{{id}}">' +
					 '<div class="admin-grid-col admin-grid-col-primary">{{name}}</div>' +
					 '<div class="admin-grid-col"><button class="btn btn-ripple btn-edit">Edit</button><button class="btn btn-ripple btn-delete">Delete</button></div>' +
					 '</div>',
			rowTmplHeaders: ['', 'Name'],
			rowTmplProps: ['id', 'name']
		},
		editItem: {
			fn: '',
			params: {},
			itemId: 'id'
		},
		saveItem: {
			fn: '',
			itemId: ''
		},
		deleteItem: {
			fn: '',
			itemId: 'id'
		},
		back: {},
		additionalProperties: {}
	} );

}( document ) );