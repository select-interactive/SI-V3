///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.toast = ( function( doc ) {
	'use strict';

	var container, label, btn, hideTimeout,
		defaultHideDuration = 3500,
		callback;

	function loadComponent() {
		var link = doc.createElement( 'link' );
		link.rel = 'import';
		link.href = '/templates/components/toast/toast.html';

		link.onload = function() {
			var content = link.import,
				el = content.querySelector( '#toast' );

			doc.body.appendChild( el.cloneNode( true ) );

			container = doc.getElementById( 'toast' );
			label = container.querySelector( '.toast-label' );
			btn = container.querySelector( '.toast-btn' );
		};

		doc.head.appendChild( link );
	}

	function show( msg, duration, fn ) {
		if ( container ) {
			if ( hideTimeout ) {
				clearTimeout( hideTimeout );
				hideTimeout = null;
			}

			label.innerHTML = msg;

			// if no duration value is passed in, or if 0 is passed in,
			//   hide the toast after the defaultHideDuration
			if ( duration !== -1 && ( !duration || !isNaN( duration ) || duration === 0 ) ) {
				duration = defaultHideDuration;
			}

			// if -1 is passed in, let the toast persist
			if ( duration !== -1 ) {
				hideTimeout = setTimeout( hide, duration );
			}

			if ( fn ) {
				callback = fn;
			}

			container.classList.add( 'active' );
		}
		else {
			console.warn( 'The elements for the toast component are not available.' );
		}
	}

	function hide() {
		container.classList.remove( 'active' );

		if ( callback && typeof callback === 'function' ) {
			callback();
		}
	}

	if ( !doc.body.classList.contains( 'nocomponents' ) ) {
		loadComponent();
	}

	return {
		show: show,
		hide: hide
	};

}( document ) );