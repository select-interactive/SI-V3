///<reference path="../main.js">
/**
 * Copyright 2016 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	const ckEditorSettings = {
		allowedContent: true,
		height: 350,
		toolbar: 'Simple'
	};

	const formCssClasses = {
		chosenSelect: 'chosen-select',
		ckeditor: 'use-ckeditor',
		errorLabel: 'error-label',
		hidden: 'hidden',
		inputField: 'input-field',
		invalid: 'invalid',
		mediumEditor: 'use-medium-editor',
		required: 'req'
	};

	class Form {
		// When creating a new Form, we can pass in a selected element (i.e. doc.querySelect( '#form' ))
		// or we can pass in a selector (i.e. '#form' )
		constructor( el ) {
			if ( typeof el === 'string' ) {
				el = app.$( el );
			}
			
			this.container = el;
			this.fields = el.querySelectorAll( 'input:not([type="file"]),textarea,select' );
			this.reqFields = el.querySelectorAll( '.' + formCssClasses.required );
			this.inputFields = el.querySelectorAll( '.' + formCssClasses.inputField );

			this.initFormElements = this.initFormElements.bind( this );
			this.initEditors = this.initEditors.bind( this );
			this.checkActiveInputs = this.checkActiveInputs.bind( this );
			this.validateFields = this.validateFields.bind( this );
			this.collectData = this.collectData.bind( this );
			this.setFieldValues = this.setFieldValues.bind( this );
			this.clearForm = this.clearForm.bind( this );

			this.initFormElements();
			this.initEditors();
		}

		// This function will loop through all input field elements to check for
		// inputs and select elements to create our custom TextBox or Select objects
		initFormElements() {
			app.$.forEach( this.inputFields, container => {
				let select = container.querySelector( 'select' );
				let input = container.querySelector( 'input' );
				
				if ( select && !select.Select ) {
					select.Select = new app.Select( select );
				}

				if ( !input ) {
					input = container.querySelector( 'textarea' );
				}

				if ( !input ) {
					input = container.querySelector( '.' + formCssClasses.mediumEditor );
				}

				if ( input ) {
					let tag = input.tagName.toLowerCase();
					let type = input.type.toLowerCase();

					if ( !input.TextBox && type !== 'checkbox' && type !== 'radio' ) {
						input.TextBox = new app.TextBox( input );
					}
				}
			} );
		}

		// Helper functions to initialize textareas with MediumEditor or CKEDITOR
		// depending on specified class
		initEditors() {
			app.$.forEach( this.fields, field => {
				if ( field.classList.contains( formCssClasses.mediumEditor ) ) {
					if ( !window.MediumEditor ) {
						console.warn( 'MediumEditor source not found. Unable to use MediumEditor.' );
					}
					else {
						new MediumEditor( field, {
							placeholder: {
								text: ''
							}
						} );
					}
				}
				else if ( field.classList.contains( formCssClasses.ckeditor ) ) {
					if ( !window.CKEDITOR ) {
						console.warn( 'CKEDITOR source not found. Unable to use CKEDITOR' );
					}
					else {
						CKEDITOR.replace( field.id, ckEditorSettings );

						if ( field.classList.contains( 'ckfinder' ) ) {
							CKFinder.setupCKEditor( CKEDITOR.instances[field.id], '/ckfinder/' );
						}
					}
				}
			} );
		}

		// Check if inputs/selects have values to set or remove active class
		// on the sibling label
		checkActiveInputs() {
			app.$.forEach( this.inputFields, container => {
				let lbl = container.querySelector( 'label' );
				let select = container.querySelector( 'select' );
				let input = container.querySelector( 'input' );

				if ( lbl ) {
					lbl.classList.remove( 'active' );
				}

				if ( select && select.Select ) {
					select.Select.checkForValue();
				}

				if ( !input ) {
					input = container.querySelector( 'textarea' );
				}

				if ( !input ) {
					input = container.querySelector( '.' + formCssClasses.mediumEditor );
				}

				if ( input && input.TextBox ) {
					input.TextBox.checkForValue();
				}
			} );
		}

		// Helper function to check if required fields have valid data
		validateFields() {
			let isValid = true;

			app.$.forEach( this.reqFields, field => {
				let val = '';
				let tag = field.tagName.toLowerCase();

				if ( field.classList.contains( formCssClasses.mediumEditor ) ) {
					val = field.innerHTML;
				}
				else if ( field.classList.contains( formCssClasses.ckeditor ) ) {
					val = CKEDITOR.instances[field.id].getData().trim();
				}
				else if ( tag === 'select' ) {
					if ( field.Select ) {
						val = field.Select.getValue();
					}
					else if ( !field.classList.contains( formCssClasses.chosenSelect ) ) {
						val = field.options[field.selectedIndex].value;
					}
				}
				else {
					val = field.value.trim();
				}

				if ( val === '' || val === '-1' || val === -1 ) {
					field.classList.add( formCssClasses.invalid );
					isValid = false;
				}
				else {
					field.value = val;
					field.classList.remove( formCssClasses.invalid );
				}
			} );

			return isValid;
		}

		// Helper function to collect data from form fields and return as
		// JSON key/value pair object. Uses the element's name attribute as the key.
		collectData() {
			let params = {};

			app.$.forEach( this.fields, field => {
				let key = field.getAttribute( 'name' );
				let val = '';
				let tag = field.tagName.toLowerCase();
				let type = field.type ? field.type.toLowerCase() : '';

				if ( type === 'checkbox' ) {
					val = field.checked;
				}
				else if ( field.classList.contains( formCssClasses.mediumEditor ) ) {
					val = field.innerHTML;
				}
				else if ( field.classList.contains( formCssClasses.ckeditor ) ) {
					val = CKEDITOR.instances[field.id].getData().trim();
				}
				else if ( tag === 'select' ) {
					if ( field.Select ) {
						val = field.Select.getValue();
					}
					else if ( !field.classList.contains( formCssClasses.chosenSelect ) ) {
						val = field.options[field.selectedIndex].value;
					}
				}
				else {
					val = field.value.trim();

					if ( field.classList.contains( 'integer' ) ) {
						val = parseInt( val, 10 );
					}
					else if ( field.classList.contains( 'decimal' ) ) {
						val = parseFloat( val );
					}
				}

				params[key] = val;
			} );

			return params;
		}

		// Helper function to set the values of form fields. Will use the 
		// name attribute of each field element to select the respective value
		// from the obj parameter.
		setFieldValues( obj ) {
			app.$.forEach( this.fields, field => {
				let val = obj[field.getAttribute( 'name' )];
				let type = field.type ? field.type.toLowerCase() : '';
				let tag = field.tagName.toLowerCase();

				if ( !obj ) {
					console.warn( 'Property does not exist for key ' + field.getAttribute( 'name' ) );
				}
				else {
					if ( type === 'checkbox' ) {
						field.checked = val;
					}
					else if ( field.classList.contains( formCssClasses.mediumEditor ) ) {
						field.innerHTML = val;
					}
					else if ( field.classList.contains( formCssClasses.ckeditor ) ) {
						val = CKEDITOR.instances[field.id].setData( val );
					}
					else if ( tag === 'select' && field.Select ) {
						field.Select.setValue( val );
					}
					else {
						if ( field.classList.contains( 'input-date' ) ) {
							if ( obj[field.getAttribute( 'name' ) + 'Str'] ) {
								val = obj[field.getAttribute( 'name' ) + 'Str'];
							}
							else {
								val = moment( val ).format( 'MM/DD/YYYY' );
							}
						}

						field.value = val;
					}
				}
			} );

			this.checkActiveInputs();
		}

		// Helper function to clear out the values of a form. Will additionally
		// remove all HTML from containers with class .row-preview and hide
		// all elements with class .btn-item-upload-delete. It will then
		// run checkActiveInputs to reset the labels.
		clearForm() {
			app.$.forEach( this.fields, field => {
				let lbl = field.querySelector( '.' + formCssClasses.errorLabel );
				let type = field.type ? field.type.toLowerCase() : '';
				let tag = field.tagName.toLowerCase();

				if ( type === 'checkbox' ) {
					field.checked = false;
				}
				else if ( field.classList.contains( formCssClasses.mediumEditor ) ) {
					field.innerHTML = '';
				}
				else if ( tag === 'textarea' ) {
					CKEDITOR.instances[field.id].setData( '' );
				}
				else if ( tag === 'select' ) {
					if ( field.Select ) {
						field.Select.setValue( '-1' );
					}
					else if ( field.multiple && field.classList.contains( formCssClasses.chosenSelect ) ) {
						app.$.forEach( field.querySelectorAll( 'option' ), function( opt ) {
							opt.selected = false;
						} );

						jQuery( field ).trigger( 'chosen:updated' );
					}
					else {
						field.value = '-1';
					}
				}
				else {
					field.value = '';
				}

				field.classList.remove( formCssClasses.invalid );

				if ( lbl ) {
					field.parentNode.removeChild( lbl );
				}
			} );

			app.$.forEach( '.row-preview', row => {
				row.innerHTML = '';
			}, this.container );

			app.$.forEach( '.btn-item-upload-delete', btn => {
				btn.classList.add( 'hidden' );
			}, this.container );

			this.checkActiveInputs();
		}

		hide() {
			this.container.classList.add( formCssClasses.hidden );
		}

		show() {
			this.checkActiveInputs();
			this.container.classList.remove( formCssClasses.hidden );
		}
	}

	// Expose the Form object to the rest of the project
	app.Form = Form;
}( document ) );