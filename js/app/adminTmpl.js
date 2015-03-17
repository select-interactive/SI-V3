///<reference path="main.js">
///<reference path="admin.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
 app.bios = (function( doc ) {
    'use strict';
    
    var 
        settings = {
            // base itemId and webservice URL
            itemId: -1,
            
            // load data ws function, params, callback (optional)
            load: {},

            // save function
            save: {
                fn: 'saveItem'
            },

            // if the default delete behavior should be used
            del: true,

            // the Parse object of data
            item: '',

            // how the option text should be set
            //   using the Parse obj
            setOptionText: function( obj ) {
                return obj.get( '' );
            }
        },

        // Parse settings
        //   object = the Parse cloud object
        //   querySort = the column to sort items by
        parse = {
            object: '',
            querySort: ''
        },

        // events for buttons/inputs (file upload)
        inputEvents = [
            {
                el: doc.getElementById( 'btn-item-save' ),
                evtName: 'click',
                handler: saveItem
            }
        ],

        // optional other data for the item
        otherData = {};

    // call the admin init function passing this pages specific data/items
    app.admin.init( settings, parse, inputEvents, otherData, saveItem );

    function saveItem() {
        var params = app.admin.collectData(),
            isValid = app.admin.validateReqFields();
        
        if ( isValid ) {
            //if ( otherData.headshot === '' ) {
            //    app.admin.setStatus( 'You must upload an article image.' );
            //    return;
            //}

            app.admin.saveItem( settings.save.fn, params );
        }
    }

}( document ) );