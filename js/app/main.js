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
    window.forEachElement = function( elements, fn ) {
        var i = 0,
            len = elements.length;

        for ( ; i < len; i++ ) {
            if ( fn( elements[i], i ) ) {
                break;
            }
        }
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

    return {
        ajax: ajax,
        xhr: xhr,
        xhrPromise: xhrPromise
    };

}( document ) );
///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	var hdr = doc.getElementById( 'hdr-main' ),
		checkY = hdr.offsetHeight / 2,
		sLogo = doc.getElementById( 's-logo' );

	window.addEventListener( 'scroll', checkWindowY, false );

	function checkWindowY( e ) {
		if ( app.util.getWindowScrollPosition() > checkY && ! doc.body.classList.contains( 'past-header' ) ) {
			doc.body.classList.add( 'past-header' );
		}
		else if ( app.util.getWindowScrollPosition() <= checkY ) {
			doc.body.classList.remove( 'past-header' );
		}
	}

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