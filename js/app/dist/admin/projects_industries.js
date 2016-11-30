'use strict'; /**
              * Copyright 2016 Select Interactive, LLC. All rights reserved.
              * @author: The Select Interactive dev team (www.select-interactive.com)
              */
(function (doc) {
	'use strict';

	var adminForm = new app.AdminForm({
		labelItemText: 'Industry',
		labelItemsText: 'Industries',
		loadItems: {
			fn: 'industriesGetJson',
			params: {
				industryId: -1,
				projectId: -1 },

			rowTmpl: '<div class="admin-grid-row{{rowClass}}" data-id="{{industryId}}">' +
			'<div class="admin-grid-col admin-grid-col-primary">{{industry}}</div>' +
			'<div class="admin-grid-col">{{active}}</div>' +
			'<div class="admin-grid-col"><button class="btn btn-ripple btn-edit">Edit</button><button class="btn btn-ripple btn-delete">Delete</button></div>' +
			'</div>',
			rowTmplHeaders: ['', 'Industry', 'Active'],
			rowTmplProps: ['industryId', 'industry', 'active'] },

		editItem: {
			fn: 'industriesGetJson',
			params: {
				projectId: -1 },

			itemId: 'industryId' },

		saveItem: {
			fn: 'industrySave',
			itemId: 'industryId',
			sendAsString: true },

		deleteItem: {
			fn: 'industryDelete',
			itemId: 'industryId' },

		back: {},
		additionalProperties: {} });


})(document);
//# sourceMappingURL=projects_industries.js.map
