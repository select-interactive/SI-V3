///<reference path="main.js">
/**	
 * SI JavaScript library
 *
 * @author Jeremy Burton - jeremy@select-interactive.com
 * @version 0.1.1
 *
 * @description To provide crossbrowser support for Select Interactive
 *   projects without relying on jQuery.
 *   
 * Featured detection and polyfill for
 *   Promises
 *   Fetch
 * 
 * Targeting features such as:
 *   forEach
 *   .matchMedia support
 *   equal height columns
 *   fetch
 */
( function( window, doc, undefined ) {

	// $ - maps to querySelector to return an element
	// @elements - a node list of elements or selector
	// @contenxt - optional - the parent container of the elements. Defaults to document.
	var $ = function( expr, context ) {
		return typeof expr === 'string' ? ( context || doc ).querySelector( expr ) : expr || null;
	};

	// $$ - maps to querySelectorAll to return a node list of elements
	// @expr - the selector expression to search for
	// @contenxt - optional - the parent container of the elements. Defaults to document.
	var $$ = function( expr, context ) {
		return typeof expr === 'string' ? ( context || doc ).querySelectorAll( expr ) : expr || null;
	};

	// $.addScript - helper function to load scripts
	// @src - String - the source of the script to load
	// @parent - Element - the element that the script should be appended to
	// @async - Boolean - should the script be loaded async
	$.addScript = function( src, parent, async, fn ) {
		var script = doc.createElement( 'script' );
		script.src = src;
		script.async = async;

		if ( fn && typeof fn === 'function' ) {
			script.onload = fn;
		}

		parent.appendChild( script );
	};


	// if we need to polyfill promises
	if ( typeof self.Promise === 'undefined' || !self.Promise ) {
		$.addScript( '/bower_components/es6-promise/promise.min.js', doc.querySelector( 'head' ), true );
	}

	// If we need to polyfill fetch
	if ( typeof self.fetch === 'undefined' || !self.fetch ) {
		$.addScript( '/bower_components/fetch/fetch.min.js', doc.querySelector( 'head' ), true );
	}

	// $.forEach / window.forEachElement = traverses a node list of elements and executes a function over them
	// @elements - a node list of elements or selector
	// @fn - the function to execute over the list of elements
	// @contenxt - optional - the parent container of the elements. Defaults to document.
	$.forEach = function( elements, fn, context ) {
		var i = 0,
            len;

		if ( !elements || typeof elements === 'function' ) {
			console.log( 'elements is not a valid node list.' );
			return;
		}

		if ( typeof elements === 'string' || elements instanceof String ) {
			elements = $$( elements, context );
		}

		len = elements.length;

		for ( ; i < len; i++ ) {
			if ( fn( elements[i], i ) ) {
				break;
			}
		}
	};

	// keep backwards compatibility for forEachElement
	window.forEachElement = $.forEach;

	// $.addEvent - traverses a node list of elements and attaches and event handler to them
	// @elements - a node list of elements or selector 
	// @evt - the event to watch for (i.e. 'click', 'mouseenter')
	// @fn - the function to execute when the event is raised
	// @contenxt - optional - the parent container of the elements. Defaults to document.
	$.addEvent = function( elements, evt, fn, context ) {
		if ( !elements || typeof elements === 'function' ) {
			console.log( 'elements is not a valid node list.' );
			return;
		}

		if ( typeof elements === 'string' || elements instanceof String ) {
			elements = $$( elements, context );
		}

		$.forEach( elements, function( el ) {
			el.addEventListener( evt, function( e ) {
				fn( e, el );
			}, false );
		} );
	};

	// $.findUp - helper function to recursively traverse up the DOM to find a specified element 
	// @startEl - the element that we start at and move up from
	// @selector - the selector of the element we are looking for
	// @attr - optional - the data attribute of the element we may want a value for
	// @endTag - optional - the selector of the end tag to stop at. Defaults to the body tag.
	// @fn - optional - a function to run once the element has been found
	$.findUp = function( startEl, selector, attr, endTag, fn ) {
		var el = startEl,
			rspObj = {};

		if ( !endTag ) {
			endTag = doc.body;
		}

		function moveUp() {
			if ( $.matches( el, selector ) ) {
				rspObj = {
					el: el,
					val: attr && attr.length ? el.getAttribute( attr ) : ''
				};

				if ( fn ) {
					fn( rspObj );
				}

				return rspObj;
			}
			else {
				el = el.parentNode;

				if ( el === endTag || $.matches( el, endTag ) ) {
					return null;
				}
				else {
					return moveUp();
				}
			}
		}

		return moveUp();
	};

	// $.mq - helper function to check for mediaquery
	// @mediaQuery - the mediaquery to test for (i.e. '(min-width:1024px)')
	$.mq = function( mediaQuery ) {
		return !( window.matchMedia ) || ( window.matchMedia && window.matchMedia( mediaQuery ).matches );
	};

	// keep backwards compatibility for mq
	window.mq = $.mq;

	// $.eqHeight - Helper function to set columns to the same height
	// @context - Optional - Element - the parent element to find rows in. Defaults to body.
	$.eqHeight = function( context ) {
		if ( !context || !context.querySelector ) {
			context = doc;
		}

		// if the promise polyfill hasn't loaded for browsers that need it
		if ( typeof self.Promise === 'undefined' || !self.Promise ) {
			setTimeout( function() {
				$.eqHeight( context );
			}, 10 );

			return;
		}

		// collect all of the rows
		$.forEach( '.eq-height', function( row ) {
			var cols = $$( '.eq-height-item', row ),

				// keep all the image promises as an array
				imagePromises = [];

			// only if we are over a mq of 768px or the row has class .mbl-eq-height
			if ( $.mq( '(min-width:768px)' ) || row.classList.contains( 'mbl-eq-height' ) ) {

				// check if this is large item only
				if ( !row.classList.contains( 'eq-height-item-lg' ) || $.mq( '(min-width:1024px)' ) ) {
					// loop through any images, create a promise for them and add to the imagePromises array
					$.forEach( 'img', function( img ) {
						imagePromises.push( new Promise( function( resolve, reject ) {
							// the image is cached (or has already loaded?)
							if ( img.complete ) {
								resolve( this );
							}
							else {
								// image has loaded
								img.addEventListener( 'load', function() {
									console.log( 'image loaded' );
									resolve( this );
								}, false );
							}
						} ) );
					}, row );

					// if there are images, wait for them to all load before setting the column height
					if ( imagePromises.length ) {
						Promise.all( imagePromises ).then( function() {
							// all images have been loaded
							setColumnHeights( cols );
						}, function() {
							console.warn( 'An image has failed to load.' );
						} );
					}

						// if no images in the container/row, set the column heights now
					else {
						setColumnHeights( cols );
					}
				}
				else {
					$.forEach( cols, function( col ) {
						col.classList.add( 'in' );
					} );
				}
			}
			else {
				$.forEach( cols, function( col ) {
					col.classList.add( 'in' );
				} );
			}
		}, context );

		function setColumnHeights( cols ) {
			var h = 0;

			// find the tallest column
			$.forEach( cols, function( col ) {
				if ( col.offsetHeight > h ) {
					h = col.offsetHeight;
				}
			} );

			// set the height of all the columns to the tallest one
			$.forEach( cols, function( col ) {
				col.style.height = h + 'px';
				col.classList.add( 'in' );
			} );
		}
	};

	// on load let's run eqHeight
	window.addEventListener( 'load', $.eqHeight );

	// $.fetch - Replacing Ajax
	// url - String - the url to fetch
	// options - JSON object - options such as data, method, etc...
	// type - optional - String - the method type. Set to 'GET' to perform a GET request
	$.fetch = function( url, options, type, callbackFn ) {
		var opts, headers;

		// if no url was passed in break now
		if ( !url ) {
			console.warn( 'No url provided to fetch' );
			return;
		}

		// if the promise polyfill hasn't loaded yet
		//   overwrite .then and wait 100 milliseconds then try again.
		if ( typeof self.Promise === 'undefined' || !self.Promise ) {
			return {
				then: function( fn ) {
					setTimeout( function() {
						return $.fetch( url, options, type, fn );
					}, 100 );
				}
			};
		}

		// if the fetch polyfill hasn't loaded yet
		//   overwrite .then and wait 100 milliseconds then try again.
		if ( !self.fetch ) {
			return {
				then: function( fn ) {
					setTimeout( function() {
						return $.fetch( url, options, type, fn );
					}, 100 );
				}
			};
		}
		else {
			// init options to empty object if none were passed in
			if ( !options ) {
				options = {};
			}

			// check fetch request type -- assuming this would a POST request
			if ( !type || type !== 'GET' ) {
				// if additional headers need to be added
				headers = app.util.extend( {
					'Accept': 'application/json',
					'Content-type': 'application/json'
				}, options.headers || {} );

				// setup some default options for a POST request
				//  and extend to include any options that were passed in
				//  specifically the body property for webservice parameters
				opts = app.util.extend( {
					url: url,
					body: '',
					method: 'POST'
				}, options );

				// make sure we include all of the needed headers
				opts.headers = headers;

				// make sure the body property has been stringified
				if ( opts.body && typeof opts.body !== 'string' && opts.body !== {} ) {
					opts.body = JSON.stringify( opts.body );
				}

				// make the fetch call
				return fetch( url, opts ).then( function( rsp ) {
					return rsp.json();
				} ).then( function( data ) {
					if ( callbackFn ) {
						callbackFn( data.d );
					}
					else {
						return data.d;
					}
				} ).then( function( rsp ) {
					return JSON.parse( rsp );
				} );
			}
			else {
				// if additional headers need to be added
				headers = app.util.extend( {
					'Content-Type': 'text/plain'
				}, options.headers || {} );
				
				// setup default options for a GET request
				//  expecting text/plain content type by default
				opts = app.util.extend( {
					method: 'GET'
				}, options );

				// make sure we include all of the needed headers
				opts.headers = headers;

				// make the fetch call
				return fetch( url, opts ).then( function( rsp ) {
					return rsp.text();
				} ).then( function( rsp ) {
					if ( callbackFn ) {
						callbackFn( rsp );
					}
					else {
						return rsp;
					}
				} );
			}
		}
	};

	$.matches = function( elm, selector ) {
		var _matches = ( elm.document || elm.ownerDocument ).querySelectorAll( selector ),
			i = _matches.length;
		while ( --i >= 0 && _matches.item( i ) !== elm ) { }
		return i > -1;
	};

	app.$ = $;
	app.$$ = $$;
}( window, window.document, undefined ) );

// Polyfill for CustomEvent
( function() {

	if ( typeof window.CustomEvent === 'function' ) {
		return false;
	}

	function CustomEvent( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
} )();

// Avoid 'console' errors in browsers that lack a console
( function() {
	var method;
	var noop = function() { };
	var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = ( window.console = window.console || {} );

	while ( length-- ) {
		method = methods[length];

		// Only stub undefined methods.
		if ( !console[method] ) {
			console[method] = noop;
		}
	}
}() );