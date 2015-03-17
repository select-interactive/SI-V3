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