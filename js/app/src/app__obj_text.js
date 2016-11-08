///<reference path="../main.js">
/**
 * Copyright 2016 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 * @version: 1.0.0
 * 
 * Corresponding HTML should follow:
 * 
 * <div class="input-field">
 *   <input type="text" id="tb-mytb" name="dbCol" />
 *   <label for="tb-mytb">Label Text</label>
 * </div>
 * 
 * To make a field required, add class="req"
 * To make a field use a datepicker, add class="input-date"
 * 
 * To autovalidate email, set type="email"
 * To auotvalidate phone numbers, set type="tel" 
 */
( function( doc ) {
	'use strict';

	const cssClasses = {
		ACTIVE_FIELD_CLASS: 'active',
		DATE_SELECTOR: 'input-date',
		ERROR_LABEL: 'error-label',
		INVALID_REQ_FIELD: 'invalid',
		REQUIRED_FIELD: 'req'
	};

	// Regex's for validating field data
	const regExpressions = {
		EMAIL: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
		TEL: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
		DATE: /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/
	};

	class TextBox {
		// Provide the input element for this TextBox
		constructor( input ) {
			// elements
			this.input = input;
			this.container = input.parentNode;
			this.label = this.container.querySelector( 'label' );

			// check for date
			if ( this.input.classList.contains( cssClasses.DATE_SELECTOR ) ) {
				this.initDatePicker();
			}

			// check for initial value
			this.checkForValue();

			this.initDatePicker = this.initDatePicker.bind( this );
			this.focusHandler = this.focusHandler.bind( this );
			this.blurHandler = this.blurHandler.bind( this );
			this.validateField = this.validateField.bind( this );
			this.checkForValue = this.checkForValue.bind( this );
			this.setValue = this.setValue.bind( this );
			this.getValue = this.getValue.bind( this );

			this.addEventListeners();
		}

		// Add the event listeners
		addEventListeners() {
			this.input.addEventListener( 'focus', this.focusHandler, false );
			this.input.addEventListener( 'blur', this.blurHandler, false );
			this.input.addEventListener( 'change', this.checkForValue, false );
		}

		// Initialize the date picker if the input has class .input-date
		initDatePicker() {
			let field = this.input;
			let picker;

			// make sure it is a text input
			field.type = 'text';

			// if touch device use default date picker
			if ( 'ontouchstart' in doc.documentElement ) {
				field.type = 'date';
				return;
			}

			picker = new Pikaday( {
				field: field,
				format: 'MM/DD/YYYY',
				onSelect: function() {
					field.value = this.getMoment().format( 'MM/DD/YYYY' );
				}
			} );
		}

		// OnFocus event handler
		focusHandler() {
			this.label.classList.add( cssClasses.ACTIVE_FIELD_CLASS );
		}

		// OnBlur event handler
		blurHandler() {
			this.checkForValue();
			this.validateField();
		}

		// Helper function to check for a value and handle the active class of the label
		checkForValue() {
			if ( this.getValue() !== '' ) {
				this.label.classList.add( cssClasses.ACTIVE_FIELD_CLASS );
				this.validateField();
			}
			else {
				this.label.classList.remove( cssClasses.ACTIVE_FIELD_CLASS );
			}
		}

		// Helper function to provide validation of field data based on input type and classes
		validateField() {
			let field = this.input;
			let type = field.type.toLowerCase();
			let valid = true;
			let val = this.getValue();
			let minChars = field.getAttribute( 'min-chars' );
			let prevError = this.container.querySelector( '.' + cssClasses.ERROR_LABEL );
			let lbl;
			let msg = '';

			// check for a value in a required field
			if ( field.classList.contains( cssClasses.REQUIRED_FIELD ) && val === '' ) {
				valid = false;
				msg = 'Required field.';
			}

			// check for min characters
			else if ( minChars && val.length < parseInt( minChars, 10 ) ) {
				valid = false;
				msg = minChars + ' characters required.';
			}

			// check for valid email address
			else if ( type === 'email' && !regExpressions.EMAIL.test( val ) ) {
				valid = false;
				msg = 'Invalid email address.';
			}

			// check for valid phone number
			else if ( type === 'tel' && !regExpressions.TEL.test( val ) ) {
				valid = false;
				msg = 'Inavlid phone number.';
			}

			// check for date
			else if ( field.classList.contains( cssClasses.DATE_SELECTOR ) && !regExpressions.DATE.test( val ) ) {
				valid = false;
				msg = 'Incorrect date format.';
			}

			// remove any previous error messages
			if ( prevError ) {
				this.container.removeChild( prevError );
			}

			// if the field is valid
			if ( valid ) {
				field.classList.remove( cssClasses.INVALID_REQ_FIELD );
			}

			// if invalid, make sure it is highlighted
			else {
				field.classList.add( cssClasses.INVALID_REQ_FIELD );

				// if we have a message
				if ( msg !== '' ) {
					lbl = doc.createElement( 'span' );
					lbl.classList.add( cssClasses.ERROR_LABEL );
					lbl.textContent = msg;
					this.container.appendChild( lbl );
				}
			}
		}

		// Helper function to set the value of the input
		setValue( val ) {
			this.input.value = val;
			this.checkForValue();
			this.validateField();
		}

		// Helper function get the value of the input
		getValue() {
			return this.input.value.trim();
		}
	}

	// Expose the TextBox object to the app
	app.TextBox = TextBox;

}( document ) );