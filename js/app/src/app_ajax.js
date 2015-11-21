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