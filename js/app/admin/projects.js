/**
* Copyright 2016 Select Interactive, LLC. All rights reserved.
* @author: The Select Interactive dev team (www.select-interactive.com)
*/
(function( doc ) {
    'use strict';

    const alert = new app.Alert();

    let adminForm = new app.AdminForm( {
		labelItemText: 'Project',
		labelItemsText: 'Projects',
		loadItems: {
			fn: 'projectsGetJson',
			params: {
                projectId: -1
            },
			rowTmpl: '<div class="admin-grid-row{{rowClass}}" data-id="{{projectId}}">' +
					 '<div class="admin-grid-col admin-grid-col-primary">{{name}}</div>' +
                     '<div class="admin-grid-col">{{active}}</div>' +
					 '<div class="admin-grid-col"><button class="btn btn-ripple btn-edit">Edit</button><button class="btn btn-ripple btn-delete">Delete</button></div>' +
					 '</div>',
			rowTmplHeaders: ['', 'Name', 'Active'],
			rowTmplProps: ['projectId', 'name', 'active']
		},
		editItem: {
			fn: 'projectsGetJson',
			params: {},
			itemId: 'projectId',
            callback: editItemCallback
		},
		saveItem: {
			fn: 'projectSave',
			itemId: 'projectId',
            sendAsString: true,
            callback: saveItemCallback
		},
		deleteItem: {
			fn: 'projectDelete',
			itemId: 'projectId'
		},
		back: {
            fn: back
        },
		additionalProperties: {
            imgPath: '',
            imgFileName: ''
        }
	} );

    const ddlTags = app.$( '#ddl-tags' );
    const _ddlTags = $( ddlTags );
    const ddlPartners = app.$( '#ddl-partners' );
    const _ddlPartners = $( ddlPartners );

    _ddlTags.chosen();
    _ddlPartners.chosen();

    const btnUploadImg = app.$( '#btn-upload-img' );
	const fUploadImg = app.$( '#f-upload-img' );
	const prevImg = app.$( '#prev-img' );
	const btnImgDelete = app.$( '#btn-img-delete' );

	btnUploadImg.addEventListener( 'click', e => fUploadImg.click() );

	fUploadImg.addEventListener( 'change', e => {
		let files = e.dataTransfer ? e.dataTransfer.files : e.currentTarget.files,
			file = files[0];

		adminForm.uploadHelper( file, true, '/admin/uploadImg.ashx', {
            'X-Min-Width': 652,
            'X-Min-Height': 500,
            'X-File-Path': 'img/projects/'
        }, rsp => {
			if ( rsp ) {
				adminForm.setAdditionalPropertyData( 'imgPath', rsp.filePath );
				adminForm.setAdditionalPropertyData( 'imgFileName', rsp.fileName );
				setPrevImg( rsp.filePath );
			}

			fUploadImg.value = '';
		} ); 
	} );

	btnImgDelete.addEventListener( 'click', e => {
		alert.promptAlert( 'Confirm Delete', '<p>Are you sure you want to delete this image?', 'Delete', 'Cancel', evt => {
			adminForm.setAdditionalPropertyData( 'imgPath', '' );
			adminForm.setAdditionalPropertyData( 'imgFileName', '' );
			setPrevImg( '' );
			alert.dismissAlert();
			evt.preventDefault();
		}, evt => {
			alert.dismissAlert();
			evt.preventDefault();
		} );
	} );

    function editItemCallback( obj ) {
        app.$.fetch( '/api/projectTagsGetJson', {
            body: {
                tagId: -1,
                projectId: obj.projectId
            }
        } ).then( rsp => {
            if ( rsp.success ) {
                let tags = rsp.obj;

                tags.forEach( tag => {
                    app.$.forEach( ddlTags.children, opt => {
                        if ( tag.tagId === parseInt( opt.value, 10 ) ) {
                            opt.selected = true;
                        }
                    } );
                } );

                _ddlTags.trigger( 'chosen:updated' );
            }
        } );

        app.$.fetch( '/api/partnersGetJson', {
            body: {
                partnerId: -1,
                projectId: obj.projectId
            }
        } ).then( rsp => {
            if ( rsp.success ) {
                let partners = rsp.obj;

                partners.forEach( partner => {
                    app.$.forEach( ddlPartners.children, opt => {
                        if ( partner.partnerId === parseInt( opt.value, 10 ) ) {
                            opt.selected = true;
                        }
                    } );
                } );

                _ddlTags.trigger( 'chosen:updated' );
                _ddlPartners.trigger( 'chosen:updated' );
            }
        } );

        setPrevImg( adminForm.getAdditionalPropertyData( 'imgPath' ) );
    }

    function setPrevImg( filePath ) {
		if ( filePath === '' ) {
			prevImg.innerHTML = '';
			btnImgDelete.classList.add( 'hidden' );
			return;
		}

		prevImg.innerHTML = '<img src="' + filePath + '" />';
		btnImgDelete.classList.remove( 'hidden' );
	}

    function saveItemCallback() {
        let tags = [];
        let partners = [];

        app.$.forEach( ddlTags.children, opt => {
            if ( opt.selected ) {
                tags.push( opt.value );
            }
        } );

        app.$.forEach( ddlPartners.children, opt => {
            if ( opt.selected ) {
                partners.push( opt.value );
            }
        } );

        app.$.fetch( '/api/projectsTagsAssign', {
            body: {
                projectId: adminForm.itemId,
                tags: tags
            }
        } );

        app.$.fetch( '/api/projectsPartnersAssign', {
            body: {
                projectId: adminForm.itemId,
                partners: partners
            }
        } );
    }

    function back() {
        app.$.forEach( ddlTags.children, opt => {
            opt.selected = false;
        } );

        app.$.forEach( ddlPartners.children, opt => {
            opt.selected = false;
        } );

        _ddlTags.trigger( 'chosen:updated' );
        _ddlPartners.trigger( 'chosen:updated' );

        setPrevImg( '' );
    }
}( document ) );