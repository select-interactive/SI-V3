///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.scroll = ( function( doc ) {
	'use strict';

	var hdr = doc.getElementById( 'hdr-main' ),
		container = doc.querySelector( '.container-main-content' ),
		links = doc.querySelectorAll( '.link-scroll' ),
		lastY = 0,

		SCROLL_TIME = 500;

	window.forEachElement( links, function( link ) {
		link.addEventListener( 'click', linkClick, false );
	} );

	function linkClick( e ) {
		var href = this.getAttribute( 'href' ),
			id = href.replace( /\//g, '' ),
			target = doc.querySelector( '#' + id );
		
		if ( target ) {
			lastY = container.scrollTop;
			scrollToY( target.offsetTop );
			e.preventDefault();
		}
	}

	function scrollToY( scrollTargetY ) {
		var scrollY = container.scrollTop,
			speed = SCROLL_TIME,
			easing = easing || 'easeOutSine',
			currentTime = 0,

			time = Math.max( 0.1, Math.min( Math.abs( scrollY - scrollTargetY ) / speed, 0.8 ) ),

			PI_D2 = Math.PI / 2,
			easingEquations = {
				easeOutSine: function( pos ) {
					return Math.sin( pos * ( Math.PI / 2 ) );
				},
				easeInOutSine: function( pos ) {
					return ( -0.5 * ( Math.cos( Math.PI * pos ) - 1 ) );
				},
				easeInOutQuint: function( pos ) {
					if ( ( pos /= 0.5 ) < 1 ) {
						return 0.5 * Math.pow( pos, 5 );
					}
					return 0.5 * ( Math.pow(( pos - 2 ), 5 ) + 2 );
				}
			};

		function tick() {
			currentTime += 1 / 60;

			var p = currentTime / time;
			var t = easingEquations[easing]( p );

			if ( p < 1 ) {
				requestAnimationFrame( tick );

				container.scrollTop = scrollY + ( ( scrollTargetY - scrollY ) * t );
			} else {
				container.scrollTop = scrollTargetY;
			}
		}

		tick();
	}

	return {
		scrollToY: scrollToY
	};

}( document ) );