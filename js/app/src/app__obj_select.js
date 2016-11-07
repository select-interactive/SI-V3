///<reference path="../main.js">
/**
 * Copyright 2016 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	const cssClasses = {
		ERROR_LABEL: 'error-label',
		INVALID_REQ_FIELD: 'invalid',
		MD_MENU: 'md-select',
		MENU: 'md-select-menu',
		MENU_OPEN: 'active',
		LIST_ITEM: 'md-select-menu-item',
		LIST_ITEM_HOVER: 'keyover',
		REQUIRED_FIELD: 'req'
	};

	class Select {
		constructor( select ) {
			// if on a touch device, default to native select
			if ( 'ontouchstart' in doc.documentElement && app.$.mq( '(max-width:1024px)' ) ) {
				return;
			}

			// elements
			this.select = select;
			this.select.classList.add( cssClasses.MD_MENU );
			this.container = this.select.parentNode;
			this.label = this.container.querySelector( 'label' );
			this.menu = null;

			// if this is a multiple select
			this.multiple = this.select.multiple;

			this.open = false;
			this.currentIndex = 0;

			this.listItems = [];

			//this.onChange = function() { };

			this.createMenu = this.createMenu.bind( this );
			this.setMenuPosition = this.setMenuPosition.bind( this );
			this.showMenu = this.showMenu.bind( this );
			this.hideMenu = this.hideMenu.bind( this );
			this.changeHandler = this.changeHandler.bind( this );
			this.focusHanlder = this.focusHanlder.bind( this );
			this.blurHandler = this.blurHandler.bind( this );
			this.keyDownHandler = this.keyDownHandler.bind( this );
			this.bodyClickHandler = this.bodyClickHandler.bind( this );
			this.checkIfRequired = this.checkIfRequired.bind( this );

			this.createMenu();
			this.addEventListeners();
		}

		addEventListeners() {
			this.select.addEventListener( 'focus', this.focusHanlder, false );
			this.select.addEventListener( 'blur', this.blurHandler, false );
		}

		// add change event
		setChangeEvent( fn ) {
			this.onChange = fn;
		}

		// create the drop down
		createMenu() {
			let opts = this.select.children;
			let len = opts.length;
			let i;
			let opt;
			let listItem;
			let li;

			this.menu = doc.createElement( 'ul' );
			this.menu.classList.add( cssClasses.MENU );

			// loop through all of the options and create the ListItems
			for ( i = 0; i < len; i++ ) {
				opt = opts[i];

				listItem = new ListItem( opt, i, this );
				this.listItems.push( listItem );
				this.menu.appendChild( listItem.listItem );
			}

			doc.body.appendChild( this.menu );

			this.setMenuPosition();
		}

		// reset the menu
		reloadMenu() {
			let container;

			if ( this.menu ) {
				container = this.menu.parentNode;
				container.removeChild( this.menu );
				this.listItems = [];
				this.createMenu();
			}
		}

		// set the menu position on the page
		setMenuPosition() {
			const rect = this.select.getBoundingClientRect();
			this.menu.style.top = rect.bottom + app.util.getWindowScrollPosition() + 'px';
			this.menu.style.left = rect.left + 'px';
			this.menu.style.width = this.select.offsetWidth + 'px';
		}

		// show the menu
		showMenu() {
			let me = this;

			// always start at the top of the list
			this.menu.scrollTop = 0;

			this.currentIndex = -1;
			this.menu.classList.add( cssClasses.MENU_OPEN );
			this.open = true;

			setTimeout( function() {
				doc.body.addEventListener( 'keydown', me.keyDownHandler, false );
				doc.body.addEventListener( 'click', me.bodyClickHandler, false );

				me.select.blur();
			}, 100 );
						
			// disable window from scrolling
			app.util.disableWindowScroll();
		}

		// hide the menu
		hideMenu() {
			let item;

			this.menu.classList.remove( cssClasses.MENU_OPEN );
			this.open = false;

			// make sure no listItems ahve the keyover class
			item = this.menu.querySelector( '.' + cssClasses.LIST_ITEM_HOVER );

			if ( item ) {
				item.classList.remove( cssClasses.LIST_ITEM_HOVER );
			}

			// remove event listeners
			doc.body.removeEventListener( 'keydown', this.keyDownHandler, false );
			doc.body.removeEventListener( 'click', this.bodyClickHandler, false );

			// re-enable window scrolling
			app.util.enableWindowScroll();
		}

		focusHanlder( e ) {
			this.setMenuPosition();
			this.showMenu();
		}

		blurHandler( e ) {
			
		}

		keyDownHandler( e ) {
			let index = this.currentIndex;
			let keyCode = -1;
			let menuScrollTop = this.menu.scrollTop;
			let menuHeight = this.menu.offsetHeight;
			let li;

			if ( e && e.keyCode ) {
				keyCode = e.keyCode;
				
				if ( keyCode === 9 ) {
					this.hideMenu();
					e.preventDefault();
				}

				// move down the list
				else if ( keyCode === 40 ) {
					e.preventDefault();
					this.currentIndex++;

					if ( this.currentIndex === this.listItems.length ) {
						this.currentIndex--;
						return;
					}

					if ( index >= 0 ) {
						this.listItems[index].listItem.classList.remove( cssClasses.LIST_ITEM_HOVER );
					}

					li = this.listItems[this.currentIndex].listItem;
					li.classList.add( cssClasses.LIST_ITEM_HOVER );

					// check scroll top
					if ( li.offsetTop + li.offsetHeight > menuScrollTop + menuHeight ) {
						this.menu.scrollTop = menuScrollTop + li.offsetHeight;
					}
				}

				// move up the list
				else if ( keyCode === 38 ) {
					e.preventDefault();
					this.currentIndex--;

					if ( this.currentIndex < 0 ) {
						this.currentIndex = -1;
						return;
					}

					if ( index >= 0 ) {
						this.listItems[index].listItem.classList.remove( cssClasses.LIST_ITEM_HOVER );
					}

					if ( this.currentIndex >= 0 ) {
						li = this.listItems[this.currentIndex].listItem;
						li.classList.add( cssClasses.LIST_ITEM_HOVER );

						// check scroll top
						if ( li.offsetTop < menuScrollTop ) {
							this.menu.scrollTop = menuScrollTop - li.offsetHeight;
						}
					}
				}

				// enter key is clicked
				else if ( keyCode === 13 ) {
					e.preventDefault();

					if ( this.currentIndex === -1 ) {
						this.currentIndex = 0;
					}

					// trigger list item click
					this.listItems[this.currentIndex].selectItem();
				}

				// if escape key is clicked
				else if ( keyCode === 27 ) {
					e.preventDefault();
					this.hideMenu();
				}
			}
		}

		changeHandler( e ) {
			if ( this.onChange && typeof this.onChange === 'function' ) {
				this.onChange();
			}
		}

		bodyClickHandler( e ) {
			if ( e && e.target && ( e.target === this.select || e.target.classList.contains( cssClasses.LIST_ITEM ) || e.target.classList.contains( 'btn-ripple-container' ) || e.target.classList.contains( 'btn-ripple-element' ) ) ) {
				// let the list item click event handle this
			}
			else {
				// clicked outside of the menu, hide the menu
				this.hideMenu();
			}
		}

		checkForValue() {

		}

		checkIfRequired() {
			let selected = this.menu.querySelector( '[selected="true"]' );
			let errorLbl = this.container.querySelector( '.' + cssClasses.ERROR_LABEL );
			let lbl;

			// remove any previous error messages
			if ( errorLbl ) {
				this.container.removeChild( errorLbl );
			}

			// if we don't have a selected option and this is a required field
			if ( !selected && this.select.classList.contains( cssClasses.REQUIRED_FIELD ) ) {
				lbl = doc.createElement( 'span ' );
				lbl.classList.add( cssClasses.ERROR_LABEL );
				lbl.textContent = 'Required field.';
				this.container.appendChild( lbl );
				this.select.classList.add( cssClasses.INVALID_REQ_FIELD );
			}

			// if we're all good, rmeove the invalid class
			else {
				this.select.classList.remove( cssClasses.INVALID_REQ_FIELD );
			}
		}

		setValue( value ) {
			let li = this.menu.querySelector( '[data-val="' + value + '"]' );
			let i = 0;
			let len = this.listItems.length;
			let listItem = null;

			if ( li ) {
				for ( i = 0; i < len; i++ ) {
					listItem = this.listItems[i];

					if ( listItem.listItem === li ) {
						if ( !listItem.listItem.getAttribute( 'selected' ) ) {
							listItem.selectItem();
						}
					}
				}
			}
		}

		getValue() {
			if ( !this.multiple ) {
				return this.select.options[this.select.selectedIndex].value;
			}
		}

		getTextValue() {
			if ( !this.multiple ) {
				return this.select.options[this.selectedIndex].text;
			}
		}
	}

	class ListItem {
		constructor( opt, index, select ) {
			this.listItem = doc.createElement( 'li' );
			this.select = select;
			this.index = index;

			this.listItem.classList.add( cssClasses.LIST_ITEM );
			this.listItem.classList.add( 'btn-ripple' );
			this.listItem.textContent = opt.textContent;
			this.listItem.setAttribute( 'data-val', opt.value );

			if ( opt.selected ) {
				this.listItem.setAttribute( 'selected', 'true' );
			}

			this.selectItem = this.selectItem.bind( this );

			this.addEventListeners();

			return this;
		}

		addEventListeners() {
			this.listItem.addEventListener( 'click', this.selectItem, false );
		}

		selectItem( e ) {
			let selected;
			
			// if clicking the currently selected item
			if ( this.listItem.getAttribute( 'selected' ) === 'true' ) {
				this.listItem.removeAttribute( 'selected' );

				if ( !this.select.multiple ) {
					this.select.select.value = '';
				}

				this.select.checkIfRequired();
			}
			else {
				// check if an item is already selected
				selected = this.select.menu.querySelector( '[selected="true"]' );

				// unselect a previously selected item if this is not a multiple select
				if ( selected && !this.select.multiple ) {
					selected.removeAttribute( 'selected' );
				}

				// select the selected item
				this.listItem.setAttribute( 'selected', 'true' );

				// update the selected element
				if ( !this.select.multiple ) {
					this.select.select.value = this.listItem.getAttribute( 'data-val' );
					this.select.checkIfRequired();
				}

				this.select.select.classList.remove( cssClasses.INVALID_REQ_FIELD );

				// hide the menu if this ins not a multiple select
				if ( !this.select.multiple ) {
					this.select.hideMenu();
				}
			}

			this.select.changeHandler();

			if ( e ) {
				e.stopPropagation();
			}
		}
	}

	app.Select = Select;

}( document ) );