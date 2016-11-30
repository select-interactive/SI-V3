'use strict'; /**
              * Copyright 2016 Select Interactive, LLC. All rights reserved.
              * @author: The Select Interactive dev team (www.select-interactive.com)
              */
(function (doc) {
	'use strict';

	var alert = new app.Alert();

	var adminForm = new app.AdminForm({
		labelItemText: 'Partner',
		labelItemsText: 'Partners',
		loadItems: {
			fn: 'partnersGetJson',
			params: {
				partnerId: -1,
				projectId: -1 },

			rowTmpl: '<div class="admin-grid-row{{rowClass}}" data-id="{{partnerId}}">' +
			'<div class="admin-grid-col admin-grid-col-primary">{{name}}</div>' +
			'<div class="admin-grid-col">{{active}}</div>' +
			'<div class="admin-grid-col"><button class="btn btn-ripple btn-edit">Edit</button><button class="btn btn-ripple btn-delete">Delete</button></div>' +
			'</div>',
			rowTmplHeaders: ['', 'Partner', 'Active'],
			rowTmplProps: ['partnerId', 'name', 'active'] },

		editItem: {
			fn: 'partnersGetJson',
			params: {
				projectId: -1 },

			itemId: 'partnerId',
			callback: editItemCallback },

		saveItem: {
			fn: 'partnerSave',
			itemId: 'partnerId',
			sendAsString: true },

		deleteItem: {
			fn: 'partnerDelete',
			itemId: 'partnerId' },

		back: {
			fn: back },

		additionalProperties: {
			logoPath: '',
			logoFileName: '' } });



	var btnUploadImg = app.$('#btn-upload-img');
	var fUploadImg = app.$('#f-upload-img');
	var prevImg = app.$('#prev-img');
	var btnImgDelete = app.$('#btn-img-delete');

	btnUploadImg.addEventListener('click', function (e) {return fUploadImg.click();});

	fUploadImg.addEventListener('change', function (e) {
		var files = e.dataTransfer ? e.dataTransfer.files : e.currentTarget.files,
		file = files[0];

		adminForm.uploadHelper(file, true, '/admin/uploadFile.ashx', {
			'X-File-Path': 'img/partners/',
			'X-Mime-Type': 'image/svg+xml' },
		function (rsp) {
			if (rsp) {
				adminForm.setAdditionalPropertyData('logoPath', rsp.filePath);
				adminForm.setAdditionalPropertyData('logoFileName', rsp.fileName);
				setPrevImg(rsp.filePath);
			}

			fUploadImg.value = '';
		});
	});

	btnImgDelete.addEventListener('click', function (e) {
		alert.promptAlert('Confirm Delete', '<p>Are you sure you want to delete this image?', 'Delete', 'Cancel', function (evt) {
			adminForm.setAdditionalPropertyData('logoPath', '');
			adminForm.setAdditionalPropertyData('logoFileName', '');
			setPrevImg('');
			alert.dismissAlert();
			evt.preventDefault();
		}, function (evt) {
			alert.dismissAlert();
			evt.preventDefault();
		});
	});

	function editItemCallback(obj) {
		setPrevImg(adminForm.getAdditionalPropertyData('logoPath'));
	}

	function setPrevImg(filePath) {
		if (filePath === '') {
			prevImg.innerHTML = '';
			btnImgDelete.classList.add('hidden');
			return;
		}

		prevImg.innerHTML = '<img style="max-width:300px;" src="' + filePath + '" />';
		btnImgDelete.classList.remove('hidden');
	}

	function back() {
		setPrevImg('');
	}

})(document);
//# sourceMappingURL=partners.js.map
