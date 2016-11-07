///<reference path="main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	var formLogin = doc.getElementById( 'form-login' ),
		tbUn = formLogin.querySelector( '[name="username"]' ),
		tbPwd = formLogin.querySelector( '[name="password"]' ),
		btnLogin = doc.getElementById( 'btn-login' ),
		status = doc.getElementById( 'status' );

	tbUn.addEventListener( 'keypress', formKeyPress, false );
	tbPwd.addEventListener( 'keypress', formKeyPress, false );
	btnLogin.addEventListener( 'click', loginUser, false );
	formLogin.addEventListener( 'submit', loginUser, false );

	if ( doc.URL.indexOf( '?lgnfail' ) !== -1 ) {
		status.innerHTML = '<p class="error">Login failed, please try again.</p>';
		status.classList.remove( 'hidden' );
	}

	function formKeyPress( e ) {
		if ( e.keyCode === 13 ) {
			loginUser( e );
		}
	}

	function loginUser( e ) {
		var un = tbUn.value.trim(),
			pwd = tbPwd.value.trim();
		
		if ( un === '' || pwd === '' ) {
			status.innerHTML = '<p>Both username and password are required.</p>';
			status.classList.remove( 'hidden' );

			if ( un === '' ) {
				tbUn.focus();
			}
			else {
				tbPwd.focus();
			}

			e.preventDefault();
			return;
		}
	}

}( document ) );