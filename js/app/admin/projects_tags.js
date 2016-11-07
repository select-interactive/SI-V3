/**
* Copyright 2016 Select Interactive, LLC. All rights reserved.
* @author: The Select Interactive dev team (www.select-interactive.com)
*/
(function( doc ) {
    'use strict';

    let adminForm = new app.AdminForm( {
		labelItemText: '',
		labelItemsText: '',
		loadItems: {
			fn: '',
			params: {},
			rowTmpl: '<div class="admin-grid-row{{rowClass}}" data-id="{{tagId}}">' +
					 '<div class="admin-grid-col admin-grid-col-primary">{{tag}}</div>' +
                     '<div class="admin-grid-col">{{active}}</div>' +
					 '<div class="admin-grid-col"><button class="btn btn-ripple btn-edit">Edit</button><button class="btn btn-ripple btn-delete">Delete</button></div>' +
					 '</div>',
			rowTmplHeaders: ['', 'Tag Name', 'Active'],
			rowTmplProps: ['tagId', 'tag', 'active']
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