///<reference path="main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	var formUser = doc.getElementById( 'form-user' ),
		fields = formUser.querySelectorAll( 'input' ),
		btnSave = doc.getElementById( 'btn-user-save' );

	btnSave.addEventListener( 'click', createUser, false );

	Parse.initialize( app.admin.getParseAppId, app.admin.getParseJSKey );

	function createUser() {
		var params = {},
			valid = true,
			user = new Parse.User();

		window.forEachElement( fields, function( field ) {
			var val = field.value.trim();

			if ( val === '' ) {
				valid = false;
				app.admin.setStatus( 'All fields are required.' );
				return true;
			}
			else {
				params[field.getAttribute( 'name' )] = val;
			}
		} );

		if ( valid ) {
			app.admin.setStatus( 'Creating user account.' );

			user.signUp( params, {
				success: function( user ) {
					app.admin.setStatus( 'User account created.' );
					setTimeout( app.admin.clearStatus, 500 );
				},
				error: function( user, err ) {
					app.admin.setStatus( 'Unable to create account at this time, please try again.' );
				}
			} );
		}
	}

}( document ) );