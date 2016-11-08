/**
* Copyright 2016 Select Interactive, LLC. All rights reserved.
* @author: The Select Interactive dev team (www.select-interactive.com)
*/
(function( doc ) {
    'use strict';

    let adminForm = new app.AdminForm( {
		labelItemText: 'Tag',
		labelItemsText: 'Tags',
		loadItems: {
			fn: 'partnersGetJson',
			params: {
                partnerId: -1,
                projectId: -1
            },
			rowTmpl: '<div class="admin-grid-row{{rowClass}}" data-id="{{partnerId}}">' +
					 '<div class="admin-grid-col admin-grid-col-primary">{{name}}</div>' +
                     '<div class="admin-grid-col">{{active}}</div>' +
					 '<div class="admin-grid-col"><button class="btn btn-ripple btn-edit">Edit</button><button class="btn btn-ripple btn-delete">Delete</button></div>' +
					 '</div>',
			rowTmplHeaders: ['', 'Partner', 'Active'],
			rowTmplProps: ['partnerId', 'name', 'active']
		},
		editItem: {
			fn: 'partnersGetJson',
			params: {
                projectId: -1
            },
			itemId: 'partnerId'
		},
		saveItem: {
			fn: 'partnerSave',
			itemId: 'partnerId',
            sendAsString: true
		},
		deleteItem: {
			fn: 'partnerDelete',
			itemId: 'partnerId'
		},
		back: {},
		additionalProperties: {
            logoPath: '',
            logoFileName: ''
        }
	} );

}( document ) );