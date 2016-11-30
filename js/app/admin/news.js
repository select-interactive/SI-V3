/**
* Copyright 2016 Select Interactive, LLC. All rights reserved.
* @author: The Select Interactive dev team (www.select-interactive.com)
*/
( function( doc ) {
	'use strict';

	const alert = new app.Alert();

	let adminForm = new app.AdminForm( {
		labelItemText: 'Article',
		labelItemsText: 'Articles',
		loadItems: {
			fn: 'articlesGetJson',
			params: {
				articleId: -1,
				authorId: -1,
				tagId: -1
			},
			rowTmpl: '<div class="admin-grid-row{{rowClass}}" data-id="{{articleId}}">' +
					 '<div class="admin-grid-col admin-grid-col-primary">{{title}}</div>' +
                     '<div class="admin-grid-col">{{active}}</div>' +
					 '<div class="admin-grid-col"><button class="btn btn-ripple btn-edit">Edit</button><button class="btn btn-ripple btn-delete">Delete</button></div>' +
					 '</div>',
			rowTmplHeaders: ['', 'Title', 'Active'],
			rowTmplProps: ['articleId', 'title', 'active']
		},
		editItem: {
			fn: 'articlesGetJson',
			params: {
				authorId: -1,
				tagId: -1
			},
			itemId: 'articleId',
			callback: editItemCallback
		},
		saveItem: {
			fn: 'articleSave',
			itemId: 'articleId',
			sendAsString: true,
			callback: saveItemCallback
		},
		deleteItem: {
			fn: 'articleDelete',
			itemId: 'articleId'
		},
		back: {
			fn: back
		},
		additionalProperties: {
			thumbPath: '',
			thumbFileName: '',
			bannerPath: '',
			bannerFileName: ''
		}
	} );

	const ddlTags = app.$( '#ddl-tags' );
	const _ddlTags = $( ddlTags );

	_ddlTags.chosen();

	const btnUploadImg = app.$( '#btn-upload-img' );
	const fUploadImg = app.$( '#f-upload-img' );
	const prevImg = app.$( '#prev-img' );
	const btnImgDelete = app.$( '#btn-img-delete' );

	const btnUploadImgBanner = app.$( '#btn-upload-img-banner' );
	const fUploadImgBanner = app.$( '#f-upload-img-banner' );
	const prevImgBanner = app.$( '#prev-img-banner' );
	const btnImgBannerDelete = app.$( '#btn-img-banner-delete' );

	btnUploadImg.addEventListener( 'click', e => fUploadImg.click() );

	fUploadImg.addEventListener( 'change', e => {
		let files = e.dataTransfer ? e.dataTransfer.files : e.currentTarget.files,
			file = files[0];

		adminForm.uploadHelper( file, true, '/admin/uploadImg.ashx', {
			'X-Min-Width': 600,
			'X-Min-Height': 480,
			'X-File-Path': 'img/news/thumb/'
		}, rsp => {
			if ( rsp ) {
				adminForm.setAdditionalPropertyData( 'thumbPath', rsp.filePath );
				adminForm.setAdditionalPropertyData( 'thumbFileName', rsp.fileName );
				setPrevImg( rsp.filePath );
			}

			fUploadImg.value = '';
		} );
	} );

	btnImgDelete.addEventListener( 'click', e => {
		alert.promptAlert( 'Confirm Delete', '<p>Are you sure you want to delete this image?', 'Delete', 'Cancel', evt => {
			adminForm.setAdditionalPropertyData( 'thumbPath', '' );
			adminForm.setAdditionalPropertyData( 'thumbFileName', '' );
			setPrevImg( '' );
			alert.dismissAlert();
			evt.preventDefault();
		}, evt => {
			alert.dismissAlert();
			evt.preventDefault();
		} );
	} );

	btnUploadImgBanner.addEventListener( 'click', e => fUploadImgBanner.click() );

	fUploadImgBanner.addEventListener( 'change', e => {
		let files = e.dataTransfer ? e.dataTransfer.files : e.currentTarget.files,
			file = files[0];

		adminForm.uploadHelper( file, true, '/admin/uploadImg.ashx', {
			'X-Min-Width': 2000,
			'X-Min-Height': 600,
			'X-File-Path': 'img/news/banner/'
		}, rsp => {
			if ( rsp ) {
				adminForm.setAdditionalPropertyData( 'bannerPath', rsp.filePath );
				adminForm.setAdditionalPropertyData( 'bannerFileName', rsp.fileName );
				setPrevImgBanner( rsp.filePath );
			}

			fUploadImgBanner.value = '';
		} );
	} );

	btnImgBannerDelete.addEventListener( 'click', e => {
		alert.promptAlert( 'Confirm Delete', '<p>Are you sure you want to delete this image?', 'Delete', 'Cancel', evt => {
			adminForm.setAdditionalPropertyData( 'bannerPath', '' );
			adminForm.setAdditionalPropertyData( 'bannerFileName', '' );
			setPrevImgBanner( '' );
			alert.dismissAlert();
			evt.preventDefault();
		}, evt => {
			alert.dismissAlert();
			evt.preventDefault();
		} );
	} );

	function editItemCallback( obj ) {
		app.$.fetch( '/api/articlesTagsGetJson', {
			body: {
				tagId: -1,
				articleId: obj.articleId
			}
		} ).then( rsp => {
			if ( rsp.success ) {
				let tags = rsp.obj;

				tags.forEach( tag => {
					app.$.forEach( ddlTags.children, opt => {
						if ( tag.tagId === parseInt( opt.value, 10 ) ) {
							opt.selected = true;
						}
					} );
				} );

				_ddlTags.trigger( 'chosen:updated' );
			}
		} );

		setPrevImg( adminForm.getAdditionalPropertyData( 'thumbPath' ) );
		setPrevImgBanner( adminForm.getAdditionalPropertyData( 'bannerPath' ) );
	}

	function setPrevImg( filePath ) {
		if ( filePath === '' ) {
			prevImg.innerHTML = '';
			btnImgDelete.classList.add( 'hidden' );
			return;
		}

		prevImg.innerHTML = '<img src="' + filePath + '" />';
		btnImgDelete.classList.remove( 'hidden' );
	}

	function setPrevImgBanner( filePath ) {
		if ( filePath === '' ) {
			prevImgBanner.innerHTML = '';
			btnImgBannerDelete.classList.add( 'hidden' );
			return;
		}

		prevImgBanner.innerHTML = '<img src="' + filePath + '" />';
		btnImgBannerDelete.classList.remove( 'hidden' );
	}

	function saveItemCallback() {
		let tags = [];

		app.$.forEach( ddlTags.children, opt => {
			if ( opt.selected ) {
				tags.push( opt.value );
			}
		} );

		app.$.fetch( '/api/articleTagsAssign', {
			body: {
				articleId: adminForm.itemId,
				tags: tags
			}
		} );
	}

	function back() {
		app.$.forEach( ddlTags.children, opt => {
			opt.selected = false;
		} );

		_ddlTags.trigger( 'chosen:updated' );

		setPrevImg( '' );
		setPrevImgBanner( '' );
	}

}( document ) );