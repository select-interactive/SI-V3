'use strict';var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}} ///<reference path="main.js">
/**
 * Copyright 2016 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 * 
 * Configuration/Info
 * 
 * Label for item has class lbl-item
 * Label for items has class lbl-items
 * For grid, expects grid container to have ID grid-container
 * Expects form-grid for item listing
 * Expects form-edit for manipulating item data
 * 
 * Expects add new button with ID btn-new
 */
(function (doc) {
	'use strict';

	var config = {
		btnBack: 'btn-back',
		btnDelete: 'btn-delete',
		btnNew: 'btn-new',
		btnSave: 'btn-save',
		formGrid: 'form-grid',
		formEdit: 'form-edit',
		gridContainerId: 'grid-container',
		gridRowClass: 'admin-grid-row',
		hiddenClass: 'hidden',
		lblItem: 'lbl-item',
		lblItems: 'lbl-items',
		wsUrl: '/api/' };


	var toast = new app.Toast();
	var alert = new app.Alert();
	var defaultUrl = window.location.pathname;var

	AdminForm = function () {
		function AdminForm(options) {_classCallCheck(this, AdminForm);
			// extract data from options
			this.options = options;

			this.labelItemText = options.labelItemText;
			this.labelItemsText = options.labelItemsText;

			// init new item
			this.initItemFn = options.initItem ? options.initItem.callback : null;

			// load items information
			this.loadItemsFn = options.loadItems.fn;
			this.loadItemsParams = options.loadItems.params;
			this.loadItemsRowHTML = options.loadItems.rowTmpl;
			this.loadItemsRowHeaders = options.loadItems.rowTmplHeaders;
			this.loadItemsRowProps = options.loadItems.rowTmplProps;

			// edit item options
			this.editItemFn = options.editItem.fn;
			this.editItemParams = options.editItem.params;
			this.editItemItemId = options.editItem.itemId;
			this.editItemCallback = options.editItem.callback;

			// save item
			this.saveItemFn = options.saveItem.fn;
			this.saveItemId = options.saveItem.itemId;
			this.sendAsString = options.saveItem.sendAsString || false;
			this.saveCallback = options.saveItem.callback;

			// delete item
			this.deleteItemFn = options.deleteItem.fn;
			this.deleteItemItemId = options.deleteItem.itemId;

			// back to options callback
			this.backToGridCallback = options.back.fn;

			// items
			this.items = [];

			// initialize our form objects
			this.formGrid = new app.Form(app.$('#' + config.formGrid));
			this.formEdit = new app.Form(app.$('#' + config.formEdit));

			// buttons
			this.btnNew = app.$('#' + config.btnNew);
			this.btnBack = app.$('#' + config.btnBack);
			this.btnDelete = app.$('#' + config.btnDelete);
			this.btnSave = app.$('#' + config.btnSave);

			// tracking data 
			this.itemId = -1;
			this.additionadditionalPropertiesDefault = app.util.cloneObj(options.additionalProperties || {});
			this.additionalProperties = app.util.cloneObj(options.additionalProperties || {});

			// bind this to our functions
			this.setLabels = this.setLabels.bind(this);
			this.loadItems = this.loadItems.bind(this);
			this.buildGrid = this.buildGrid.bind(this);
			this.initNewItem = this.initNewItem.bind(this);
			this.editData = this.editData.bind(this);
			this.saveItem = this.saveItem.bind(this);
			this.backToGrid = this.backToGrid.bind(this);
			this.btnDeleteClickHandler = this.btnDeleteClickHandler.bind(this);
			this.deleteItem = this.deleteItem.bind(this);
			this.popstateHanlder = this.popstateHanlder.bind(this);

			// set display labels
			this.setLabels();

			// assign event listeners
			this.addEventListeners();

			// load current database items
			this.loadItems();
		}_createClass(AdminForm, [{ key: 'setLabels', value: function setLabels()

			{
				var me = this;

				app.$.forEach('.' + config.lblItem, function (el) {
					el.textContent = me.labelItemText;
				});

				app.$.forEach('.' + config.lblItems, function (el) {
					el.textContent = me.labelItemsText;
				});
			} }, { key: 'addEventListeners', value: function addEventListeners()

			{
				this.btnNew.addEventListener('click', this.initNewItem, false);
				this.btnBack.addEventListener('click', this.backToGrid, false);
				this.btnSave.addEventListener('click', this.saveItem, false);
				this.btnDelete.addEventListener('click', this.btnDeleteClickHandler, false);

				window.addEventListener('popstate', this.popstateHanlder, false);
			} }, { key: 'loadItems', value: function loadItems()

			{var _this = this;
				app.$.fetch(config.wsUrl + this.loadItemsFn, {
					body: this.loadItemsParams }).
				then(function (rsp) {
					if (rsp.success) {
						_this.items = rsp.obj;
						_this.buildGrid();
					}
				}).catch(function (rsp) {
					console.log('Error loading items.', rsp);
				});
			} }, { key: 'buildGrid', value: function buildGrid()

			{
				var me = this;
				var html = '';
				var rowHtml = '';

				// add the header row
				rowHtml = this.loadItemsRowHTML;
				for (var i = 0; i < this.loadItemsRowHeaders.length; i++) {
					var hdr = this.loadItemsRowHeaders[i];
					var itemProp = this.loadItemsRowProps[i];
					rowHtml = rowHtml.replace('{{' + itemProp + '}}', hdr);
				}

				rowHtml = rowHtml.replace('{{rowClass}}', ' hdr');
				html += rowHtml;

				// loop through all of the items and add them
				for (var _i = 0; _i < this.items.length; _i++) {
					var item = this.items[_i];
					rowHtml = this.loadItemsRowHTML.replace('{{rowClass}}', '');

					for (var j = 0; j < this.loadItemsRowProps.length; j++) {
						var _itemProp = this.loadItemsRowProps[j];
						var val = item[_itemProp];

						if (_itemProp === 'active') {
							val = val === true ? 'Active' : 'Not Active';
						}

						rowHtml = rowHtml.replace('{{' + _itemProp + '}}', val);
					}

					html += rowHtml;
				}

				app.$('#' + config.gridContainerId).innerHTML = html;

				setTimeout(function () {
					app.$.forEach('.' + config.gridRowClass, function (row) {
						new FormRow(row, me);
					});
				}, 10);
			} }, { key: 'initNewItem', value: function initNewItem()

			{
				this.itemId = -1;

				if (this.formEdit.container.querySelector('#tb-sort-order')) {
					this.formEdit.container.querySelector('#tb-sort-order').value = this.items.length + 1;
				}

				this.formGrid.hide();
				this.formEdit.show();
				this.btnDelete.classList.add(config.hiddenClass);

				if (this.initItemFn && typeof this.initItemFn === 'function') {
					this.initItemFn();
				}

				history.pushState({ page: 'edit' }, 'Edit', '?edit');
			} }, { key: 'editData', value: function editData(

			id) {var _this2 = this;
				toast.show('Loading item details...', -1);
				this.itemId = id;
				this.editItemParams[this.editItemItemId] = this.itemId;

				app.$.fetch(config.wsUrl + this.editItemFn, {
					body: this.editItemParams }).
				then(function (rsp) {
					var obj = void 0;

					if (rsp.success && rsp.obj.length) {
						obj = rsp.obj[0];
						_this2.formEdit.setFieldValues(obj);
						_this2.formEdit.show();
						_this2.formGrid.hide();
						_this2.btnDelete.classList.remove(config.hiddenClass);

						if (_this2.additionalProperties) {
							Object.getOwnPropertyNames(_this2.additionalProperties).forEach(function (val) {
								_this2.additionalProperties[val] = obj[val];
							});
						}

						window.scrollTo(0, 0);
						toast.hide(true);

						if (_this2.editItemCallback && typeof _this2.editItemCallback === 'function') {
							_this2.editItemCallback(obj);
						}

						history.pushState({ page: 'edit' }, 'Edit', '?edit');
					}
				}).catch(function (rsp) {
					console.log(rsp);
				});
			} }, { key: 'saveItem', value: function saveItem()

			{var _this3 = this;
				var me = this;
				var isValid = this.formEdit.validateFields();
				var params = {};

				if (!isValid) {
					toast.show('Fields marked with * are required.');
					return;
				}

				toast.show('Saving data, please wait...');

				params = this.formEdit.collectData();

				if (this.additionalProperties) {
					Object.getOwnPropertyNames(this.additionalProperties).forEach(function (val) {
						params[val] = _this3.additionalProperties[val];
					});
				}

				params[this.saveItemId] = this.itemId;

				if (this.sendAsString) {
					params = {
						data: JSON.stringify(params) };

				}

				app.$.fetch(config.wsUrl + this.saveItemFn, {
					body: params }).
				then(function (rsp) {
					if (rsp.success) {
						toast.show('Data saved successfully.', 2000);
						me.loadItems();

						if (_this3.itemId === -1) {
							//setTimeout( me.backToGrid, 1500 );
							_this3.itemId = rsp.obj;
						}

						if (_this3.saveCallback && typeof _this3.saveCallback === 'function') {
							_this3.saveCallback();
						}
					} else
					{
						toast.show('Unable to save at this time, please try again.', -1);
						console.log('Error:', rsp || 'No error data.');
					}
				}).catch(function (rsp) {
					toast.show('Unable to save at this time, please try again.', -1);
					console.log('Error:', rsp || 'No error data.');
				});
			} }, { key: 'backToGrid', value: function backToGrid()

			{var _this4 = this;
				this.formEdit.hide();
				this.formEdit.clearForm();
				this.formGrid.show();

				// reset tracked data
				this.itemId = -1;

				if (this.additionalProperties) {
					Object.getOwnPropertyNames(this.additionalProperties).forEach(function (val) {
						_this4.additionalProperties[val] = _this4.additionadditionalPropertiesDefault[val];
					});
				}

				if (this.backToGridCallback && typeof this.backToGridCallback === 'function') {
					this.backToGridCallback();
				}

				window.scrollTo(0, 0);

				history.pushState({ page: '' }, 'Options', defaultUrl);
			} }, { key: 'btnDeleteClickHandler', value: function btnDeleteClickHandler()

			{
				this.deleteItem(this.itemId);
			} }, { key: 'deleteItem', value: function deleteItem(

			id) {var _this5 = this;
				var me = this;

				var params = {};
				params[this.deleteItemItemId] = id;

				alert.promptAlert('Confirm Delete', '<p>Are you sure you want to delete this item?', 'Delete', 'Cancel', function (evt) {
					alert.dismissAlert();
					toast.show('Deleting item...');

					app.$.fetch(config.wsUrl + _this5.deleteItemFn, {
						body: params }).
					then(function (rsp) {
						if (rsp.success) {
							toast.show('Item successfully deleted.', 2500);
							me.loadItems();

							setTimeout(function () {
								me.backToGrid();
							}, 1000);
						} else
						{
							toast.show('Unable to delete at this time. Please try again.');
							console.log('Error:', rsp.msg || 'No error data');
						}
					}).catch(function (rsp) {
						toast.show('Unable to delete at this time. Please try again.');
						console.log('Error:', rsp || 'No error data');
					});

					evt.preventDefault();
				}, function (evt) {
					alert.dismissAlert();
					evt.preventDefault();
				});
			} }, { key: 'setAdditionalPropertyData', value: function setAdditionalPropertyData(

			key, val) {
				this.additionalProperties[key] = val;
			} }, { key: 'getAdditionalPropertyData', value: function getAdditionalPropertyData(

			key) {
				return this.additionalProperties[key];
			} }, { key: 'popstateHanlder', value: function popstateHanlder(

			e) {
				if (!e.state || e.state.page === '') {
					this.backToGrid();
				}
			}

			// helper function to handle image uploads
			//   @file - the file to be uploaded
			//   @isImg - boolean if uploading an image
			//   @handler - the ashx file to handle the file upload
			//   @fn - optional - callback function to run after the image has been uploaded
		}, { key: 'uploadHelper', value: function uploadHelper(file, isImg, handler, headers, fn) {
				var fileName = file.name;
				var fileType = file.type;
				var fReader = new FileReader();

				// confirm this file is allowed
				if (!isImg || /^image\//.test(fileType)) {
					toast.show('Uploading file, please wait...', -1);

					fReader.onload = function (e) {
						var xhr = new XMLHttpRequest();

						// set the handler and all headers
						xhr.open('post', handler, true);
						xhr.setRequestHeader('X-File-Name', fileName);
						xhr.setRequestHeader('X-File-Size', file.size);
						xhr.setRequestHeader('X-File-Type', fileType);

						for (var key in headers) {
							xhr.setRequestHeader(key, headers[key]);
						}

						// callback of xhr load
						xhr.addEventListener('load', function (response) {
							// when the request is complete
							if (response.target.response) {
								var rsp = JSON.parse(response.target.response);

								// if the upload was successful
								if (rsp.success) {
									toast.show('The file was successfully uploaded.');
									setTimeout(function () {
										toast.hide(true);
									}, 1000);

									if (fn && typeof fn === 'function') {
										fn(rsp.obj);
									}
								} else
								{
									toast.show('Unable to upload the file, please try again.', -1);
									console.log('Error:', rsp.msg || 'No error data.');
								}
							}
						}, false);

						xhr.send(file);
					};

					// begin the read operation
					fReader.readAsDataURL(file);
				} else
				{
					toast.show('Only .jpg, .jpeg, and .png files are allowed.', -1);
				}
			} }]);return AdminForm;}();var


	FormRow = function () {
		function FormRow(row, form) {_classCallCheck(this, FormRow);
			this.container = row;
			this.AdminForm = form;
			this.id = row.getAttribute('data-id');
			this.btnEdit = row.querySelector('.btn-edit');
			this.btnDelete = row.querySelector('.btn-delete');

			this.editItem = this.editItem.bind(this);
			this.deleteItem = this.deleteItem.bind(this);

			this.addEventListeners();
		}_createClass(FormRow, [{ key: 'addEventListeners', value: function addEventListeners()

			{
				this.btnEdit.addEventListener('click', this.editItem, false);
				this.btnDelete.addEventListener('click', this.deleteItem, false);
			} }, { key: 'editItem', value: function editItem()

			{
				this.AdminForm.editData(this.id);
			} }, { key: 'deleteItem', value: function deleteItem()

			{
				this.AdminForm.deleteItem(this.id);
			} }]);return FormRow;}();


	app.AdminForm = AdminForm;

})(document);
//# sourceMappingURL=form.js.map
