///<reference path="../main.js">
/**
 * Copyright 2016 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 * @version: 1.0.0
 */
( function( doc ) {
	'use strict';

	let activeAlert = null;

	const cssClasses = {
		ALERT_ACTIVE: 'alert-active',
		ALERT_EL: 'alert-el',
		ALERT_HDR: 'alert-header',
		ALERT_INFO: 'alert-info',
		BTN: 'alert-btn',
		BTN_CONFIRM: 'alert-btn-confirm',
		BTN_CONTAINER: 'alert-btn-container',
		BTN_DISMISS: 'alert-btn-dismiss',
		CONTAINER: 'alert-container'
	};

	const keys = {
		ESCAPE: 27
	};

	class Alert {
		constructor() {
			if ( activeAlert ) {
				console.log( 'An alert already exists.' );
				return activeAlert;
			}

			this.alertContainer = this.createAlertElements();

			this.onConfirm = function() { };
			this.onDismiss = function() { };

			this.promptAlert = this.promptAlert.bind( this );
			this.updateButtons = this.updateButtons.bind( this );
			this.showAlert = this.showAlert.bind( this );
			this.handleKeyDown = this.handleKeyDown.bind( this );
			this.dismissAlert = this.dismissAlert.bind( this );

			this.addEventListeners();

			activeAlert = this;
		}

		createAlertElements() {
			let el = doc.createElement( 'div' );
			el.classList.add( cssClasses.CONTAINER );
			doc.body.appendChild( el );

			this.alertEl = doc.createElement( 'div' );
			this.alertEl.classList.add( cssClasses.ALERT_EL );

			this.alertHeader = doc.createElement( 'h3' );
			this.alertHeader.classList.add( cssClasses.ALERT_HDR );

			this.alertInfo = doc.createElement( 'div' );
			this.alertInfo.classList.add( cssClasses.ALERT_INFO );

			let btnContainer = doc.createElement( 'div' );
			btnContainer.classList.add( cssClasses.BTN_CONTAINER );

			this.btnDismiss = doc.createElement( 'button' );
			this.btnDismiss.classList.add( cssClasses.BTN );
			this.btnDismiss.classList.add( cssClasses.BTN_CONFIRM );
			this.btnDismiss.classList.add( 'btn-ripple' );
			this.btnDismiss.textContent = 'Dismiss';

			this.btnConfirm = doc.createElement( 'button' );
			this.btnConfirm.classList.add( cssClasses.BTN );
			this.btnConfirm.classList.add( cssClasses.BTN_CONFIRM );
			this.btnConfirm.classList.add( 'btn-ripple' );
			this.btnConfirm.textContent = 'Confirm';

			btnContainer.appendChild( this.btnDismiss );
			btnContainer.appendChild( this.btnConfirm );

			el.appendChild( this.alertEl );
			this.alertEl.appendChild( this.alertHeader );
			this.alertEl.appendChild( this.alertInfo );
			this.alertEl.appendChild( btnContainer );

			return el;
		}

		addEventListeners() {
			this.btnConfirm.addEventListener( 'click', this.onConfirm, false );
			this.btnDismiss.addEventListener( 'click', this.onDismiss, false );
		}

		promptAlert( hdr, content, btnConfirmText, btnDismissText, fnConfirm, fnDismiss ) {
			this.alertHeader.textContent = hdr;
			this.alertInfo.innerHTML = content;
			this.updateButtons( btnConfirmText, btnDismissText, fnConfirm, fnDismiss );
			this.showAlert();

			doc.body.addEventListener( 'keydown', this.handleKeyDown, false );
		}

		updateButtons( btnConfirmText, btnDismissText, fnConfirm, fnDismiss ) {
			this.btnConfirm.textContent = btnConfirmText;
			this.btnDismiss.textContent = btnDismissText;

			this.btnDismiss.MaterialButton = new MaterialButton( this.btnDismiss );
			this.btnConfirm.MaterialButton = new MaterialButton( this.btnConfirm );

			this.btnConfirm.removeEventListener( 'click', this.onConfirm, false );
			this.btnDismiss.removeEventListener( 'click', this.onDismiss, false );

			this.onConfirm = fnConfirm;
			this.onDismiss = fnDismiss;

			this.btnConfirm.addEventListener( 'click', this.onConfirm, false );
			this.btnDismiss.addEventListener( 'click', this.onDismiss, false );
		}

		showAlert() {
			doc.body.classList.add( cssClasses.ALERT_ACTIVE );
		}

		handleKeyDown( e ) {
			if ( e.keyCode === keys.ESCAPE ) {
				this.onDismiss();
			}
		}

		dismissAlert() {
			doc.body.classList.remove( cssClasses.ALERT_ACTIVE );
			doc.body.removeEventListener( 'keydown', this.handleKeyPress, false );
		}
	}

	app.Alert = Alert;

}( document ) );