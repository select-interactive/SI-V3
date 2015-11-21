///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.tabs = ( function( doc ) {
	'use strict';

	var tabLinks = doc.querySelectorAll( '.tab-links' );

	window.forEachElement( tabLinks, function( els ) {
		var links = els.querySelectorAll( 'a' ),
			tabGroup = els.getAttribute( 'data-tab-group' );

		if ( links.length !== doc.querySelectorAll( '[data-tab-group="' + tabGroup + '"].tab' ).length ) {
			console.warn( 'Different # of links and tabs for tab group: ' + tabGroup );
		}

		window.forEachElement( links, function( link ) {
			link.addEventListener( 'click', function( e ) {
				var tab = link.getAttribute( 'href' ).toString().substring( 1 );

				window.forEachElement( doc.querySelectorAll( '[data-tab-group="' + tabGroup + '"].tab.active' ), function( el ) {
					el.classList.remove( 'active' );
				} );

				tab = doc.querySelector( '[data-tab-group="' + tabGroup + '"][data-tab="' + tab + '"]' );
				
				if ( !link.classList.contains( 'active' ) ) {
					els.querySelector( '.active' ).classList.remove( 'active' );
				}

				link.classList.add( 'active' );
				tab.classList.add( 'active' );
				
				e.preventDefault();
			}, false );
		} );
	} );

}( document ) );