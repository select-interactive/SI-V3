///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.alerts = ( function( doc ) {
	'use strict';

	var elHTML = doc.querySelector( 'html' ),
		container, hdr, content, confirm, deny, overlay;
	
	function loadComponent() {
		var link = doc.createElement( 'link' );
		link.rel = 'import';
		link.href = '/templates/components/alerts/alert.html';

		link.onload = function() {
			var content = link.import,
				el = content.querySelector( '#alert' ),
				elOverlay = content.querySelector( '#alert-overlay' );

			doc.body.appendChild( el.cloneNode( true ) );
			doc.body.appendChild( elOverlay.cloneNode( true ) );

			container = doc.getElementById( 'alert' );
			hdr = doc.getElementById( 'alert-hdr' );
			content = doc.getElementById( 'alert-content' );
			confirm = doc.getElementById( 'alert-confirm' );
			deny = doc.getElementById( 'alert-deny' );
			overlay = doc.getElementById( 'alert-overlay' );
		};

		doc.head.appendChild( link );
	}

	function promptAlert( hdrText, html, confirmText, denyText, fnConfirm, fnDeny ) {
		var cloneConfirm, cloneDeny;
		
		if ( container ) {
			// clone the buttons to remove any previous event listeners
			cloneConfirm = confirm.cloneNode( true );
			cloneDeny = deny.cloneNode( true );

			confirm.parentNode.replaceChild( cloneConfirm, confirm );
			deny.parentNode.replaceChild( cloneDeny, deny );

			confirm = cloneConfirm;
			deny = cloneDeny;

			// add new events for the buttons
			if ( fnConfirm && typeof fnConfirm === 'function' ) {
				confirm.addEventListener( 'click', fnConfirm, false );
			}

			if ( fnDeny && typeof fnDeny === 'function' ) {
				deny.addEventListener( 'click', fnDeny, false );
			}

			setContent( hdrText, html, confirmText, denyText );
			showAlert();
		}
		else {
			console.warn( 'The elements for the alert component are not available.' );
		}
	}

	function setContent( hdrText, html, confirmText, denyText ) {
		hdr.innerHTML = hdrText;
		doc.getElementById( 'alert-content' ).innerHTML = html;
		confirm.innerText = confirmText;
		deny.innerText = denyText;
	}

	function showAlert() {
		elHTML.classList.add( 'alert-visible' );
		overlay.style.height = doc.body.offsetHeight + 'px';
	}

	function closeAlert() {
		elHTML.classList.remove( 'alert-visible' );
		overlay.style.height = '0';
	}

	loadComponent();

	return {
		promptAlert: promptAlert,
		dismissAlert: closeAlert
	};

}( document ) );