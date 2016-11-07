///<reference path="../main.js">
/**
 * Copyright 2016 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	const cssClasses = {
		ANIMATABLE: 'animatable',
		NAV_IN: 'side-nav-in'
	};

	class SideNav {
		constructor() {
			this.btnShow = app.$( '.hdr-nav-trigger' );
			this.sideNav = app.$( '.side-nav' );
			this.sideNavContainer = app.$( '.side-nav-container' );
			this.sideNavClose = app.$( '.side-nav-close' );

			this.showSideNav = this.showSideNav.bind( this );
			this.hideSideNav = this.hideSideNav.bind( this );
			this.onTouchStart = this.onTouchStart.bind( this );
			this.onTouchMove = this.onTouchMove.bind( this );
			this.onTouchEnd = this.onTouchEnd.bind( this );
			this.onTransitionEnd = this.onTransitionEnd.bind( this );
			this.update = this.update.bind( this );

			this.startX = 0;
			this.currentX = 0;
			this.touchingSideNav = false;

			this.addEventListeners();
		}

		addEventListeners() {
			this.btnShow.addEventListener( 'click', this.showSideNav );
			this.sideNav.addEventListener( 'click', this.hideSideNav );
			this.sideNavContainer.addEventListener( 'click', this.blockClicks );
			this.sideNavClose.addEventListener( 'click', this.hideSideNav );
			this.sideNav.addEventListener( 'touchstart', this.onTouchStart );

			this.sideNav.addEventListener( 'touchmove', this.onTouchMove );
			this.sideNav.addEventListener( 'touchend', this.onTouchEnd );
		}

		showSideNav( e ) {
			this.sideNav.classList.add( cssClasses.ANIMATABLE );
			doc.body.classList.add( cssClasses.NAV_IN );
			this.sideNav.addEventListener( 'transitionend', this.onTransitionEnd );
			e.preventDefault();
		}

		hideSideNav( e ) {
			this.sideNav.classList.add( 'animatable' );
			doc.body.classList.remove( cssClasses.NAV_IN );
			this.sideNav.addEventListener( 'transitionend', this.onTransitionEnd );

			if ( e ) {
				e.preventDefault();
			}
		}

		blockClicks( e ) {
			e.stopPropagation();
		}

		onTouchStart( e ) {
			if ( !doc.body.classList.contains( cssClasses.NAV_IN ) ) {
				return;
			}

			this.startX = e.touches[0].pageX;
			this.currentX = this.startX;

			this.touchingSideNav = true;
			requestAnimationFrame( this.update );
		}

		onTouchMove( e ) {
			if ( !this.touchingSideNav ) {
				return;
			}

			this.currentX = e.touches[0].pageX;
			const translateX = Math.min( 0, this.currentX - this.startX );

			if ( translateX < 0 ) {
				e.preventDefault();
			}
		}

		onTouchEnd( e ) {
			if ( !this.touchingSideNav ) {
				return;
			}

			this.touchingSideNav = false;

			const translateX = Math.min( 0, this.currentX - this.startX );
			this.sideNavContainer.style.transform = '';

			if ( translateX < 0 ) {
				this.hideSideNav();
			}
		}

		update() {
			if ( !this.touchingSideNav ) {
				return;
			}

			requestAnimationFrame( this.update );

			const translateX = Math.min( 0, this.currentX - this.startX );
			this.sideNavContainer.style.transform = 'translateX(' + translateX + 'px)';
		}

		onTransitionEnd( e ) {
			this.sideNav.classList.remove( cssClasses.ANIMATABLE );
			this.sideNav.removeEventListener( 'transitionend', this.onTransitionEnd );
		}
	}

	if ( app.$( '.side-nav' ) ) {
		new SideNav();
	}

}( document ) );