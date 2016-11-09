/**
* Copyright 2016 Select Interactive, LLC. All rights reserved.
* @author: The Select Interactive dev team (www.select-interactive.com)
*/
(function( doc ) {
    'use strict';

    const config = {
		apiKey: 'AIzaSyCgPr6C2_Y4D-p8grQ_TfT7-hTrRii3VfQ'
	};

    class Gmap {
        constructor( el, loadCallback ) {
            // don't create a map twice
            if ( this.initialized ) {
                return;
            }

            this.container = el;
            this.map = null;
            this.markers = [];

            this.loadCallback = loadCallback;

            this.options = {
                defaultCenter: {
                    lat: 32.731486,
                    lng: -97.366189
                },
                defaultZoom: 10,
                icon: '/img/map-marker.v1.png',
                scrollwheel: false,
                styles: [{ 'featureType': 'administrative', 'elementType': 'labels.text.fill', 'stylers': [{ 'color': '#444444' }] }, { 'featureType': 'landscape', 'elementType': 'all', 'stylers': [{ 'color': '#f2f2f2' }] }, { 'featureType': 'poi', 'elementType': 'all', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'road', 'elementType': 'all', 'stylers': [{ 'saturation': -100 }, { 'lightness': 45 }] }, { 'featureType': 'road.highway', 'elementType': 'all', 'stylers': [{ 'visibility': 'simplified' }] }, { 'featureType': 'road.arterial', 'elementType': 'labels.icon', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'transit', 'elementType': 'all', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'water', 'elementType': 'all', 'stylers': [{ 'color': '#4f595d' }, { 'visibility': 'on' }] }],
                zoomControl: true
            };

            this.initMap = this.initMap.bind( this );
            this.setDefaultCenter = this.setDefaultCenter.bind( this );
            this.setDefaultZoom = this.setDefaultZoom.bind( this );
            
            this.addScript();
        }

        initMap() {
            this.setDefaultCenter();
            this.setDefaultZoom();

            this.map = new google.maps.Map( this.container, {
				center: this.options.defaultCenter,
				mapTypeControl: false,
				scrollwheel: this.options.scrollwheel,
				streetViewControl: false,
				zoom: this.options.defaultZoom,
				zoomControl: this.options.zoomControl
            } );

            this.map.setOptions( { styles: this.options.styles } );

            if ( this.container.hasAttribute( 'data-map-marker' ) ) {
				this.addMarker( this.options.defaultCenter );
			}

            if ( this.loadCallback && typeof this.loadCallback === 'function' ) {
				this.loadCallback( this.map );
			}
        }

        addScript() {
			app.$.addScript( 'https://maps.googleapis.com/maps/api/js?key=' + config.apiKey, doc.body, true, this.initMap );
		}

        setDefaultCenter() {
            if ( this.container.hasAttribute( 'data-map-center' ) ) {
                const coords = this.container.getAttribute( 'data-map-center' );
                const position = coords.split( ',' );
                
                if ( position.length ) {
                    this.options.defaultCenter = {
                        lat: parseFloat( position[0] ),
                        lng: parseFloat( position[1] )
                    };
                }
            }
        }

        setDefaultZoom() {
            if ( this.container.hasAttribute( 'data-map-zoom' ) ) {
                this.defaultZoom = parseInt( this.container.getAttribute( 'data-map-zoom' ), 10 );
            }
        }

        addMarker( data ) {
			const me = this;

			let icon = data.marker || this.options.icon;

			let marker = new google.maps.Marker( {
				data: data,
				icon: icon,
				map: this.map,
				position: {
					lat: data.lat,
					lng: data.lng
				}
			} );

			this.markers.push( marker );
		}
    }

    class GmapInitializer {
        static init() {
            app.$.forEach( '.gmap-auto-init', el => {
                new Gmap( el );
            } );
        }
    }
    
    app.GmapInitializer = GmapInitializer;
    GmapInitializer.init();

}( document ) );