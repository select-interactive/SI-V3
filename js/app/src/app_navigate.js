///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	var main = doc.getElementById( 'main' ),
		pagePopped = false,
		page, url, classes;

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
			classes = target.getAttribute( 'data-nav-class' );
			
			if ( page !== pageToLoad || url !== target.getAttribute( 'href' ) ) {
				url = target.getAttribute( 'href' );
				page = pageToLoad;
				loadPage( page, url, true );
				history.pushState( { page: page, url: url }, page, url );
			}

			e.preventDefault();
		}
		else if ( target && target.parentNode && target.parentNode !== doc.body ) {
			checkClickTarget( target.parentNode, e );
		}
	}

	function loadPage( page, url, logView ) {
		var currentPage = main.querySelector( '.page-wrapper.in' );

		app.nav.hide();

		if ( currentPage ) {
			currentPage.classList.remove( 'in' );
		}

		app.ajax.fetch( '/webservices/wsApp.asmx/loadControlContent', {
			controlName: page,
			url: url
		} ).then( function( rsp ) {
			var pageWrapper = doc.createElement( 'div' );
			rsp = JSON.parse( rsp );

			pageWrapper.classList.add( 'page-wrapper' );
			pageWrapper.innerHTML = rsp.html;
			doc.title = rsp.title;

			if ( logView ) {
				app.analytics.logPageView( rsp.title );
			}

			if ( currentPage ) {
				setTimeout( function() {
					if ( classes ) {
						doc.body.className = 'nocomponents ' + classes;
					}
					else {
						doc.body.className = 'nocomponents';
					}

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
			pageWrapper.classList.add( 'in' );
			window.scrollTo( 0, 0 );

			// check for containers to lazy load
			app.lazyLoad.init( pageWrapper );

			// init any gmaps on the page
			if ( pageWrapper.querySelector( '.gmap' ) ) {
				app.gmap.init( doc.querySelector( '.gmap' ) );
			}

			// init any menus added to the page
			app.menu.initMenus( pageWrapper, true );
		}, 10 );
	}

	function pop( e ) {
		if ( pagePopped ) {
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
		else {
			pagePopped = true;
		}
	}

}( document ) );