/**
* Copyright 2016 Select Interactive, LLC. All rights reserved.
* @author: The Select Interactive dev team (www.select-interactive.com)
*/
(function( doc ) {
    'use strict';

    const hdr = app.$( '#hdr-main' );

    if ( hdr ) {
        window.addEventListener( 'scroll', e => {
            if ( doc.body.classList.contains( 'home' ) ) {
                let wh = window.innerHeight;
                let y = window.scrollY;

                if ( y >= wh / 3 ) {
                    doc.body.classList.remove( 'home-top' );
                }
                else {
                    doc.body.classList.add( 'home-top' );
                }
            }
        } );
    }

}( document ) );