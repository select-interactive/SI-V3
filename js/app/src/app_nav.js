///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.nav = ( function( doc ) {
	'use strict';

	var nav = doc.querySelector( '#nav-main' ),
		btnNavTrigger = doc.querySelector( '#btn-nav-trigger' ),
		evtOverlay = doc.querySelector( '#event-overlay' ),
			
		startX = -1;

	if ( nav && btnNavTrigger && evtOverlay ) {
		nav.addEventListener( 'touchstart', navTouchStart, false );
		nav.addEventListener( 'touchend', navTouchEnd, false );
		btnNavTrigger.addEventListener( 'click', showNav, false );
		evtOverlay.addEventListener( 'click', hideNav, false );
	}
	else {
		console.warn( 'Website navigation elements not present.' );
	}

	function navTouchStart( e ) {
		if ( window.mq( '(max-width:1024px)' ) && e.touches ) {
			startX = e.touches[0].clientX;
		}
	}

	function navTouchEnd( e ) {
		var endX;

		if ( window.mq( '(max-width:1024px)' ) && e.changedTouches ) {
			endX = e.changedTouches[0].pageX;
			
			if ( endX - startX >= 100 ) {
				hideNav();
			}
		}
	}

	function showNav( e ) {
		doc.body.classList.toggle( 'nav-in' );

		if ( doc.body.classList.contains( 'nav-in' ) ) {
			evtOverlay.style.height = doc.body.offsetHeight + 'px';
		}
		else {
			hideNav( e );
		}

		e.preventDefault();
	}

	function hideNav( e ) {
		if ( doc.body.classList.contains( 'nav-in' ) ) {
			doc.body.classList.remove( 'nav-in' );
			evtOverlay.style.height = 0;

			if ( e ) {
				e.preventDefault();
			}
		}
	}

	return {
		hide: hideNav
	};

}( document ) );