///<reference path="../main.js">
/**
 * Copyright 2016 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 * @version: 1.0.0
 */
( function( doc ) {
	'use strict';

	let activeToast = null;

	const cssClasses = {
		ACTIVE: 'active',
		TOAST: 'toast'
	};

	class Toast {
		constructor() {
			if ( activeToast ) {
				console.log( 'A toast already exists.' );
				return activeToast;
			}

			this.container = this.createToastElement();
			this.duration = -1;
			this.defaultDuration = 3000;
			this.hideTimeout = null;

			this.show = this.show.bind( this );
			this.hide = this.hide.bind( this );

			activeToast = this;
		}

		createToastElement() {
			let el = doc.createElement( 'div' );
			el.classList.add( cssClasses.TOAST );
			doc.body.appendChild( el );
			return el;
		}

		show( msg, duration ) {
			let me = this;

			if ( this.hideTimeout ) {
				clearTimeout( this.hideTimeout );
				this.hideTimeout = null;
			}

			this.container.innerHTML = msg;

			setTimeout( function() {
				me.container.classList.add( cssClasses.ACTIVE );
			}, 1 );

			this.duration = duration;
			this.hide();
		}

		hide( now ) {
			let me = this,
        		duration = this.defaultDuration;

			if ( now ) {
				this.container.classList.remove( cssClasses.ACTIVE );
				return;
			}

			if ( this.duration === -1 ) {
				return;
			}

			if ( this.duration && this.duration !== -1 ) {
				duration = this.duration;
			}

			this.hideTimeout = setTimeout( function() {
				me.container.classList.remove( cssClasses.ACTIVE );
			}, duration );
		}
	}

	app.Toast = Toast;
}( document ) );