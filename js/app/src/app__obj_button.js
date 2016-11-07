///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	var MaterialButton = function MaterialButton( element ) {
		this.element_ = element;
		this.init();
	};

	window.MaterialButton = MaterialButton;

	// Definte css classes
	MaterialButton.prototype.cssClasses_ = {
		RIPPLE_BUTTON: 'btn-ripple',
		RIPPLE_CONTAINER: 'btn-ripple-container',
		RIPPLE: 'btn-ripple-element',
		RIPPLE_CENTER: 'btn-ripple-center',
		RIPPLE_IS_ANIMATING: 'is-animating',
		RIPPLE_IS_VISIBLE: 'is-visible'
	};

	MaterialButton.prototype.RippleConstant = {
		INITIAL_SCALE: 'scale(0.0001, 0.0001)',
		INITIAL_SIZE: '1px',
		INITIAL_OPACITY: '0.4',
		FINAL_OPACITY: '0',
		FINAL_SCALE: ''
	};

	// initialize the element
	MaterialButton.prototype.init = function() {
		if ( this.element_ ) {
			
			// if this button needs the ripple effect
			//   add the necessary ripple elements and events
			if ( this.element_.classList.contains( this.cssClasses_.RIPPLE_BUTTON ) ) {
				this.initRipple();
			}
		}
	};

	MaterialButton.prototype.initRipple = function() {
		var recentering;

		// first add the elements
		this.addRippleElements();

		// set defaults and add event handlers
		recentering = this.element_.classList.contains( this.cssClasses_.RIPPLE_CENTER );
		this.frameCount_ = 0;
		this.rippleSize_ = 0;
		this.x_ = 0;
		this.y_ = 0;

		// Touch start produces a compat mouse down event, which would cause a
		// second ripple. To avoid that, we use this property to ignore the first
		// mouse down after a touch start.
		this.ignoringMouseDown_ = false;

		this.boundDownHandler = this.downHandler_.bind( this );
		this.element_.addEventListener( 'mousedown', this.boundDownHandler, false );
		this.element_.addEventListener( 'touchstart', this.boundDownHandler, false );

		this.boundUpHandler = this.upHandler_.bind( this );
		this.element_.addEventListener( 'mouseup', this.boundUpHandler, false );
		this.element_.addEventListener( 'mouseleave', this.boundUpHandler, false );
		this.element_.addEventListener( 'touchend', this.boundUpHandler, false );
		this.element_.addEventListener( 'blur', this.boundUpHandler, false );

		// helpers
		this.getFrameCount = function() {
			return this.frameCount_;
		};

		this.setFrameCount = function( fC ) {
			this.frameCount_ = fC;
		};

		this.getRippleElement = function() {
			return this.rippleElement_;
		};

		this.setRippleXY = function( newX, newY ) {
			this.x_ = newX;
			this.y_ = newY;
		};

		// styles
		this.setRippleStyles = function( start ) {
			if ( this.rippleElement_ !== null ) {
				var transformString, scale, size,
					offset = 'translate(' + this.x_ + 'px, ' + this.y_ + 'px)';

				if ( start ) {
					scale = this.RippleConstant.INITIAL_SCALE;
					size = this.RippleConstant.INITIAL_SIZE;
				}
				else {
					scale = this.RippleConstant.FINAL_SCALE;
					size = this.rippleSize_ + 'px';

					if ( recentering ) {
						offset = 'translate(' + this.boundWidth / 2 + 'px, ' + this.boundHeight / 2 + 'px)';
					}
				}

				transformString = 'translate(-50%, -50%) ' + offset + scale;

				this.rippleElement_.style.webkitTransform = transformString;
				this.rippleElement_.style.msTransform = transformString;
				this.rippleElement_.style.transform = transformString;

				if ( start ) {
					this.rippleElement_.classList.remove( this.cssClasses_.RIPPLE_IS_ANIMATING );
				}
				else {
					this.rippleElement_.classList.add( this.cssClasses_.RIPPLE_IS_ANIMATING );
				}
			}
		};

		// RAF
		this.animFrameHandler = function() {
			if ( this.frameCount_-- > 0 ) {
				requestAnimationFrame( this.animFrameHandler.bind( this ) );
			}
			else {
				this.setRippleStyles( false );
			}
		};
	};

	MaterialButton.prototype.addRippleElements = function() {
		var container = doc.createElement( 'span' );
		container.classList.add( this.cssClasses_.RIPPLE_CONTAINER );

		this.rippleElement_ = doc.createElement( 'span' );
		this.rippleElement_.classList.add( this.cssClasses_.RIPPLE );

		container.appendChild( this.rippleElement_ );

		this.boundRippleBlurHandler = this.blurHandler_.bind( this );
		this.rippleElement_.addEventListener( 'mouseup', this.boundRippleBlurHandler );
		this.element_.appendChild( container );
	};

	// blur event handler
	MaterialButton.prototype.blurHandler_ = function( e ) {
		if ( e ) {
			this.element_.blur();
		}
	};

	// disable the button
	MaterialButton.prototype.disable = function() {
		this.element_.disabled = true;
	};

	// button downHandler
	MaterialButton.prototype.downHandler_ = function( e ) {
		var bound, x, y, clientX, clientY;

		if ( !this.rippleElement_.style.width && !this.rippleElement_.style.height ) {
			var rect = this.element_.getBoundingClientRect();
			this.boundHeight = rect.height;
			this.boundWidth = rect.width;
			this.rippleSize_ = Math.sqrt( rect.width * rect.width + rect.height * rect.height ) * 2 + 2;
			this.rippleElement_.style.width = this.rippleSize_ + 'px';
			this.rippleElement_.style.height = this.rippleSize_ + 'px';
		}

		this.rippleElement_.classList.add( this.cssClasses_.RIPPLE_IS_VISIBLE );

		if ( e.type === 'mousedown' && this.ignoringMouseDown_ ) {
			this.ignoringMouseDown_ = false;
		}
		else {
			if ( e.type === 'touchstart' ) {
				this.ignoringMouseDown_ = true;
			}

			var frameCount = this.getFrameCount();
			if ( frameCount > 0 ) {
				return;
			}

			this.setFrameCount( 1 );

			bound = e.currentTarget.getBoundingClientRect();

			// Check if we are handling a keyboard click.
			if ( e.clientX === 0 && e.clientY === 0 ) {
				x = Math.round( bound.width / 2 );
				y = Math.round( bound.height / 2 );
			} else {
				clientX = e.clientX ? e.clientX : e.touches[0].clientX;
				clientY = e.clientY ? e.clientY : e.touches[0].clientY;
				x = Math.round( clientX - bound.left );
				y = Math.round( clientY - bound.top );
			}

			this.setRippleXY( x, y );
			this.setRippleStyles( true );

			window.requestAnimationFrame( this.animFrameHandler.bind( this ) );
		}
	};

	// button upHandler
	MaterialButton.prototype.upHandler_ = function( e ) {
		// Don't fire for the artificial "mouseup" generated by a double-click.
		if ( e && e.detail !== 2 ) {
			this.rippleElement_.classList.remove( this.cssClasses_.RIPPLE_IS_VISIBLE );
		}

		// Allow a repaint to occur before removing this class, so the animation
		// shows for tap events, which seem to trigger a mouseup too soon after mousedown.
		window.setTimeout( function() {
			this.rippleElement_.classList.remove( this.cssClasses_.RIPPLE_IS_VISIBLE );
		}.bind( this ), 0 );
	};

	// enable the button
	MaterialButton.prototype.enable = function() {
		this.element_.disabled = false;
	};

	app.$.forEach( '.btn-ripple', function( btn ) {
		btn.MaterialButton = new MaterialButton( btn );
	} );
}( document ) );