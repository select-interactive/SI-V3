/**
* Copyright 2016 Select Interactive, LLC. All rights reserved.
* @author: The Select Interactive dev team (www.select-interactive.com)
*/
(function( doc ) {
    'use strict';

    const nav = app.$( '#nav-main' );
    const triggers = app.$$( '.nav-trigger' );

    if ( nav && triggers.length ) {
        app.$.forEach( triggers, trigger => {
            trigger.addEventListener( 'click', e=> {
                doc.body.classList.toggle( 'nav-in' );
            } );
        } );
    } 

}( document ) );