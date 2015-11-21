///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.container = ( function( doc ) {
	'use strict';

	var drawer = doc.querySelector( '.container-drawer' ),
		drawerOverlay = doc.querySelector( '#container-drawer-overlay' );

	if ( drawer ) {
		window.forEachElement( drawer.querySelectorAll( 'a' ), function( link ) {
			var href = link.href;

			if ( href && doc.URL.toLowerCase() === href.toLowerCase() ) {
				link.classList.add( 'active' );
			}

			link.addEventListener( 'click', function( e ) {
				var active = drawer.querySelector( '.active' );

				if ( active ) {
					active.classList.remove( 'active' );
				}

				if ( href && href.indexOf( '#' ) === -1 ) {
					window.location = href;
				}

				link.classList.add( 'active' );

				if ( doc.body.classList.contains( 'container-drawer-open' ) ) {
					toggleDrawer();
				}

				e.preventDefault();
			}, false );
		} );
	}

	if ( !drawerOverlay && !doc.body.classList.contains( 'nocomponents' ) ) {
		console.warn( 'No container drawer overlay found, added automatically' );

		drawerOverlay = doc.createElement( 'div' );
		drawerOverlay.id = 'container-drawer-overlay';
		doc.body.appendChild( drawerOverlay );
	}

	if ( drawerOverlay ) {
		window.forEachElement( '[drawer-nav-trigger]', function( el ) {
			el.addEventListener( 'click', toggleDrawer, false );
		} );

		drawerOverlay.addEventListener( 'click', toggleDrawer, false );
	}

	function toggleDrawer( e ) {
		doc.body.classList.toggle( 'container-drawer-open' );

		if ( e ) {
			e.preventDefault();
		}
	}

	return {
		toggleDrawer: toggleDrawer
	};

}( document ) );