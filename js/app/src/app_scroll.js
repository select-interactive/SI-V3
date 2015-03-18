///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	var hdr = doc.getElementById( 'hdr-main' ),
		checkY = hdr.offsetHeight / 2,
		sLogo = doc.getElementById( 's-logo' );

	window.addEventListener( 'scroll', checkWindowY, false );

	function checkWindowY( e ) {
		if ( app.util.getWindowScrollPosition() > checkY && ! doc.body.classList.contains( 'past-header' ) ) {
			doc.body.classList.add( 'past-header' );
		}
		else if ( app.util.getWindowScrollPosition() <= checkY ) {
			doc.body.classList.remove( 'past-header' );
		}
	}

}( document ) );