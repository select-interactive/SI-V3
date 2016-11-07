///<reference path="main.js">
/**
 * Copyright 2014 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 * 
 * All variables/functions ending with _ are assumed to be private to app.admin
 */
app.admin = ( function( doc ) {
	'use strict';

	var
        // settings is to be provided by the calling page js
        //   should include default itemId, wsUrl, and load functions
        settings_,

        // ckeditor settings
        editorSettings_ = {
        	allowedContent: true,
        	height: 350,
        	toolbar: 'Simple'
        },

        // PARSE settings
        parse_ = {
        	appId: 'caIzDF1iPPqqdTRXaKeC83tblCsx8tDpSchvTPkz',
        	jsKey: 'tW8R8E8XU0LqkWAm1npm6ImkWqW5HztS61rXnXhB'
        },

        // buttons/input[file] elements on the form
        //   that will trigger events
        inputEvents_ = [
            {
            	el: doc.getElementById( 'btn-item-new' ),
            	evtName: 'click',
            	handler: initItem
            },
            {
            	el: doc.getElementById( 'btn-item-back' ),
            	evtName: 'click',
            	handler: back
            },
            {
            	el: doc.getElementById( 'btn-item-delete' ),
            	evtName: 'click',
            	handler: deleteItem
            }
        ],

        // otherData is to be provided by the calling page js
        //   optional object of other data to store/collect
        otherData_,

        // used to store the original data of otherData
        //   from the calling page
        otherDataOriginal_,

        // pointer to the admin page's save event to be triggered
        //    on enter keypress of dataFields
        saveEvt_,

        // standard admin page elements that are expected to be
        //   on the page
        formOptions_ = doc.getElementById( 'form-options' ),
        ddlOptions_,
        formEdit_ = doc.getElementById( 'form-edit' ),
        reqFields_,
        dataFields_,

        status_ = doc.getElementById( 'status' );

	function init( settings, parse, inputEvents, otherData, saveEvt ) {
		if ( formOptions_ && formEdit_ ) {
			ddlOptions_ = doc.getElementById( 'ddl-options' );
			reqFields_ = formEdit_.querySelectorAll( '.req' );
			dataFields_ = formEdit_.querySelectorAll( '[name]' );

			settings_ = settings;
			parse_ = app.util.extend( parse_, parse );
			otherData_ = otherData;
			otherDataOriginal_ = app.util.cloneObj( otherData );
			saveEvt_ = saveEvt;

			// concat will concat the events from inputEvents_ and inputEvents
			//   into inputEvents_
			inputEvents_ = inputEvents_.concat( inputEvents );

			initParse();
			initCkEditor();
			bindEvents();
		}
	}

	function initParse() {
		Parse.initialize( parse_.appId, parse_.jsKey );
		updateOptions();
	}

	function initCkEditor() {
		window.forEachElement( formEdit_.querySelectorAll( 'textarea' ), function( ta ) {
			CKEDITOR.replace( ta.name, editorSettings_ );
		} );
	}

	function bindEvents() {
		ddlOptions_.addEventListener( 'change', loadItem, false );

		// loop through the buttons/inputs provided and
		//   set the event handlers
		inputEvents_.forEach( function( inEvt ) {
			if ( inEvt.el && inEvt.evtName && inEvt.handler ) {
				inEvt.el.addEventListener( inEvt.evtName, inEvt.handler, false );
			}
		} );

		// loop through inputs and watch for enter keypress
		window.forEachElement( dataFields_, function( el ) {
			el.addEventListener( 'keypress', function( e ) {
				if ( e.keyCode === 13 ) {
					saveEvt_();
				}
			}, false );
		} );

		// loop through elements with class input-date 
		//   to provide limitations on data entered
		window.forEachElement( doc.querySelectorAll( '.input-date' ), function( el ) {
			// only allow numbers and /
			//  value should be MM/DD/YYYY
			el.addEventListener( 'keydown', function( e ) {
				var keyCode = e.keyCode;

				if ( ( keyCode < 48 || keyCode > 57 ) && ( keyCode < 96 || keyCode > 105 ) && keyCode !== 46 && keyCode !== 37 && keyCode !== 39 && keyCode !== 8 && keyCode !== 111 && keyCode !== 191 && keyCode !== 9 ) {
					e.preventDefault();
				}
			}, false );

			// automatically add / after MM and DD
			el.addEventListener( 'keyup', function( e ) {
				var val = this.value.trim();

				if ( ( val.length === 2 || val.length === 5 ) && e.keyCode !== 8 ) {
					this.value = val + '/';
				}
			} );
		} );
	}

	// starting a new item
	function initItem() {
		formOptions_.classList.add( 'hidden' );
		formEdit_.classList.remove( 'hidden' );

		// if we have a sort order field, set the default value to the list of elements
		//   in ddlOptions_
		if ( doc.querySelector( '[name="sortOrder"]' ) ) {
			doc.querySelector( '[name="sortOrder"]' ).value = ddlOptions_.querySelectorAll( 'option' ).length;
		}

		app.forms.checkActive();
		formEdit_.querySelector( 'input' ).focus();
		clearStatus();
	}

	// loading an item to edit/delete
	function loadItem() {
		var keys, key,

            Obj = Parse.Object.extend( parse_.object ),
            query = new Parse.Query( Obj );

		// set the itemId
		settings_.itemId = ddlOptions_.options[ddlOptions_.selectedIndex].value;

		if ( settings_.itemId.length !== '-1' ) {
			setStatus( 'Loading, please wait.' );

			query.get( settings_.itemId, {
				success: function( obj ) {
					if ( obj ) {
						// loop through all data fields and set the value of them
						//   to the data received from the webservice
						window.forEachElement( dataFields_, function( field ) {
							var val = obj.get( field.getAttribute( 'name' ) );

							if ( field.tagName.toLowerCase() === 'textarea' ) {
								CKEDITOR.instances[field.id].setData( val );
							}
							if ( field.classList.contains( 'input-date' ) ) {
								field.value = moment( val ).format( 'MM/DD/YYYY' );
							}
							else {
								field.value = val;
							}
						} );

						// if this page requires additional data stored in otherData_
						if ( otherData_ ) {

							// get the keyss of each property in otherData_
							keys = Object.keys( otherData_ );

							// loop through them and set the value of property
							//   to the data returned from the webservice
							for ( var i = 0; i < keys.length; i++ ) {
								key = keys[i];
								setOtherDataProperty( key, obj.get( key ) );
							}
						}

						// if we have a callback function unique to the current page, call it
						if ( settings_.load.callback && typeof settings_.load.callback === 'function' ) {
							settings_.load.callback();
						}

						// show the edit form, hide the options form
						formOptions_.classList.add( 'hidden' );
						formEdit_.classList.remove( 'hidden' );

						if ( settings_.del ) {
							doc.getElementById( 'btn-item-delete' ).classList.remove( 'hidden' );
						}

						// hide loading status message
						clearStatus();
					}

						// if an error occured trying to load the data
					else {
						setStatus( 'Unable to load data. Please try again.' );
						ddlOptions_.value = '-1';
					}
				},
				error: function( obj, err ) {
					console.log( obj, err );
				}
			} );
		}
	}

	// helper function to set a property in otherData_
	function setOtherDataProperty( key, value ) {
		otherData_[key] = value;
	}

	// helper function to get a property value in otherData_
	function getOtherDataProperty( key ) {
		return otherData_[key];
	}

	// when preparing to save, check all required fields and make sure
	//   data has been provided for them
	function validateReqFields() {
		var isValid = true;

		window.forEachElement( reqFields_, function( field ) {
			var val;

			if ( field.tagName.toLowerCase() === 'textarea' ) {
				val = CKEDITOR.instances[field.id].getData( val ).trim();
			}
			else if ( field.tagName.toLowerCase() === 'select' && !field.classList.contains( 'material-select' ) ) {
				val = field.options[field.selectedIndex].value;
			}
			else {
				val = field.value.trim();
			}

			if ( val === '' || val === '-1' ) {
				field.classList.add( 'invalid' );
				isValid = false;
			}
			else {
				field.value = val;
				field.classList.remove( 'invalid' );
			}
		} );

		if ( !isValid ) {
			formEdit_.querySelector( '.invalid' ).focus();
			setStatus( 'Fields marked with * are required.' );
		}
		else {
			clearStatus();
		}

		return isValid;
	}

	// when preparing to save, collect all the data from the form
	//   this includes looping through all dataFields_ and getting the
	//   data from otherData_ and combining into one object
	function collectData() {
		var data = {},
            keys, key;

		// get the data from the dataFields_
		window.forEachElement( dataFields_, function( field ) {
			var val;

			if ( field.tagName.toLowerCase() === 'textarea' ) {
				val = CKEDITOR.instances[field.id].getData( val ).trim();
			}
			else if ( field.tagName.toLowerCase() === 'select' && !field.classList.contains( 'material-select' ) ) {
				val = field.options[field.selectedIndex].value;
			}
			else {
				val = field.value.trim();
			}

			data[field.getAttribute( 'name' )] = val;
		} );

		// get the data from the otherData_
		if ( otherData_ ) {
			keys = Object.keys( otherData_ );

			for ( var i = 0; i < keys.length; i++ ) {
				key = keys[i];
				data[key] = getOtherDataProperty( key );
			}
		}

		return data;
	}

	// helper function to handle image uploads
	//   @file - the file to be uploaded
	//   @isImg - boolean if uploading an image
	//   @handler - the ashx file to handle the file upload
	//   @fn - optional - callback function to run after the image has been uploaded
	function uploadFile( file, isImg, handler, fn ) {
		var fileName = file ? file.name : '',
            fileType = file ? file.type : '',

            // file reader
            fReader = new FileReader();

		if ( fileName === '' && fileType === '' ) {
			return;
		}

		// confirm this file is allowed
		if ( !isImg || /^image\//.test( fileType ) ) {
			setStatus( 'Uploading, please wait. This could take a few minutes.' );

			fReader.onload = function( e ) {
				// create the XMLHttpRequest object
				var xhr = new XMLHttpRequest();

				// set the handler and all headers
				xhr.open( 'post', handler, true );
				//xhr.overrideMimeType( 'text/plain; charset=x-user-defined-binary' );
				xhr.setRequestHeader( 'X-File-Name', fileName );
				xhr.setRequestHeader( 'X-File-Size', file.size );
				xhr.setRequestHeader( 'X-File-Type', fileType );

				// callback of xhr load
				xhr.addEventListener( 'load', function( response ) {
					// when the request is complete
					if ( response.target.response ) {
						var rsp = JSON.parse( response.target.response ),
							msg;

						// if the upload was successful
						if ( rsp.status === 'success' ) {
							setStatus( 'The file was successfully uploaded.' );
							setTimeout( clearStatus, 1000 );

							if ( fn && typeof fn === 'function' ) {
								fn( rsp.fileName );
							}
						}
						else {
							msg = 'Unable to upload the file, please try again.';

							if ( rsp.msg ) {
								msg += ' ' + rsp.msg;
							}

							setStatus( msg );
						}
					}
				}, false );

				xhr.send( file );
			};

			// begin the read operation
			fReader.readAsDataURL( file );
		}
		else {
			setStatus( 'Only .jpg, .jpeg, and .png files are allowed.' );
		}
	}

	// handles saving of the item
	//   @wsUrl - the webservice to call
	//   @wsData - the data to send to the webservice
	//   @fn - optional - additional callback to execute after the save
	function saveItem( wsUrl, wsData, fn ) {
		var Obj = Parse.Object.extend( parse_.object ),
            obj = new Obj(),
            isError = false,

            saveObj = function() {
            	obj.save( wsData, {
            		success: function( obj ) {
            			setStatus( 'Save successful.' );

            			updateOptions();

            			if ( fn && typeof fn === 'function' ) {
            				fn( obj );
            			}

            			setTimeout( back, 1000 );
            		},
            		error: function( obj, err ) {
            			setStatus( 'Unable to save at this time, please try again.' );
            			console.log( obj, err );
            		}
            	} );
            };

		setStatus( 'Saving, please wait...' );

		if ( getItemId() !== -1 ) {
			var query = new Parse.Query( Obj );

			query.get( settings_.itemId, {
				success: function( itemObj ) {
					obj = itemObj;
					saveObj();
				},
				error: function( itemObj, err ) {
					isError = true;
					setStatus( 'Unable to save at this tieme, please try again.' );
				}
			} );
		}
		else {
			saveObj();
		}
	}

	// deletes the item from parse
	function deleteItem() {
		var Obj = Parse.Object.extend( parse_.object ),
            query = new Parse.Query( Obj );

		// set the itemId
		settings_.itemId = ddlOptions_.options[ddlOptions_.selectedIndex].value;

		if ( settings_.itemId.length !== '-1' && window.confirm( 'Are you sure you want to delete this item?' ) ) {
			setStatus( 'Loading, please wait.' );

			query.get( settings_.itemId, {
				success: function( obj ) {
					obj.destroy( {
						success: function( obj ) {
							setStatus( 'The item has been deleted successfully.' );
							updateOptions();

							setTimeout( back, 1000 );
						},
						error: function( obj, err ) {
							setStatus( 'Unable to delete at this time, please try again.' );
							console.log( obj, err );
						}
					} );
				},
				error: function( obj, err ) {
					setStatus( 'Unable to delete at this time, please try again.' );
					console.log( obj, err );
				}
			} );
		}
	}

	// toggle back to the options screen
	//   and clear out everything from the edit screen
	function back() {
		// reset the base itemId
		settings_.itemId = -1;

		// reset otherData_ to it's original state
		otherData_ = app.util.cloneObj( otherDataOriginal_ );

		// set the options ddl back to default state
		ddlOptions_.value = '-1';

		// make sure we go back to the top of the screen
		window.scrollTo( 0, 0 );

		// hide the edit form and show the options screen
		formEdit_.classList.add( 'hidden' );
		formOptions_.classList.remove( 'hidden' );

		// clear our all inputs
		window.forEachElement( formEdit_.querySelectorAll( 'input, textarea' ), function( field ) {
			if ( field.tagName.toLowerCase() === 'textarea' ) {
				CKEDITOR.instances[field.id].setData( '' );
			}
			else {
				field.classList.remove( 'invalid' );
				field.value = '';
			}
		} );

		window.forEachElement( formEdit_.querySelectorAll( 'select' ), function( field ) {
			field.classList.remove( 'invalid' );
			field.value = '-1';

			if ( field.classList.contains( 'material-select' ) ) {
				field.parentNode.querySelector( 'input[type="text"]' ).value = '';
				field.parentNode.querySelector( 'input[type="text"]' ).classList.remove( 'invalid' );

				window.forEachElement( field.parentNode.querySelectorAll( '.select-opt.active' ), function( opt ) {
					opt.classList.remove( 'active' );
				} );
			}
			else if ( field.multiple && field.classList.contains( 'chosen-select' ) ) {
				window.forEachElement( field.querySelectorAll( 'option' ), function( opt ) {
					opt.selected = false;
				} );

				$( field ).trigger( 'chosen:updated' );
			}
		} );

		// if any preview rows are used, clear them too
		window.forEachElement( formEdit_.querySelectorAll( '.row-preview' ), function( row ) {
			row.innerHTML = '';
		} );

		// any map rows
		window.forEachElement( formEdit_.querySelectorAll( '.row-map' ), function( row ) {
			row.classList.add( 'hidden' );
		} );

		forEachElement( doc.querySelectorAll( '.btn-load-action' ), function( btn ) {
			btn.classList.add( 'hidden' );
		} );

		forEachElement( formEdit_.querySelectorAll( '.active' ), function( el ) {
			el.classList.remove( 'active' );
		} );

		doc.getElementById( 'btn-item-delete' ).classList.add( 'hidden' );

		// clear any status message
		clearStatus();
	}

	// update the list of options in the ddlOptions_
	//   requires webservice url, function, and parameters
	//   all should be provided by page specific settings object
	function updateOptions() {
		var Obj = Parse.Object.extend( parse_.object ),
            query = new Parse.Query( Obj );

		if ( parse_.querySort ) {
			query.ascending( parse_.querySort );
		}

		query.limit( 1000 );

		query.find( {
			success: function( results ) {
				var obj;
				ddlOptions_.innerHTML = '';

				if ( results && results.length ) {
					ddlOptions_.appendChild( createOpt( '-1', '-- Select ' + settings_.item + ' --' ) );

					for ( var i = 0; i < results.length; i++ ) {
						obj = results[i];
						ddlOptions_.appendChild( createOpt( obj.id, settings_.setOptionText( obj ) ) );
					}
				}
				else {
					ddlOptions_.appendChild( createOpt( '-1', '-- No ' + settings_.item + 's Found --' ) );
				}
			},
			error: function( obj, error ) {
				console.log( obj, error );
			}
		} );
	}

	// helper method to create option elements
	function createOpt( val, txt, className ) {
		var opt = doc.createElement( 'option' );
		opt.value = val;
		opt.text = txt;

		if ( className ) {
			opt.className = className;
		}

		return opt;
	}

	// helper function to create the item URL
	function createUrl( str, dateObj ) {
		var datePart;

		str = str.toLowerCase();
		str = str.replace( / /gi, '-' );
		str = str.replace( /#/gi, '-' );
		str = str.replace( /!/gi, '-' );
		str = str.replace( /&/gi, '-' );
		str = str.replace( /\./gi, '' );
		str = str.replace( /,/gi, '' );
		str = str.replace( /'/gi, '' );
		str = str.replace( /"/gi, '' );
		str = str.replace( /\//gi, '' );
		str = str.replace( /\\/gi, '' );
		str = str.replace( /--/gi, '-' );

		if ( dateObj ) {
			datePart = dateObj.substring( 6 ) + '/';
			datePart = datePart + dateObj.substring( 0, 2 ) + '/';
			datePart = datePart + dateObj.substring( 3, 5 ) + '/';
			str = datePart + str;
		}

		return str;
	}

	// helper function to return the base itemId
	function getItemId() {
		return settings_.itemId;
	}

	// helper method to set the status message
	function setStatus( msg ) {
		//status_.classList.remove( 'hidden' );
		//status_.innerHTML = '<p>' + msg + '</p>';
		app.toast.show( msg );
	}

	// helper method to clear the status message
	function clearStatus() {
		//status_.classList.add( 'hidden' );
		//status_.innerHTML = '';
		app.toast.hide();
	}

	// available public method calls
	return {
		init: init,
		initItem: initItem,
		back: back,
		setOtherDataProperty: setOtherDataProperty,
		getOtherDataProperty: getOtherDataProperty,
		validateReqFields: validateReqFields,
		collectData: collectData,
		getItemId: getItemId,
		uploadFile: uploadFile,
		saveItem: saveItem,
		deleteItem: deleteItem,
		createOpt: createOpt,
		createUrl: createUrl,
		setStatus: setStatus,
		clearStatus: clearStatus,
		updateOptions: updateOptions,
		getParseAppId: parse_.appId,
		getParseJSKey: parse_.jsKey
	};
}( document ) );