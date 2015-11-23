///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.gmap = ( function( doc ) {
	'use strict';

	var gmapEl, map, status,
		icon = '/img/map-marker.v1.png',

		mapStyles = [{ 'featureType': 'administrative', 'elementType': 'labels.text.fill', 'stylers': [{ 'color': '#444444' }] }, { 'featureType': 'landscape', 'elementType': 'all', 'stylers': [{ 'color': '#f2f2f2' }] }, { 'featureType': 'poi', 'elementType': 'all', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'road', 'elementType': 'all', 'stylers': [{ 'saturation': -100 }, { 'lightness': 45 }] }, { 'featureType': 'road.highway', 'elementType': 'all', 'stylers': [{ 'visibility': 'simplified' }] }, { 'featureType': 'road.arterial', 'elementType': 'labels.icon', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'transit', 'elementType': 'all', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'water', 'elementType': 'all', 'stylers': [{ 'color': '#4f595d' }, { 'visibility': 'on' }] }],

		markers = [],
		mapBounds,

		originalCenter,
		originalZoom,

		loadCallback,
			
		gmapsInitialized = false;

	function init( el, statusEl, fn ) {
		gmapEl = el;
		status = statusEl;
		loadCallback = fn;
		loadGmaps();
	}

	function loadGmaps() {
		var script;
		
		if ( !gmapsInitialized ) {
			script = doc.createElement( 'script' );
			script.async = true;
			script.src = 'https://maps.googleapis.com/maps/api/js?callback=app.gmap.initGmap';
			doc.body.appendChild( script );
			gmapsInitialized = true;
		}
		else {
			initGmap();
		}
	}

	function initGmap() {
		var latLng = gmapEl.getAttribute( 'data-map-center' ).split( ',' );

		originalCenter = {
			lat: parseFloat( latLng[0] ),
			lng: parseFloat( latLng[1] )
		};

		originalZoom = parseInt( gmapEl.getAttribute( 'data-map-zoom' ), 10 );

		google.maps.visualRefresh = true;

		map = new google.maps.Map( gmapEl, {
			center: originalCenter,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROAD,
			scrollwheel: false,
			streetViewControl: true,
			zoom: originalZoom,
			zoomControl: true
		} );

		map.setOptions( { styles: mapStyles } );

		if ( gmapEl.getAttribute( 'data-map-marker' ) ) {
			addMarker( {
				lat: originalCenter.lat,
				lng: originalCenter.lng
			} );
		}

		mapBounds = new google.maps.LatLngBounds();

		if ( loadCallback ) {
			loadCallback();
		}

		gmapEl.init = true;
	}

	function clearMarkers() {
		for ( var i = 0, len = markers.length; i < len; i++ ) {
			markers[i].setMap( null );
		}

		mapBounds = new google.maps.LatLngBounds();
	}

	function addMarker( listing, fn, mapClickFn ) {
		var marker = new google.maps.Marker( {
			icon: icon,
			position: {
				lat: listing.lat,
				lng: listing.lng
			},
			objId: listing.objectId
		} ),

			bounds;

		marker.setMap( map );
		markers.push( marker );

		bounds = new google.maps.LatLng( listing.lat, listing.lng );

		if ( gmapEl.getAttribute( 'data-infowindow' ) ) {
			var content = '<div id="info-window-content"><span class="color-primary text-xlarge">Select Interactive</span><br />3343 Locke Avenue<br />Suite 107<br />Fort Worth, TX 76107</div>';
			var infowindow = new google.maps.InfoWindow( {
				content: content
			} );

			marker.addListener( 'mouseover', function() {
				infowindow.open( map, marker );
			} );

			marker.addListener( 'click', function() {
				infowindow.open( map, marker );
			} );
		}

		if ( mapBounds ) {
			mapBounds.extend( bounds );
		}

		if ( fn ) {
			google.maps.event.addListener( marker, 'mouseover', function() {
				fn( listing.objectId );
			} );
		}

		if ( mapClickFn ) {
			google.maps.event.addListener( map, 'click', function( e ) {
				var latLng = e.latLng;
				marker.setPosition( e.latLng );
				mapClickFn( e );
			} );
		}
	}

	function fitBounds() {
		map.fitBounds( mapBounds );

		if ( map.getZoom() > 14 ) {
			map.setZoom( 14 );
		}
	}

	function setStatus( msg ) {
		status.innerHTML = '<p>' + msg + '</p>';
		status.classList.add( 'in' );
	}

	function clearStatus() {
		if ( status ) {
			status.classList.remove( 'in' );
		}
	}

	function reset() {
		map.setCenter( originalCenter );
		map.setZoom( originalZoom );
	}

	function triggerResize() {
		setTimeout( function() {
			google.maps.event.trigger( map, 'resize' );
			map.setCenter( originalCenter );
		}, 500 );
	}

	function setCenter( lat, lng ) {
		map.setCenter( { lat: lat, lng: lng } );
	}

	function setZoom( zoom ) {
		map.setZoom( zoom );
	}

	if ( doc.querySelector( '#gmap' ) ) {
		init( doc.getElementById( 'gmap' ) );
	}

	return {
		init: init,
		initGmap: initGmap,
		addMarker: addMarker,
		fitBounds: fitBounds,
		clearMarkers: clearMarkers,
		setStatus: setStatus,
		clearStatus: clearStatus,
		resetMap: reset,
		triggerResize: triggerResize,
		setCenter: setCenter,
		setZoom: setZoom
	};

}( document ) );