///<reference path="main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	var formGrid = doc.getElementById( 'form-grid' ),
		gridContainer = doc.getElementById( 'grid-container' ),
		btnNew = doc.getElementById( 'btn-new' ),

		formEdit = doc.getElementById( 'form-edit' ),
		tbUname = doc.getElementById( 'tb-uname' ),
		tbPwd = doc.getElementById( 'tb-pwd' ),
		tbEmail = doc.getElementById( 'tb-email' ),
		fields = formEdit.querySelectorAll( 'input' ),
		btnBack = doc.getElementById( 'btn-back' ),
		btnSave = doc.getElementById( 'btn-save' ),

		userId = '',
			
		rowTmpl = '<div class="admin-grid-row" data-id="{{id}}">' +
				  '<div class="admin-grid-col admin-grid-col-primary">{{username}}</div>' +
				  '<div class="admin-grid-col">{{email}}</div>' +
				  '<div class="admin-grid-col"><button class="btn btn-edit hidden">Edit<button class="btn btn-delete">Delete</button></div>' +
			      '</div>';

	btnNew.addEventListener( 'click', initNewUser, false );
	btnBack.addEventListener( 'click', back, false );
	btnSave.addEventListener( 'click', createUser, false );

	function init() {
		Parse.initialize( app.admin.getParseAppId, app.admin.getParseJSKey );
		loadGrid();

		gridContainer.addEventListener( 'click', function( e ) {
			if ( e && e.target ) {
				gridElementClick( e.target );
				e.preventDefault();
			}
		}, false );
	}

	function loadGrid() {
		var Obj = Parse.Object.extend( 'User' ),
			query = new Parse.Query( Obj );

		gridContainer.innerHTML = 'Loading...';

		query.find({
			success: function( obj ) {
				var users = obj,
					i, len = users.length,
					user,
					html = '', rowHtml;

				for ( i = 0; i < len; i++ ) {
					user = users[i];
					rowHtml = rowTmpl;
					rowHtml = rowHtml.replace( '{{id}}', user.id );
					rowHtml = rowHtml.replace( '{{username}}', user.attributes.username );
					rowHtml = rowHtml.replace( '{{email}}', user.attributes.email );
					html += rowHtml;
				}

				gridContainer.innerHTML = html;
			},
			error: function( obj, err ) {
				console.log( 'Error loading user data from Parse.', obj, err );
			}
		});
	}

	function initNewUser( e ) {
		formGrid.classList.add( 'hidden' );
		formEdit.classList.remove( 'hidden' );
		tbUname.focus();
		e.preventDefault();
	}

	function gridElementClick( el ) {
		if ( el === doc.body ) {
			return;
		}
		else if ( el.classList && el.classList.contains( 'btn-edit' ) ) {
			edituser( el );
		}
		else if ( el.classList && el.classList.contains( 'btn-delete' ) ) {
			deleteUser( el );
		}
		else if ( el.parentNode ) {
			gridElementClick( el.parentNode );
		}
	}

	function edituser( el ) {
		var Obj = Parse.Object.extend( 'User' ),
			query = new Parse.Query( Obj );

		userId = el.parentNode.parentNode.getAttribute( 'data-id' );

		query.get( userId, {
			success: function( obj ) {
				tbUname.value = obj.attributes.username;
				tbEmail.value = obj.attributes.email;
				tbPwd.value = '';
				formGrid.classList.add( 'hidden' );
				formEdit.classList.remove( 'hidden' );
				app.forms.checkActive();
			},
			error: function( obj ) {
				app.admin.setStatus( 'Unable to load the user\'s information at this time. Please try again.' );
				userId = '';
			}
		} );
	}

	function deleteUser( el ) {
		userId = el.parentNode.parentNode.getAttribute( 'data-id' );

		app.alerts.promptAlert( 'Confirm Delete', '<p>Are you sure you want to delete this user?', 'Delete User', 'Cancel', deleteUserAccount, function( evt ) {
			app.alerts.dismissAlert();
			evt.preventDefault();
		} );
	}

	function deleteUserAccount( e ) {
		var Obj = Parse.Object.extend( 'User' ),
			query = new Parse.Query( Obj );

		app.alerts.dismissAlert();
		app.admin.setStatus( 'Deleting user, please wait...' );
		
		query.get( userId, {
			success: function( obj ) {
				obj.destroy( {
					success: function( obj ) {
						var container = gridContainer.querySelector( '.admin-grid-row[data-id="' + userId + '"]' );

						app.admin.setStatus( 'The user has been deleted successfully.' );

						if ( container ) {
							container.parentNode.removeChild( container );
						}

						userId = '';
					},
					error: function( obj, err ) {
						app.admin.setStatus( 'Unable to delete the user at this time. Please try again.' );
						userId = '';
					}
				} );
			},
			error: function( obj, err ) {
				app.admin.setStatus( 'Unable to delete the user at this time. Please try again.' );
				userId = '';
			}
		} );

		e.preventDefault();
	}

	function back( e ) {
		formEdit.classList.add( 'hidden' );
		formGrid.classList.remove( 'hidden' );

		forEachElement( fields, function( el ) {
			var label = el.parentNode.querySelector( '.active' ),
				erroLabel = el.parentNode.querySelector( '.error-label' );

			if ( label ) {
				label.classList.remove( 'active' );
			}

			if ( erroLabel ) {
				erroLabel.innerHTML = '';
			}

			el.value = '';
			el.classList.remove( 'invalid' );
		} );

		e.preventDefault();
	}

	function createUser() {
		var params = {},
			valid = true,
			Obj = Parse.Object.extend( 'User' ),
			query, user;

		window.forEachElement( fields, function( field ) {
			var val = field.value.trim();

			if ( val === '' ) {
				valid = false;
				app.admin.setStatus( 'All fields are required.' );
				return true;
			}
			else {
				params[field.getAttribute( 'name' )] = val;
			}
		} );

		if ( valid ) {
			app.admin.setStatus( 'Saving user account.' );

			if ( userId === '' ) {
				user = new Parse.User();

				user.signUp( params, {
					success: function( user ) {
						app.admin.setStatus( 'User account created.' );
						loadGrid();

						setTimeout( function() {
							app.admin.clearStatus();
							back();
						}, 500 );
					},
					error: function( user, err ) {
						app.admin.setStatus( 'Unable to create account at this time, please try again.' );
					}
				} );
			}

			// TODO - FIND A WAY TO MAKE THIS WORK
			else {
				query = new Parse.Query( Obj );

				query.get( userId, {
					success: function( obj ) {
						console.log( 'Object loaded', obj );
					},
					error: function( obj, err ) {

					}
				} );
			}
		}
	}

	init();

}( document ) );