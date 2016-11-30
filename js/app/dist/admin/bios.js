'use strict'; /**
              * Copyright 2016 Select Interactive, LLC. All rights reserved.
              * @author: The Select Interactive dev team (www.select-interactive.com)
              */
(function (doc) {
	'use strict';

	var alert = new app.Alert();

	var adminForm = new app.AdminForm({
		labelItemText: 'Bio',
		labelItemsText: 'Bios',
		loadItems: {
			fn: 'biosGetJson',
			params: {
				bioId: -1 },

			rowTmpl: '<div class="admin-grid-row{{rowClass}}" data-id="{{bioId}}">' +
			'<div class="admin-grid-col admin-grid-col-primary">{{fname}} {{lname}}</div>' +
			'<div class="admin-grid-col">{{title}}</div>' +
			'<div class="admin-grid-col">{{active}}</div>' +
			'<div class="admin-grid-col"><button class="btn btn-ripple btn-edit">Edit</button><button class="btn btn-ripple btn-delete">Delete</button></div>' +
			'</div>',
			rowTmplHeaders: ['', 'Name', '', 'Title', 'Active'],
			rowTmplProps: ['bioId', 'fname', 'lname', 'title', 'active'] },

		editItem: {
			fn: 'biosGetJson',
			params: {},
			itemId: 'bioId',
			callback: editItemCallback },

		saveItem: {
			fn: 'bioSave',
			itemId: 'bioId',
			sendAsString: true },

		deleteItem: {
			fn: 'bioDelete',
			itemId: 'bioId' },

		back: {
			fn: back },

		additionalProperties: {
			imgPath: '',
			imgFileName: '' } });



	var btnUploadImg = app.$('#btn-upload-img');
	var fUploadImg = app.$('#f-upload-img');
	var prevImg = app.$('#prev-img');
	var btnImgDelete = app.$('#btn-img-delete');

	btnUploadImg.addEventListener('click', function (e) {return fUploadImg.click();});

	fUploadImg.addEventListener('change', function (e) {
		var files = e.dataTransfer ? e.dataTransfer.files : e.currentTarget.files,
		file = files[0];

		adminForm.uploadHelper(file, true, '/admin/uploadImg.ashx', {
			'X-Min-Width': 354,
			'X-Min-Height': 278,
			'X-File-Path': 'img/team/' },
		function (rsp) {
			if (rsp) {
				adminForm.setAdditionalPropertyData('imgPath', rsp.filePath);
				adminForm.setAdditionalPropertyData('imgFileName', rsp.fileName);
				setPrevImg(rsp.filePath);
			}

			fUploadImg.value = '';
		});
	});

	btnImgDelete.addEventListener('click', function (e) {
		alert.promptAlert('Confirm Delete', '<p>Are you sure you want to delete this image?', 'Delete', 'Cancel', function (evt) {
			adminForm.setAdditionalPropertyData('imgPath', '');
			adminForm.setAdditionalPropertyData('imgFileName', '');
			setPrevImg('');
			alert.dismissAlert();
			evt.preventDefault();
		}, function (evt) {
			alert.dismissAlert();
			evt.preventDefault();
		});
	});

	function editItemCallback(obj) {
		setPrevImg(adminForm.getAdditionalPropertyData('imgPath'));
	}

	function setPrevImg(filePath) {
		if (filePath === '') {
			prevImg.innerHTML = '';
			btnImgDelete.classList.add('hidden');
			return;
		}

		prevImg.innerHTML = '<img src="' + filePath + '" />';
		btnImgDelete.classList.remove('hidden');
	}

	function back() {
		setPrevImg('');
	}

})(document);
//# sourceMappingURL=bios.js.map
