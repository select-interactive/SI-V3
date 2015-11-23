/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
'use strict';

importScripts( '/js/libs/serviceworker-cache-polyfill.js' );

// cache version
var CACHE_VERSION = 'cache-v-1';

// Files we want to cache
var urlsToCache = [
	'/bower_components/es6-promise/promise.min.js',
	'/bower_components/fetch/fetch.js',
	'/js/libs/picturefill.min.js'
];

// set the callback for the install step
self.addEventListener( 'install', function( event ) {
	event.waitUntil( caches.open( CACHE_VERSION ).then( function( cache ) {
		return cache.addAll( urlsToCache );
	} ) );
} );

// return requests (fetch events)
self.addEventListener( 'fetch', function( event ) {
	// get the url of the requested item
	var requestUrl = new URL( event.request.url );

	event.respondWith(
		caches.match( event.request ).then( function( response ) {
			// cache hit -- return response
			if ( response ) {
				return response;
			}

			var fetchRequest = event.request.clone();

			return fetch( fetchRequest ).then( function( response ) {
				if ( !response || response.status !== 200 || response.type !== 'basic' ) {
					return response;
				}

				var responseToCache = response.clone();

				if ( requestUrl.pathname.indexOf( '/img/' ) === 0 ) {
					console.log( 'Should cache: ' + requestUrl.pathname );
					//caches.open( CACHE_VERSION ).then( function( cache ) {
					//	cache.put( event.request, responseToCache ).then( function() {
					//		console.log( 'Image added to the cache.' );
					//	} );
					//} );
				}

				return response;
			} );
		} )
	);
} );