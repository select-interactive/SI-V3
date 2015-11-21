///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.forms = ( function( doc ) {
	'use strict';

	var inputFields = doc.querySelectorAll( '.input-field' ),
		ranges = doc.querySelectorAll( 'input[type=range]' ),
		
		// keep track of an open select element
		openSelect,

		// TODO: Add regular expressions for validating type=email and type=tel
		//  input fields
		emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
		telRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
		dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

	// Handles text inputs and select elements
	window.forEachElement( inputFields, function( container ) {
		var lbl = container.querySelector( 'label' ),
			input = container.querySelector( 'input' ),
			select, opts;

		// if textarea
		if ( !input ) {
			input = container.querySelector( 'textarea' );
		}

		// if select
		if ( !input ) {
			input = container.querySelector( 'select' );

			if ( input ) {
				input = initSelect( input );
				select = container.querySelector( '.select-opts' );
			}
		}

		// check if date input and if we are on larger screen
		//   if we are on mobile, we'll let the device use the default date picker.
		if ( input && input.classList.contains( 'input-date' ) && window.mq( '(min-width:1025px)' ) ) {
			input.type = 'text';

			var picker = new Pikaday( {
				field: input,
				format: 'MM/DD/YYYY',
				onSelect: function() {
					input.value = this.getMoment().format( 'MM/DD/YYYY' );
				}
			} );
		}
		
		// add events for the labels
		if ( lbl && input ) {
			input.addEventListener( 'focus', function( e ) {
				lbl.classList.add( 'active' );
			}, false );

			if ( select ) {
				input.addEventListener( 'click', function( e ) {
					var overlay;

					select.classList.add( 'active' );
					openSelect = select;

					overlay = doc.createElement( 'div' );
					overlay.id = 'select-pg-overlay';
					doc.body.appendChild( overlay );
				}, false );
			}

			if ( !select ) {
				if ( input.value.length ) {
					lbl.classList.add( 'active' );
				}

				// --------------------------------------------------
				// TODO: this is getting called twice on date fields?
				// --------------------------------------------------
				input.addEventListener( 'blur', function( e ) {
					var val = input.value.trim();
					
					if ( !val.length ) {
						lbl.classList.remove( 'active' );
					}
					
					validateField( input );
				}, false );
			}
		}

		// -------------------------------------------------------------------
		// TODO: Not working on iOS. The overlay is on top of the select list?
		// -------------------------------------------------------------------
		// check for select opts
		if ( select ) {
			opts = select.querySelectorAll( '.select-opt' );
				
			window.forEachElement( opts, function( opt ) {
				opt.addEventListener( 'click', function( e ) {
					var active = select.querySelector( '.active' ),
						val = '';
					
					if ( active && active !== opt && !input.classList.contains( 'multiple' ) ) {
						active.classList.remove( 'active' );
					}
					
					opt.classList.toggle( 'active' );
					
					if ( input.classList.contains( 'multiple' ) ) {
						active = select.querySelectorAll( '.active' );

						window.forEachElement( active, function( a, i ) {
							if ( i > 0 ) {
								val += ', ';
							}

							val += a.innerHTML;
						} );

						input.value = val;
					}
					else if ( opt.classList.contains( 'active' ) ) {
						input.value = opt.innerHTML;
						closeSelect();
					}
					else {
						input.value = '';
						closeSelect();
					}
					
					validateField( input );

					e.preventDefault();
					return false;
				}, false );
			} );
		}
	} );

	function checkSelectValues( el ) {
		var input = el.parentNode.querySelector( 'input[type="text"]' ),
			opts = el.parentNode.querySelectorAll( '.select-opt.active' ),
			val = '';

		if ( !opts || opts.length === 0 ) {
			input.value = '';
		}

		window.forEachElement( opts, function( opt, i ) {
			if ( input.classList.contains( 'multiple' ) ) {
				if ( i > 0 ) {
					val += ', ';
				}

				val += opt.innerHTML;
			}
			else {
				val = opt.innerHTML;
			}
		} );

		input.value = val;
	}

	function initSelect( el ) {
		var container, input, icon, optionList, options = '', label;

		container = el.parentNode;
		container.classList.add( 'input-field-select' );
		
		input = doc.createElement( 'input' );
		input.classList.add( 'input-icon-select' );
		input.id = 'tb-' + el.id;
		input.readOnly = true;
		input.type = 'text';

		for ( var i = 0; i < el.classList.length; i++ ) {
			input.classList.add( el.classList[i] );
		}

		if ( el.getAttribute( 'multiple' ) !== null ) {
			input.classList.add( 'multiple' );
		}
		
		icon = doc.createElement( 'i' );
		icon.classList.add( 'material-icons' );
		icon.classList.add( 'icon-drop-down' );
		icon.innerHTML = 'arrow_drop_down';

		label = container.querySelector( 'label' );

		if ( label ) {
			container.removeChild( label );
			label.setAttribute( 'for', input.id );
		}

		window.forEachElement( el.querySelectorAll( 'option' ), function( opt ) {
			options += '<li><a class="select-opt" href="#" data-val="' + opt.value + '">' + opt.text + '</a></li>';
		} );

		optionList = doc.createElement( 'ul' );
		optionList.innerHTML = options;
		optionList.classList.add( 'select-opts' );

		el.classList.add( 'hidden' );
		container.appendChild( input );
		container.appendChild( label );
		container.appendChild( icon );
		container.appendChild( optionList );

		return input;
	}

	// event to hide select elements
	doc.body.addEventListener( 'click', function( e ) {
		if ( e.target.id === 'select-pg-overlay' ) {
			closeSelect();
			e.preventDefault();
		}
	}, false );

	function closeSelect() {
		var lbl = openSelect.parentNode.querySelector( 'label' ),
			overlay = doc.getElementById( 'select-pg-overlay' );
		
		doc.body.removeChild( overlay );

		openSelect.classList.remove( 'active' );
		validateField( openSelect.parentNode.querySelector( 'input' ) );

		if ( !openSelect.querySelector( '.active' ) && lbl ) {
			lbl.classList.remove( 'active' );
		}

		openSelect = null;
	}

	function checkActiveInputs() {
		window.forEachElement( inputFields, function( container ) {
			var lbl = container.querySelector( 'label' ),
				input = container.querySelector( 'input' );

			if ( !input ) {
				input = container.querySelector( 'textarea' );
			}

			if ( lbl && input && input.value.trim().length ) {
				lbl.classList.add( 'active' );
			}
		} );
	}

	// Handles ranges
	window.forEachElement( ranges, function( range ) {
		var lbl = doc.createElement( 'span' );
		lbl.classList.add( 'range-label' );
		lbl.innerHTML = range.value + ' / ' + range.getAttribute( 'max' );
		range.parentNode.appendChild( lbl );

		range.addEventListener( 'change', function() { setRangeValue( range, lbl ); }, false );
		range.addEventListener( 'input', function() { setRangeValue( range, lbl ); }, false );
	} );

	function setRangeValue( range, lbl ) {
		if ( lbl ) {
			lbl.innerHTML = range.value + ' / ' + range.getAttribute( 'max' );
		}
	}

	function validateField( field ) {
		var valid = true,
			val = field.value.trim(),
			minChars = field.getAttribute( 'min-chars' ),
			prevError = field.parentNode.querySelector( '.error-label' ),
			lbl, msg;
		
		// check for some value in a .req field
		if ( field.classList.contains( 'req' ) && !val.length ) {
			valid = false;
			msg = 'Required field.';
		}

		// check for min characters entered
		else if ( minChars && val.length < minChars ) {
			valid = false;
			msg = minChars + ' characters required.';
		}

		// check for valid email addresses
		else if ( field.type.toLowerCase() === 'email' && !emailRegex.test( val ) ) {
			valid = false;
			msg = 'Invalid email address.';
		}

		// check for valid phone number
		else if ( field.type.toLowerCase() === 'tel' && !telRegex.test( val ) ) {
			valid = false;
			msg = 'Invalid phone number.';
		}

		// check for date
		else if ( field.classList.contains( 'input-date' ) && !dateRegex.test( val ) ) {
			valid = false;
			msg = 'Incorrect date format.';
		}


		// remove any previous error messages
		if ( prevError ) {
			prevError.parentNode.removeChild( prevError );
		}

		// if the field is valid
		if ( valid ) {
			field.classList.remove( 'invalid' );
		}

		// if invalid, make sure it is highlighted
		else {
			field.classList.add( 'invalid' );

			// if we have a msg
			if ( msg ) {
				lbl = doc.createElement( 'span' );
				lbl.classList.add( 'error-label' );
				lbl.innerHTML = msg;
				field.parentNode.appendChild( lbl );
			}
		}
	}

	return {
		checkActive: checkActiveInputs,
		checkSelectValues: checkSelectValues
	};

}( document ) );