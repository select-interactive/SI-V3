'use strict'; /**
              * Copyright 2016 Select Interactive, LLC. All rights reserved.
              * @author: The Select Interactive dev team (www.select-interactive.com)
              */
(function (doc) {
	'use strict';

	var alert = new app.Alert();

	var adminForm = new app.AdminForm({
		labelItemText: 'Article',
		labelItemsText: 'Articles',
		loadItems: {
			fn: 'articlesGetJson',
			params: {
				articleId: -1,
				authorId: -1,
				tagId: -1 },

			rowTmpl: '<div class="admin-grid-row{{rowClass}}" data-id="{{articleId}}">' +
			'<div class="admin-grid-col admin-grid-col-primary">{{title}}</div>' +
			'<div class="admin-grid-col">{{active}}</div>' +
			'<div class="admin-grid-col"><button class="btn btn-ripple btn-edit">Edit</button><button class="btn btn-ripple btn-delete">Delete</button></div>' +
			'</div>',
			rowTmplHeaders: ['', 'Title', 'Active'],
			rowTmplProps: ['articleId', 'title', 'active'] },

		editItem: {
			fn: 'articlesGetJson',
			params: {
				authorId: -1,
				tagId: -1 },

			itemId: 'articleId',
			callback: editItemCallback },

		saveItem: {
			fn: 'articleSave',
			itemId: 'articleId',
			sendAsString: true,
			callback: saveItemCallback },

		deleteItem: {
			fn: 'articleDelete',
			itemId: 'articleId' },

		back: {
			fn: back },

		additionalProperties: {
			thumbPath: '',
			thumbFileName: '',
			bannerPath: '',
			bannerFileName: '' } });



	var ddlTags = app.$('#ddl-tags');
	var _ddlTags = $(ddlTags);

	_ddlTags.chosen();

	var btnUploadImg = app.$('#btn-upload-img');
	var fUploadImg = app.$('#f-upload-img');
	var prevImg = app.$('#prev-img');
	var btnImgDelete = app.$('#btn-img-delete');

	var btnUploadImgBanner = app.$('#btn-upload-img-banner');
	var fUploadImgBanner = app.$('#f-upload-img-banner');
	var prevImgBanner = app.$('#prev-img-banner');
	var btnImgBannerDelete = app.$('#btn-img-banner-delete');

	btnUploadImg.addEventListener('click', function (e) {return fUploadImg.click();});

	fUploadImg.addEventListener('change', function (e) {
		var files = e.dataTransfer ? e.dataTransfer.files : e.currentTarget.files,
		file = files[0];

		adminForm.uploadHelper(file, true, '/admin/uploadImg.ashx', {
			'X-Min-Width': 600,
			'X-Min-Height': 480,
			'X-File-Path': 'img/news/thumb/' },
		function (rsp) {
			if (rsp) {
				adminForm.setAdditionalPropertyData('thumbPath', rsp.filePath);
				adminForm.setAdditionalPropertyData('thumbFileName', rsp.fileName);
				setPrevImg(rsp.filePath);
			}

			fUploadImg.value = '';
		});
	});

	btnImgDelete.addEventListener('click', function (e) {
		alert.promptAlert('Confirm Delete', '<p>Are you sure you want to delete this image?', 'Delete', 'Cancel', function (evt) {
			adminForm.setAdditionalPropertyData('thumbPath', '');
			adminForm.setAdditionalPropertyData('thumbFileName', '');
			setPrevImg('');
			alert.dismissAlert();
			evt.preventDefault();
		}, function (evt) {
			alert.dismissAlert();
			evt.preventDefault();
		});
	});

	btnUploadImgBanner.addEventListener('click', function (e) {return fUploadImgBanner.click();});

	fUploadImgBanner.addEventListener('change', function (e) {
		var files = e.dataTransfer ? e.dataTransfer.files : e.currentTarget.files,
		file = files[0];

		adminForm.uploadHelper(file, true, '/admin/uploadImg.ashx', {
			'X-Min-Width': 2000,
			'X-Min-Height': 600,
			'X-File-Path': 'img/news/banner/' },
		function (rsp) {
			if (rsp) {
				adminForm.setAdditionalPropertyData('bannerPath', rsp.filePath);
				adminForm.setAdditionalPropertyData('bannerFileName', rsp.fileName);
				setPrevImgBanner(rsp.filePath);
			}

			fUploadImgBanner.value = '';
		});
	});

	btnImgBannerDelete.addEventListener('click', function (e) {
		alert.promptAlert('Confirm Delete', '<p>Are you sure you want to delete this image?', 'Delete', 'Cancel', function (evt) {
			adminForm.setAdditionalPropertyData('bannerPath', '');
			adminForm.setAdditionalPropertyData('bannerFileName', '');
			setPrevImgBanner('');
			alert.dismissAlert();
			evt.preventDefault();
		}, function (evt) {
			alert.dismissAlert();
			evt.preventDefault();
		});
	});

	function editItemCallback(obj) {
		app.$.fetch('/api/articlesTagsGetJson', {
			body: {
				tagId: -1,
				articleId: obj.articleId } }).

		then(function (rsp) {
			if (rsp.success) {
				var tags = rsp.obj;

				tags.forEach(function (tag) {
					app.$.forEach(ddlTags.children, function (opt) {
						if (tag.tagId === parseInt(opt.value, 10)) {
							opt.selected = true;
						}
					});
				});

				_ddlTags.trigger('chosen:updated');
			}
		});

		setPrevImg(adminForm.getAdditionalPropertyData('thumbPath'));
		setPrevImgBanner(adminForm.getAdditionalPropertyData('bannerPath'));
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

	function setPrevImgBanner(filePath) {
		if (filePath === '') {
			prevImgBanner.innerHTML = '';
			btnImgBannerDelete.classList.add('hidden');
			return;
		}

		prevImgBanner.innerHTML = '<img src="' + filePath + '" />';
		btnImgBannerDelete.classList.remove('hidden');
	}

	function saveItemCallback() {
		var tags = [];

		app.$.forEach(ddlTags.children, function (opt) {
			if (opt.selected) {
				tags.push(opt.value);
			}
		});

		app.$.fetch('/api/articleTagsAssign', {
			body: {
				articleId: adminForm.itemId,
				tags: tags } });


	}

	function back() {
		app.$.forEach(ddlTags.children, function (opt) {
			opt.selected = false;
		});

		_ddlTags.trigger('chosen:updated');

		setPrevImg('');
		setPrevImgBanner('');
	}

})(document);
//# sourceMappingURL=news.js.map
