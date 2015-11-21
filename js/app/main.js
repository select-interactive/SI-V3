/**	
 * SI JavaScript library
 *
 * @author Jeremy Burton - jeremy@select-interactive.com
 * @version 0.0.6
 *
 * @description To provide crossbrowser support for Select Interactive
 *   projects without relying on jQuery.
 *   
 * Targeting features such as:
 *   classList
 *   forEach
 *   placeholder
 *   .matchMedia support
 *   equal height columns
 */
(function( window, doc, undefined ) {

    var 
        button = doc.createElement( 'button' ),
        div = doc.createElement( 'div' ),
        input = doc.createElement( 'input' );
    

    /**
     * ------------------------------------------------------------------
     * classList Polyfill -- Required for I9E
     * ------------------------------------------------------------------
     */
    if ( ! ( 'classList' in div ) ) {
        /* jshint ignore:start */
        var prototype=Array.prototype,push=prototype.push,splice=prototype.splice,join=prototype.join;function DOMTokenList(a){this.el=a;a=a.className.replace(/^\s+|\s+$/g,"").split(/\s+/);for(var b=0;b<a.length;b++)push.call(this,a[b])} DOMTokenList.prototype={add:function(a){this.contains(a)||(push.call(this,a),this.el.className=this.toString())},contains:function(a){return-1!=this.el.className.indexOf(a)},item:function(a){return this[a]||null},remove:function(a){if(this.contains(a)){for(var b=0;b<this.length&&this[b]!=a;b++);splice.call(this,b,1);this.el.className=this.toString()}},toString:function(){return join.call(this," ")},toggle:function(a){this.contains(a)?this.remove(a):this.add(a);return this.contains(a)}}; window.DOMTokenList=DOMTokenList;function defineElementGetter(a,b,c){Object.defineProperty?Object.defineProperty(a,b,{get:c}):a.__defineGetter__(b,c)}defineElementGetter(Element.prototype,"classList",function(){return new DOMTokenList(this)});
        /* jshint ignore:end */
    }


    /**
     * -----------------------------------
     * forEachElement using querySelectAll
     * -----------------------------------
     */
    window.forEachElement = function( elements, fn, context ) {
        var i = 0,
            len;

        if ( !elements || typeof elements === 'function' ) {
        	console.log( 'elements is not a valid node list.' );
        	return;
        }

        if ( typeof elements === 'string' || elements instanceof String ) {
        	if ( context ) {
        		elements = context.querySelectorAll( elements );
        	}
        	else {
        		elements = doc.querySelectorAll( elements );
        	}
		}

		len = elements.length;

        for ( ; i < len; i++ ) {
            if ( fn( elements[i], i ) ) {
                break;
            }
        }
    };

    window.$$ = function( query, evt, fn, context ) {
    	var elements;

    	if ( typeof query === 'string' || query instanceof String ) {
    		if ( context ) {
    			elements = context.querySelectorAll( query );
    		}
    		else {
    			elements = doc.querySelectorAll( query );
    		}
    	}
    	else {
    		console.log( 'unable to select ' + query );
    	}

    	window.forEachElement( elements, function( el ) {
    		el.addEventListener( evt, fn, false );
    	} );
    };

    /**
     * --------------------
     * Placeholder Polyfill
     * --------------------
     */
     if  ( ! ( 'placeholder' in input ) ) {
        window.forEachElement( doc.querySelectorAll( '[placeholder]' ), function( el ) {
            var ph = el.getAttribute( 'placeholder' );

            el.value = ph;

            el.addEventListener( 'focus', function() {
                if ( window.trimString( el.value ) === ph ) {
                    el.value = '';
                }
            }, false );

            el.addEventListener( 'blur', function() {
                if ( window.trimString( el.value ) === '' ) {
                    el.value = ph;
                }
            }, false );
        });
     }


    /**
     * -----------------------------------------------------------------------------
     * Match media function
     *
     * If browsers don't support .matchMedia or CSS Animations (IE9-) we return true
     * Otherwise we return if the passed mediaQuery matches
     * -----------------------------------------------------------------------------
     */
    window.mq = function( mediaQuery ) {
        return !( window.matchMedia ) || ( window.matchMedia && window.matchMedia( mediaQuery ).matches );
    };


    /**
     * --------------------------------------------------------------
     * Useful function for setting floated columns to the same height
     * --------------------------------------------------------------
     */
    if ( doc.querySelectorAll( '.eq-height' ) ) {
        var rows = doc.querySelectorAll( '.eq-height' );
        
        // Loop through each row that .eq-height
        window.forEachElement( rows, function( row ) {
            var 
                // get each col
                cols = row.querySelectorAll( '.eq-height-item' ),

                // get all images
                imgs = row.querySelectorAll( 'img' ),
                imgsLoaded = 0,
                
                checkImgsLoaded = function() {
                    imgsLoaded++;
                    
                    if ( imgs.length === imgsLoaded ) {
                        setHeights();
                    }
                },
                
                setHeights = function() {
                    var h = 0;
                    
                    window.forEachElement( cols, function( col ) {
                        var colH = col.offsetHeight;

                        if ( colH > h ) {
                            h = colH;
                        }
                    });        
                    
                    window.forEachElement( cols, function( col ) {
                        col.style.height = h + 'px';
                    });
                };

            window.forEachElement( cols, function( col ) {
                col.style.height = 'auto';
            });

            // if we have imgs, wait for them to load or check if they're cached
            if ( imgs.length ) {
                window.forEachElement( imgs, function( img ) {
                    if ( img.complete ) {
                        checkImgsLoaded();
                    }
                    else {
                        img.onload = checkImgsLoaded;
                    }
                });
            }

            // if no images, just set the heights of the columns
            else {
                setHeights();
            }

        });
    }

    /**
     * ---------------------------------------------------
     * Helper method to set vendor prefixes for CSS3 items
     * ---------------------------------------------------
     */
    window.addVendorPrefixes = function( element, property, value ) {
        var capsProp = property.substring( 0, 1 ).toString().toUpperCase() + property.substring( 1 );

        element.style['moz' + capsProp] = value;
        element.style['ms' + capsProp] = value;
        element.style['o' + capsProp] = value;
        element.style['webkit' + capsProp] = value;
        element.style[property] = value;
    };


    /**
     * ------------------------------------------------------
     * Helper to check if tab is visible using visibility API
     * ------------------------------------------------------
     */
    window.getHiddenProp = function() {
        var prefixes = ['webkit','moz','ms','o'];
    
        // if 'hidden' is natively supported just return it
        if ( 'hidden' in document ) {
            return 'hidden';
        }
    
        // otherwise loop over all the known prefixes until we find one
        for ( var i = 0; i < prefixes.length; i++ ){
            if ( ( prefixes[i] + 'Hidden' ) in document ) {
                return prefixes[i] + 'Hidden';
            }
        }

        // otherwise it's not supported
        return null;
    };

    window.isTabHidden = function() {
        var prop = window.getHiddenProp();

        if ( ! prop ) {
            return false;
        }
    
        return document[prop];
    };
     
}( window, window.document, undefined ) );


// Avoid 'console' errors in browsers that lack a console
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
/* jshint ignore:start */
; ( function() {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick( layer, options ) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if ( FastClick.notNeeded( layer ) ) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind( method, context ) {
			return function() { return method.apply( context, arguments ); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for ( var i = 0, l = methods.length; i < l; i++ ) {
			context[methods[i]] = bind( context[methods[i]], context );
		}

		// Set up event handlers as required
		if ( deviceIsAndroid ) {
			layer.addEventListener( 'mouseover', this.onMouse, true );
			layer.addEventListener( 'mousedown', this.onMouse, true );
			layer.addEventListener( 'mouseup', this.onMouse, true );
		}

		layer.addEventListener( 'click', this.onClick, true );
		layer.addEventListener( 'touchstart', this.onTouchStart, false );
		layer.addEventListener( 'touchmove', this.onTouchMove, false );
		layer.addEventListener( 'touchend', this.onTouchEnd, false );
		layer.addEventListener( 'touchcancel', this.onTouchCancel, false );

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if ( !Event.prototype.stopImmediatePropagation ) {
			layer.removeEventListener = function( type, callback, capture ) {
				var rmv = Node.prototype.removeEventListener;
				if ( type === 'click' ) {
					rmv.call( layer, type, callback.hijacked || callback, capture );
				} else {
					rmv.call( layer, type, callback, capture );
				}
			};

			layer.addEventListener = function( type, callback, capture ) {
				var adv = Node.prototype.addEventListener;
				if ( type === 'click' ) {
					adv.call( layer, type, callback.hijacked || ( callback.hijacked = function( event ) {
						if ( !event.propagationStopped ) {
							callback( event );
						}
					} ), capture );
				} else {
					adv.call( layer, type, callback, capture );
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if ( typeof layer.onclick === 'function' ) {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener( 'click', function( event ) {
				oldOnClick( event );
			}, false );
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf( "Windows Phone" ) >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf( 'Android' ) > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test( navigator.userAgent ) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && ( /OS 4_\d(_\d)?/ ).test( navigator.userAgent );


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && ( /OS [6-7]_\d/ ).test( navigator.userAgent );

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf( 'BB10' ) > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function( target ) {
		switch ( target.nodeName.toLowerCase() ) {

			// Don't send a synthetic click to disabled inputs (issue #62)
			case 'button':
			case 'select':
			case 'textarea':
				if ( target.disabled ) {
					return true;
				}

				break;
			case 'input':

				// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
				if ( ( deviceIsIOS && target.type === 'file' ) || target.disabled ) {
					return true;
				}

				break;
			case 'label':
			case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
			case 'video':
				return true;
		}

		return ( /\bneedsclick\b/ ).test( target.className );
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function( target ) {
		switch ( target.nodeName.toLowerCase() ) {
			case 'textarea':
				return true;
			case 'select':
				return !deviceIsAndroid;
			case 'input':
				switch ( target.type ) {
					case 'button':
					case 'checkbox':
					case 'file':
					case 'image':
					case 'radio':
					case 'submit':
						return false;
				}

				// No point in attempting to focus disabled inputs
				return !target.disabled && !target.readOnly;
			default:
				return ( /\bneedsfocus\b/ ).test( target.className );
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function( targetElement, event ) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if ( document.activeElement && document.activeElement !== targetElement ) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent( 'MouseEvents' );
		clickEvent.initMouseEvent( this.determineEventType( targetElement ), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null );
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent( clickEvent );
	};

	FastClick.prototype.determineEventType = function( targetElement ) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if ( deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select' ) {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function( targetElement ) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if ( deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf( 'date' ) !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month' ) {
			length = targetElement.value.length;
			targetElement.setSelectionRange( length, length );
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function( targetElement ) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if ( !scrollParent || !scrollParent.contains( targetElement ) ) {
			parentElement = targetElement;
			do {
				if ( parentElement.scrollHeight > parentElement.offsetHeight ) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while ( parentElement );
		}

		// Always update the scroll top tracker if possible.
		if ( scrollParent ) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function( eventTarget ) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if ( eventTarget.nodeType === Node.TEXT_NODE ) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function( event ) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if ( event.targetTouches.length > 1 ) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget( event.target );
		touch = event.targetTouches[0];

		if ( deviceIsIOS ) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if ( selection.rangeCount && !selection.isCollapsed ) {
				return true;
			}

			if ( !deviceIsIOS4 ) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if ( touch.identifier && touch.identifier === this.lastTouchIdentifier ) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent( targetElement );
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ( ( event.timeStamp - this.lastClickTime ) < this.tapDelay ) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function( event ) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if ( Math.abs( touch.pageX - this.touchStartX ) > boundary || Math.abs( touch.pageY - this.touchStartY ) > boundary ) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function( event ) {
		if ( !this.trackingClick ) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if ( this.targetElement !== this.getTargetElementFromEventTarget( event.target ) || this.touchHasMoved( event ) ) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function( labelElement ) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if ( labelElement.control !== undefined ) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if ( labelElement.htmlFor ) {
			return document.getElementById( labelElement.htmlFor );
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector( 'button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea' );
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function( event ) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if ( !this.trackingClick ) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ( ( event.timeStamp - this.lastClickTime ) < this.tapDelay ) {
			this.cancelNextClick = true;
			return true;
		}

		if ( ( event.timeStamp - this.trackingClickStart ) > this.tapTimeout ) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if ( deviceIsIOSWithBadTarget ) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint( touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset ) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if ( targetTagName === 'label' ) {
			forElement = this.findControl( targetElement );
			if ( forElement ) {
				this.focus( targetElement );
				if ( deviceIsAndroid ) {
					return false;
				}

				targetElement = forElement;
			}
		} else if ( this.needsFocus( targetElement ) ) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ( ( event.timeStamp - trackingClickStart ) > 100 || ( deviceIsIOS && window.top !== window && targetTagName === 'input' ) ) {
				this.targetElement = null;
				return false;
			}

			this.focus( targetElement );
			this.sendClick( targetElement, event );

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if ( !deviceIsIOS || targetTagName !== 'select' ) {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if ( deviceIsIOS && !deviceIsIOS4 ) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if ( scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop ) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if ( !this.needsClick( targetElement ) ) {
			event.preventDefault();
			this.sendClick( targetElement, event );
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function( event ) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if ( !this.targetElement ) {
			return true;
		}

		if ( event.forwardedTouchEvent ) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if ( !event.cancelable ) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if ( !this.needsClick( this.targetElement ) || this.cancelNextClick ) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if ( event.stopImmediatePropagation ) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function( event ) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if ( this.trackingClick ) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if ( event.target.type === 'submit' && event.detail === 0 ) {
			return true;
		}

		permitted = this.onMouse( event );

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if ( !permitted ) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if ( deviceIsAndroid ) {
			layer.removeEventListener( 'mouseover', this.onMouse, true );
			layer.removeEventListener( 'mousedown', this.onMouse, true );
			layer.removeEventListener( 'mouseup', this.onMouse, true );
		}

		layer.removeEventListener( 'click', this.onClick, true );
		layer.removeEventListener( 'touchstart', this.onTouchStart, false );
		layer.removeEventListener( 'touchmove', this.onTouchMove, false );
		layer.removeEventListener( 'touchend', this.onTouchEnd, false );
		layer.removeEventListener( 'touchcancel', this.onTouchCancel, false );
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function( layer ) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if ( typeof window.ontouchstart === 'undefined' ) {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +( /Chrome\/([0-9]+)/.exec( navigator.userAgent ) || [, 0] )[1];

		if ( chromeVersion ) {

			if ( deviceIsAndroid ) {
				metaViewport = document.querySelector( 'meta[name=viewport]' );

				if ( metaViewport ) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if ( metaViewport.content.indexOf( 'user-scalable=no' ) !== -1 ) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if ( chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth ) {
						return true;
					}
				}

				// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if ( deviceIsBlackBerry10 ) {
			blackberryVersion = navigator.userAgent.match( /Version\/([0-9]*)\.([0-9]*)/ );

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if ( blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3 ) {
				metaViewport = document.querySelector( 'meta[name=viewport]' );

				if ( metaViewport ) {
					// user-scalable=no eliminates click delay.
					if ( metaViewport.content.indexOf( 'user-scalable=no' ) !== -1 ) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if ( document.documentElement.scrollWidth <= window.outerWidth ) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if ( layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation' ) {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +( /Firefox\/([0-9]+)/.exec( navigator.userAgent ) || [, 0] )[1];

		if ( firefoxVersion >= 27 ) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector( 'meta[name=viewport]' );
			if ( metaViewport && ( metaViewport.content.indexOf( 'user-scalable=no' ) !== -1 || document.documentElement.scrollWidth <= window.outerWidth ) ) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if ( layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation' ) {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function( layer, options ) {
		return new FastClick( layer, options );
	};


	if ( typeof define === 'function' && typeof define.amd === 'object' && define.amd ) {

		// AMD. Register as an anonymous module.
		define( function() {
			return FastClick;
		} );
	} else if ( typeof module !== 'undefined' && module.exports ) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
}() );
/* jshint ignore:end */
//! moment.js
//! version : 2.10.3
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
/* jshint ignore:start */
( function( global, factory ) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define( factory ) :
    global.moment = factory()
}( this, function() {
	'use strict';

	var hookCallback;

	function utils_hooks__hooks() {
		return hookCallback.apply( null, arguments );
	}

	// This is done to register the method called with moment()
	// without creating circular dependencies.
	function setHookCallback( callback ) {
		hookCallback = callback;
	}

	function isArray( input ) {
		return Object.prototype.toString.call( input ) === '[object Array]';
	}

	function isDate( input ) {
		return input instanceof Date || Object.prototype.toString.call( input ) === '[object Date]';
	}

	function map( arr, fn ) {
		var res = [], i;
		for ( i = 0; i < arr.length; ++i ) {
			res.push( fn( arr[i], i ) );
		}
		return res;
	}

	function hasOwnProp( a, b ) {
		return Object.prototype.hasOwnProperty.call( a, b );
	}

	function extend( a, b ) {
		for ( var i in b ) {
			if ( hasOwnProp( b, i ) ) {
				a[i] = b[i];
			}
		}

		if ( hasOwnProp( b, 'toString' ) ) {
			a.toString = b.toString;
		}

		if ( hasOwnProp( b, 'valueOf' ) ) {
			a.valueOf = b.valueOf;
		}

		return a;
	}

	function create_utc__createUTC( input, format, locale, strict ) {
		return createLocalOrUTC( input, format, locale, strict, true ).utc();
	}

	function defaultParsingFlags() {
		// We need to deep clone this object.
		return {
			empty: false,
			unusedTokens: [],
			unusedInput: [],
			overflow: -2,
			charsLeftOver: 0,
			nullInput: false,
			invalidMonth: null,
			invalidFormat: false,
			userInvalidated: false,
			iso: false
		};
	}

	function getParsingFlags( m ) {
		if ( m._pf == null ) {
			m._pf = defaultParsingFlags();
		}
		return m._pf;
	}

	function valid__isValid( m ) {
		if ( m._isValid == null ) {
			var flags = getParsingFlags( m );
			m._isValid = !isNaN( m._d.getTime() ) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

			if ( m._strict ) {
				m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
			}
		}
		return m._isValid;
	}

	function valid__createInvalid( flags ) {
		var m = create_utc__createUTC( NaN );
		if ( flags != null ) {
			extend( getParsingFlags( m ), flags );
		}
		else {
			getParsingFlags( m ).userInvalidated = true;
		}

		return m;
	}

	var momentProperties = utils_hooks__hooks.momentProperties = [];

	function copyConfig( to, from ) {
		var i, prop, val;

		if ( typeof from._isAMomentObject !== 'undefined' ) {
			to._isAMomentObject = from._isAMomentObject;
		}
		if ( typeof from._i !== 'undefined' ) {
			to._i = from._i;
		}
		if ( typeof from._f !== 'undefined' ) {
			to._f = from._f;
		}
		if ( typeof from._l !== 'undefined' ) {
			to._l = from._l;
		}
		if ( typeof from._strict !== 'undefined' ) {
			to._strict = from._strict;
		}
		if ( typeof from._tzm !== 'undefined' ) {
			to._tzm = from._tzm;
		}
		if ( typeof from._isUTC !== 'undefined' ) {
			to._isUTC = from._isUTC;
		}
		if ( typeof from._offset !== 'undefined' ) {
			to._offset = from._offset;
		}
		if ( typeof from._pf !== 'undefined' ) {
			to._pf = getParsingFlags( from );
		}
		if ( typeof from._locale !== 'undefined' ) {
			to._locale = from._locale;
		}

		if ( momentProperties.length > 0 ) {
			for ( i in momentProperties ) {
				prop = momentProperties[i];
				val = from[prop];
				if ( typeof val !== 'undefined' ) {
					to[prop] = val;
				}
			}
		}

		return to;
	}

	var updateInProgress = false;

	// Moment prototype object
	function Moment( config ) {
		copyConfig( this, config );
		this._d = new Date( +config._d );
		// Prevent infinite loop in case updateOffset creates new moment
		// objects.
		if ( updateInProgress === false ) {
			updateInProgress = true;
			utils_hooks__hooks.updateOffset( this );
			updateInProgress = false;
		}
	}

	function isMoment( obj ) {
		return obj instanceof Moment || ( obj != null && obj._isAMomentObject != null );
	}

	function toInt( argumentForCoercion ) {
		var coercedNumber = +argumentForCoercion,
            value = 0;

		if ( coercedNumber !== 0 && isFinite( coercedNumber ) ) {
			if ( coercedNumber >= 0 ) {
				value = Math.floor( coercedNumber );
			} else {
				value = Math.ceil( coercedNumber );
			}
		}

		return value;
	}

	function compareArrays( array1, array2, dontConvert ) {
		var len = Math.min( array1.length, array2.length ),
            lengthDiff = Math.abs( array1.length - array2.length ),
            diffs = 0,
            i;
		for ( i = 0; i < len; i++ ) {
			if ( ( dontConvert && array1[i] !== array2[i] ) ||
                ( !dontConvert && toInt( array1[i] ) !== toInt( array2[i] ) ) ) {
				diffs++;
			}
		}
		return diffs + lengthDiff;
	}

	function Locale() {
	}

	var locales = {};
	var globalLocale;

	function normalizeLocale( key ) {
		return key ? key.toLowerCase().replace( '_', '-' ) : key;
	}

	// pick the locale from the array
	// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
	// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
	function chooseLocale( names ) {
		var i = 0, j, next, locale, split;

		while ( i < names.length ) {
			split = normalizeLocale( names[i] ).split( '-' );
			j = split.length;
			next = normalizeLocale( names[i + 1] );
			next = next ? next.split( '-' ) : null;
			while ( j > 0 ) {
				locale = loadLocale( split.slice( 0, j ).join( '-' ) );
				if ( locale ) {
					return locale;
				}
				if ( next && next.length >= j && compareArrays( split, next, true ) >= j - 1 ) {
					//the next array item is better than a shallower substring of this one
					break;
				}
				j--;
			}
			i++;
		}
		return null;
	}

	function loadLocale( name ) {
		var oldLocale = null;
		// TODO: Find a better way to register and load all the locales in Node
		if ( !locales[name] && typeof module !== 'undefined' &&
                module && module.exports ) {
			try {
				oldLocale = globalLocale._abbr;
				require( './locale/' + name );
				// because defineLocale currently also sets the global locale, we
				// want to undo that for lazy loaded locales
				locale_locales__getSetGlobalLocale( oldLocale );
			} catch ( e ) { }
		}
		return locales[name];
	}

	// This function will load locale and then set the global locale.  If
	// no arguments are passed in, it will simply return the current global
	// locale key.
	function locale_locales__getSetGlobalLocale( key, values ) {
		var data;
		if ( key ) {
			if ( typeof values === 'undefined' ) {
				data = locale_locales__getLocale( key );
			}
			else {
				data = defineLocale( key, values );
			}

			if ( data ) {
				// moment.duration._locale = moment._locale = data;
				globalLocale = data;
			}
		}

		return globalLocale._abbr;
	}

	function defineLocale( name, values ) {
		if ( values !== null ) {
			values.abbr = name;
			if ( !locales[name] ) {
				locales[name] = new Locale();
			}
			locales[name].set( values );

			// backwards compat for now: also set the locale
			locale_locales__getSetGlobalLocale( name );

			return locales[name];
		} else {
			// useful for testing
			delete locales[name];
			return null;
		}
	}

	// returns locale data
	function locale_locales__getLocale( key ) {
		var locale;

		if ( key && key._locale && key._locale._abbr ) {
			key = key._locale._abbr;
		}

		if ( !key ) {
			return globalLocale;
		}

		if ( !isArray( key ) ) {
			//short-circuit everything else
			locale = loadLocale( key );
			if ( locale ) {
				return locale;
			}
			key = [key];
		}

		return chooseLocale( key );
	}

	var aliases = {};

	function addUnitAlias( unit, shorthand ) {
		var lowerCase = unit.toLowerCase();
		aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
	}

	function normalizeUnits( units ) {
		return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
	}

	function normalizeObjectUnits( inputObject ) {
		var normalizedInput = {},
            normalizedProp,
            prop;

		for ( prop in inputObject ) {
			if ( hasOwnProp( inputObject, prop ) ) {
				normalizedProp = normalizeUnits( prop );
				if ( normalizedProp ) {
					normalizedInput[normalizedProp] = inputObject[prop];
				}
			}
		}

		return normalizedInput;
	}

	function makeGetSet( unit, keepTime ) {
		return function( value ) {
			if ( value != null ) {
				get_set__set( this, unit, value );
				utils_hooks__hooks.updateOffset( this, keepTime );
				return this;
			} else {
				return get_set__get( this, unit );
			}
		};
	}

	function get_set__get( mom, unit ) {
		return mom._d['get' + ( mom._isUTC ? 'UTC' : '' ) + unit]();
	}

	function get_set__set( mom, unit, value ) {
		return mom._d['set' + ( mom._isUTC ? 'UTC' : '' ) + unit]( value );
	}

	// MOMENTS

	function getSet( units, value ) {
		var unit;
		if ( typeof units === 'object' ) {
			for ( unit in units ) {
				this.set( unit, units[unit] );
			}
		} else {
			units = normalizeUnits( units );
			if ( typeof this[units] === 'function' ) {
				return this[units]( value );
			}
		}
		return this;
	}

	function zeroFill( number, targetLength, forceSign ) {
		var output = '' + Math.abs( number ),
            sign = number >= 0;

		while ( output.length < targetLength ) {
			output = '0' + output;
		}
		return ( sign ? ( forceSign ? '+' : '' ) : '-' ) + output;
	}

	var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g;

	var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

	var formatFunctions = {};

	var formatTokenFunctions = {};

	// token:    'M'
	// padded:   ['MM', 2]
	// ordinal:  'Mo'
	// callback: function () { this.month() + 1 }
	function addFormatToken( token, padded, ordinal, callback ) {
		var func = callback;
		if ( typeof callback === 'string' ) {
			func = function() {
				return this[callback]();
			};
		}
		if ( token ) {
			formatTokenFunctions[token] = func;
		}
		if ( padded ) {
			formatTokenFunctions[padded[0]] = function() {
				return zeroFill( func.apply( this, arguments ), padded[1], padded[2] );
			};
		}
		if ( ordinal ) {
			formatTokenFunctions[ordinal] = function() {
				return this.localeData().ordinal( func.apply( this, arguments ), token );
			};
		}
	}

	function removeFormattingTokens( input ) {
		if ( input.match( /\[[\s\S]/ ) ) {
			return input.replace( /^\[|\]$/g, '' );
		}
		return input.replace( /\\/g, '' );
	}

	function makeFormatFunction( format ) {
		var array = format.match( formattingTokens ), i, length;

		for ( i = 0, length = array.length; i < length; i++ ) {
			if ( formatTokenFunctions[array[i]] ) {
				array[i] = formatTokenFunctions[array[i]];
			} else {
				array[i] = removeFormattingTokens( array[i] );
			}
		}

		return function( mom ) {
			var output = '';
			for ( i = 0; i < length; i++ ) {
				output += array[i] instanceof Function ? array[i].call( mom, format ) : array[i];
			}
			return output;
		};
	}

	// format date using native date object
	function formatMoment( m, format ) {
		if ( !m.isValid() ) {
			return m.localeData().invalidDate();
		}

		format = expandFormat( format, m.localeData() );

		if ( !formatFunctions[format] ) {
			formatFunctions[format] = makeFormatFunction( format );
		}

		return formatFunctions[format]( m );
	}

	function expandFormat( format, locale ) {
		var i = 5;

		function replaceLongDateFormatTokens( input ) {
			return locale.longDateFormat( input ) || input;
		}

		localFormattingTokens.lastIndex = 0;
		while ( i >= 0 && localFormattingTokens.test( format ) ) {
			format = format.replace( localFormattingTokens, replaceLongDateFormatTokens );
			localFormattingTokens.lastIndex = 0;
			i -= 1;
		}

		return format;
	}

	var match1 = /\d/;            //       0 - 9
	var match2 = /\d\d/;          //      00 - 99
	var match3 = /\d{3}/;         //     000 - 999
	var match4 = /\d{4}/;         //    0000 - 9999
	var match6 = /[+-]?\d{6}/;    // -999999 - 999999
	var match1to2 = /\d\d?/;         //       0 - 99
	var match1to3 = /\d{1,3}/;       //       0 - 999
	var match1to4 = /\d{1,4}/;       //       0 - 9999
	var match1to6 = /[+-]?\d{1,6}/;  // -999999 - 999999

	var matchUnsigned = /\d+/;           //       0 - inf
	var matchSigned = /[+-]?\d+/;      //    -inf - inf

	var matchOffset = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

	var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

	// any word (or two) characters or numbers including two/three word month in arabic.
	var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

	var regexes = {};

	function addRegexToken( token, regex, strictRegex ) {
		regexes[token] = typeof regex === 'function' ? regex : function( isStrict ) {
			return ( isStrict && strictRegex ) ? strictRegex : regex;
		};
	}

	function getParseRegexForToken( token, config ) {
		if ( !hasOwnProp( regexes, token ) ) {
			return new RegExp( unescapeFormat( token ) );
		}

		return regexes[token]( config._strict, config._locale );
	}

	// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
	function unescapeFormat( s ) {
		return s.replace( '\\', '' ).replace( /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function( matched, p1, p2, p3, p4 ) {
			return p1 || p2 || p3 || p4;
		} ).replace( /[-\/\\^$*+?.()|[\]{}]/g, '\\$&' );
	}

	var tokens = {};

	function addParseToken( token, callback ) {
		var i, func = callback;
		if ( typeof token === 'string' ) {
			token = [token];
		}
		if ( typeof callback === 'number' ) {
			func = function( input, array ) {
				array[callback] = toInt( input );
			};
		}
		for ( i = 0; i < token.length; i++ ) {
			tokens[token[i]] = func;
		}
	}

	function addWeekParseToken( token, callback ) {
		addParseToken( token, function( input, array, config, token ) {
			config._w = config._w || {};
			callback( input, config._w, config, token );
		} );
	}

	function addTimeToArrayFromToken( token, input, config ) {
		if ( input != null && hasOwnProp( tokens, token ) ) {
			tokens[token]( input, config._a, config, token );
		}
	}

	var YEAR = 0;
	var MONTH = 1;
	var DATE = 2;
	var HOUR = 3;
	var MINUTE = 4;
	var SECOND = 5;
	var MILLISECOND = 6;

	function daysInMonth( year, month ) {
		return new Date( Date.UTC( year, month + 1, 0 ) ).getUTCDate();
	}

	// FORMATTING

	addFormatToken( 'M', ['MM', 2], 'Mo', function() {
		return this.month() + 1;
	} );

	addFormatToken( 'MMM', 0, 0, function( format ) {
		return this.localeData().monthsShort( this, format );
	} );

	addFormatToken( 'MMMM', 0, 0, function( format ) {
		return this.localeData().months( this, format );
	} );

	// ALIASES

	addUnitAlias( 'month', 'M' );

	// PARSING

	addRegexToken( 'M', match1to2 );
	addRegexToken( 'MM', match1to2, match2 );
	addRegexToken( 'MMM', matchWord );
	addRegexToken( 'MMMM', matchWord );

	addParseToken( ['M', 'MM'], function( input, array ) {
		array[MONTH] = toInt( input ) - 1;
	} );

	addParseToken( ['MMM', 'MMMM'], function( input, array, config, token ) {
		var month = config._locale.monthsParse( input, token, config._strict );
		// if we didn't find a month name, mark the date as invalid.
		if ( month != null ) {
			array[MONTH] = month;
		} else {
			getParsingFlags( config ).invalidMonth = input;
		}
	} );

	// LOCALES

	var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split( '_' );
	function localeMonths( m ) {
		return this._months[m.month()];
	}

	var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split( '_' );
	function localeMonthsShort( m ) {
		return this._monthsShort[m.month()];
	}

	function localeMonthsParse( monthName, format, strict ) {
		var i, mom, regex;

		if ( !this._monthsParse ) {
			this._monthsParse = [];
			this._longMonthsParse = [];
			this._shortMonthsParse = [];
		}

		for ( i = 0; i < 12; i++ ) {
			// make the regex if we don't have it already
			mom = create_utc__createUTC( [2000, i] );
			if ( strict && !this._longMonthsParse[i] ) {
				this._longMonthsParse[i] = new RegExp( '^' + this.months( mom, '' ).replace( '.', '' ) + '$', 'i' );
				this._shortMonthsParse[i] = new RegExp( '^' + this.monthsShort( mom, '' ).replace( '.', '' ) + '$', 'i' );
			}
			if ( !strict && !this._monthsParse[i] ) {
				regex = '^' + this.months( mom, '' ) + '|^' + this.monthsShort( mom, '' );
				this._monthsParse[i] = new RegExp( regex.replace( '.', '' ), 'i' );
			}
			// test the regex
			if ( strict && format === 'MMMM' && this._longMonthsParse[i].test( monthName ) ) {
				return i;
			} else if ( strict && format === 'MMM' && this._shortMonthsParse[i].test( monthName ) ) {
				return i;
			} else if ( !strict && this._monthsParse[i].test( monthName ) ) {
				return i;
			}
		}
	}

	// MOMENTS

	function setMonth( mom, value ) {
		var dayOfMonth;

		// TODO: Move this out of here!
		if ( typeof value === 'string' ) {
			value = mom.localeData().monthsParse( value );
			// TODO: Another silent failure?
			if ( typeof value !== 'number' ) {
				return mom;
			}
		}

		dayOfMonth = Math.min( mom.date(), daysInMonth( mom.year(), value ) );
		mom._d['set' + ( mom._isUTC ? 'UTC' : '' ) + 'Month']( value, dayOfMonth );
		return mom;
	}

	function getSetMonth( value ) {
		if ( value != null ) {
			setMonth( this, value );
			utils_hooks__hooks.updateOffset( this, true );
			return this;
		} else {
			return get_set__get( this, 'Month' );
		}
	}

	function getDaysInMonth() {
		return daysInMonth( this.year(), this.month() );
	}

	function checkOverflow( m ) {
		var overflow;
		var a = m._a;

		if ( a && getParsingFlags( m ).overflow === -2 ) {
			overflow =
                a[MONTH] < 0 || a[MONTH] > 11 ? MONTH :
                a[DATE] < 1 || a[DATE] > daysInMonth( a[YEAR], a[MONTH] ) ? DATE :
                a[HOUR] < 0 || a[HOUR] > 24 || ( a[HOUR] === 24 && ( a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0 ) ) ? HOUR :
                a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE :
                a[SECOND] < 0 || a[SECOND] > 59 ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

			if ( getParsingFlags( m )._overflowDayOfYear && ( overflow < YEAR || overflow > DATE ) ) {
				overflow = DATE;
			}

			getParsingFlags( m ).overflow = overflow;
		}

		return m;
	}

	function warn( msg ) {
		if ( utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn ) {
			console.warn( 'Deprecation warning: ' + msg );
		}
	}

	function deprecate( msg, fn ) {
		var firstTime = true,
            msgWithStack = msg + '\n' + ( new Error() ).stack;

		return extend( function() {
			if ( firstTime ) {
				warn( msgWithStack );
				firstTime = false;
			}
			return fn.apply( this, arguments );
		}, fn );
	}

	var deprecations = {};

	function deprecateSimple( name, msg ) {
		if ( !deprecations[name] ) {
			warn( msg );
			deprecations[name] = true;
		}
	}

	utils_hooks__hooks.suppressDeprecationWarnings = false;

	var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

	var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
        ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
        ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d{2}/],
        ['YYYY-DDD', /\d{4}-\d{3}/]
	];

	// iso time formats and regexes
	var isoTimes = [
        ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
        ['HH:mm', /(T| )\d\d:\d\d/],
        ['HH', /(T| )\d\d/]
	];

	var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

	// date from iso format
	function configFromISO( config ) {
		var i, l,
            string = config._i,
            match = from_string__isoRegex.exec( string );

		if ( match ) {
			getParsingFlags( config ).iso = true;
			for ( i = 0, l = isoDates.length; i < l; i++ ) {
				if ( isoDates[i][1].exec( string ) ) {
					// match[5] should be 'T' or undefined
					config._f = isoDates[i][0] + ( match[6] || ' ' );
					break;
				}
			}
			for ( i = 0, l = isoTimes.length; i < l; i++ ) {
				if ( isoTimes[i][1].exec( string ) ) {
					config._f += isoTimes[i][0];
					break;
				}
			}
			if ( string.match( matchOffset ) ) {
				config._f += 'Z';
			}
			configFromStringAndFormat( config );
		} else {
			config._isValid = false;
		}
	}

	// date from iso format or fallback
	function configFromString( config ) {
		var matched = aspNetJsonRegex.exec( config._i );

		if ( matched !== null ) {
			config._d = new Date( +matched[1] );
			return;
		}

		configFromISO( config );
		if ( config._isValid === false ) {
			delete config._isValid;
			utils_hooks__hooks.createFromInputFallback( config );
		}
	}

	utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function( config ) {
        	config._d = new Date( config._i + ( config._useUTC ? ' UTC' : '' ) );
        }
    );

	function createDate( y, m, d, h, M, s, ms ) {
		//can't just apply() to create a date:
		//http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
		var date = new Date( y, m, d, h, M, s, ms );

		//the date constructor doesn't accept years < 1970
		if ( y < 1970 ) {
			date.setFullYear( y );
		}
		return date;
	}

	function createUTCDate( y ) {
		var date = new Date( Date.UTC.apply( null, arguments ) );
		if ( y < 1970 ) {
			date.setUTCFullYear( y );
		}
		return date;
	}

	addFormatToken( 0, ['YY', 2], 0, function() {
		return this.year() % 100;
	} );

	addFormatToken( 0, ['YYYY', 4], 0, 'year' );
	addFormatToken( 0, ['YYYYY', 5], 0, 'year' );
	addFormatToken( 0, ['YYYYYY', 6, true], 0, 'year' );

	// ALIASES

	addUnitAlias( 'year', 'y' );

	// PARSING

	addRegexToken( 'Y', matchSigned );
	addRegexToken( 'YY', match1to2, match2 );
	addRegexToken( 'YYYY', match1to4, match4 );
	addRegexToken( 'YYYYY', match1to6, match6 );
	addRegexToken( 'YYYYYY', match1to6, match6 );

	addParseToken( ['YYYY', 'YYYYY', 'YYYYYY'], YEAR );
	addParseToken( 'YY', function( input, array ) {
		array[YEAR] = utils_hooks__hooks.parseTwoDigitYear( input );
	} );

	// HELPERS

	function daysInYear( year ) {
		return isLeapYear( year ) ? 366 : 365;
	}

	function isLeapYear( year ) {
		return ( year % 4 === 0 && year % 100 !== 0 ) || year % 400 === 0;
	}

	// HOOKS

	utils_hooks__hooks.parseTwoDigitYear = function( input ) {
		return toInt( input ) + ( toInt( input ) > 68 ? 1900 : 2000 );
	};

	// MOMENTS

	var getSetYear = makeGetSet( 'FullYear', false );

	function getIsLeapYear() {
		return isLeapYear( this.year() );
	}

	addFormatToken( 'w', ['ww', 2], 'wo', 'week' );
	addFormatToken( 'W', ['WW', 2], 'Wo', 'isoWeek' );

	// ALIASES

	addUnitAlias( 'week', 'w' );
	addUnitAlias( 'isoWeek', 'W' );

	// PARSING

	addRegexToken( 'w', match1to2 );
	addRegexToken( 'ww', match1to2, match2 );
	addRegexToken( 'W', match1to2 );
	addRegexToken( 'WW', match1to2, match2 );

	addWeekParseToken( ['w', 'ww', 'W', 'WW'], function( input, week, config, token ) {
		week[token.substr( 0, 1 )] = toInt( input );
	} );

	// HELPERS

	// firstDayOfWeek       0 = sun, 6 = sat
	//                      the day of the week that starts the week
	//                      (usually sunday or monday)
	// firstDayOfWeekOfYear 0 = sun, 6 = sat
	//                      the first week is the week that contains the first
	//                      of this day of the week
	//                      (eg. ISO weeks use thursday (4))
	function weekOfYear( mom, firstDayOfWeek, firstDayOfWeekOfYear ) {
		var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


		if ( daysToDayOfWeek > end ) {
			daysToDayOfWeek -= 7;
		}

		if ( daysToDayOfWeek < end - 7 ) {
			daysToDayOfWeek += 7;
		}

		adjustedMoment = local__createLocal( mom ).add( daysToDayOfWeek, 'd' );
		return {
			week: Math.ceil( adjustedMoment.dayOfYear() / 7 ),
			year: adjustedMoment.year()
		};
	}

	// LOCALES

	function localeWeek( mom ) {
		return weekOfYear( mom, this._week.dow, this._week.doy ).week;
	}

	var defaultLocaleWeek = {
		dow: 0, // Sunday is the first day of the week.
		doy: 6  // The week that contains Jan 1st is the first week of the year.
	};

	function localeFirstDayOfWeek() {
		return this._week.dow;
	}

	function localeFirstDayOfYear() {
		return this._week.doy;
	}

	// MOMENTS

	function getSetWeek( input ) {
		var week = this.localeData().week( this );
		return input == null ? week : this.add(( input - week ) * 7, 'd' );
	}

	function getSetISOWeek( input ) {
		var week = weekOfYear( this, 1, 4 ).week;
		return input == null ? week : this.add(( input - week ) * 7, 'd' );
	}

	addFormatToken( 'DDD', ['DDDD', 3], 'DDDo', 'dayOfYear' );

	// ALIASES

	addUnitAlias( 'dayOfYear', 'DDD' );

	// PARSING

	addRegexToken( 'DDD', match1to3 );
	addRegexToken( 'DDDD', match3 );
	addParseToken( ['DDD', 'DDDD'], function( input, array, config ) {
		config._dayOfYear = toInt( input );
	} );

	// HELPERS

	//http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
	function dayOfYearFromWeeks( year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek ) {
		var d = createUTCDate( year, 0, 1 ).getUTCDay();
		var daysToAdd;
		var dayOfYear;

		d = d === 0 ? 7 : d;
		weekday = weekday != null ? weekday : firstDayOfWeek;
		daysToAdd = firstDayOfWeek - d + ( d > firstDayOfWeekOfYear ? 7 : 0 ) - ( d < firstDayOfWeek ? 7 : 0 );
		dayOfYear = 7 * ( week - 1 ) + ( weekday - firstDayOfWeek ) + daysToAdd + 1;

		return {
			year: dayOfYear > 0 ? year : year - 1,
			dayOfYear: dayOfYear > 0 ? dayOfYear : daysInYear( year - 1 ) + dayOfYear
		};
	}

	// MOMENTS

	function getSetDayOfYear( input ) {
		var dayOfYear = Math.round(( this.clone().startOf( 'day' ) - this.clone().startOf( 'year' ) ) / 864e5 ) + 1;
		return input == null ? dayOfYear : this.add(( input - dayOfYear ), 'd' );
	}

	// Pick the first defined of two or three arguments.
	function defaults( a, b, c ) {
		if ( a != null ) {
			return a;
		}
		if ( b != null ) {
			return b;
		}
		return c;
	}

	function currentDateArray( config ) {
		var now = new Date();
		if ( config._useUTC ) {
			return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
		}
		return [now.getFullYear(), now.getMonth(), now.getDate()];
	}

	// convert an array to a date.
	// the array should mirror the parameters below
	// note: all values past the year are optional and will default to the lowest possible value.
	// [year, month, day , hour, minute, second, millisecond]
	function configFromArray( config ) {
		var i, date, input = [], currentDate, yearToUse;

		if ( config._d ) {
			return;
		}

		currentDate = currentDateArray( config );

		//compute day of the year from weeks and weekdays
		if ( config._w && config._a[DATE] == null && config._a[MONTH] == null ) {
			dayOfYearFromWeekInfo( config );
		}

		//if the day of the year is set, figure out what it is
		if ( config._dayOfYear ) {
			yearToUse = defaults( config._a[YEAR], currentDate[YEAR] );

			if ( config._dayOfYear > daysInYear( yearToUse ) ) {
				getParsingFlags( config )._overflowDayOfYear = true;
			}

			date = createUTCDate( yearToUse, 0, config._dayOfYear );
			config._a[MONTH] = date.getUTCMonth();
			config._a[DATE] = date.getUTCDate();
		}

		// Default to current date.
		// * if no year, month, day of month are given, default to today
		// * if day of month is given, default month and year
		// * if month is given, default only year
		// * if year is given, don't default anything
		for ( i = 0; i < 3 && config._a[i] == null; ++i ) {
			config._a[i] = input[i] = currentDate[i];
		}

		// Zero out whatever was not defaulted, including time
		for ( ; i < 7; i++ ) {
			config._a[i] = input[i] = ( config._a[i] == null ) ? ( i === 2 ? 1 : 0 ) : config._a[i];
		}

		// Check for 24:00:00.000
		if ( config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0 ) {
			config._nextDay = true;
			config._a[HOUR] = 0;
		}

		config._d = ( config._useUTC ? createUTCDate : createDate ).apply( null, input );
		// Apply timezone offset from input. The actual utcOffset can be changed
		// with parseZone.
		if ( config._tzm != null ) {
			config._d.setUTCMinutes( config._d.getUTCMinutes() - config._tzm );
		}

		if ( config._nextDay ) {
			config._a[HOUR] = 24;
		}
	}

	function dayOfYearFromWeekInfo( config ) {
		var w, weekYear, week, weekday, dow, doy, temp;

		w = config._w;
		if ( w.GG != null || w.W != null || w.E != null ) {
			dow = 1;
			doy = 4;

			// TODO: We need to take the current isoWeekYear, but that depends on
			// how we interpret now (local, utc, fixed offset). So create
			// a now version of current config (take local/utc/offset flags, and
			// create now).
			weekYear = defaults( w.GG, config._a[YEAR], weekOfYear( local__createLocal(), 1, 4 ).year );
			week = defaults( w.W, 1 );
			weekday = defaults( w.E, 1 );
		} else {
			dow = config._locale._week.dow;
			doy = config._locale._week.doy;

			weekYear = defaults( w.gg, config._a[YEAR], weekOfYear( local__createLocal(), dow, doy ).year );
			week = defaults( w.w, 1 );

			if ( w.d != null ) {
				// weekday -- low day numbers are considered next week
				weekday = w.d;
				if ( weekday < dow ) {
					++week;
				}
			} else if ( w.e != null ) {
				// local weekday -- counting starts from begining of week
				weekday = w.e + dow;
			} else {
				// default to begining of week
				weekday = dow;
			}
		}
		temp = dayOfYearFromWeeks( weekYear, week, weekday, doy, dow );

		config._a[YEAR] = temp.year;
		config._dayOfYear = temp.dayOfYear;
	}

	utils_hooks__hooks.ISO_8601 = function() { };

	// date from string and format string
	function configFromStringAndFormat( config ) {
		// TODO: Move this to another part of the creation flow to prevent circular deps
		if ( config._f === utils_hooks__hooks.ISO_8601 ) {
			configFromISO( config );
			return;
		}

		config._a = [];
		getParsingFlags( config ).empty = true;

		// This array is used to make a Date, either with `new Date` or `Date.UTC`
		var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

		tokens = expandFormat( config._f, config._locale ).match( formattingTokens ) || [];

		for ( i = 0; i < tokens.length; i++ ) {
			token = tokens[i];
			parsedInput = ( string.match( getParseRegexForToken( token, config ) ) || [] )[0];
			if ( parsedInput ) {
				skipped = string.substr( 0, string.indexOf( parsedInput ) );
				if ( skipped.length > 0 ) {
					getParsingFlags( config ).unusedInput.push( skipped );
				}
				string = string.slice( string.indexOf( parsedInput ) + parsedInput.length );
				totalParsedInputLength += parsedInput.length;
			}
			// don't parse if it's not a known token
			if ( formatTokenFunctions[token] ) {
				if ( parsedInput ) {
					getParsingFlags( config ).empty = false;
				}
				else {
					getParsingFlags( config ).unusedTokens.push( token );
				}
				addTimeToArrayFromToken( token, parsedInput, config );
			}
			else if ( config._strict && !parsedInput ) {
				getParsingFlags( config ).unusedTokens.push( token );
			}
		}

		// add remaining unparsed input length to the string
		getParsingFlags( config ).charsLeftOver = stringLength - totalParsedInputLength;
		if ( string.length > 0 ) {
			getParsingFlags( config ).unusedInput.push( string );
		}

		// clear _12h flag if hour is <= 12
		if ( getParsingFlags( config ).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0 ) {
			getParsingFlags( config ).bigHour = undefined;
		}
		// handle meridiem
		config._a[HOUR] = meridiemFixWrap( config._locale, config._a[HOUR], config._meridiem );

		configFromArray( config );
		checkOverflow( config );
	}


	function meridiemFixWrap( locale, hour, meridiem ) {
		var isPm;

		if ( meridiem == null ) {
			// nothing to do
			return hour;
		}
		if ( locale.meridiemHour != null ) {
			return locale.meridiemHour( hour, meridiem );
		} else if ( locale.isPM != null ) {
			// Fallback
			isPm = locale.isPM( meridiem );
			if ( isPm && hour < 12 ) {
				hour += 12;
			}
			if ( !isPm && hour === 12 ) {
				hour = 0;
			}
			return hour;
		} else {
			// this is not supposed to happen
			return hour;
		}
	}

	function configFromStringAndArray( config ) {
		var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

		if ( config._f.length === 0 ) {
			getParsingFlags( config ).invalidFormat = true;
			config._d = new Date( NaN );
			return;
		}

		for ( i = 0; i < config._f.length; i++ ) {
			currentScore = 0;
			tempConfig = copyConfig( {}, config );
			if ( config._useUTC != null ) {
				tempConfig._useUTC = config._useUTC;
			}
			tempConfig._f = config._f[i];
			configFromStringAndFormat( tempConfig );

			if ( !valid__isValid( tempConfig ) ) {
				continue;
			}

			// if there is any input that was not parsed add a penalty for that format
			currentScore += getParsingFlags( tempConfig ).charsLeftOver;

			//or tokens
			currentScore += getParsingFlags( tempConfig ).unusedTokens.length * 10;

			getParsingFlags( tempConfig ).score = currentScore;

			if ( scoreToBeat == null || currentScore < scoreToBeat ) {
				scoreToBeat = currentScore;
				bestMoment = tempConfig;
			}
		}

		extend( config, bestMoment || tempConfig );
	}

	function configFromObject( config ) {
		if ( config._d ) {
			return;
		}

		var i = normalizeObjectUnits( config._i );
		config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

		configFromArray( config );
	}

	function createFromConfig( config ) {
		var input = config._i,
            format = config._f,
            res;

		config._locale = config._locale || locale_locales__getLocale( config._l );

		if ( input === null || ( format === undefined && input === '' ) ) {
			return valid__createInvalid( { nullInput: true } );
		}

		if ( typeof input === 'string' ) {
			config._i = input = config._locale.preparse( input );
		}

		if ( isMoment( input ) ) {
			return new Moment( checkOverflow( input ) );
		} else if ( isArray( format ) ) {
			configFromStringAndArray( config );
		} else if ( format ) {
			configFromStringAndFormat( config );
		} else if ( isDate( input ) ) {
			config._d = input;
		} else {
			configFromInput( config );
		}

		res = new Moment( checkOverflow( config ) );
		if ( res._nextDay ) {
			// Adding is smart enough around DST
			res.add( 1, 'd' );
			res._nextDay = undefined;
		}

		return res;
	}

	function configFromInput( config ) {
		var input = config._i;
		if ( input === undefined ) {
			config._d = new Date();
		} else if ( isDate( input ) ) {
			config._d = new Date( +input );
		} else if ( typeof input === 'string' ) {
			configFromString( config );
		} else if ( isArray( input ) ) {
			config._a = map( input.slice( 0 ), function( obj ) {
				return parseInt( obj, 10 );
			} );
			configFromArray( config );
		} else if ( typeof ( input ) === 'object' ) {
			configFromObject( config );
		} else if ( typeof ( input ) === 'number' ) {
			// from milliseconds
			config._d = new Date( input );
		} else {
			utils_hooks__hooks.createFromInputFallback( config );
		}
	}

	function createLocalOrUTC( input, format, locale, strict, isUTC ) {
		var c = {};

		if ( typeof ( locale ) === 'boolean' ) {
			strict = locale;
			locale = undefined;
		}
		// object construction must be done this way.
		// https://github.com/moment/moment/issues/1423
		c._isAMomentObject = true;
		c._useUTC = c._isUTC = isUTC;
		c._l = locale;
		c._i = input;
		c._f = format;
		c._strict = strict;

		return createFromConfig( c );
	}

	function local__createLocal( input, format, locale, strict ) {
		return createLocalOrUTC( input, format, locale, strict, false );
	}

	var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function() {
         	var other = local__createLocal.apply( null, arguments );
         	return other < this ? this : other;
         }
     );

	var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function() {
        	var other = local__createLocal.apply( null, arguments );
        	return other > this ? this : other;
        }
    );

	// Pick a moment m from moments so that m[fn](other) is true for all
	// other. This relies on the function fn to be transitive.
	//
	// moments should either be an array of moment objects or an array, whose
	// first element is an array of moment objects.
	function pickBy( fn, moments ) {
		var res, i;
		if ( moments.length === 1 && isArray( moments[0] ) ) {
			moments = moments[0];
		}
		if ( !moments.length ) {
			return local__createLocal();
		}
		res = moments[0];
		for ( i = 1; i < moments.length; ++i ) {
			if ( moments[i][fn]( res ) ) {
				res = moments[i];
			}
		}
		return res;
	}

	// TODO: Use [].sort instead?
	function min() {
		var args = [].slice.call( arguments, 0 );

		return pickBy( 'isBefore', args );
	}

	function max() {
		var args = [].slice.call( arguments, 0 );

		return pickBy( 'isAfter', args );
	}

	function Duration( duration ) {
		var normalizedInput = normalizeObjectUnits( duration ),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

		// representation for dateAddRemove
		this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
		// Because of dateAddRemove treats 24 hours as different from a
		// day when working around DST, we need to store them separately
		this._days = +days +
            weeks * 7;
		// It is impossible translate months into days without knowing
		// which months you are are talking about, so we have to store
		// it separately.
		this._months = +months +
            quarters * 3 +
            years * 12;

		this._data = {};

		this._locale = locale_locales__getLocale();

		this._bubble();
	}

	function isDuration( obj ) {
		return obj instanceof Duration;
	}

	function offset( token, separator ) {
		addFormatToken( token, 0, 0, function() {
			var offset = this.utcOffset();
			var sign = '+';
			if ( offset < 0 ) {
				offset = -offset;
				sign = '-';
			}
			return sign + zeroFill( ~~( offset / 60 ), 2 ) + separator + zeroFill( ~~( offset ) % 60, 2 );
		} );
	}

	offset( 'Z', ':' );
	offset( 'ZZ', '' );

	// PARSING

	addRegexToken( 'Z', matchOffset );
	addRegexToken( 'ZZ', matchOffset );
	addParseToken( ['Z', 'ZZ'], function( input, array, config ) {
		config._useUTC = true;
		config._tzm = offsetFromString( input );
	} );

	// HELPERS

	// timezone chunker
	// '+10:00' > ['10',  '00']
	// '-1530'  > ['-15', '30']
	var chunkOffset = /([\+\-]|\d\d)/gi;

	function offsetFromString( string ) {
		var matches = ( ( string || '' ).match( matchOffset ) || [] );
		var chunk = matches[matches.length - 1] || [];
		var parts = ( chunk + '' ).match( chunkOffset ) || ['-', 0, 0];
		var minutes = +( parts[1] * 60 ) + toInt( parts[2] );

		return parts[0] === '+' ? minutes : -minutes;
	}

	// Return a moment from input, that is local/utc/zone equivalent to model.
	function cloneWithOffset( input, model ) {
		var res, diff;
		if ( model._isUTC ) {
			res = model.clone();
			diff = ( isMoment( input ) || isDate( input ) ? +input : +local__createLocal( input ) ) - ( +res );
			// Use low-level api, because this fn is low-level api.
			res._d.setTime( +res._d + diff );
			utils_hooks__hooks.updateOffset( res, false );
			return res;
		} else {
			return local__createLocal( input ).local();
		}
		return model._isUTC ? local__createLocal( input ).zone( model._offset || 0 ) : local__createLocal( input ).local();
	}

	function getDateOffset( m ) {
		// On Firefox.24 Date#getTimezoneOffset returns a floating point.
		// https://github.com/moment/moment/pull/1871
		return -Math.round( m._d.getTimezoneOffset() / 15 ) * 15;
	}

	// HOOKS

	// This function will be called whenever a moment is mutated.
	// It is intended to keep the offset in sync with the timezone.
	utils_hooks__hooks.updateOffset = function() { };

	// MOMENTS

	// keepLocalTime = true means only change the timezone, without
	// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
	// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
	// +0200, so we adjust the time as needed, to be valid.
	//
	// Keeping the time actually adds/subtracts (one hour)
	// from the actual represented time. That is why we call updateOffset
	// a second time. In case it wants us to change the offset again
	// _changeInProgress == true case, then we have to adjust, because
	// there is no such time in the given timezone.
	function getSetOffset( input, keepLocalTime ) {
		var offset = this._offset || 0,
            localAdjust;
		if ( input != null ) {
			if ( typeof input === 'string' ) {
				input = offsetFromString( input );
			}
			if ( Math.abs( input ) < 16 ) {
				input = input * 60;
			}
			if ( !this._isUTC && keepLocalTime ) {
				localAdjust = getDateOffset( this );
			}
			this._offset = input;
			this._isUTC = true;
			if ( localAdjust != null ) {
				this.add( localAdjust, 'm' );
			}
			if ( offset !== input ) {
				if ( !keepLocalTime || this._changeInProgress ) {
					add_subtract__addSubtract( this, create__createDuration( input - offset, 'm' ), 1, false );
				} else if ( !this._changeInProgress ) {
					this._changeInProgress = true;
					utils_hooks__hooks.updateOffset( this, true );
					this._changeInProgress = null;
				}
			}
			return this;
		} else {
			return this._isUTC ? offset : getDateOffset( this );
		}
	}

	function getSetZone( input, keepLocalTime ) {
		if ( input != null ) {
			if ( typeof input !== 'string' ) {
				input = -input;
			}

			this.utcOffset( input, keepLocalTime );

			return this;
		} else {
			return -this.utcOffset();
		}
	}

	function setOffsetToUTC( keepLocalTime ) {
		return this.utcOffset( 0, keepLocalTime );
	}

	function setOffsetToLocal( keepLocalTime ) {
		if ( this._isUTC ) {
			this.utcOffset( 0, keepLocalTime );
			this._isUTC = false;

			if ( keepLocalTime ) {
				this.subtract( getDateOffset( this ), 'm' );
			}
		}
		return this;
	}

	function setOffsetToParsedOffset() {
		if ( this._tzm ) {
			this.utcOffset( this._tzm );
		} else if ( typeof this._i === 'string' ) {
			this.utcOffset( offsetFromString( this._i ) );
		}
		return this;
	}

	function hasAlignedHourOffset( input ) {
		if ( !input ) {
			input = 0;
		}
		else {
			input = local__createLocal( input ).utcOffset();
		}

		return ( this.utcOffset() - input ) % 60 === 0;
	}

	function isDaylightSavingTime() {
		return (
            this.utcOffset() > this.clone().month( 0 ).utcOffset() ||
            this.utcOffset() > this.clone().month( 5 ).utcOffset()
        );
	}

	function isDaylightSavingTimeShifted() {
		if ( this._a ) {
			var other = this._isUTC ? create_utc__createUTC( this._a ) : local__createLocal( this._a );
			return this.isValid() && compareArrays( this._a, other.toArray() ) > 0;
		}

		return false;
	}

	function isLocal() {
		return !this._isUTC;
	}

	function isUtcOffset() {
		return this._isUTC;
	}

	function isUtc() {
		return this._isUTC && this._offset === 0;
	}

	var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

	// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
	// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
	var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

	function create__createDuration( input, key ) {
		var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

		if ( isDuration( input ) ) {
			duration = {
				ms: input._milliseconds,
				d: input._days,
				M: input._months
			};
		} else if ( typeof input === 'number' ) {
			duration = {};
			if ( key ) {
				duration[key] = input;
			} else {
				duration.milliseconds = input;
			}
		} else if ( !!( match = aspNetRegex.exec( input ) ) ) {
			sign = ( match[1] === '-' ) ? -1 : 1;
			duration = {
				y: 0,
				d: toInt( match[DATE] ) * sign,
				h: toInt( match[HOUR] ) * sign,
				m: toInt( match[MINUTE] ) * sign,
				s: toInt( match[SECOND] ) * sign,
				ms: toInt( match[MILLISECOND] ) * sign
			};
		} else if ( !!( match = create__isoRegex.exec( input ) ) ) {
			sign = ( match[1] === '-' ) ? -1 : 1;
			duration = {
				y: parseIso( match[2], sign ),
				M: parseIso( match[3], sign ),
				d: parseIso( match[4], sign ),
				h: parseIso( match[5], sign ),
				m: parseIso( match[6], sign ),
				s: parseIso( match[7], sign ),
				w: parseIso( match[8], sign )
			};
		} else if ( duration == null ) {// checks for null or undefined
			duration = {};
		} else if ( typeof duration === 'object' && ( 'from' in duration || 'to' in duration ) ) {
			diffRes = momentsDifference( local__createLocal( duration.from ), local__createLocal( duration.to ) );

			duration = {};
			duration.ms = diffRes.milliseconds;
			duration.M = diffRes.months;
		}

		ret = new Duration( duration );

		if ( isDuration( input ) && hasOwnProp( input, '_locale' ) ) {
			ret._locale = input._locale;
		}

		return ret;
	}

	create__createDuration.fn = Duration.prototype;

	function parseIso( inp, sign ) {
		// We'd normally use ~~inp for this, but unfortunately it also
		// converts floats to ints.
		// inp may be undefined, so careful calling replace on it.
		var res = inp && parseFloat( inp.replace( ',', '.' ) );
		// apply sign while we're at it
		return ( isNaN( res ) ? 0 : res ) * sign;
	}

	function positiveMomentsDifference( base, other ) {
		var res = { milliseconds: 0, months: 0 };

		res.months = other.month() - base.month() +
            ( other.year() - base.year() ) * 12;
		if ( base.clone().add( res.months, 'M' ).isAfter( other ) ) {
			--res.months;
		}

		res.milliseconds = +other - +( base.clone().add( res.months, 'M' ) );

		return res;
	}

	function momentsDifference( base, other ) {
		var res;
		other = cloneWithOffset( other, base );
		if ( base.isBefore( other ) ) {
			res = positiveMomentsDifference( base, other );
		} else {
			res = positiveMomentsDifference( other, base );
			res.milliseconds = -res.milliseconds;
			res.months = -res.months;
		}

		return res;
	}

	function createAdder( direction, name ) {
		return function( val, period ) {
			var dur, tmp;
			//invert the arguments, but complain about it
			if ( period !== null && !isNaN( +period ) ) {
				deprecateSimple( name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period).' );
				tmp = val; val = period; period = tmp;
			}

			val = typeof val === 'string' ? +val : val;
			dur = create__createDuration( val, period );
			add_subtract__addSubtract( this, dur, direction );
			return this;
		};
	}

	function add_subtract__addSubtract( mom, duration, isAdding, updateOffset ) {
		var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
		updateOffset = updateOffset == null ? true : updateOffset;

		if ( milliseconds ) {
			mom._d.setTime( +mom._d + milliseconds * isAdding );
		}
		if ( days ) {
			get_set__set( mom, 'Date', get_set__get( mom, 'Date' ) + days * isAdding );
		}
		if ( months ) {
			setMonth( mom, get_set__get( mom, 'Month' ) + months * isAdding );
		}
		if ( updateOffset ) {
			utils_hooks__hooks.updateOffset( mom, days || months );
		}
	}

	var add_subtract__add = createAdder( 1, 'add' );
	var add_subtract__subtract = createAdder( -1, 'subtract' );

	function moment_calendar__calendar( time ) {
		// We want to compare the start of today, vs this.
		// Getting start-of-today depends on whether we're local/utc/offset or not.
		var now = time || local__createLocal(),
            sod = cloneWithOffset( now, this ).startOf( 'day' ),
            diff = this.diff( sod, 'days', true ),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
		return this.format( this.localeData().calendar( format, this, local__createLocal( now ) ) );
	}

	function clone() {
		return new Moment( this );
	}

	function isAfter( input, units ) {
		var inputMs;
		units = normalizeUnits( typeof units !== 'undefined' ? units : 'millisecond' );
		if ( units === 'millisecond' ) {
			input = isMoment( input ) ? input : local__createLocal( input );
			return +this > +input;
		} else {
			inputMs = isMoment( input ) ? +input : +local__createLocal( input );
			return inputMs < +this.clone().startOf( units );
		}
	}

	function isBefore( input, units ) {
		var inputMs;
		units = normalizeUnits( typeof units !== 'undefined' ? units : 'millisecond' );
		if ( units === 'millisecond' ) {
			input = isMoment( input ) ? input : local__createLocal( input );
			return +this < +input;
		} else {
			inputMs = isMoment( input ) ? +input : +local__createLocal( input );
			return +this.clone().endOf( units ) < inputMs;
		}
	}

	function isBetween( from, to, units ) {
		return this.isAfter( from, units ) && this.isBefore( to, units );
	}

	function isSame( input, units ) {
		var inputMs;
		units = normalizeUnits( units || 'millisecond' );
		if ( units === 'millisecond' ) {
			input = isMoment( input ) ? input : local__createLocal( input );
			return +this === +input;
		} else {
			inputMs = +local__createLocal( input );
			return +( this.clone().startOf( units ) ) <= inputMs && inputMs <= +( this.clone().endOf( units ) );
		}
	}

	function absFloor( number ) {
		if ( number < 0 ) {
			return Math.ceil( number );
		} else {
			return Math.floor( number );
		}
	}

	function diff( input, units, asFloat ) {
		var that = cloneWithOffset( input, this ),
            zoneDelta = ( that.utcOffset() - this.utcOffset() ) * 6e4,
            delta, output;

		units = normalizeUnits( units );

		if ( units === 'year' || units === 'month' || units === 'quarter' ) {
			output = monthDiff( this, that );
			if ( units === 'quarter' ) {
				output = output / 3;
			} else if ( units === 'year' ) {
				output = output / 12;
			}
		} else {
			delta = this - that;
			output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? ( delta - zoneDelta ) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? ( delta - zoneDelta ) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
		}
		return asFloat ? output : absFloor( output );
	}

	function monthDiff( a, b ) {
		// difference in months
		var wholeMonthDiff = ( ( b.year() - a.year() ) * 12 ) + ( b.month() - a.month() ),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add( wholeMonthDiff, 'months' ),
            anchor2, adjust;

		if ( b - anchor < 0 ) {
			anchor2 = a.clone().add( wholeMonthDiff - 1, 'months' );
			// linear across the month
			adjust = ( b - anchor ) / ( anchor - anchor2 );
		} else {
			anchor2 = a.clone().add( wholeMonthDiff + 1, 'months' );
			// linear across the month
			adjust = ( b - anchor ) / ( anchor2 - anchor );
		}

		return -( wholeMonthDiff + adjust );
	}

	utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

	function toString() {
		return this.clone().locale( 'en' ).format( 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ' );
	}

	function moment_format__toISOString() {
		var m = this.clone().utc();
		if ( 0 < m.year() && m.year() <= 9999 ) {
			if ( 'function' === typeof Date.prototype.toISOString ) {
				// native implementation is ~50x faster, use it when we can
				return this.toDate().toISOString();
			} else {
				return formatMoment( m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' );
			}
		} else {
			return formatMoment( m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' );
		}
	}

	function format( inputString ) {
		var output = formatMoment( this, inputString || utils_hooks__hooks.defaultFormat );
		return this.localeData().postformat( output );
	}

	function from( time, withoutSuffix ) {
		if ( !this.isValid() ) {
			return this.localeData().invalidDate();
		}
		return create__createDuration( { to: this, from: time } ).locale( this.locale() ).humanize( !withoutSuffix );
	}

	function fromNow( withoutSuffix ) {
		return this.from( local__createLocal(), withoutSuffix );
	}

	function to( time, withoutSuffix ) {
		if ( !this.isValid() ) {
			return this.localeData().invalidDate();
		}
		return create__createDuration( { from: this, to: time } ).locale( this.locale() ).humanize( !withoutSuffix );
	}

	function toNow( withoutSuffix ) {
		return this.to( local__createLocal(), withoutSuffix );
	}

	function locale( key ) {
		var newLocaleData;

		if ( key === undefined ) {
			return this._locale._abbr;
		} else {
			newLocaleData = locale_locales__getLocale( key );
			if ( newLocaleData != null ) {
				this._locale = newLocaleData;
			}
			return this;
		}
	}

	var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function( key ) {
        	if ( key === undefined ) {
        		return this.localeData();
        	} else {
        		return this.locale( key );
        	}
        }
    );

	function localeData() {
		return this._locale;
	}

	function startOf( units ) {
		units = normalizeUnits( units );
		// the following switch intentionally omits break keywords
		// to utilize falling through the cases.
		switch ( units ) {
			case 'year':
				this.month( 0 );
				/* falls through */
			case 'quarter':
			case 'month':
				this.date( 1 );
				/* falls through */
			case 'week':
			case 'isoWeek':
			case 'day':
				this.hours( 0 );
				/* falls through */
			case 'hour':
				this.minutes( 0 );
				/* falls through */
			case 'minute':
				this.seconds( 0 );
				/* falls through */
			case 'second':
				this.milliseconds( 0 );
		}

		// weeks are a special case
		if ( units === 'week' ) {
			this.weekday( 0 );
		}
		if ( units === 'isoWeek' ) {
			this.isoWeekday( 1 );
		}

		// quarters are also special
		if ( units === 'quarter' ) {
			this.month( Math.floor( this.month() / 3 ) * 3 );
		}

		return this;
	}

	function endOf( units ) {
		units = normalizeUnits( units );
		if ( units === undefined || units === 'millisecond' ) {
			return this;
		}
		return this.startOf( units ).add( 1, ( units === 'isoWeek' ? 'week' : units ) ).subtract( 1, 'ms' );
	}

	function to_type__valueOf() {
		return +this._d - ( ( this._offset || 0 ) * 60000 );
	}

	function unix() {
		return Math.floor( +this / 1000 );
	}

	function toDate() {
		return this._offset ? new Date( +this ) : this._d;
	}

	function toArray() {
		var m = this;
		return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
	}

	function moment_valid__isValid() {
		return valid__isValid( this );
	}

	function parsingFlags() {
		return extend( {}, getParsingFlags( this ) );
	}

	function invalidAt() {
		return getParsingFlags( this ).overflow;
	}

	addFormatToken( 0, ['gg', 2], 0, function() {
		return this.weekYear() % 100;
	} );

	addFormatToken( 0, ['GG', 2], 0, function() {
		return this.isoWeekYear() % 100;
	} );

	function addWeekYearFormatToken( token, getter ) {
		addFormatToken( 0, [token, token.length], 0, getter );
	}

	addWeekYearFormatToken( 'gggg', 'weekYear' );
	addWeekYearFormatToken( 'ggggg', 'weekYear' );
	addWeekYearFormatToken( 'GGGG', 'isoWeekYear' );
	addWeekYearFormatToken( 'GGGGG', 'isoWeekYear' );

	// ALIASES

	addUnitAlias( 'weekYear', 'gg' );
	addUnitAlias( 'isoWeekYear', 'GG' );

	// PARSING

	addRegexToken( 'G', matchSigned );
	addRegexToken( 'g', matchSigned );
	addRegexToken( 'GG', match1to2, match2 );
	addRegexToken( 'gg', match1to2, match2 );
	addRegexToken( 'GGGG', match1to4, match4 );
	addRegexToken( 'gggg', match1to4, match4 );
	addRegexToken( 'GGGGG', match1to6, match6 );
	addRegexToken( 'ggggg', match1to6, match6 );

	addWeekParseToken( ['gggg', 'ggggg', 'GGGG', 'GGGGG'], function( input, week, config, token ) {
		week[token.substr( 0, 2 )] = toInt( input );
	} );

	addWeekParseToken( ['gg', 'GG'], function( input, week, config, token ) {
		week[token] = utils_hooks__hooks.parseTwoDigitYear( input );
	} );

	// HELPERS

	function weeksInYear( year, dow, doy ) {
		return weekOfYear( local__createLocal( [year, 11, 31 + dow - doy] ), dow, doy ).week;
	}

	// MOMENTS

	function getSetWeekYear( input ) {
		var year = weekOfYear( this, this.localeData()._week.dow, this.localeData()._week.doy ).year;
		return input == null ? year : this.add(( input - year ), 'y' );
	}

	function getSetISOWeekYear( input ) {
		var year = weekOfYear( this, 1, 4 ).year;
		return input == null ? year : this.add(( input - year ), 'y' );
	}

	function getISOWeeksInYear() {
		return weeksInYear( this.year(), 1, 4 );
	}

	function getWeeksInYear() {
		var weekInfo = this.localeData()._week;
		return weeksInYear( this.year(), weekInfo.dow, weekInfo.doy );
	}

	addFormatToken( 'Q', 0, 0, 'quarter' );

	// ALIASES

	addUnitAlias( 'quarter', 'Q' );

	// PARSING

	addRegexToken( 'Q', match1 );
	addParseToken( 'Q', function( input, array ) {
		array[MONTH] = ( toInt( input ) - 1 ) * 3;
	} );

	// MOMENTS

	function getSetQuarter( input ) {
		return input == null ? Math.ceil(( this.month() + 1 ) / 3 ) : this.month(( input - 1 ) * 3 + this.month() % 3 );
	}

	addFormatToken( 'D', ['DD', 2], 'Do', 'date' );

	// ALIASES

	addUnitAlias( 'date', 'D' );

	// PARSING

	addRegexToken( 'D', match1to2 );
	addRegexToken( 'DD', match1to2, match2 );
	addRegexToken( 'Do', function( isStrict, locale ) {
		return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
	} );

	addParseToken( ['D', 'DD'], DATE );
	addParseToken( 'Do', function( input, array ) {
		array[DATE] = toInt( input.match( match1to2 )[0], 10 );
	} );

	// MOMENTS

	var getSetDayOfMonth = makeGetSet( 'Date', true );

	addFormatToken( 'd', 0, 'do', 'day' );

	addFormatToken( 'dd', 0, 0, function( format ) {
		return this.localeData().weekdaysMin( this, format );
	} );

	addFormatToken( 'ddd', 0, 0, function( format ) {
		return this.localeData().weekdaysShort( this, format );
	} );

	addFormatToken( 'dddd', 0, 0, function( format ) {
		return this.localeData().weekdays( this, format );
	} );

	addFormatToken( 'e', 0, 0, 'weekday' );
	addFormatToken( 'E', 0, 0, 'isoWeekday' );

	// ALIASES

	addUnitAlias( 'day', 'd' );
	addUnitAlias( 'weekday', 'e' );
	addUnitAlias( 'isoWeekday', 'E' );

	// PARSING

	addRegexToken( 'd', match1to2 );
	addRegexToken( 'e', match1to2 );
	addRegexToken( 'E', match1to2 );
	addRegexToken( 'dd', matchWord );
	addRegexToken( 'ddd', matchWord );
	addRegexToken( 'dddd', matchWord );

	addWeekParseToken( ['dd', 'ddd', 'dddd'], function( input, week, config ) {
		var weekday = config._locale.weekdaysParse( input );
		// if we didn't get a weekday name, mark the date as invalid
		if ( weekday != null ) {
			week.d = weekday;
		} else {
			getParsingFlags( config ).invalidWeekday = input;
		}
	} );

	addWeekParseToken( ['d', 'e', 'E'], function( input, week, config, token ) {
		week[token] = toInt( input );
	} );

	// HELPERS

	function parseWeekday( input, locale ) {
		if ( typeof input === 'string' ) {
			if ( !isNaN( input ) ) {
				input = parseInt( input, 10 );
			}
			else {
				input = locale.weekdaysParse( input );
				if ( typeof input !== 'number' ) {
					return null;
				}
			}
		}
		return input;
	}

	// LOCALES

	var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split( '_' );
	function localeWeekdays( m ) {
		return this._weekdays[m.day()];
	}

	var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split( '_' );
	function localeWeekdaysShort( m ) {
		return this._weekdaysShort[m.day()];
	}

	var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split( '_' );
	function localeWeekdaysMin( m ) {
		return this._weekdaysMin[m.day()];
	}

	function localeWeekdaysParse( weekdayName ) {
		var i, mom, regex;

		if ( !this._weekdaysParse ) {
			this._weekdaysParse = [];
		}

		for ( i = 0; i < 7; i++ ) {
			// make the regex if we don't have it already
			if ( !this._weekdaysParse[i] ) {
				mom = local__createLocal( [2000, 1] ).day( i );
				regex = '^' + this.weekdays( mom, '' ) + '|^' + this.weekdaysShort( mom, '' ) + '|^' + this.weekdaysMin( mom, '' );
				this._weekdaysParse[i] = new RegExp( regex.replace( '.', '' ), 'i' );
			}
			// test the regex
			if ( this._weekdaysParse[i].test( weekdayName ) ) {
				return i;
			}
		}
	}

	// MOMENTS

	function getSetDayOfWeek( input ) {
		var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
		if ( input != null ) {
			input = parseWeekday( input, this.localeData() );
			return this.add( input - day, 'd' );
		} else {
			return day;
		}
	}

	function getSetLocaleDayOfWeek( input ) {
		var weekday = ( this.day() + 7 - this.localeData()._week.dow ) % 7;
		return input == null ? weekday : this.add( input - weekday, 'd' );
	}

	function getSetISODayOfWeek( input ) {
		// behaves the same as moment#day except
		// as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
		// as a setter, sunday should belong to the previous week.
		return input == null ? this.day() || 7 : this.day( this.day() % 7 ? input : input - 7 );
	}

	addFormatToken( 'H', ['HH', 2], 0, 'hour' );
	addFormatToken( 'h', ['hh', 2], 0, function() {
		return this.hours() % 12 || 12;
	} );

	function meridiem( token, lowercase ) {
		addFormatToken( token, 0, 0, function() {
			return this.localeData().meridiem( this.hours(), this.minutes(), lowercase );
		} );
	}

	meridiem( 'a', true );
	meridiem( 'A', false );

	// ALIASES

	addUnitAlias( 'hour', 'h' );

	// PARSING

	function matchMeridiem( isStrict, locale ) {
		return locale._meridiemParse;
	}

	addRegexToken( 'a', matchMeridiem );
	addRegexToken( 'A', matchMeridiem );
	addRegexToken( 'H', match1to2 );
	addRegexToken( 'h', match1to2 );
	addRegexToken( 'HH', match1to2, match2 );
	addRegexToken( 'hh', match1to2, match2 );

	addParseToken( ['H', 'HH'], HOUR );
	addParseToken( ['a', 'A'], function( input, array, config ) {
		config._isPm = config._locale.isPM( input );
		config._meridiem = input;
	} );
	addParseToken( ['h', 'hh'], function( input, array, config ) {
		array[HOUR] = toInt( input );
		getParsingFlags( config ).bigHour = true;
	} );

	// LOCALES

	function localeIsPM( input ) {
		// IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
		// Using charAt should be more compatible.
		return ( ( input + '' ).toLowerCase().charAt( 0 ) === 'p' );
	}

	var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
	function localeMeridiem( hours, minutes, isLower ) {
		if ( hours > 11 ) {
			return isLower ? 'pm' : 'PM';
		} else {
			return isLower ? 'am' : 'AM';
		}
	}


	// MOMENTS

	// Setting the hour should keep the time, because the user explicitly
	// specified which hour he wants. So trying to maintain the same hour (in
	// a new timezone) makes sense. Adding/subtracting hours does not follow
	// this rule.
	var getSetHour = makeGetSet( 'Hours', true );

	addFormatToken( 'm', ['mm', 2], 0, 'minute' );

	// ALIASES

	addUnitAlias( 'minute', 'm' );

	// PARSING

	addRegexToken( 'm', match1to2 );
	addRegexToken( 'mm', match1to2, match2 );
	addParseToken( ['m', 'mm'], MINUTE );

	// MOMENTS

	var getSetMinute = makeGetSet( 'Minutes', false );

	addFormatToken( 's', ['ss', 2], 0, 'second' );

	// ALIASES

	addUnitAlias( 'second', 's' );

	// PARSING

	addRegexToken( 's', match1to2 );
	addRegexToken( 'ss', match1to2, match2 );
	addParseToken( ['s', 'ss'], SECOND );

	// MOMENTS

	var getSetSecond = makeGetSet( 'Seconds', false );

	addFormatToken( 'S', 0, 0, function() {
		return ~~( this.millisecond() / 100 );
	} );

	addFormatToken( 0, ['SS', 2], 0, function() {
		return ~~( this.millisecond() / 10 );
	} );

	function millisecond__milliseconds( token ) {
		addFormatToken( 0, [token, 3], 0, 'millisecond' );
	}

	millisecond__milliseconds( 'SSS' );
	millisecond__milliseconds( 'SSSS' );

	// ALIASES

	addUnitAlias( 'millisecond', 'ms' );

	// PARSING

	addRegexToken( 'S', match1to3, match1 );
	addRegexToken( 'SS', match1to3, match2 );
	addRegexToken( 'SSS', match1to3, match3 );
	addRegexToken( 'SSSS', matchUnsigned );
	addParseToken( ['S', 'SS', 'SSS', 'SSSS'], function( input, array ) {
		array[MILLISECOND] = toInt(( '0.' + input ) * 1000 );
	} );

	// MOMENTS

	var getSetMillisecond = makeGetSet( 'Milliseconds', false );

	addFormatToken( 'z', 0, 0, 'zoneAbbr' );
	addFormatToken( 'zz', 0, 0, 'zoneName' );

	// MOMENTS

	function getZoneAbbr() {
		return this._isUTC ? 'UTC' : '';
	}

	function getZoneName() {
		return this._isUTC ? 'Coordinated Universal Time' : '';
	}

	var momentPrototype__proto = Moment.prototype;

	momentPrototype__proto.add = add_subtract__add;
	momentPrototype__proto.calendar = moment_calendar__calendar;
	momentPrototype__proto.clone = clone;
	momentPrototype__proto.diff = diff;
	momentPrototype__proto.endOf = endOf;
	momentPrototype__proto.format = format;
	momentPrototype__proto.from = from;
	momentPrototype__proto.fromNow = fromNow;
	momentPrototype__proto.to = to;
	momentPrototype__proto.toNow = toNow;
	momentPrototype__proto.get = getSet;
	momentPrototype__proto.invalidAt = invalidAt;
	momentPrototype__proto.isAfter = isAfter;
	momentPrototype__proto.isBefore = isBefore;
	momentPrototype__proto.isBetween = isBetween;
	momentPrototype__proto.isSame = isSame;
	momentPrototype__proto.isValid = moment_valid__isValid;
	momentPrototype__proto.lang = lang;
	momentPrototype__proto.locale = locale;
	momentPrototype__proto.localeData = localeData;
	momentPrototype__proto.max = prototypeMax;
	momentPrototype__proto.min = prototypeMin;
	momentPrototype__proto.parsingFlags = parsingFlags;
	momentPrototype__proto.set = getSet;
	momentPrototype__proto.startOf = startOf;
	momentPrototype__proto.subtract = add_subtract__subtract;
	momentPrototype__proto.toArray = toArray;
	momentPrototype__proto.toDate = toDate;
	momentPrototype__proto.toISOString = moment_format__toISOString;
	momentPrototype__proto.toJSON = moment_format__toISOString;
	momentPrototype__proto.toString = toString;
	momentPrototype__proto.unix = unix;
	momentPrototype__proto.valueOf = to_type__valueOf;

	// Year
	momentPrototype__proto.year = getSetYear;
	momentPrototype__proto.isLeapYear = getIsLeapYear;

	// Week Year
	momentPrototype__proto.weekYear = getSetWeekYear;
	momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

	// Quarter
	momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

	// Month
	momentPrototype__proto.month = getSetMonth;
	momentPrototype__proto.daysInMonth = getDaysInMonth;

	// Week
	momentPrototype__proto.week = momentPrototype__proto.weeks = getSetWeek;
	momentPrototype__proto.isoWeek = momentPrototype__proto.isoWeeks = getSetISOWeek;
	momentPrototype__proto.weeksInYear = getWeeksInYear;
	momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

	// Day
	momentPrototype__proto.date = getSetDayOfMonth;
	momentPrototype__proto.day = momentPrototype__proto.days = getSetDayOfWeek;
	momentPrototype__proto.weekday = getSetLocaleDayOfWeek;
	momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
	momentPrototype__proto.dayOfYear = getSetDayOfYear;

	// Hour
	momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

	// Minute
	momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

	// Second
	momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

	// Millisecond
	momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

	// Offset
	momentPrototype__proto.utcOffset = getSetOffset;
	momentPrototype__proto.utc = setOffsetToUTC;
	momentPrototype__proto.local = setOffsetToLocal;
	momentPrototype__proto.parseZone = setOffsetToParsedOffset;
	momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
	momentPrototype__proto.isDST = isDaylightSavingTime;
	momentPrototype__proto.isDSTShifted = isDaylightSavingTimeShifted;
	momentPrototype__proto.isLocal = isLocal;
	momentPrototype__proto.isUtcOffset = isUtcOffset;
	momentPrototype__proto.isUtc = isUtc;
	momentPrototype__proto.isUTC = isUtc;

	// Timezone
	momentPrototype__proto.zoneAbbr = getZoneAbbr;
	momentPrototype__proto.zoneName = getZoneName;

	// Deprecations
	momentPrototype__proto.dates = deprecate( 'dates accessor is deprecated. Use date instead.', getSetDayOfMonth );
	momentPrototype__proto.months = deprecate( 'months accessor is deprecated. Use month instead', getSetMonth );
	momentPrototype__proto.years = deprecate( 'years accessor is deprecated. Use year instead', getSetYear );
	momentPrototype__proto.zone = deprecate( 'moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone );

	var momentPrototype = momentPrototype__proto;

	function moment__createUnix( input ) {
		return local__createLocal( input * 1000 );
	}

	function moment__createInZone() {
		return local__createLocal.apply( null, arguments ).parseZone();
	}

	var defaultCalendar = {
		sameDay: '[Today at] LT',
		nextDay: '[Tomorrow at] LT',
		nextWeek: 'dddd [at] LT',
		lastDay: '[Yesterday at] LT',
		lastWeek: '[Last] dddd [at] LT',
		sameElse: 'L'
	};

	function locale_calendar__calendar( key, mom, now ) {
		var output = this._calendar[key];
		return typeof output === 'function' ? output.call( mom, now ) : output;
	}

	var defaultLongDateFormat = {
		LTS: 'h:mm:ss A',
		LT: 'h:mm A',
		L: 'MM/DD/YYYY',
		LL: 'MMMM D, YYYY',
		LLL: 'MMMM D, YYYY LT',
		LLLL: 'dddd, MMMM D, YYYY LT'
	};

	function longDateFormat( key ) {
		var output = this._longDateFormat[key];
		if ( !output && this._longDateFormat[key.toUpperCase()] ) {
			output = this._longDateFormat[key.toUpperCase()].replace( /MMMM|MM|DD|dddd/g, function( val ) {
				return val.slice( 1 );
			} );
			this._longDateFormat[key] = output;
		}
		return output;
	}

	var defaultInvalidDate = 'Invalid date';

	function invalidDate() {
		return this._invalidDate;
	}

	var defaultOrdinal = '%d';
	var defaultOrdinalParse = /\d{1,2}/;

	function ordinal( number ) {
		return this._ordinal.replace( '%d', number );
	}

	function preParsePostFormat( string ) {
		return string;
	}

	var defaultRelativeTime = {
		future: 'in %s',
		past: '%s ago',
		s: 'a few seconds',
		m: 'a minute',
		mm: '%d minutes',
		h: 'an hour',
		hh: '%d hours',
		d: 'a day',
		dd: '%d days',
		M: 'a month',
		MM: '%d months',
		y: 'a year',
		yy: '%d years'
	};

	function relative__relativeTime( number, withoutSuffix, string, isFuture ) {
		var output = this._relativeTime[string];
		return ( typeof output === 'function' ) ?
            output( number, withoutSuffix, string, isFuture ) :
            output.replace( /%d/i, number );
	}

	function pastFuture( diff, output ) {
		var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
		return typeof format === 'function' ? format( output ) : format.replace( /%s/i, output );
	}

	function locale_set__set( config ) {
		var prop, i;
		for ( i in config ) {
			prop = config[i];
			if ( typeof prop === 'function' ) {
				this[i] = prop;
			} else {
				this['_' + i] = prop;
			}
		}
		// Lenient ordinal parsing accepts just a number in addition to
		// number + (possibly) stuff coming from _ordinalParseLenient.
		this._ordinalParseLenient = new RegExp( this._ordinalParse.source + '|' + ( /\d{1,2}/ ).source );
	}

	var prototype__proto = Locale.prototype;

	prototype__proto._calendar = defaultCalendar;
	prototype__proto.calendar = locale_calendar__calendar;
	prototype__proto._longDateFormat = defaultLongDateFormat;
	prototype__proto.longDateFormat = longDateFormat;
	prototype__proto._invalidDate = defaultInvalidDate;
	prototype__proto.invalidDate = invalidDate;
	prototype__proto._ordinal = defaultOrdinal;
	prototype__proto.ordinal = ordinal;
	prototype__proto._ordinalParse = defaultOrdinalParse;
	prototype__proto.preparse = preParsePostFormat;
	prototype__proto.postformat = preParsePostFormat;
	prototype__proto._relativeTime = defaultRelativeTime;
	prototype__proto.relativeTime = relative__relativeTime;
	prototype__proto.pastFuture = pastFuture;
	prototype__proto.set = locale_set__set;

	// Month
	prototype__proto.months = localeMonths;
	prototype__proto._months = defaultLocaleMonths;
	prototype__proto.monthsShort = localeMonthsShort;
	prototype__proto._monthsShort = defaultLocaleMonthsShort;
	prototype__proto.monthsParse = localeMonthsParse;

	// Week
	prototype__proto.week = localeWeek;
	prototype__proto._week = defaultLocaleWeek;
	prototype__proto.firstDayOfYear = localeFirstDayOfYear;
	prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

	// Day of Week
	prototype__proto.weekdays = localeWeekdays;
	prototype__proto._weekdays = defaultLocaleWeekdays;
	prototype__proto.weekdaysMin = localeWeekdaysMin;
	prototype__proto._weekdaysMin = defaultLocaleWeekdaysMin;
	prototype__proto.weekdaysShort = localeWeekdaysShort;
	prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
	prototype__proto.weekdaysParse = localeWeekdaysParse;

	// Hours
	prototype__proto.isPM = localeIsPM;
	prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
	prototype__proto.meridiem = localeMeridiem;

	function lists__get( format, index, field, setter ) {
		var locale = locale_locales__getLocale();
		var utc = create_utc__createUTC().set( setter, index );
		return locale[field]( utc, format );
	}

	function list( format, index, field, count, setter ) {
		if ( typeof format === 'number' ) {
			index = format;
			format = undefined;
		}

		format = format || '';

		if ( index != null ) {
			return lists__get( format, index, field, setter );
		}

		var i;
		var out = [];
		for ( i = 0; i < count; i++ ) {
			out[i] = lists__get( format, i, field, setter );
		}
		return out;
	}

	function lists__listMonths( format, index ) {
		return list( format, index, 'months', 12, 'month' );
	}

	function lists__listMonthsShort( format, index ) {
		return list( format, index, 'monthsShort', 12, 'month' );
	}

	function lists__listWeekdays( format, index ) {
		return list( format, index, 'weekdays', 7, 'day' );
	}

	function lists__listWeekdaysShort( format, index ) {
		return list( format, index, 'weekdaysShort', 7, 'day' );
	}

	function lists__listWeekdaysMin( format, index ) {
		return list( format, index, 'weekdaysMin', 7, 'day' );
	}

	locale_locales__getSetGlobalLocale( 'en', {
		ordinalParse: /\d{1,2}(th|st|nd|rd)/,
		ordinal: function( number ) {
			var b = number % 10,
                output = ( toInt( number % 100 / 10 ) === 1 ) ? 'th' :
                ( b === 1 ) ? 'st' :
                ( b === 2 ) ? 'nd' :
                ( b === 3 ) ? 'rd' : 'th';
			return number + output;
		}
	} );

	// Side effect imports
	utils_hooks__hooks.lang = deprecate( 'moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale );
	utils_hooks__hooks.langData = deprecate( 'moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale );

	var mathAbs = Math.abs;

	function duration_abs__abs() {
		var data = this._data;

		this._milliseconds = mathAbs( this._milliseconds );
		this._days = mathAbs( this._days );
		this._months = mathAbs( this._months );

		data.milliseconds = mathAbs( data.milliseconds );
		data.seconds = mathAbs( data.seconds );
		data.minutes = mathAbs( data.minutes );
		data.hours = mathAbs( data.hours );
		data.months = mathAbs( data.months );
		data.years = mathAbs( data.years );

		return this;
	}

	function duration_add_subtract__addSubtract( duration, input, value, direction ) {
		var other = create__createDuration( input, value );

		duration._milliseconds += direction * other._milliseconds;
		duration._days += direction * other._days;
		duration._months += direction * other._months;

		return duration._bubble();
	}

	// supports only 2.0-style add(1, 's') or add(duration)
	function duration_add_subtract__add( input, value ) {
		return duration_add_subtract__addSubtract( this, input, value, 1 );
	}

	// supports only 2.0-style subtract(1, 's') or subtract(duration)
	function duration_add_subtract__subtract( input, value ) {
		return duration_add_subtract__addSubtract( this, input, value, -1 );
	}

	function bubble() {
		var milliseconds = this._milliseconds;
		var days = this._days;
		var months = this._months;
		var data = this._data;
		var seconds, minutes, hours, years = 0;

		// The following code bubbles up values, see the tests for
		// examples of what that means.
		data.milliseconds = milliseconds % 1000;

		seconds = absFloor( milliseconds / 1000 );
		data.seconds = seconds % 60;

		minutes = absFloor( seconds / 60 );
		data.minutes = minutes % 60;

		hours = absFloor( minutes / 60 );
		data.hours = hours % 24;

		days += absFloor( hours / 24 );

		// Accurately convert days to years, assume start from year 0.
		years = absFloor( daysToYears( days ) );
		days -= absFloor( yearsToDays( years ) );

		// 30 days to a month
		// TODO (iskren): Use anchor date (like 1st Jan) to compute this.
		months += absFloor( days / 30 );
		days %= 30;

		// 12 months -> 1 year
		years += absFloor( months / 12 );
		months %= 12;

		data.days = days;
		data.months = months;
		data.years = years;

		return this;
	}

	function daysToYears( days ) {
		// 400 years have 146097 days (taking into account leap year rules)
		return days * 400 / 146097;
	}

	function yearsToDays( years ) {
		// years * 365 + absFloor(years / 4) -
		//     absFloor(years / 100) + absFloor(years / 400);
		return years * 146097 / 400;
	}

	function as( units ) {
		var days;
		var months;
		var milliseconds = this._milliseconds;

		units = normalizeUnits( units );

		if ( units === 'month' || units === 'year' ) {
			days = this._days + milliseconds / 864e5;
			months = this._months + daysToYears( days ) * 12;
			return units === 'month' ? months : months / 12;
		} else {
			// handle milliseconds separately because of floating point math errors (issue #1867)
			days = this._days + Math.round( yearsToDays( this._months / 12 ) );
			switch ( units ) {
				case 'week': return days / 7 + milliseconds / 6048e5;
				case 'day': return days + milliseconds / 864e5;
				case 'hour': return days * 24 + milliseconds / 36e5;
				case 'minute': return days * 1440 + milliseconds / 6e4;
				case 'second': return days * 86400 + milliseconds / 1000;
					// Math.floor prevents floating point math errors here
				case 'millisecond': return Math.floor( days * 864e5 ) + milliseconds;
				default: throw new Error( 'Unknown unit ' + units );
			}
		}
	}

	// TODO: Use this.as('ms')?
	function duration_as__valueOf() {
		return (
            this._milliseconds +
            this._days * 864e5 +
            ( this._months % 12 ) * 2592e6 +
            toInt( this._months / 12 ) * 31536e6
        );
	}

	function makeAs( alias ) {
		return function() {
			return this.as( alias );
		};
	}

	var asMilliseconds = makeAs( 'ms' );
	var asSeconds = makeAs( 's' );
	var asMinutes = makeAs( 'm' );
	var asHours = makeAs( 'h' );
	var asDays = makeAs( 'd' );
	var asWeeks = makeAs( 'w' );
	var asMonths = makeAs( 'M' );
	var asYears = makeAs( 'y' );

	function duration_get__get( units ) {
		units = normalizeUnits( units );
		return this[units + 's']();
	}

	function makeGetter( name ) {
		return function() {
			return this._data[name];
		};
	}

	var duration_get__milliseconds = makeGetter( 'milliseconds' );
	var seconds = makeGetter( 'seconds' );
	var minutes = makeGetter( 'minutes' );
	var hours = makeGetter( 'hours' );
	var days = makeGetter( 'days' );
	var months = makeGetter( 'months' );
	var years = makeGetter( 'years' );

	function weeks() {
		return absFloor( this.days() / 7 );
	}

	var round = Math.round;
	var thresholds = {
		s: 45,  // seconds to minute
		m: 45,  // minutes to hour
		h: 22,  // hours to day
		d: 26,  // days to month
		M: 11   // months to year
	};

	// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
	function substituteTimeAgo( string, number, withoutSuffix, isFuture, locale ) {
		return locale.relativeTime( number || 1, !!withoutSuffix, string, isFuture );
	}

	function duration_humanize__relativeTime( posNegDuration, withoutSuffix, locale ) {
		var duration = create__createDuration( posNegDuration ).abs();
		var seconds = round( duration.as( 's' ) );
		var minutes = round( duration.as( 'm' ) );
		var hours = round( duration.as( 'h' ) );
		var days = round( duration.as( 'd' ) );
		var months = round( duration.as( 'M' ) );
		var years = round( duration.as( 'y' ) );

		var a = seconds < thresholds.s && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < thresholds.h && ['hh', hours] ||
                days === 1 && ['d'] ||
                days < thresholds.d && ['dd', days] ||
                months === 1 && ['M'] ||
                months < thresholds.M && ['MM', months] ||
                years === 1 && ['y'] || ['yy', years];

		a[2] = withoutSuffix;
		a[3] = +posNegDuration > 0;
		a[4] = locale;
		return substituteTimeAgo.apply( null, a );
	}

	// This function allows you to set a threshold for relative time strings
	function duration_humanize__getSetRelativeTimeThreshold( threshold, limit ) {
		if ( thresholds[threshold] === undefined ) {
			return false;
		}
		if ( limit === undefined ) {
			return thresholds[threshold];
		}
		thresholds[threshold] = limit;
		return true;
	}

	function humanize( withSuffix ) {
		var locale = this.localeData();
		var output = duration_humanize__relativeTime( this, !withSuffix, locale );

		if ( withSuffix ) {
			output = locale.pastFuture( +this, output );
		}

		return locale.postformat( output );
	}

	var iso_string__abs = Math.abs;

	function iso_string__toISOString() {
		// inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
		var Y = iso_string__abs( this.years() );
		var M = iso_string__abs( this.months() );
		var D = iso_string__abs( this.days() );
		var h = iso_string__abs( this.hours() );
		var m = iso_string__abs( this.minutes() );
		var s = iso_string__abs( this.seconds() + this.milliseconds() / 1000 );
		var total = this.asSeconds();

		if ( !total ) {
			// this is the same as C#'s (Noda) and python (isodate)...
			// but not other JS (goog.date)
			return 'P0D';
		}

		return ( total < 0 ? '-' : '' ) +
            'P' +
            ( Y ? Y + 'Y' : '' ) +
            ( M ? M + 'M' : '' ) +
            ( D ? D + 'D' : '' ) +
            ( ( h || m || s ) ? 'T' : '' ) +
            ( h ? h + 'H' : '' ) +
            ( m ? m + 'M' : '' ) +
            ( s ? s + 'S' : '' );
	}

	var duration_prototype__proto = Duration.prototype;

	duration_prototype__proto.abs = duration_abs__abs;
	duration_prototype__proto.add = duration_add_subtract__add;
	duration_prototype__proto.subtract = duration_add_subtract__subtract;
	duration_prototype__proto.as = as;
	duration_prototype__proto.asMilliseconds = asMilliseconds;
	duration_prototype__proto.asSeconds = asSeconds;
	duration_prototype__proto.asMinutes = asMinutes;
	duration_prototype__proto.asHours = asHours;
	duration_prototype__proto.asDays = asDays;
	duration_prototype__proto.asWeeks = asWeeks;
	duration_prototype__proto.asMonths = asMonths;
	duration_prototype__proto.asYears = asYears;
	duration_prototype__proto.valueOf = duration_as__valueOf;
	duration_prototype__proto._bubble = bubble;
	duration_prototype__proto.get = duration_get__get;
	duration_prototype__proto.milliseconds = duration_get__milliseconds;
	duration_prototype__proto.seconds = seconds;
	duration_prototype__proto.minutes = minutes;
	duration_prototype__proto.hours = hours;
	duration_prototype__proto.days = days;
	duration_prototype__proto.weeks = weeks;
	duration_prototype__proto.months = months;
	duration_prototype__proto.years = years;
	duration_prototype__proto.humanize = humanize;
	duration_prototype__proto.toISOString = iso_string__toISOString;
	duration_prototype__proto.toString = iso_string__toISOString;
	duration_prototype__proto.toJSON = iso_string__toISOString;
	duration_prototype__proto.locale = locale;
	duration_prototype__proto.localeData = localeData;

	// Deprecations
	duration_prototype__proto.toIsoString = deprecate( 'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString );
	duration_prototype__proto.lang = lang;

	// Side effect imports

	addFormatToken( 'X', 0, 0, 'unix' );
	addFormatToken( 'x', 0, 0, 'valueOf' );

	// PARSING

	addRegexToken( 'x', matchSigned );
	addRegexToken( 'X', matchTimestamp );
	addParseToken( 'X', function( input, array, config ) {
		config._d = new Date( parseFloat( input, 10 ) * 1000 );
	} );
	addParseToken( 'x', function( input, array, config ) {
		config._d = new Date( toInt( input ) );
	} );

	// Side effect imports


	utils_hooks__hooks.version = '2.10.3';

	setHookCallback( local__createLocal );

	utils_hooks__hooks.fn = momentPrototype;
	utils_hooks__hooks.min = min;
	utils_hooks__hooks.max = max;
	utils_hooks__hooks.utc = create_utc__createUTC;
	utils_hooks__hooks.unix = moment__createUnix;
	utils_hooks__hooks.months = lists__listMonths;
	utils_hooks__hooks.isDate = isDate;
	utils_hooks__hooks.locale = locale_locales__getSetGlobalLocale;
	utils_hooks__hooks.invalid = valid__createInvalid;
	utils_hooks__hooks.duration = create__createDuration;
	utils_hooks__hooks.isMoment = isMoment;
	utils_hooks__hooks.weekdays = lists__listWeekdays;
	utils_hooks__hooks.parseZone = moment__createInZone;
	utils_hooks__hooks.localeData = locale_locales__getLocale;
	utils_hooks__hooks.isDuration = isDuration;
	utils_hooks__hooks.monthsShort = lists__listMonthsShort;
	utils_hooks__hooks.weekdaysMin = lists__listWeekdaysMin;
	utils_hooks__hooks.defineLocale = defineLocale;
	utils_hooks__hooks.weekdaysShort = lists__listWeekdaysShort;
	utils_hooks__hooks.normalizeUnits = normalizeUnits;
	utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

	var _moment = utils_hooks__hooks;

	return _moment;

} ) );
/*jshint ignore:end */
/*!
 * Pikaday
 *
 * Copyright © 2014 David Bushell | BSD & MIT license | https://github.com/dbushell/Pikaday
 */
/* jshint ignore:start */
( function( root, factory ) {
	'use strict';

	var moment;
	if ( typeof exports === 'object' ) {
		// CommonJS module
		// Load moment.js as an optional dependency
		try { moment = require( 'moment' ); } catch ( e ) { }
		module.exports = factory( moment );
	} else if ( typeof define === 'function' && define.amd ) {
		// AMD. Register as an anonymous module.
		define( function( req ) {
			// Load moment.js as an optional dependency
			var id = 'moment';
			try { moment = req( id ); } catch ( e ) { }
			return factory( moment );
		} );
	} else {
		root.Pikaday = factory( root.moment );
	}
}( this, function( moment ) {
	'use strict';

	/**
     * feature detection and helper functions
     */
	var hasMoment = typeof moment === 'function',

    hasEventListeners = !!window.addEventListener,

    document = window.document,

    sto = window.setTimeout,

    addEvent = function( el, e, callback, capture ) {
    	if ( hasEventListeners ) {
    		el.addEventListener( e, callback, !!capture );
    	} else {
    		el.attachEvent( 'on' + e, callback );
    	}
    },

    removeEvent = function( el, e, callback, capture ) {
    	if ( hasEventListeners ) {
    		el.removeEventListener( e, callback, !!capture );
    	} else {
    		el.detachEvent( 'on' + e, callback );
    	}
    },

    fireEvent = function( el, eventName, data ) {
    	var ev;

    	if ( document.createEvent ) {
    		ev = document.createEvent( 'HTMLEvents' );
    		ev.initEvent( eventName, true, false );
    		ev = extend( ev, data );
    		el.dispatchEvent( ev );
    	} else if ( document.createEventObject ) {
    		ev = document.createEventObject();
    		ev = extend( ev, data );
    		el.fireEvent( 'on' + eventName, ev );
    	}
    },

    trim = function( str ) {
    	return str.trim ? str.trim() : str.replace( /^\s+|\s+$/g, '' );
    },

    hasClass = function( el, cn ) {
    	return ( ' ' + el.className + ' ' ).indexOf( ' ' + cn + ' ' ) !== -1;
    },

    addClass = function( el, cn ) {
    	if ( !hasClass( el, cn ) ) {
    		el.className = ( el.className === '' ) ? cn : el.className + ' ' + cn;
    	}
    },

    removeClass = function( el, cn ) {
    	el.className = trim(( ' ' + el.className + ' ' ).replace( ' ' + cn + ' ', ' ' ) );
    },

    isArray = function( obj ) {
    	return ( /Array/ ).test( Object.prototype.toString.call( obj ) );
    },

    isDate = function( obj ) {
    	return ( /Date/ ).test( Object.prototype.toString.call( obj ) ) && !isNaN( obj.getTime() );
    },

    isWeekend = function( date ) {
    	var day = date.getDay();
    	return day === 0 || day === 6;
    },

    isLeapYear = function( year ) {
    	// solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
    	return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    },

    getDaysInMonth = function( year, month ) {
    	return [31, isLeapYear( year ) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },

    setToStartOfDay = function( date ) {
    	if ( isDate( date ) ) date.setHours( 0, 0, 0, 0 );
    },

    compareDates = function( a, b ) {
    	// weak date comparison (use setToStartOfDay(date) to ensure correct result)
    	return a.getTime() === b.getTime();
    },

    extend = function( to, from, overwrite ) {
    	var prop, hasProp;
    	for ( prop in from ) {
    		hasProp = to[prop] !== undefined;
    		if ( hasProp && typeof from[prop] === 'object' && from[prop] !== null && from[prop].nodeName === undefined ) {
    			if ( isDate( from[prop] ) ) {
    				if ( overwrite ) {
    					to[prop] = new Date( from[prop].getTime() );
    				}
    			}
    			else if ( isArray( from[prop] ) ) {
    				if ( overwrite ) {
    					to[prop] = from[prop].slice( 0 );
    				}
    			} else {
    				to[prop] = extend( {}, from[prop], overwrite );
    			}
    		} else if ( overwrite || !hasProp ) {
    			to[prop] = from[prop];
    		}
    	}
    	return to;
    },

    adjustCalendar = function( calendar ) {
    	if ( calendar.month < 0 ) {
    		calendar.year -= Math.ceil( Math.abs( calendar.month ) / 12 );
    		calendar.month += 12;
    	}
    	if ( calendar.month > 11 ) {
    		calendar.year += Math.floor( Math.abs( calendar.month ) / 12 );
    		calendar.month -= 12;
    	}
    	return calendar;
    },

    /**
     * defaults and localisation
     */
    defaults = {

    	// bind the picker to a form field
    	field: null,

    	// automatically show/hide the picker on `field` focus (default `true` if `field` is set)
    	bound: undefined,

    	// position of the datepicker, relative to the field (default to bottom & left)
    	// ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
    	position: 'bottom left',

    	// automatically fit in the viewport even if it means repositioning from the position option
    	reposition: true,

    	// the default output format for `.toString()` and `field` value
    	format: 'YYYY-MM-DD',

    	// the initial date to view when first opened
    	defaultDate: null,

    	// make the `defaultDate` the initial selected value
    	setDefaultDate: false,

    	// first day of week (0: Sunday, 1: Monday etc)
    	firstDay: 0,

    	// the minimum/earliest date that can be selected
    	minDate: null,
    	// the maximum/latest date that can be selected
    	maxDate: null,

    	// number of years either side, or array of upper/lower range
    	yearRange: 10,

    	// show week numbers at head of row
    	showWeekNumber: false,

    	// used internally (don't config outside)
    	minYear: 0,
    	maxYear: 9999,
    	minMonth: undefined,
    	maxMonth: undefined,

    	isRTL: false,

    	// Additional text to append to the year in the calendar title
    	yearSuffix: '',

    	// Render the month after year in the calendar title
    	showMonthAfterYear: false,

    	// how many months are visible
    	numberOfMonths: 1,

    	// when numberOfMonths is used, this will help you to choose where the main calendar will be (default `left`, can be set to `right`)
    	// only used for the first display or when a selected date is not visible
    	mainCalendar: 'left',

    	// Specify a DOM element to render the calendar in
    	container: undefined,

    	// internationalization
    	i18n: {
    		previousMonth: 'Previous Month',
    		nextMonth: 'Next Month',
    		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    		weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    		weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    	},

    	// callback function
    	onSelect: null,
    	onOpen: null,
    	onClose: null,
    	onDraw: null
    },


    /**
     * templating functions to abstract HTML rendering
     */
    renderDayName = function( opts, day, abbr ) {
    	day += opts.firstDay;
    	while ( day >= 7 ) {
    		day -= 7;
    	}
    	return abbr ? opts.i18n.weekdaysShort[day] : opts.i18n.weekdays[day];
    },

    renderDay = function( d, m, y, isSelected, isToday, isDisabled, isEmpty ) {
    	if ( isEmpty ) {
    		return '<td class="is-empty"></td>';
    	}
    	var arr = [];
    	if ( isDisabled ) {
    		arr.push( 'is-disabled' );
    	}
    	if ( isToday ) {
    		arr.push( 'is-today' );
    	}
    	if ( isSelected ) {
    		arr.push( 'is-selected' );
    	}
    	return '<td data-day="' + d + '" class="' + arr.join( ' ' ) + '">' +
                 '<button class="pika-button pika-day" type="button" ' +
                    'data-pika-year="' + y + '" data-pika-month="' + m + '" data-pika-day="' + d + '">' +
                        d +
                 '</button>' +
               '</td>';
    },

    renderWeek = function( d, m, y ) {
    	// Lifted from http://javascript.about.com/library/blweekyear.htm, lightly modified.
    	var onejan = new Date( y, 0, 1 ),
            weekNum = Math.ceil(( ( ( new Date( y, m, d ) - onejan ) / 86400000 ) + onejan.getDay() + 1 ) / 7 );
    	return '<td class="pika-week">' + weekNum + '</td>';
    },

    renderRow = function( days, isRTL ) {
    	return '<tr>' + ( isRTL ? days.reverse() : days ).join( '' ) + '</tr>';
    },

    renderBody = function( rows ) {
    	return '<tbody>' + rows.join( '' ) + '</tbody>';
    },

    renderHead = function( opts ) {
    	var i, arr = [];
    	if ( opts.showWeekNumber ) {
    		arr.push( '<th></th>' );
    	}
    	for ( i = 0; i < 7; i++ ) {
    		arr.push( '<th scope="col"><abbr title="' + renderDayName( opts, i ) + '">' + renderDayName( opts, i, true ) + '</abbr></th>' );
    	}
    	return '<thead>' + ( opts.isRTL ? arr.reverse() : arr ).join( '' ) + '</thead>';
    },

    renderTitle = function( instance, c, year, month, refYear ) {
    	var i, j, arr,
            opts = instance._o,
            isMinYear = year === opts.minYear,
            isMaxYear = year === opts.maxYear,
            html = '<div class="pika-title">',
            monthHtml,
            yearHtml,
            prev = true,
            next = true;

    	for ( arr = [], i = 0; i < 12; i++ ) {
    		arr.push( '<option value="' + ( year === refYear ? i - c : 12 + i - c ) + '"' +
                ( i === month ? ' selected' : '' ) +
                ( ( isMinYear && i < opts.minMonth ) || ( isMaxYear && i > opts.maxMonth ) ? 'disabled' : '' ) + '>' +
                opts.i18n.months[i] + '</option>' );
    	}
    	monthHtml = '<div class="pika-label">' + opts.i18n.months[month] + '<select class="pika-select pika-select-month">' + arr.join( '' ) + '</select></div>';

    	if ( isArray( opts.yearRange ) ) {
    		i = opts.yearRange[0];
    		j = opts.yearRange[1] + 1;
    	} else {
    		i = year - opts.yearRange;
    		j = 1 + year + opts.yearRange;
    	}

    	for ( arr = []; i < j && i <= opts.maxYear; i++ ) {
    		if ( i >= opts.minYear ) {
    			arr.push( '<option value="' + i + '"' + ( i === year ? ' selected' : '' ) + '>' + ( i ) + '</option>' );
    		}
    	}
    	yearHtml = '<div class="pika-label">' + year + opts.yearSuffix + '<select class="pika-select pika-select-year">' + arr.join( '' ) + '</select></div>';

    	if ( opts.showMonthAfterYear ) {
    		html += yearHtml + monthHtml;
    	} else {
    		html += monthHtml + yearHtml;
    	}

    	if ( isMinYear && ( month === 0 || opts.minMonth >= month ) ) {
    		prev = false;
    	}

    	if ( isMaxYear && ( month === 11 || opts.maxMonth <= month ) ) {
    		next = false;
    	}

    	if ( c === 0 ) {
    		html += '<button class="pika-prev' + ( prev ? '' : ' is-disabled' ) + '" type="button">' + opts.i18n.previousMonth + '</button>';
    	}
    	if ( c === ( instance._o.numberOfMonths - 1 ) ) {
    		html += '<button class="pika-next' + ( next ? '' : ' is-disabled' ) + '" type="button">' + opts.i18n.nextMonth + '</button>';
    	}

    	return html += '</div>';
    },

    renderTable = function( opts, data ) {
    	return '<table cellpadding="0" cellspacing="0" class="pika-table">' + renderHead( opts ) + renderBody( data ) + '</table>';
    },


    /**
     * Pikaday constructor
     */
    Pikaday = function( options ) {
    	var self = this,
            opts = self.config( options );

    	self._onMouseDown = function( e ) {
    		if ( !self._v ) {
    			return;
    		}
    		e = e || window.event;
    		var target = e.target || e.srcElement;
    		if ( !target ) {
    			return;
    		}

    		if ( !hasClass( target, 'is-disabled' ) ) {
    			if ( hasClass( target, 'pika-button' ) && !hasClass( target, 'is-empty' ) ) {
    				self.setDate( new Date( target.getAttribute( 'data-pika-year' ), target.getAttribute( 'data-pika-month' ), target.getAttribute( 'data-pika-day' ) ) );
    				if ( opts.bound ) {
    					sto( function() {
    						self.hide();
    						if ( opts.field ) {
    							opts.field.blur();
    						}
    					}, 100 );
    				}
    				return;
    			}
    			else if ( hasClass( target, 'pika-prev' ) ) {
    				self.prevMonth();
    			}
    			else if ( hasClass( target, 'pika-next' ) ) {
    				self.nextMonth();
    			}
    		}
    		if ( !hasClass( target, 'pika-select' ) ) {
    			if ( e.preventDefault ) {
    				e.preventDefault();
    			} else {
    				e.returnValue = false;
    				return false;
    			}
    		} else {
    			self._c = true;
    		}
    	};

    	self._onChange = function( e ) {
    		e = e || window.event;
    		var target = e.target || e.srcElement;
    		if ( !target ) {
    			return;
    		}
    		if ( hasClass( target, 'pika-select-month' ) ) {
    			self.gotoMonth( target.value );
    		}
    		else if ( hasClass( target, 'pika-select-year' ) ) {
    			self.gotoYear( target.value );
    		}
    	};

    	self._onInputChange = function( e ) {
    		var date;

    		if ( e.firedBy === self ) {
    			return;
    		}
    		if ( hasMoment ) {
    			date = moment( opts.field.value, opts.format );
    			date = ( date && date.isValid() ) ? date.toDate() : null;
    		}
    		else {
    			date = new Date( Date.parse( opts.field.value ) );
    		}
    		self.setDate( isDate( date ) ? date : null );
    		if ( !self._v ) {
    			self.show();
    		}
    	};

    	self._onInputFocus = function() {
    		self.show();
    	};

    	self._onInputClick = function() {
    		self.show();
    	};

    	self._onInputBlur = function() {
    		// IE allows pika div to gain focus; catch blur the input field
    		var pEl = document.activeElement;
    		do {
    			if ( hasClass( pEl, 'pika-single' ) ) {
    				return;
    			}
    		}
    		while ( ( pEl = pEl.parentNode ) );

    		if ( !self._c ) {
    			self._b = sto( function() {
    				self.hide();
    			}, 50 );
    		}
    		self._c = false;
    	};

    	self._onClick = function( e ) {
    		e = e || window.event;
    		var target = e.target || e.srcElement,
                pEl = target;
    		if ( !target ) {
    			return;
    		}
    		if ( !hasEventListeners && hasClass( target, 'pika-select' ) ) {
    			if ( !target.onchange ) {
    				target.setAttribute( 'onchange', 'return;' );
    				addEvent( target, 'change', self._onChange );
    			}
    		}
    		do {
    			if ( hasClass( pEl, 'pika-single' ) || pEl === opts.trigger ) {
    				return;
    			}
    		}
    		while ( ( pEl = pEl.parentNode ) );
    		if ( self._v && target !== opts.trigger && pEl !== opts.trigger ) {
    			self.hide();
    		}
    	};

    	self.el = document.createElement( 'div' );
    	self.el.className = 'pika-single' + ( opts.isRTL ? ' is-rtl' : '' );

    	addEvent( self.el, 'mousedown', self._onMouseDown, true );
    	addEvent( self.el, 'change', self._onChange );

    	if ( opts.field ) {
    		if ( opts.container ) {
    			opts.container.appendChild( self.el );
    		} else if ( opts.bound ) {
    			document.body.appendChild( self.el );
    		} else {
    			opts.field.parentNode.insertBefore( self.el, opts.field.nextSibling );
    		}
    		addEvent( opts.field, 'change', self._onInputChange );

    		if ( !opts.defaultDate ) {
    			if ( hasMoment && opts.field.value ) {
    				opts.defaultDate = moment( opts.field.value, opts.format ).toDate();
    			} else {
    				opts.defaultDate = new Date( Date.parse( opts.field.value ) );
    			}
    			opts.setDefaultDate = true;
    		}
    	}

    	var defDate = opts.defaultDate;

    	if ( isDate( defDate ) ) {
    		if ( opts.setDefaultDate ) {
    			self.setDate( defDate, true );
    		} else {
    			self.gotoDate( defDate );
    		}
    	} else {
    		self.gotoDate( new Date() );
    	}

    	if ( opts.bound ) {
    		this.hide();
    		self.el.className += ' is-bound';
    		addEvent( opts.trigger, 'click', self._onInputClick );
    		addEvent( opts.trigger, 'focus', self._onInputFocus );
    		addEvent( opts.trigger, 'blur', self._onInputBlur );
    	} else {
    		this.show();
    	}
    };


	/**
     * public Pikaday API
     */
	Pikaday.prototype = {


		/**
         * configure functionality
         */
		config: function( options ) {
			if ( !this._o ) {
				this._o = extend( {}, defaults, true );
			}

			var opts = extend( this._o, options, true );

			opts.isRTL = !!opts.isRTL;

			opts.field = ( opts.field && opts.field.nodeName ) ? opts.field : null;

			opts.bound = !!( opts.bound !== undefined ? opts.field && opts.bound : opts.field );

			opts.trigger = ( opts.trigger && opts.trigger.nodeName ) ? opts.trigger : opts.field;

			opts.disableWeekends = !!opts.disableWeekends;

			opts.disableDayFn = ( typeof opts.disableDayFn ) == "function" ? opts.disableDayFn : null;

			var nom = parseInt( opts.numberOfMonths, 10 ) || 1;
			opts.numberOfMonths = nom > 4 ? 4 : nom;

			if ( !isDate( opts.minDate ) ) {
				opts.minDate = false;
			}
			if ( !isDate( opts.maxDate ) ) {
				opts.maxDate = false;
			}
			if ( ( opts.minDate && opts.maxDate ) && opts.maxDate < opts.minDate ) {
				opts.maxDate = opts.minDate = false;
			}
			if ( opts.minDate ) {
				setToStartOfDay( opts.minDate );
				opts.minYear = opts.minDate.getFullYear();
				opts.minMonth = opts.minDate.getMonth();
			}
			if ( opts.maxDate ) {
				setToStartOfDay( opts.maxDate );
				opts.maxYear = opts.maxDate.getFullYear();
				opts.maxMonth = opts.maxDate.getMonth();
			}

			if ( isArray( opts.yearRange ) ) {
				var fallback = new Date().getFullYear() - 10;
				opts.yearRange[0] = parseInt( opts.yearRange[0], 10 ) || fallback;
				opts.yearRange[1] = parseInt( opts.yearRange[1], 10 ) || fallback;
			} else {
				opts.yearRange = Math.abs( parseInt( opts.yearRange, 10 ) ) || defaults.yearRange;
				if ( opts.yearRange > 100 ) {
					opts.yearRange = 100;
				}
			}

			return opts;
		},

		/**
         * return a formatted string of the current selection (using Moment.js if available)
         */
		toString: function( format ) {
			return !isDate( this._d ) ? '' : hasMoment ? moment( this._d ).format( format || this._o.format ) : this._d.toDateString();
		},

		/**
         * return a Moment.js object of the current selection (if available)
         */
		getMoment: function() {
			return hasMoment ? moment( this._d ) : null;
		},

		/**
         * set the current selection from a Moment.js object (if available)
         */
		setMoment: function( date, preventOnSelect ) {
			if ( hasMoment && moment.isMoment( date ) ) {
				this.setDate( date.toDate(), preventOnSelect );
			}
		},

		/**
         * return a Date object of the current selection
         */
		getDate: function() {
			return isDate( this._d ) ? new Date( this._d.getTime() ) : null;
		},

		/**
         * set the current selection
         */
		setDate: function( date, preventOnSelect ) {
			if ( !date ) {
				this._d = null;

				if ( this._o.field ) {
					this._o.field.value = '';
					fireEvent( this._o.field, 'change', { firedBy: this } );
				}

				return this.draw();
			}
			if ( typeof date === 'string' ) {
				date = new Date( Date.parse( date ) );
			}
			if ( !isDate( date ) ) {
				return;
			}

			var min = this._o.minDate,
                max = this._o.maxDate;

			if ( isDate( min ) && date < min ) {
				date = min;
			} else if ( isDate( max ) && date > max ) {
				date = max;
			}

			this._d = new Date( date.getTime() );
			setToStartOfDay( this._d );
			this.gotoDate( this._d );

			if ( this._o.field ) {
				this._o.field.value = this.toString();
				fireEvent( this._o.field, 'change', { firedBy: this } );
			}
			if ( !preventOnSelect && typeof this._o.onSelect === 'function' ) {
				this._o.onSelect.call( this, this.getDate() );
			}
		},

		/**
         * change view to a specific date
         */
		gotoDate: function( date ) {
			var newCalendar = true;

			if ( !isDate( date ) ) {
				return;
			}

			if ( this.calendars ) {
				var firstVisibleDate = new Date( this.calendars[0].year, this.calendars[0].month, 1 ),
                    lastVisibleDate = new Date( this.calendars[this.calendars.length - 1].year, this.calendars[this.calendars.length - 1].month, 1 ),
                    visibleDate = date.getTime();
				// get the end of the month
				lastVisibleDate.setMonth( lastVisibleDate.getMonth() + 1 );
				lastVisibleDate.setDate( lastVisibleDate.getDate() - 1 );
				newCalendar = ( visibleDate < firstVisibleDate.getTime() || lastVisibleDate.getTime() < visibleDate );
			}

			if ( newCalendar ) {
				this.calendars = [{
					month: date.getMonth(),
					year: date.getFullYear()
				}];
				if ( this._o.mainCalendar === 'right' ) {
					this.calendars[0].month += 1 - this._o.numberOfMonths;
				}
			}

			this.adjustCalendars();
		},

		adjustCalendars: function() {
			this.calendars[0] = adjustCalendar( this.calendars[0] );
			for ( var c = 1; c < this._o.numberOfMonths; c++ ) {
				this.calendars[c] = adjustCalendar( {
					month: this.calendars[0].month + c,
					year: this.calendars[0].year
				} );
			}
			this.draw();
		},

		gotoToday: function() {
			this.gotoDate( new Date() );
		},

		/**
         * change view to a specific month (zero-index, e.g. 0: January)
         */
		gotoMonth: function( month ) {
			if ( !isNaN( month ) ) {
				this.calendars[0].month = parseInt( month, 10 );
				this.adjustCalendars();
			}
		},

		nextMonth: function() {
			this.calendars[0].month++;
			this.adjustCalendars();
		},

		prevMonth: function() {
			this.calendars[0].month--;
			this.adjustCalendars();
		},

		/**
         * change view to a specific full year (e.g. "2012")
         */
		gotoYear: function( year ) {
			if ( !isNaN( year ) ) {
				this.calendars[0].year = parseInt( year, 10 );
				this.adjustCalendars();
			}
		},

		/**
         * change the minDate
         */
		setMinDate: function( value ) {
			this._o.minDate = value;
		},

		/**
         * change the maxDate
         */
		setMaxDate: function( value ) {
			this._o.maxDate = value;
		},

		/**
         * refresh the HTML
         */
		draw: function( force ) {
			if ( !this._v && !force ) {
				return;
			}
			var opts = this._o,
                minYear = opts.minYear,
                maxYear = opts.maxYear,
                minMonth = opts.minMonth,
                maxMonth = opts.maxMonth,
                html = '';

			if ( this._y <= minYear ) {
				this._y = minYear;
				if ( !isNaN( minMonth ) && this._m < minMonth ) {
					this._m = minMonth;
				}
			}
			if ( this._y >= maxYear ) {
				this._y = maxYear;
				if ( !isNaN( maxMonth ) && this._m > maxMonth ) {
					this._m = maxMonth;
				}
			}

			for ( var c = 0; c < opts.numberOfMonths; c++ ) {
				html += '<div class="pika-lendar">' + renderTitle( this, c, this.calendars[c].year, this.calendars[c].month, this.calendars[0].year ) + this.render( this.calendars[c].year, this.calendars[c].month ) + '</div>';
			}

			this.el.innerHTML = html;

			if ( opts.bound ) {
				if ( opts.field.type !== 'hidden' ) {
					sto( function() {
						opts.trigger.focus();
					}, 1 );
				}
			}

			if ( typeof this._o.onDraw === 'function' ) {
				var self = this;
				sto( function() {
					self._o.onDraw.call( self );
				}, 0 );
			}
		},

		adjustPosition: function() {
			if ( this._o.container ) return;
			var field = this._o.trigger, pEl = field,
            width = this.el.offsetWidth, height = this.el.offsetHeight,
            viewportWidth = window.innerWidth || document.documentElement.clientWidth,
            viewportHeight = window.innerHeight || document.documentElement.clientHeight,
            scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop,
            left, top, clientRect;

			if ( typeof field.getBoundingClientRect === 'function' ) {
				clientRect = field.getBoundingClientRect();
				left = clientRect.left + window.pageXOffset;
				top = clientRect.bottom + window.pageYOffset;
			} else {
				left = pEl.offsetLeft;
				top = pEl.offsetTop + pEl.offsetHeight;
				while ( ( pEl = pEl.offsetParent ) ) {
					left += pEl.offsetLeft;
					top += pEl.offsetTop;
				}
			}

			// default position is bottom & left
			if ( ( this._o.reposition && left + width > viewportWidth ) ||
                (
                    this._o.position.indexOf( 'right' ) > -1 &&
                    left - width + field.offsetWidth > 0
                )
            ) {
				left = left - width + field.offsetWidth;
			}
			if ( ( this._o.reposition && top + height > viewportHeight + scrollTop ) ||
                (
                    this._o.position.indexOf( 'top' ) > -1 &&
                    top - height - field.offsetHeight > 0
                )
            ) {
				top = top - height - field.offsetHeight;
			}

			this.el.style.cssText = [
                'position: absolute',
                'left: ' + left + 'px',
                'top: ' + top + 'px'
			].join( ';' );
		},

		/**
         * render HTML for a particular month
         */
		render: function( year, month ) {
			var opts = this._o,
                now = new Date(),
                days = getDaysInMonth( year, month ),
                before = new Date( year, month, 1 ).getDay(),
                data = [],
                row = [];
			setToStartOfDay( now );
			if ( opts.firstDay > 0 ) {
				before -= opts.firstDay;
				if ( before < 0 ) {
					before += 7;
				}
			}
			var cells = days + before,
                after = cells;
			while ( after > 7 ) {
				after -= 7;
			}
			cells += 7 - after;
			for ( var i = 0, r = 0; i < cells; i++ ) {
				var day = new Date( year, month, 1 + ( i - before ) ),
                    isSelected = isDate( this._d ) ? compareDates( day, this._d ) : false,
                    isToday = compareDates( day, now ),
                    isEmpty = i < before || i >= ( days + before ),
                    isDisabled = ( opts.minDate && day < opts.minDate ) ||
                                 ( opts.maxDate && day > opts.maxDate ) ||
                                 ( opts.disableWeekends && isWeekend( day ) ) ||
                                 ( opts.disableDayFn && opts.disableDayFn( day ) );

				row.push( renderDay( 1 + ( i - before ), month, year, isSelected, isToday, isDisabled, isEmpty ) );

				if ( ++r === 7 ) {
					if ( opts.showWeekNumber ) {
						row.unshift( renderWeek( i - before, month, year ) );
					}
					data.push( renderRow( row, opts.isRTL ) );
					row = [];
					r = 0;
				}
			}
			return renderTable( opts, data );
		},

		isVisible: function() {
			return this._v;
		},

		show: function() {
			if ( !this._v ) {
				removeClass( this.el, 'is-hidden' );
				this._v = true;
				this.draw();
				if ( this._o.bound ) {
					addEvent( document, 'click', this._onClick );
					this.adjustPosition();
				}
				if ( typeof this._o.onOpen === 'function' ) {
					this._o.onOpen.call( this );
				}
			}
		},

		hide: function() {
			var v = this._v;
			if ( v !== false ) {
				if ( this._o.bound ) {
					removeEvent( document, 'click', this._onClick );
				}
				this.el.style.cssText = '';
				addClass( this.el, 'is-hidden' );
				this._v = false;
				if ( v !== undefined && typeof this._o.onClose === 'function' ) {
					this._o.onClose.call( this );
				}
			}
		},

		/**
         * GAME OVER
         */
		destroy: function() {
			this.hide();
			removeEvent( this.el, 'mousedown', this._onMouseDown, true );
			removeEvent( this.el, 'change', this._onChange );
			if ( this._o.field ) {
				removeEvent( this._o.field, 'change', this._onInputChange );
				if ( this._o.bound ) {
					removeEvent( this._o.trigger, 'click', this._onInputClick );
					removeEvent( this._o.trigger, 'focus', this._onInputFocus );
					removeEvent( this._o.trigger, 'blur', this._onInputBlur );
				}
			}
			if ( this.el.parentNode ) {
				this.el.parentNode.removeChild( this.el );
			}
		}

	};

	return Pikaday;

} ) );
/*jshint ignore:end */
///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
var app = {};
///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
 app.ajax = (function( doc ) {

    // global ajax function
    function ajax( wsUrl, wsData, callSuccess, callFailure, async ) {
        try {
            // XMLHttpRequest object
            // Supports IE9
            var request = window.XMLHttpRequest ? new window.XMLHttpRequest() : new window.ActiveXObject( 'MSXML2.XMLHTTP.3.0' );

            // Open using POST call to wsUrl and boolean async
            request.open( 'POST', wsUrl, async );

            // Set the content-type header to expect JSON
            request.setRequestHeader( 'Content-Type', 'application/json; charset=utf-8' );

            // Onload of request
            request.onload = function() {
                // if the request was successful, call the success callback function
                if ( request.status >= 200 && request.status < 400 ) {
                    callSuccess( JSON.parse( request.responseText ) );
                }

                // If the webservice returned an error, call the error function if it exists
                else {
                    if ( callFailure ) {
                        callFailure();
                    }
                }
            };

            // An error trying to connect to the webservice
            request.onerror = callFailure ? callFailure : function() {};

            // Make sure the data is a JSON string
            if ( typeof wsData !== 'string' ) {
                wsData = JSON.stringify( wsData );
            }

            // Make the request
            request.send( wsData );
        }
        catch( e ) {
            console.log( 'No XHR support.' );
        }
    }

    // shorthand ajax call that assumes 
    //   no failure callback and async = true
    function xhr( wsUrl, wsData, fnSuccess ) {
        return ajax( wsUrl, wsData, fnSuccess, function() {}, true );
    }

    // Ajax with Promise -- NOTE: Not compatible in IE
    //   would be called like:
    //   xhrPromise( '/webservices/ws.asmx/function', { id: 1 } ).then(function( response ) {
    //     console.log( 'Success', response );
    //   }, function( error ) {
    //     console.log( 'Failed.', error );
    //   });
    function xhrPromise( wsUrl, wsData ) {
        return new Promise( function( resolve, reject ) {
            ajax( wsUrl, wsData, resolve, reject, true );
        });
    }

 	// fetch
    function ajaxFetch( url, data ) {
    	// Make sure the data is a JSON string
    	if ( typeof data !== 'string' && data !== {} ) {
    		data = JSON.stringify( data );
    	}

    	return fetch( url, {
    		body: data,
    		headers: {
    			'Accept': 'application/json',
    			'Content-type': 'application/json'
    		},
    		method: 'post'
    	} ).then( function( rsp ) {
    		return rsp.json();
    	} ).then( function( data ) {
    		return data.d;
    	} );
    }

    return {
        ajax: ajax,
        xhr: xhr,
        xhrPromise: xhrPromise,
        fetch: ajaxFetch
    };

}( document ) );
///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.alerts = ( function( doc ) {
	'use strict';

	var elHTML = doc.querySelector( 'html' ),
		container, hdr, content, confirm, deny, overlay;
	
	function loadComponent() {
		var link = doc.createElement( 'link' );
		link.rel = 'import';
		link.href = '/templates/components/alerts/alert.html';

		link.onload = function() {
			var content = link.import,
				el = content.querySelector( '#alert' ),
				elOverlay = content.querySelector( '#alert-overlay' );

			doc.body.appendChild( el.cloneNode( true ) );
			doc.body.appendChild( elOverlay.cloneNode( true ) );

			container = doc.getElementById( 'alert' );
			hdr = doc.getElementById( 'alert-hdr' );
			content = doc.getElementById( 'alert-content' );
			confirm = doc.getElementById( 'alert-confirm' );
			deny = doc.getElementById( 'alert-deny' );
			overlay = doc.getElementById( 'alert-overlay' );
		};

		doc.head.appendChild( link );
	}

	function promptAlert( hdrText, html, confirmText, denyText, fnConfirm, fnDeny ) {
		var cloneConfirm, cloneDeny;
		
		if ( container ) {
			// clone the buttons to remove any previous event listeners
			cloneConfirm = confirm.cloneNode( true );
			cloneDeny = deny.cloneNode( true );

			confirm.parentNode.replaceChild( cloneConfirm, confirm );
			deny.parentNode.replaceChild( cloneDeny, deny );

			confirm = cloneConfirm;
			deny = cloneDeny;

			// add new events for the buttons
			if ( fnConfirm && typeof fnConfirm === 'function' ) {
				confirm.addEventListener( 'click', fnConfirm, false );
			}

			if ( fnDeny && typeof fnDeny === 'function' ) {
				deny.addEventListener( 'click', fnDeny, false );
			}

			setContent( hdrText, html, confirmText, denyText );
			showAlert();
		}
		else {
			console.warn( 'The elements for the alert component are not available.' );
		}
	}

	function setContent( hdrText, html, confirmText, denyText ) {
		hdr.innerHTML = hdrText;
		doc.getElementById( 'alert-content' ).innerHTML = html;
		confirm.innerText = confirmText;
		deny.innerText = denyText;
	}

	function showAlert() {
		elHTML.classList.add( 'alert-visible' );
		overlay.style.height = doc.body.offsetHeight + 'px';
	}

	function closeAlert() {
		elHTML.classList.remove( 'alert-visible' );
		overlay.style.height = '0';
	}

	loadComponent();

	return {
		promptAlert: promptAlert,
		dismissAlert: closeAlert
	};

}( document ) );
///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.container = ( function( doc ) {
	'use strict';

	var drawer = doc.querySelector( '.container-drawer' ),
		drawerOverlay = doc.querySelector( '#container-drawer-overlay' );

	if ( drawer ) {
		window.forEachElement( drawer.querySelectorAll( 'a' ), function( link ) {
			var href = link.href;

			if ( href && doc.URL.toLowerCase() === href.toLowerCase() ) {
				link.classList.add( 'active' );
			}

			link.addEventListener( 'click', function( e ) {
				var active = drawer.querySelector( '.active' );

				if ( active ) {
					active.classList.remove( 'active' );
				}

				if ( href && href.indexOf( '#' ) === -1 ) {
					window.location = href;
				}

				link.classList.add( 'active' );

				if ( doc.body.classList.contains( 'container-drawer-open' ) ) {
					toggleDrawer();
				}

				e.preventDefault();
			}, false );
		} );
	}

	if ( !drawerOverlay && !doc.body.classList.contains( 'nocomponents' ) ) {
		console.warn( 'No container drawer overlay found, added automatically' );

		drawerOverlay = doc.createElement( 'div' );
		drawerOverlay.id = 'container-drawer-overlay';
		doc.body.appendChild( drawerOverlay );
	}

	if ( drawerOverlay ) {
		window.forEachElement( '[drawer-nav-trigger]', function( el ) {
			el.addEventListener( 'click', toggleDrawer, false );
		} );

		drawerOverlay.addEventListener( 'click', toggleDrawer, false );
	}

	function toggleDrawer( e ) {
		doc.body.classList.toggle( 'container-drawer-open' );

		if ( e ) {
			e.preventDefault();
		}
	}

	return {
		toggleDrawer: toggleDrawer
	};

}( document ) );
///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.forms = ( function( doc ) {
	'use strict';

	var inputFields = doc.querySelectorAll( '.input-field' ),
		ranges = doc.querySelectorAll( 'input[type=range]' ),
		
		// keep track of an open select element
		openSelect,

		// TODO: Add regular expressions for validating type=email and type=tel
		//  input fields
		emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
		telRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
		dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

	// Handles text inputs and select elements
	window.forEachElement( inputFields, function( container ) {
		var lbl = container.querySelector( 'label' ),
			input = container.querySelector( 'input' ),
			select, opts;

		// if textarea
		if ( !input ) {
			input = container.querySelector( 'textarea' );
		}

		// if select
		if ( !input ) {
			input = container.querySelector( 'select' );

			if ( input ) {
				input = initSelect( input );
				select = container.querySelector( '.select-opts' );
			}
		}

		// check if date input and if we are on larger screen
		//   if we are on mobile, we'll let the device use the default date picker.
		if ( input && input.classList.contains( 'input-date' ) && window.mq( '(min-width:1025px)' ) ) {
			input.type = 'text';

			var picker = new Pikaday( {
				field: input,
				format: 'MM/DD/YYYY',
				onSelect: function() {
					input.value = this.getMoment().format( 'MM/DD/YYYY' );
				}
			} );
		}
		
		// add events for the labels
		if ( lbl && input ) {
			input.addEventListener( 'focus', function( e ) {
				lbl.classList.add( 'active' );
			}, false );

			if ( select ) {
				input.addEventListener( 'click', function( e ) {
					var overlay;

					select.classList.add( 'active' );
					openSelect = select;

					overlay = doc.createElement( 'div' );
					overlay.id = 'select-pg-overlay';
					doc.body.appendChild( overlay );
				}, false );
			}

			if ( !select ) {
				if ( input.value.length ) {
					lbl.classList.add( 'active' );
				}

				// --------------------------------------------------
				// TODO: this is getting called twice on date fields?
				// --------------------------------------------------
				input.addEventListener( 'blur', function( e ) {
					var val = input.value.trim();
					
					if ( !val.length ) {
						lbl.classList.remove( 'active' );
					}
					
					validateField( input );
				}, false );
			}
		}

		// -------------------------------------------------------------------
		// TODO: Not working on iOS. The overlay is on top of the select list?
		// -------------------------------------------------------------------
		// check for select opts
		if ( select ) {
			opts = select.querySelectorAll( '.select-opt' );
				
			window.forEachElement( opts, function( opt ) {
				opt.addEventListener( 'click', function( e ) {
					var active = select.querySelector( '.active' ),
						val = '';
					
					if ( active && active !== opt && !input.classList.contains( 'multiple' ) ) {
						active.classList.remove( 'active' );
					}
					
					opt.classList.toggle( 'active' );
					
					if ( input.classList.contains( 'multiple' ) ) {
						active = select.querySelectorAll( '.active' );

						window.forEachElement( active, function( a, i ) {
							if ( i > 0 ) {
								val += ', ';
							}

							val += a.innerHTML;
						} );

						input.value = val;
					}
					else if ( opt.classList.contains( 'active' ) ) {
						input.value = opt.innerHTML;
						closeSelect();
					}
					else {
						input.value = '';
						closeSelect();
					}
					
					validateField( input );

					return false;
				}, false );
			} );
		}
	} );

	function initSelect( el ) {
		var container, input, icon, optionList, options = '', label;

		container = el.parentNode;
		container.classList.add( 'input-field-select' );
		
		input = doc.createElement( 'input' );
		input.classList.add( 'input-icon-select' );
		input.id = 'tb-' + el.id;
		input.readOnly = true;
		input.type = 'text';

		for ( var i = 0; i < el.classList.length; i++ ) {
			input.classList.add( el.classList[i] );
		}

		if ( el.getAttribute( 'multiple' ) !== null ) {
			input.classList.add( 'multiple' );
		}
		
		icon = doc.createElement( 'i' );
		icon.classList.add( 'material-icons' );
		icon.classList.add( 'icon-drop-down' );
		icon.innerHTML = 'arrow_drop_down';

		label = container.querySelector( 'label' );

		if ( label ) {
			container.removeChild( label );
			label.setAttribute( 'for', input.id );
		}

		window.forEachElement( el.querySelectorAll( 'option' ), function( opt ) {
			options += '<li><a class="select-opt" href="#" data-val="' + opt.value + '">' + opt.text + '</a></li>';
		} );

		optionList = doc.createElement( 'ul' );
		optionList.innerHTML = options;
		optionList.classList.add( 'select-opts' );

		el.classList.add( 'hidden' );
		container.appendChild( input );
		container.appendChild( label );
		container.appendChild( icon );
		container.appendChild( optionList );

		return input;
	}

	// event to hide select elements
	doc.body.addEventListener( 'click', function( e ) {
		if ( e.target.id === 'select-pg-overlay' ) {
			closeSelect();
			e.preventDefault();
		}
	}, false );

	function closeSelect() {
		var lbl = openSelect.parentNode.querySelector( 'label' ),
			overlay = doc.getElementById( 'select-pg-overlay' );
		
		doc.body.removeChild( overlay );

		openSelect.classList.remove( 'active' );
		validateField( openSelect.parentNode.querySelector( 'input' ) );

		if ( !openSelect.querySelector( '.active' ) && lbl ) {
			lbl.classList.remove( 'active' );
		}

		openSelect = null;
	}

	function checkActiveInputs() {
		window.forEachElement( inputFields, function( container ) {
			var lbl = container.querySelector( 'label' ),
				input = container.querySelector( 'input' );

			if ( !input ) {
				input = container.querySelector( 'textarea' );
			}

			if ( lbl && input && input.value.trim().length ) {
				lbl.classList.add( 'active' );
			}
		} );
	}

	// Handles ranges
	window.forEachElement( ranges, function( range ) {
		var lbl = doc.createElement( 'span' );
		lbl.classList.add( 'range-label' );
		lbl.innerHTML = range.value + ' / ' + range.getAttribute( 'max' );
		range.parentNode.appendChild( lbl );

		range.addEventListener( 'change', function() { setRangeValue( range, lbl ); }, false );
		range.addEventListener( 'input', function() { setRangeValue( range, lbl ); }, false );
	} );

	function setRangeValue( range, lbl ) {
		if ( lbl ) {
			lbl.innerHTML = range.value + ' / ' + range.getAttribute( 'max' );
		}
	}

	function validateField( field ) {
		var valid = true,
			val = field.value.trim(),
			minChars = field.getAttribute( 'min-chars' ),
			prevError = field.parentNode.querySelector( '.error-label' ),
			lbl, msg;
		
		// check for some value in a .req field
		if ( field.classList.contains( 'req' ) && !val.length ) {
			valid = false;
			msg = 'Required field.';
		}

		// check for min characters entered
		else if ( minChars && val.length < minChars ) {
			valid = false;
			msg = minChars + ' characters required.';
		}

		// check for valid email addresses
		else if ( field.type.toLowerCase() === 'email' && !emailRegex.test( val ) ) {
			valid = false;
			msg = 'Invalid email address.';
		}

		// check for valid phone number
		else if ( field.type.toLowerCase() === 'tel' && !telRegex.test( val ) ) {
			valid = false;
			msg = 'Invalid phone number.';
		}

		// check for date
		else if ( field.classList.contains( 'input-date' ) && !dateRegex.test( val ) ) {
			valid = false;
			msg = 'Incorrect date format.';
		}


		// remove any previous error messages
		if ( prevError ) {
			prevError.parentNode.removeChild( prevError );
		}

		// if the field is valid
		if ( valid ) {
			field.classList.remove( 'invalid' );
		}

		// if invalid, make sure it is highlighted
		else {
			field.classList.add( 'invalid' );

			// if we have a msg
			if ( msg ) {
				console.log( 'hi' );
				lbl = doc.createElement( 'span' );
				lbl.classList.add( 'error-label' );
				lbl.innerHTML = msg;
				field.parentNode.appendChild( lbl );
			}
		}
	}

	return {
		checkActive: checkActiveInputs
	};

}( document ) );
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
///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	//if ( 'serviceWorker' in navigator ) {
	//	navigator.serviceWorker.register( '/serviceworker.js' ).then( function( registration ) {
	//		// registration was successful
	//		console.log( 'serviceworker registration successful with scope: ' + registration.scope );
	//
	//	} ).catch( function( err ) {
	//		console.log( 'serviceworker registration failed: ', err );
	//	} );
	//}

}( document ) );
///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.tabs = ( function( doc ) {
	'use strict';

	var tabLinks = doc.querySelectorAll( '.tab-links' );

	window.forEachElement( tabLinks, function( els ) {
		var links = els.querySelectorAll( 'a' ),
			tabGroup = els.getAttribute( 'data-tab-group' );

		if ( links.length !== doc.querySelectorAll( '[data-tab-group="' + tabGroup + '"].tab' ).length ) {
			console.warn( 'Different # of links and tabs for tab group: ' + tabGroup );
		}

		window.forEachElement( links, function( link ) {
			link.addEventListener( 'click', function( e ) {
				var tab = link.getAttribute( 'href' ).toString().substring( 1 );

				window.forEachElement( doc.querySelectorAll( '[data-tab-group="' + tabGroup + '"].tab.active' ), function( el ) {
					el.classList.remove( 'active' );
				} );

				tab = doc.querySelector( '[data-tab-group="' + tabGroup + '"][data-tab="' + tab + '"]' );
				
				if ( !link.classList.contains( 'active' ) ) {
					els.querySelector( '.active' ).classList.remove( 'active' );
				}

				link.classList.add( 'active' );
				tab.classList.add( 'active' );
				
				e.preventDefault();
			}, false );
		} );
	} );

}( document ) );
///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
app.toast = ( function( doc ) {
	'use strict';

	var container, label, btn, hideTimeout,
		defaultHideDuration = 3500,
		callback;

	function loadComponent() {
		var link = doc.createElement( 'link' );
		link.rel = 'import';
		link.href = '/templates/components/toast/toast.html';

		link.onload = function() {
			var content = link.import,
				el = content.querySelector( '#toast' );

			doc.body.appendChild( el.cloneNode( true ) );

			container = doc.getElementById( 'toast' );
			label = container.querySelector( '.toast-label' );
			btn = container.querySelector( '.toast-btn' );
		};

		doc.head.appendChild( link );
	}

	function show( msg, duration, fn ) {
		if ( container ) {
			if ( hideTimeout ) {
				clearTimeout( hideTimeout );
				hideTimeout = null;
			}

			label.innerHTML = msg;

			// if no duration value is passed in, or if 0 is passed in,
			//   hide the toast after the defaultHideDuration
			if ( duration !== -1 && ( !duration || !isNaN( duration ) || duration === 0 ) ) {
				duration = defaultHideDuration;
			}

			// if -1 is passed in, let the toast persist
			if ( duration !== -1 ) {
				hideTimeout = setTimeout( hide, duration );
			}

			if ( fn ) {
				callback = fn;
			}

			container.classList.add( 'active' );
		}
		else {
			console.warn( 'The elements for the toast component are not available.' );
		}
	}

	function hide() {
		container.classList.remove( 'active' );

		if ( callback && typeof callback === 'function' ) {
			callback();
		}
	}

	if ( !doc.body.classList.contains( 'nocomponents' ) ) {
		loadComponent();
	}

	return {
		show: show,
		hide: hide
	};

}( document ) );
///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
 app.util = (function( doc ) {
    'use strict';
        
    // will clone an object, not copying by reference
    function cloneObj( obj ) {
        return JSON.parse( JSON.stringify( obj ) );
    }

    function extend( obj1, obj2 ) {
        var obj = obj1;

        for ( var key in obj2 ) {
            obj[key] = obj2[key];
        }

        return obj;
    }

    function getWindowScrollPosition() {
        if ( typeof window.scrollY === 'undefined' ) {
            return document.documentElement.scrollTop;
        }
        else {
            return window.scrollY;
        }
    }

	// Initiate Fastclick
    if ( 'addEventListener' in doc ) {
    	if ( !window.FastClick ) {
    		console.warn( 'FastClick is not installed.' );
    		return;
    	}

		doc.addEventListener( 'DOMContentLoaded', function() {
    		FastClick.attach( doc.body );
    	}, false );
    }

    return {
        cloneObj: cloneObj,
        extend: extend,
        getWindowScrollPosition: getWindowScrollPosition
    };

}( document ) );
window.requestAnimationFrame = (function() {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
}());