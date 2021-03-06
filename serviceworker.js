﻿///<reference path="main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
'use strict';

importScripts( '/js/libs/serviceworker-cache-polyfill.js' );

// cache version
var CACHE_VERSION = 'cache-v-4.0';

// Files we want to cache
var urlsToCache = [
	'/bower_components/es6-promise/promise.min.js',
	'/bower_components/fetch/fetch.js',
	'/css/styles.v-4.1.min.css',
	'/js/app/build/main.v-4.0.min.js'
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
		// check if the item is in the cache
		//   and if it is load from the cache
		caches.match( event.request ).then( function( response ) {
			if ( response ) {
				return response;
			}

			// if the item is not in the cache,
			//   we need to clone the request
			var fetchRequest = event.request.clone();

			// attempt to fetch the requested item from the network
			return fetch( fetchRequest ).then( function( response ) {
				if ( !response || response.status !== 200 || response.type !== 'basic' ) {
					return response;
				}

				var rspClone = response.clone();

				// let's check to see if the requested item is an image
				//   and if it is then cache it
				if ( requestUrl.pathname.indexOf( '/img/' ) === 0 ) {
					caches.open( CACHE_VERSION ).then( function( cache ) {
						cache.put( fetchRequest, response ).then( function() {
							console.log( 'Image added to the cache' );
						}, function() {
							console.log( 'Image not added to the cache' );
						} );
					} );
				}

				// cache fonts
				else if ( requestUrl.pathname.indexOf( '/font/' ) === 0 ) {
					caches.open( CACHE_VERSION ).then( function( cache ) {
						cache.put( fetchRequest, response ).then( function() {
							console.log( 'Font added to the cache' );
						}, function() {
							console.log( 'Font not added to the cache' );
						} );
					} );
				}

				// make sure the css file is cached if it wasn't on install
				else if ( requestUrl.pathname.indexOf( '/css/' ) === 0 ) {
					caches.open( CACHE_VERSION ).then( function( cache ) {
						cache.put( fetchRequest, response ).then( function() {
							console.log( 'Stylesheet added to the cache' );
						}, function() {
							console.log( 'Stylesheet not added to the cache' );
						} );
					} );
				}

				// make sure our main js file is cached if it wasn't on install
				else if ( requestUrl.pathname.indexOf( '/js/app/dist/main' ) === 0 ) {
					caches.open( CACHE_VERSION ).then( function( cache ) {
						cache.put( fetchRequest, response ).then( function() {
							console.log( 'Main JS added to the cache' );
						}, function() {
							console.log( 'Main JS not added to the cache' );
						} );
					} );
				}

				return rspClone;
			} ).catch( function() {
				// the requested item wasn't in the cache and was unable to be downloaded from
				//   the network -- likely due to offline
			} );
		} )
	);
} );