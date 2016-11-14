/**
* Copyright 2016 Select Interactive, LLC. All rights reserved.
* @author: The Select Interactive dev team (www.select-interactive.com)
*/
(function( doc ) {
    'use strict';

    // if we're on the front end setup proper handlers
    if ( doc.body.hasAttribute( 'frontend' ) ) {
        app.Router.init();
        app.Nav.init();
        app.LazyContentHandler.load();
        app.LazyImgHandler.loadImages();
    }

}( document ) );