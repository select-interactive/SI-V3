///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.menu = ( function( doc ) {
	'use strict';

	var triggers, currentTrigger, openMenu, hideMenuTimeout;

	function init( context ) {
		if ( !context ) {
			context = doc;
		}

		triggers = context.querySelectorAll( '[data-menu-trigger]' );

		forEachElement( triggers, function( trigger ) {
			if ( !trigger.getAttribute( 'data-initialized' ) ) {
				trigger.setAttribute( 'data-initialized', 'true' );

				trigger.addEventListener( 'mouseenter', function( e ) {
					showMenu( trigger );
					e.preventDefault();
				}, false );

				trigger.addEventListener( 'click', function( e ) {
					showMenu( trigger );
					e.preventDefault();
				}, false );
			}
		} );
	}

	function showMenu( trigger ) {
		var menu = doc.querySelector( '[data-menu="' + trigger.getAttribute( 'data-menu-trigger' ) + '"]' );

		if ( menu && openMenu !== menu ) {
			currentTrigger = trigger;
			openMenu = menu;

			menu.classList.add( 'in' );

			menu.removeEventListener( 'mouseenter', keepMenu );
			menu.removeEventListener( 'mouseout', hideMenu );

			menu.addEventListener( 'mouseenter', keepMenu, false );
			menu.addEventListener( 'mouseleave', hideMenu, false );
		}
	}
	
	function keepMenu() {
		if ( hideMenuTimeout ) {
			clearTimeout( hideMenuTimeout );
			hideMenuTimeout = null;
		}
	}

	function hideMenu( menu ) {
		hideMenuTimeout = setTimeout( function() {
			openMenu.classList.add( 'hide' );

			setTimeout( function() {
				openMenu.classList.remove( 'in' );
				openMenu.classList.remove( 'hide' );
			}, 500 );
		}, 300 );
	}

	init();

	return {
		initMenus: init
	};

}( document ) );