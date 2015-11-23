///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.analytics = ( function( doc ) {
	'use strict';

	function logPageView( title ) {
		if ( ga ) {
			ga( 'send', 'pageview', window.location.pathname, {
				title: title
			} );
		}
	}

	return {
		logPageView: logPageView
	};

}( document ) );