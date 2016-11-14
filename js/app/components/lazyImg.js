/**
* Copyright 2016 Select Interactive, LLC. All rights reserved.
* @author: The Select Interactive dev team (www.select-interactive.com)
*/
(function( doc ) {
    'use strict';

    class LazyImg {
        constructor( el ) {
            this.img = el;
            this.src = el.getAttribute( 'data-src' );
            this.init();
        }

        init() {
            // use a timeout so the request aren't all
            // at the exact same time
            setTimeout( _ => {
                this.img.src = this.src;
                this.img.classList.add( 'lazy-loaded' );
            }, 10 );
        }
    }

    class LazyImgHandler {
        static loadImages() {
            app.$.forEach( '[data-lazy]:not(.lazy-loaded)', el => {
                new LazyImg( el );
            } );
        }
    }

    app.LazyImgHandler = LazyImgHandler;

}( document ) );