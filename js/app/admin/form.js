///<reference path="main.js">
/**
 * Copyright 2016 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 * 
 * Configuration/Info
 * 
 * Label for item has class lbl-item
 * Label for items has class lbl-items
 * For grid, expects grid container to have ID grid-container
 * Expects form-grid for item listing
 * Expects form-edit for manipulating item data
 * 
 * Expects add new button with ID btn-new
 */
( function( doc ) {
	'use strict';

	const config = {
		btnBack: 'btn-back',
		btnDelete: 'btn-delete',
		btnNew: 'btn-new',
		btnSave: 'btn-save',
		formGrid: 'form-grid',
		formEdit: 'form-edit',
		gridContainerId: 'grid-container',
		gridRowClass: 'admin-grid-row',
		hiddenClass: 'hidden',
		lblItem: 'lbl-item',
		lblItems: 'lbl-items',
		wsUrl: '/api/'
	};

	const toast = new app.Toast();
	const alert = new app.Alert();
	const defaultUrl = window.location.pathname;
	
	class AdminForm {
		constructor( options ) {
			// extract data from options
			this.options = options;

			this.labelItemText = options.labelItemText;
			this.labelItemsText = options.labelItemsText;

			// init new item
			this.initItemFn = options.initItem ? options.initItem.callback : null;

			// load items information
			this.loadItemsFn = options.loadItems.fn;
			this.loadItemsParams = options.loadItems.params;
			this.loadItemsRowHTML = options.loadItems.rowTmpl;
			this.loadItemsRowHeaders = options.loadItems.rowTmplHeaders;
			this.loadItemsRowProps = options.loadItems.rowTmplProps;
			
			// edit item options
			this.editItemFn = options.editItem.fn;
			this.editItemParams = options.editItem.params;
			this.editItemItemId = options.editItem.itemId;
			this.editItemCallback = options.editItem.callback;

			// save item
			this.saveItemFn = options.saveItem.fn;
			this.saveItemId = options.saveItem.itemId;
			this.sendAsString = options.saveItem.sendAsString || false;
			this.saveCallback = options.saveItem.callback;

			// delete item
			this.deleteItemFn = options.deleteItem.fn;
			this.deleteItemItemId = options.deleteItem.itemId;

			// back to options callback
			this.backToGridCallback = options.back.fn;

			// items
			this.items = [];

			// initialize our form objects
			this.formGrid = new app.Form( app.$( '#' + config.formGrid ) );
			this.formEdit = new app.Form( app.$( '#' + config.formEdit ) );

			// buttons
			this.btnNew = app.$( '#' + config.btnNew );
			this.btnBack = app.$( '#' + config.btnBack );
			this.btnDelete = app.$( '#' + config.btnDelete );
			this.btnSave = app.$( '#' + config.btnSave );

			// tracking data 
			this.itemId = -1;
			this.additionadditionalPropertiesDefault = app.util.cloneObj( options.additionalProperties || {} );
			this.additionalProperties = app.util.cloneObj( options.additionalProperties || {} );

			// bind this to our functions
			this.setLabels = this.setLabels.bind( this );
			this.loadItems = this.loadItems.bind( this );
			this.buildGrid = this.buildGrid.bind( this );
			this.initNewItem = this.initNewItem.bind( this );
			this.editData = this.editData.bind( this );
			this.saveItem = this.saveItem.bind( this );
			this.backToGrid = this.backToGrid.bind( this );
			this.btnDeleteClickHandler = this.btnDeleteClickHandler.bind( this );
			this.deleteItem = this.deleteItem.bind( this );
			this.popstateHanlder = this.popstateHanlder.bind( this );

			// set display labels
			this.setLabels();

			// assign event listeners
			this.addEventListeners();

			// load current database items
			this.loadItems();
		}

		setLabels() {
			const me = this;

			app.$.forEach( '.' + config.lblItem, el => {
				el.textContent = me.labelItemText;
			} );

			app.$.forEach( '.' + config.lblItems, el => {
				el.textContent = me.labelItemsText;
			} );
		}

		addEventListeners() {
			this.btnNew.addEventListener( 'click', this.initNewItem, false );
			this.btnBack.addEventListener( 'click', this.backToGrid, false );
			this.btnSave.addEventListener( 'click', this.saveItem, false );
			this.btnDelete.addEventListener( 'click', this.btnDeleteClickHandler, false );

			window.addEventListener( 'popstate', this.popstateHanlder, false );
		}

		loadItems() {
			app.$.fetch( config.wsUrl + this.loadItemsFn, {
				body: this.loadItemsParams
			} ).then( rsp => {
				if ( rsp.success ) {
					this.items = rsp.obj;
					this.buildGrid();
				}
			} ).catch( rsp => {
				console.log( 'Error loading items.', rsp );
			} );
		}

		buildGrid() {
			const me = this;
			let html = '';
			let rowHtml = '';

			// add the header row
			rowHtml = this.loadItemsRowHTML;
			for ( let i = 0; i < this.loadItemsRowHeaders.length; i++ ) {
				let hdr = this.loadItemsRowHeaders[i];
				let itemProp = this.loadItemsRowProps[i];
				rowHtml = rowHtml.replace( '{{' + itemProp + '}}', hdr );
			}

			rowHtml = rowHtml.replace( '{{rowClass}}', ' hdr' );
			html += rowHtml;

			// loop through all of the items and add them
			for ( let i = 0; i < this.items.length; i++ ) {
				let item = this.items[i];
				rowHtml = this.loadItemsRowHTML.replace( '{{rowClass}}', '' );
				
				for ( let j = 0; j < this.loadItemsRowProps.length; j++ ) {
					let itemProp = this.loadItemsRowProps[j];
					let val = item[itemProp];

					if ( itemProp === 'active' ) {
						val = val === true ? 'Active' : 'Not Active';
					}

					rowHtml = rowHtml.replace( '{{' + itemProp + '}}', val );
				}

				html += rowHtml;
			}

			app.$( '#' + config.gridContainerId ).innerHTML = html;

			setTimeout( () => {
				app.$.forEach( '.' + config.gridRowClass, row => {
					new FormRow( row, me  );
				} );
			}, 10 );
		}

		initNewItem() {
			this.itemId = -1;

			if ( this.formEdit.container.querySelector( '#tb-sort-order' ) ) {
				this.formEdit.container.querySelector( '#tb-sort-order' ).value = this.items.length + 1;
			}

			this.formGrid.hide();
			this.formEdit.show();
			this.btnDelete.classList.add( config.hiddenClass );

			if ( this.initItemFn && typeof this.initItemFn === 'function' ) {
				this.initItemFn();
			}

			history.pushState( { page: 'edit' }, 'Edit', '?edit' );
		}

		editData( id ) {
			toast.show( 'Loading item details...', -1 );
			this.itemId = id;
			this.editItemParams[this.editItemItemId] = this.itemId;
			
			app.$.fetch( config.wsUrl + this.editItemFn, {
				body: this.editItemParams
			} ).then( rsp => {
				let obj;

				if ( rsp.success && rsp.obj.length ) {
					obj = rsp.obj[0];
					this.formEdit.setFieldValues( obj );
					this.formEdit.show();
					this.formGrid.hide();
					this.btnDelete.classList.remove( config.hiddenClass );

					if ( this.additionalProperties ) {
						Object.getOwnPropertyNames( this.additionalProperties ).forEach( val => {
							this.additionalProperties[val] = obj[val];
						} );
					}
					
					window.scrollTo( 0, 0 );
					toast.hide( true );

					if ( this.editItemCallback && typeof this.editItemCallback === 'function' ) {
						this.editItemCallback( obj );
					}

					history.pushState( { page: 'edit' }, 'Edit', '?edit' );
				}
			} ).catch( rsp => {
				console.log( rsp );
			} );
		}

		saveItem() {
			const me = this;
			let isValid = this.formEdit.validateFields();
			let params = {};

			if ( !isValid ) {
				toast.show( 'Fields marked with * are required.' );
				return;
			}

			toast.show( 'Saving data, please wait...' );

			params = this.formEdit.collectData();

			if ( this.additionalProperties ) {
				Object.getOwnPropertyNames( this.additionalProperties ).forEach( val => {
					params[val] = this.additionalProperties[val];
				} );
			}

			params[this.saveItemId] = this.itemId;

			if ( this.sendAsString ) {
				params = {
					data: JSON.stringify( params )
				};
			}

			app.$.fetch( config.wsUrl + this.saveItemFn, {
				body: params
			} ).then( rsp => {
				if ( rsp.success ) {
					toast.show( 'Data saved successfully.', 2000 );
					me.loadItems();

					if ( this.itemId === -1 ) {
						//setTimeout( me.backToGrid, 1500 );
						this.itemId = rsp.obj;
					}

					if ( this.saveCallback && typeof this.saveCallback === 'function' ) {
						this.saveCallback();
					}
				}
				else {
					toast.show( 'Unable to save at this time, please try again.', -1 );
					console.log( 'Error:', rsp || 'No error data.' );
				}
			} ).catch( rsp => {
				toast.show( 'Unable to save at this time, please try again.', -1 );
				console.log( 'Error:', rsp || 'No error data.' );
			} );
		}

		backToGrid() {
			this.formEdit.hide();
			this.formEdit.clearForm();
			this.formGrid.show();

			// reset tracked data
			this.itemId = -1;

			if ( this.additionalProperties ) {
				Object.getOwnPropertyNames( this.additionalProperties ).forEach( val => {
					this.additionalProperties[val] = this.additionadditionalPropertiesDefault[val];
				} );
			}

			if ( this.backToGridCallback && typeof this.backToGridCallback === 'function' ) {
				this.backToGridCallback();
			}
			
			window.scrollTo( 0, 0 );

			history.pushState( { page: '' }, 'Options', defaultUrl );
		}

		btnDeleteClickHandler() {
			this.deleteItem( this.itemId );
		}

		deleteItem( id ) {
			const me = this;

			let params = {};
			params[this.deleteItemItemId] = id;

			alert.promptAlert( 'Confirm Delete', '<p>Are you sure you want to delete this item?', 'Delete', 'Cancel', evt => {
				alert.dismissAlert();
				toast.show( 'Deleting item...' );
				
				app.$.fetch( config.wsUrl + this.deleteItemFn, {
					body: params
				} ).then( rsp => {
					if ( rsp.success ) {
						toast.show( 'Item successfully deleted.', 2500 );
						me.loadItems();

						setTimeout(() => {
							me.backToGrid();
						}, 1000 );
					}
					else {
						toast.show( 'Unable to delete at this time. Please try again.' );
						console.log( 'Error:', rsp.msg || 'No error data' );
					}
				} ).catch( rsp => {
					toast.show( 'Unable to delete at this time. Please try again.' );
					console.log( 'Error:', rsp || 'No error data' );
				} );

				evt.preventDefault();
			}, evt => {
				alert.dismissAlert();
				evt.preventDefault();
			} );
		}

		setAdditionalPropertyData( key, val ) {
			this.additionalProperties[key] = val;
		}

		getAdditionalPropertyData( key ) {
			return this.additionalProperties[key];
		}

		popstateHanlder( e ) {
			if ( !e.state || e.state.page === '' ) {
				this.backToGrid();
			}
		}

		// helper function to handle image uploads
		//   @file - the file to be uploaded
		//   @isImg - boolean if uploading an image
		//   @handler - the ashx file to handle the file upload
		//   @fn - optional - callback function to run after the image has been uploaded
		uploadHelper( file, isImg, handler, headers, fn ) {
			let fileName = file.name;
			let fileType = file.type;
			let fReader = new FileReader();

			// confirm this file is allowed
			if ( !isImg || /^image\//.test( fileType ) ) {
				toast.show( 'Uploading file, please wait...', -1 );

				fReader.onload = function( e ) {
					let xhr = new XMLHttpRequest();

					// set the handler and all headers
					xhr.open( 'post', handler, true );
					xhr.setRequestHeader( 'X-File-Name', fileName );
					xhr.setRequestHeader( 'X-File-Size', file.size );
					xhr.setRequestHeader( 'X-File-Type', fileType );

					for ( const key in headers ) {
						xhr.setRequestHeader( key, headers[key] );
					}

					// callback of xhr load
					xhr.addEventListener( 'load', function( response ) {
						// when the request is complete
						if ( response.target.response ) {
							let rsp = JSON.parse( response.target.response );

							// if the upload was successful
							if ( rsp.success ) {
								toast.show( 'The file was successfully uploaded.' );
								setTimeout(() => {
									toast.hide( true );
								}, 1000 );

								if ( fn && typeof fn === 'function' ) {
									fn( rsp.obj );
								}
							}
							else {
								toast.show( 'Unable to upload the file, please try again.', -1 );
								console.log( 'Error:', rsp.msg || 'No error data.' );
							}
						}
					}, false );

					xhr.send( file );
				};

				// begin the read operation
				fReader.readAsDataURL( file );
			}
			else {
				toast.show( 'Only .jpg, .jpeg, and .png files are allowed.', -1 );
			}
		}
	}

	class FormRow {
		constructor( row, form ) {
			this.container = row;
			this.AdminForm = form;
			this.id = row.getAttribute( 'data-id' );
			this.btnEdit = row.querySelector( '.btn-edit' );
			this.btnDelete = row.querySelector( '.btn-delete' );
			
			this.editItem = this.editItem.bind( this );
			this.deleteItem = this.deleteItem.bind( this );

			this.addEventListeners();
		}

		addEventListeners() {
			this.btnEdit.addEventListener( 'click', this.editItem, false );
			this.btnDelete.addEventListener( 'click', this.deleteItem, false );
		}

		editItem() {
			this.AdminForm.editData( this.id );
		}

		deleteItem() {
			this.AdminForm.deleteItem( this.id );
		}
	}

	app.AdminForm = AdminForm;

}( document ) );