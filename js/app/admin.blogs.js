///<reference path="main.js">
///<reference path="admin.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.bios = ( function( doc, $ ) {
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
        	item: 'Blog',

        	// how the option text should be set
        	//   using the Parse obj
        	setOptionText: function( obj ) {
        		return obj.get( 'title' );
        	}
        },

        // Parse settings
        //   object = the Parse cloud object
        //   querySort = the column to sort items by
        parse = {
        	object: 'Blog',
        	querySort: '-datePublished'
        },

        // events for buttons/inputs (file upload)
        inputEvents = [
            {
            	el: doc.getElementById( 'btn-item-save' ),
            	evtName: 'click',
            	handler: saveItem
            },
			{
				el: doc.getElementById( 'btn-img-trigger' ),
				evtName: 'click',
				handler: triggerImgUpload
			},
			{
				el: doc.getElementById( 'f-img' ),
				evtName: 'change',
				handler: imgSelected
			},
			{
				el: doc.getElementById( 'btn-img-delete' ),
				evtName: 'click',
				handler: deleteImgBanner
			},
			{
				el: doc.getElementById( 'btn-img-thumb-trigger' ),
				evtName: 'click',
				handler: triggerImgThumbUpload
			},
			{
				el: doc.getElementById( 'f-img-thumb' ),
				evtName: 'change',
				handler: imgThumbSelected
			},
			{
				el: doc.getElementById( 'btn-img-thumb-delete' ),
				evtName: 'click',
				handler: deleteImgThumb
			}
        ],

        // optional other data for the item
        otherData = {
        	active: false,
        	banner: '',
			category: '',
			tags: '',
			thumbnail: ''
        },
		
		ddlCategory = doc.getElementById( 'ddl-category' ),
		ddlTags = doc.getElementById( 'ddl-tags' ),
        fImg = doc.getElementById( 'f-img' ),
        imgPrev = doc.getElementById( 'img-prev' ),
        btnImgDetele = doc.getElementById( 'btn-img-delete' ),
		fImgThumb = doc.getElementById( 'f-img-thumb' ),
        imgThumbPrev = doc.getElementById( 'img-thumb-prev' ),
        btnImgThumbDetele = doc.getElementById( 'btn-img-thumb-delete' ),
        cbActive = doc.getElementById( 'cb-active' );

	// call the admin init function passing this pages specific data/items
	app.admin.init( settings, parse, inputEvents, otherData, saveItem );

	function init() {
		initChosenSelects();
	}

	function initChosenSelects() {
		$( ddlTags ).chosen();
	}

	function loadItem() {
		setCategory();
		setLoadedTags();
		cbActive.checked = app.admin.getOtherDataProperty( 'active' );
		app.forms.checkActive();
		setImgPrev( app.admin.getOtherDataProperty( 'banner' ) );
		setImgThumbPrev( app.admin.getOtherDataProperty( 'thumbnail' ) );
		cbActive.checked = app.admin.getOtherDataProperty( 'active' );
	}

	function setCategory() {
		var category = app.admin.getOtherDataProperty( 'category' ),
			opts = ddlCategory.parentNode.querySelectorAll( '.select-opt' );

		if ( category === '' ) {
			return;
		}

		window.forEachElement( opts, function( opt ) {
			if ( opt.getAttribute( 'data-val' ) === category ) {
				opt.classList.add( 'active' );
			}
		} );

		app.forms.checkSelectValues( ddlCategory );
	}

	function setLoadedTags() {
		var tags = app.admin.getOtherDataProperty( 'tags' ),
    		i = 0, len, tag;

		if ( tags && tags.length ) {
			tags = tags.split( ',' );
			len = tags.length;

			for ( ; i < len; i++ ) {
				tag = tags[i];
				ddlTags.querySelector( '[value="' + tag + '"]' ).selected = true;
			}

			$( ddlTags ).trigger( 'chosen:updated' );
		}
	}

	function triggerImgUpload() {
		fImg.click();
	}

	function imgSelected( e ) {
		var files = e.dataTransfer ? e.dataTransfer.files : e.currentTarget.files,
			file = files[0];

		app.admin.uploadFile( file, true, '/admin/blogs/uploadImg.ashx', function( fileName ) {
			if ( fileName ) {
				setTimeout( function() {
					app.admin.setOtherDataProperty( 'banner', fileName );
					setImgPrev( fileName );
				}, 500 );
			}
		} );
	}

	function deleteImgBanner( e ) {
		app.admin.setOtherDataProperty( 'banner', '' );
		setImgPrev( null );
	}

	function triggerImgThumbUpload() {
		fImgThumb.click();
	}

	function imgThumbSelected( e ) {
		var files = e.dataTransfer ? e.dataTransfer.files : e.currentTarget.files,
			file = files[0];

		app.admin.uploadFile( file, true, '/admin/blogs/uploadImgThumb.ashx', function( fileName ) {
			if ( fileName ) {
				setTimeout( function() {
					app.admin.setOtherDataProperty( 'thumbnail', fileName );
					setImgThumbPrev( fileName );
				}, 500 );
			}
		} );
	}

	function deleteImgThumb( e ) {
		app.admin.setOtherDataProperty( 'thumbnail', '' );
		setImgThumbPrev( null );
	}

	function saveItem() {
		var params = app.admin.collectData(),
            isValid = app.admin.validateReqFields();

		if ( isValid ) {
			params.category = '';
			params.categoryName = '';
			window.forEachElement( ddlCategory.querySelectorAll( 'option' ), function( opt, i ) {
				if ( opt.selected ) {
					params.category = opt.value;
					params.categoryName = opt.text;
					params.categoryUrl = opt.getAttribute( 'data-category-url' );
				}
			} );

			params.tags = '';
			params.tagNames = '';
			params.tagUrls = '';
			window.forEachElement( ddlTags.querySelectorAll( 'option' ), function( opt, i ) {
				if ( opt.selected ) {
					if ( params.tags !== '' ) {
						params.tags += ',';
						params.tagNames += ', ';
						params.tagUrls += ',';
					}

					params.tags += opt.value;
					params.tagNames += opt.text;
					params.tagUrls += opt.getAttribute( 'data-tag-url' );
				}
			} );

			params.active = cbActive.checked;
			params.url = app.admin.createUrl( params.title, params.datePublished );
			params.datePublished = new Date( params.datePublished );
			app.admin.saveItem( settings.save.fn, params );
		}
	}

	function setImgPrev( fileName ) {
		if ( fileName && fileName.length ) {
			imgPrev.innerHTML = '<img src="/img/news/med/' + fileName + '" />';
			btnImgDetele.classList.remove( 'hidden' );
		}
		else {
			imgPrev.innerHTML = '';
			btnImgDetele.classList.add( 'hidden' );
		}
	}

	function setImgThumbPrev( fileName ) {
		if ( fileName && fileName.length ) {
			imgThumbPrev.innerHTML = '<img src="/img/news/thumb/' + fileName + '" />';
			btnImgThumbDetele.classList.remove( 'hidden' );
		}
		else {
			imgThumbPrev.innerHTML = '';
			btnImgThumbDetele.classList.add( 'hidden' );
		}
	}

	init();

}( document, jQuery ) );