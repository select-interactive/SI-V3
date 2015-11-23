///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.lazyLoad = ( function( doc ) {
	'use strict';

	var wsUrl = '/webservices/wsApp.asmx/',
		loadContainers;

	function init( context ) {
		if ( !context ) {
			context = doc;
		}

		loadContainers = context.querySelectorAll( '.lazy-load' );

		forEachElement( loadContainers, function( container ) {
			if ( !container.getAttribute( 'data-loaded' ) ) {
				container.setAttribute( 'data-loaded', 'true' );
				loadContent( container );
			}
		} );
	}

	function loadContent( container ) {
		var ws = container.getAttribute( 'data-ws' ),
			url = container.getAttribute( 'data-url' ),
			params = container.getAttribute( 'data-params' ),
			wsData = {};

		if ( ws ) {
			url = wsUrl + url;
		}

		if ( params ) {
			params = params.split( ',' );

			for ( var i = 0, len = params.length; i < len; i++ ) {
				var param = params[i].split( ':' ),
					key = param[0],
					value = param[1];
				wsData[key] = value;
			}
		}

		app.ajax.fetch( url, wsData ).then( function( rsp ) {
			container.innerHTML = rsp;
		} );
	}

	init();

	return {
		init: init
	};

}( document ) );