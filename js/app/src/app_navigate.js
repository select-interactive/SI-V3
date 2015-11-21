///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	var main = doc.getElementById( 'main' ),
		page, url;

	window.addEventListener( 'popstate', pop, false );

	doc.addEventListener( 'click', function( e ) {
		if ( e && e.target ) {
			checkClickTarget( e.target, e );
		}
	}, false );

	function checkClickTarget( target, e ) {
		var pageToLoad;

		if ( target && target.classList && target.classList.contains( 'navigation' ) ) {
			pageToLoad = target.getAttribute( 'data-control' );
			url = target.getAttribute( 'href' );
			
			if ( page !== pageToLoad ) {
				page = pageToLoad;
				console.log( target, page, url );
				loadPage( page, url );
				history.pushState( { page: page, url: url }, page, url );
			}

			e.preventDefault();
		}
		else if ( target && target.parentNode && target.parentNode !== doc.body ) {
			checkClickTarget( target.parentNode, e );
		}
	}

	function loadPage( page, url ) {
		var currentPage = main.querySelector( '.page-wrapper.in' );

		if ( currentPage ) {
			currentPage.classList.remove( 'in' );
		}

		app.ajax.fetch( '/webservices/wsApp.asmx/loadControlContent', {
			controlName: page,
			url: url
		} ).then( function( rsp ) {
			var pageWrapper = doc.createElement( 'div' );

			pageWrapper.classList.add( 'page-wrapper' );
			pageWrapper.innerHTML = rsp;

			if ( currentPage ) {
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

			if ( pageWrapper.querySelector( '.gmap' ) ) {
				app.gmap.init( doc.querySelector( '.gmap' ) );
			}
		}, 10 );
	}

	function pop( e ) {
		if ( history.state && history.state.page ) {
			page = history.state.page;
			url = history.state.url;
		}
		else {
			page = 'home';
			url = page;
		}

		if ( main && page && url ) {
			loadPage( page, url );
		}
	}

}( document ) );