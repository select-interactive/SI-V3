'use strict'; /**
              * Copyright 2016 Select Interactive, LLC. All rights reserved.
              * @author: The Select Interactive dev team (www.select-interactive.com)
              */
(function (doc) {
	'use strict';

	var adminForm = new app.AdminForm({
		labelItemText: 'Tag',
		labelItemsText: 'Tags',
		loadItems: {
			fn: 'projectTagsGetJson',
			params: {
				tagId: -1,
				projectId: -1 },

			rowTmpl: '<div class="admin-grid-row{{rowClass}}" data-id="{{tagId}}">' +
			'<div class="admin-grid-col admin-grid-col-primary">{{tag}}</div>' +
			'<div class="admin-grid-col">{{active}}</div>' +
			'<div class="admin-grid-col"><button class="btn btn-ripple btn-edit">Edit</button><button class="btn btn-ripple btn-delete">Delete</button></div>' +
			'</div>',
			rowTmplHeaders: ['', 'Tag Name', 'Active'],
			rowTmplProps: ['tagId', 'tag', 'active'] },

		editItem: {
			fn: 'projectTagsGetJson',
			params: {
				projectId: -1 },

			itemId: 'tagId' },

		saveItem: {
			fn: 'projectTagSave',
			itemId: 'tagId',
			sendAsString: true },

		deleteItem: {
			fn: 'projectTagDelete',
			itemId: 'tagId' },

		back: {},
		additionalProperties: {} });


})(document);
//# sourceMappingURL=projects_tags.js.map
