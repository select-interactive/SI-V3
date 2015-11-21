///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	var main = doc.getElementById( 'main' ),
		page;

	window.addEventListener( 'popstate', pop, false );

	doc.addEventListener( 'click', function( e ) {
		var pageToLoad;

		if ( e && e.target && e.target.classList && e.target.classList.contains( 'navigation' ) ) {
			pageToLoad = e.target.getAttribute( 'data-control' );

			if ( page !== pageToLoad ) {
				page = pageToLoad;
				loadPage( page );
				history.pushState( { page: page }, page, '/' + page + '/' );
			}

			e.preventDefault();
		}
	}, false );

	function loadPage( page ) {
		app.ajax.fetch( '/webservices/wsApp.asmx/loadControlContent', {
			controlName: page
		} ).then( function( rsp ) {
			var pageWrapper = doc.createElement( 'div' ),
				currentPage = main.querySelector( '.page-wrapper.in' );

			pageWrapper.classList.add( 'page-wrapper' );
			pageWrapper.innerHTML = rsp;

			if ( currentPage ) {
				currentPage.classList.remove( 'in' );
				
				setTimeout( function() {
					main.removeChild( currentPage );
					showNewPage( pageWrapper );
				}, 375 );
			}
			else {
				showNewPage( pageWrapper );
			}
		} );
	}

	function showNewPage( pageWrapper ) {
		main.appendChild( pageWrapper );
		setTimeout( function() {
			window.scrollTo( 0, 0 );
			pageWrapper.classList.add( 'in' );
		}, 10 );
	}

	function pop( e ) {
		if ( history.state && history.state.page ) {
			page = history.state.page;
		}
		else {
			page = 'home';
		}

		loadPage( page );
	}

}( document ) );