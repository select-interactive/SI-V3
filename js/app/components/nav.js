/**
* Copyright 2016 Select Interactive, LLC. All rights reserved.
* @author: The Select Interactive dev team (www.select-interactive.com)
*/
(function( doc ) {
    'use strict';

    class Nav {
        static init() {
            this.triggers = app.$$( '.nav-trigger' );

            this.addEventListeners_();
        }

        static addEventListeners_() {
            app.$.forEach( this.triggers, trigger => {
                trigger.addEventListener( 'click', e=> {
                    doc.body.classList.toggle( 'nav-in' );
                } );
            } );
        }

        static close() {
            doc.body.classList.remove( 'nav-in' );
        }
    }

    app.Nav = Nav;

}( document ) );