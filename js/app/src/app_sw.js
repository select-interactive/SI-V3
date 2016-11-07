///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	if ( 'serviceWorker' in navigator ) {
		navigator.serviceWorker.register( '/serviceworker.js' ).then( function( registration ) {
			// registration was successful
			console.log( 'serviceworker registration successful with scope: ' + registration.scope );
	
		} ).catch( function( err ) {
			console.log( 'serviceworker registration failed: ', err );
		} );
	}

}( document ) );