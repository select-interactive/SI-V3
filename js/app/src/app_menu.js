///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.menu = ( function( doc ) {
	'use strict';

	var triggers, currentTrigger, openMenu, hideMenuTimeout,
		evtOverlay = doc.querySelector( '#event-overlay' );

	window.addEventListener( 'resize', resetMenuPosition, false );

	function init( context, dynamicLoad ) {
		var menu, position;

		if ( !context ) {
			context = doc;
		}

		triggers = context.querySelectorAll( '[data-menu-trigger]' );

		forEachElement( triggers, function( trigger ) {
			if ( !trigger.getAttribute( 'data-initialized' ) ) {
				trigger.setAttribute( 'data-initialized', 'true' );
				menu = context.querySelector( '[data-menu="' + trigger.getAttribute( 'data-menu-trigger' ) + '"]' );
				menu.parentNode.removeChild( menu );
				doc.body.appendChild( menu );

				setMenuPosition( trigger, dynamicLoad );
				
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

	function resetMenuPosition() {
		triggers = doc.querySelectorAll( '[data-menu-trigger]' );

		forEachElement( triggers, function( trigger ) {
			setMenuPosition( trigger );
		} );
	}

	function setMenuPosition( trigger, dynamicLoad ) {
		var menu = doc.querySelector( '[data-menu="' + trigger.getAttribute( 'data-menu-trigger' ) + '"]' ),
			position = trigger.getBoundingClientRect(),
			right = window.innerWidth - position.right - 1,
			top = position.top;
		
		if ( window.mq( '(min-width:1025px)' ) ) {
			right = right - 18;
		}

		if ( dynamicLoad ) {
			top = top - 101;
		}

		menu.style.right = right + 'px';
		menu.setAttribute( 'data-top', top );
	}

	function showMenu( trigger ) {
		var menu = doc.querySelector( '[data-menu="' + trigger.getAttribute( 'data-menu-trigger' ) + '"]' );

		if ( menu && openMenu !== menu ) {
			currentTrigger = trigger;
			openMenu = menu;

			menu.style.top = menu.getAttribute( 'data-top' ) + 'px';
			menu.classList.add( 'in' );

			menu.removeEventListener( 'mouseenter', keepMenu );
			menu.removeEventListener( 'mouseout', hideMenu );

			menu.addEventListener( 'mouseenter', keepMenu, false );
			menu.addEventListener( 'mouseleave', hideMenu, false );

			if ( window.mq( '(max-width:1024px)' ) ) {
				if ( evtOverlay ) {
					evtOverlay.classList.add( 'in' );

					setTimeout( function() {
						evtOverlay.style.height = doc.body.offsetHeight + 'px';
						evtOverlay.addEventListener( 'click', hideMenu, false );
					}, 10 );
				}
				else {
					console.warn( 'No event overlay found to close menu on mobile.' );
				}
			}
		}
	}
	
	function keepMenu() {
		if ( hideMenuTimeout ) {
			clearTimeout( hideMenuTimeout );
			hideMenuTimeout = null;
		}
	}

	function hideMenu() {
		hideMenuTimeout = setTimeout( function() {
			openMenu.classList.add( 'hide' );

			evtOverlay.removeEventListener( 'click', hideMenu, false );
			evtOverlay.classList.remove( 'in' );
			evtOverlay.style.height = 0;

			setTimeout( function() {
				openMenu.classList.remove( 'in' );
				openMenu.classList.remove( 'hide' );
				openMenu.style.top = '-99999px';

				setTimeout( function() {
					openMenu = null;
				}, 10 );
			}, 500 );
		}, 300 );
	}

	init();

	return {
		initMenus: init
	};

}( document ) );