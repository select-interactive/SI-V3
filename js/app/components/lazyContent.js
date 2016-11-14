/**
* Copyright 2016 Select Interactive, LLC. All rights reserved.
* @author: The Select Interactive dev team (www.select-interactive.com)
*/
(function( doc ) {
    'use strict';

    class LazyContent {
        constructor( el ) {
            this.container = el;
            this.src = el.getAttribute( 'data-src' );
            this.loadContent();
        }

        loadContent() {
            app.$.fetch( '/api/loadControlContent', {
                body: {
                    controlName: this.src,
                    url: this.src
                }
            } ).then( rsp => {
                if ( rsp.success ) {
                    this.container.insertAdjacentHTML( 'afterend', rsp.obj.html );
                    this.container.parentNode.removeChild( this.container );
                }
            } );
        }
    }

    class LazyContentHandler {
        static load() {
            app.$.forEach( '[data-content-lazy]:not(.lazy-loaded)', el => {
                new LazyContent( el );
            } );
        }
    }

    app.LazyContentHandler = LazyContentHandler;

}( document ) );