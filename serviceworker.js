///<reference path="main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
'use strict';

importScripts( '/js/libs/serviceworker-cache-polyfill.js' );

// cache version
var CACHE_VERSION = 'cache-v1';

// Files we want to cache
var urlsToCache = [
	'/'
];

// set the callback for the install step
self.addEventListener( 'install', function( event ) {
	event.waitUntil( caches.open( CACHE_VERSION ).then( function( cache ) {
		return cache.addAll( urlsToCache );
	} ) );
} );

// return requests (fetch events)
self.addEventListener( 'fetch', function( event ) {
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

				caches.open( CACHE_VERSION ).then( function( cache ) {
					cache.put( event.request, responseToCache );
				} );

				return response;
			} );
		} )
	);
} );