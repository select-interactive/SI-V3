/**
* Copyright 2016 Select Interactive, LLC. All rights reserved.
* @author: The Select Interactive dev team (www.select-interactive.com)
*/
(function( doc ) {
    'use strict';

    class Router {
        static init() {
            this.mainContainer = app.$( '#page-container' );
            this.path = window.location.pathname;
            this.addEventListners_();
        }

        static addEventListners_() {
            doc.body.addEventListener( 'click', e => this.handleClick_( e ) );
            window.addEventListener( 'popstate', e => this.popstateHandler_( e ) );
        }

        static handleClick_( e ) {
            if ( e.metaKey || e.ctrlKey || e.button !== 0 ) {
                return;
            }

            var node = e.target;
            do {
                if ( node === null || node.nodeName.toLowerCase() === 'a') {
                    break;
                }

                node = node.parentNode;
            } while ( node );

            if ( node ) {
                const href = node.href;
                const path = node.getAttribute( 'href' );
                
                if ( href.indexOf( window.location.hostname ) !== -1 || path === '/' ) {
                    e.preventDefault();

                    if ( path !== this.path ) {
                        this.path = path;
                        app.Nav.close();
                        this.go_( path, true );
                    }
                }
            }
        }

        static go_( path, updateState ) {
            // fade current page out
            // load new page
            // then fade in the new page
            // then update state
            Promise.all([
                this.fadePageOut_(),
                this.loadPageContent_( path )
            ]).then( data => {
                const html = data[1];
                this.mainContainer.innerHTML = html;

                // use request animation to wait for the html to be painted
                requestAnimationFrame( () => {
                    requestAnimationFrame( () => {
                        app.$.eqHeight( this.mainContainer );

                        this.fadePageIn_().then( _ => {
                            if ( updateState ) {
                                this.updateState_();
                            }

                            if ( path !== '/' ) {
                                doc.body.classList.remove( 'home' );
                                doc.body.classList.remove( 'home-top' );
                            }
                            else {
                                doc.body.classList.add( 'home' );
                                doc.body.classList.add( 'home-top' );
                            }
                        } );
                    } );
                } );
            } );
        }

        static fadePageOut_() {
            return new Promise( ( resolve, reject ) => {
                const onTransitionEnd = () => {
                    this.mainContainer.removeEventListener( 'transitionend', onTransitionEnd );
                    resolve();
                };
                
                this.mainContainer.addEventListener( 'transitionend', onTransitionEnd );
                doc.body.classList.add( 'page-out' );
            } );
        }

        static loadPageContent_( path ) {
            return app.$.fetch( '/api/loadControlContent', {
                body: {
                    controlName: path,
                    url: ''
                }
            } ).then( rsp => {
                if ( rsp.success ) {
                    const content = rsp.obj;
                    return content.html;
                }
            } );
        }

        static fadePageIn_() {
            return new Promise( ( resolve, reject ) => {
                const onTransitionEnd = () => {
                    this.mainContainer.removeEventListener( 'transitionend', onTransitionEnd );
                    resolve();
                };

                window.scrollTo( 0, 0 );
                this.mainContainer.addEventListener( 'transitionend', onTransitionEnd );
                doc.body.classList.remove( 'page-out' );
            } );
        }

        static updateState_() {
            history.pushState( { path: this.path }, null, this.path );

            if ( typeof window.ga === 'function' ) {
                window.ga( 'send', 'pageview' );
            }
        }

        static popstateHandler_() {
            if ( history.state && history.state.path ) {
                console.log( history.state.path );
				this.go_( history.state.path );
			}
        }
    }

    app.Router = Router;

}( document ) );