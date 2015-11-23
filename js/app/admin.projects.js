///<reference path="main.js">
///<reference path="admin.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
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
        	item: 'Project',

        	// how the option text should be set
        	//   using the Parse obj
        	setOptionText: function( obj ) {
        		return obj.get( 'name' );
        	}
        },

        // Parse settings
        //   object = the Parse cloud object
        //   querySort = the column to sort items by
        parse = {
        	object: 'Project',
        	querySort: 'sortOrder'
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
				handler: deleteThumb
			},
			{
				el: doc.getElementById( 'btn-img-monitor-trigger' ),
				evtName: 'click',
				handler: triggerImgMonitorUpload
			},
			{
				el: doc.getElementById( 'f-img-monitor' ),
				evtName: 'change',
				handler: imgMonitorSelected
			},
			{
				el: doc.getElementById( 'btn-img-monitor-delete' ),
				evtName: 'click',
				handler: deleteMonitorImg
			}
        ],

        // optional other data for the item
        otherData = {
        	active: false,
			primaryImg: '',
			thumbnail: ''
        },
		
        fImg = doc.getElementById( 'f-img' ),
        imgPrev = doc.getElementById( 'img-prev' ),
        btnImgDetele = doc.getElementById( 'btn-img-delete' ),
		fImgMonitor = doc.getElementById( 'f-img-monitor' ),
        imgMonitorPrev = doc.getElementById( 'img-monitor-prev' ),
        btnImgMonitorDetele = doc.getElementById( 'btn-img-monitor-delete' ),
        cbActive = doc.getElementById( 'cb-active' );

	// call the admin init function passing this pages specific data/items
	app.admin.init( settings, parse, inputEvents, otherData, saveItem );

	function loadItem() {
		app.forms.checkActive();
		setImgPrev( app.admin.getOtherDataProperty( 'thumbnail' ) );
		setImgMonitorPrev( app.admin.getOtherDataProperty( 'primaryImg' ) );
		cbActive.checked = app.admin.getOtherDataProperty( 'active' );
	}

	function triggerImgUpload() {
		fImg.click();
	}

	function imgSelected( e ) {
		var files = e.dataTransfer ? e.dataTransfer.files : e.currentTarget.files,
			file = files[0];

		app.admin.uploadFile( file, true, '/admin/projects/uploadImg.ashx', function( fileName ) {
			if ( fileName ) {
				setTimeout( function() {
					app.admin.setOtherDataProperty( 'thumbnail', fileName );
					setImgPrev( fileName );
				}, 500 );
			}
		} );
	}

	function deleteThumb( e ) {
		app.admin.setOtherDataProperty( 'thumbnail', '' );
		setImgPrev( null );
	}

	function triggerImgMonitorUpload() {
		fImgMonitor.click();
	}

	function imgMonitorSelected( e ) {
		var files = e.dataTransfer ? e.dataTransfer.files : e.currentTarget.files,
			file = files[0];

		app.admin.uploadFile( file, true, '/admin/projects/uploadMonitorImg.ashx', function( fileName ) {
			if ( fileName ) {
				setTimeout( function() {
					app.admin.setOtherDataProperty( 'primaryImg', fileName );
					setImgMonitorPrev( fileName );
				}, 500 );
			}
		} );
	}

	function deleteMonitorImg( e ) {
		app.admin.setOtherDataProperty( 'primaryImg', '' );
		setImgMonitorPrev( null );
	}

	function saveItem() {
		var params = app.admin.collectData(),
            isValid = app.admin.validateReqFields();

		if ( isValid ) {
			params.sortOrder = parseInt( params.sortOrder, 10 );
			params.active = cbActive.checked;
			app.admin.saveItem( settings.save.fn, params );
		}
	}

	function setImgPrev( fileName ) {
		if ( fileName && fileName.length ) {
			imgPrev.innerHTML = '<img src="/img/projects/' + fileName + '" />';
			btnImgDetele.classList.remove( 'hidden' );
		}
		else {
			imgPrev.innerHTML = '';
			btnImgDetele.classList.add( 'hidden' );
		}
	}

	function setImgMonitorPrev( fileName ) {
		if ( fileName && fileName.length ) {
			imgMonitorPrev.innerHTML = '<img src="/img/projects/primary/' + fileName + '" />';
			btnImgMonitorDetele.classList.remove( 'hidden' );
		}
		else {
			imgMonitorPrev.innerHTML = '';
			btnImgMonitorDetele.classList.add( 'hidden' );
		}
	}

}( document ) );