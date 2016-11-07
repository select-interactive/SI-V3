///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	if ( 'serviceWorker' in navigator && doc.URL.indexOf( 'localhost' ) === -1 ) {
		navigator.serviceWorker.register( '/serviceworker.js' ).then( registration => {
			console.log( 'serviceworker registration successful with scope: ' + registration.scope );
		} ).catch( err => {
			console.log( 'serviceworker registration failed: ', err );
		} );
	}

}( document ) );