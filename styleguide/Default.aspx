<%@ Page Language="VB" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="styleguide_Default" %>
<%@ Register TagPrefix="uc" TagName="head" Src="~/controls/head.ascx" %>
<%@ Register TagPrefix="uc" TagName="includedScripts" Src="~/controls/includedScripts.ascx" %>
<!doctype html>

<!--[if lt IE 9]><html class="no-js lt-ie9"><![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<title>Project Style Guide</title>
	<uc:head runat="server" ID="ucHead" />
</head>
<body>
	<div class="container">
		<div class="container-drawer">
			<header class="hdr-bar">
				<h3 title>Nav Bar</h3>
			</header>
			<nav id="drawer-nav">
				<ul>
					<li><a class="link-scroll active" href="/home/"><i class="material-icons">home</i>Home</a></li>
					<li><a class="link-scroll" href="/icons/"><i class="material-icons">star</i>Icons</a></li>
					<li><a class="link-scroll" href="/color/"><i class="material-icons">palette</i>Color</a></li>
					<li><a class="link-scroll" href="/buttons/"><i class="material-icons">radio_button_checked</i>Buttons</a></li>
					<li><a class="link-scroll" href="/forms/"><i class="material-icons">border_color</i>Form Elements</a></li>
					<li><a class="link-scroll" href="/alerts/"><i class="material-icons">warning</i>Alerts/Confirmations</a></li>
					<li><a class="link-scroll" href="/toasts/"><i class="material-icons">notifications_active</i>Toasts</a></li>
					<li><a class="link-scroll" href="/tabs/"><i class="material-icons">tab</i>Tabs</a></li>
				</ul>
			</nav>
		</div>
		<div id="home" class="container-main">
			<header class="hdr-bar">
				<a href="open-nav" drawer-nav-trigger><i class="material-icons">menu</i></a>
				<h2 title>Application Title</h2>
				<nav id="hdr-nav">
					<ul>
						<li><a href="#"><i class="material-icons">search</i></a></li><li><a href="#"><i class="material-icons">more_vert</i></a></li>
					</ul>
				</nav>
			</header>
			<div class="container-main-content">
				<div class="sg">
					<section class="sg-section">
						<h2 class="sh-hdr sg-hdr-primary">Select Interactive Components/Elements Style Guide</h2>
						<div class="sg-summary">
							<p>Overview of components and elements available in this project. Includes overview of functionality, API calls, and styles.</p>
							<p>Note: one day the components will be able to be wrapped as Custom Elements, but that day is not today. So for now all components (i.e. alert dialog, toast, etc...) require 3 different files: 1. HTML template 2. JavaScript 3. CSS (SASS).</p>
							<p>HTML templates will live in /templates/components/{componentName}/{componentName}.html</p>
							<p>JavaScript files will live in /js/app/src/app_{componentName}.js. This means that they will be compiled and concatenated into /js/app/main.js so there is no need to include additional &lt;script&gt; tags. This also means that the components should be available throughout the entire site/app.</p>
							<p>Sass files will live in /css/sass/components/{componentName}/_{componentName}.scss</p>
						</div>
					</section>
					<section id="icons" class="sg-section">
						<h2 class="sg-hdr">Icons</h2>
						<div class="sg-summary">
							<p>Google just recently open sourced their entire <a href="https://www.google.com/design/icons/" target="_blank">Material Design icon library</a>, including creating it as an <a href="http://google.github.io/material-design-icons/#icon-font-for-the-web" target="_blank">icon font</a>! Over 750 icons in the one font.</p>
							<p>To include in a project, load in the font from Google Fonts API -- &lt;link href=&ldquo;https://fonts.googleapis.com/icon?family=Material+Icons&rdquo; rel=&ldquo;stylesheet&rdquo;&gt;</p>
							<p>To include an icon on a page -- &lt;i class=&ldquo;material-icons&rdquo;&gt;icon_name&lt;/i&gt;</p>
							<p>Doesn&rsquo;t get much easier. Helper classes available for changing sizes:</p>
							<p>.md-18 { font-size: 24px; }<br />.md-18 { font-size: 24px; }<br />.md-36 { font-size: 36px; }<br />.md-48 { font-size: 48px; }</p>
						</div>
						<div class="row">
							<div class="col col-2">
								<div class="sg-element"><i class="material-icons">done</i></div>
							</div>
							<div class="col col-2">
								<div class="sg-element"><i class="material-icons md-18">grade</i></div>
							</div>
							<div class="col col-2">
								<div class="sg-element"><i class="material-icons md-24">lock</i></div>
							</div>
							<div class="col col-2">
								<div class="sg-element"><i class="material-icons md-36">perm_identity</i></div>
							</div>
							<div class="col col-2">
								<div class="sg-element"><i class="material-icons md-48">search</i></div>
							</div>
							<div class="col col-2">
								<div class="sg-element"><i class="material-icons">get_app</i></div>
							</div>
						</div>
						<div class="sg-summary">
							<p>Additional rules can be added to /sass/components/material/_icons.scss</p>
						</div>
					</section>
					<div id="color" class="sg-section">
						<h2 class="sg-hdr">Color Palettes</h2>
						<div class="sg-section">
							<p>The /css/sass/base/_variables.scss file is now set to begin with 2 primary project colors, $color-primary and $color-secondary. These will traditionally come from client brand guidelines. Additionally shades of the colors are set to be automatically configured:</p>
							<p>$color-primary-dark<br />$color-primary-light<br />$color-secondary-dark<br />$color-secondary-light</p>
							<p>If needed additional variables can be added for more brand colors.</p>
							<p>A section denoted as helper colors defaults to only $white: #fff and $black: #000. Additional helpers can be added as needed in this area (i.e. $gray: #999; $gray-dark: #555;).</p>
							<p>Alert/Messaging helper colors are defined for: <span style="color:#c09853;">$warning-text</span>, <span style="color:#b94a48;">$error-text</span>, <span style="color:#468847;">$success-text</span>, and <span style="color:#3a87ad;">$info-text</span>. These are defaults for rapid prototyping, they can be changed to meet the project requirements.</p>
						</div>
					</div>
					<section id="buttons" class="sg-section">
						<h2 class="sg-hdr">Buttons</h2>
						<div class="sg-summary">
							<p>3 button types -- Flat, Raised, and Floating Action Button.</p>
							<p>Both &lt;button&gt; and &lt;a&gt; can be used. Add class=&ldquo;btn&rdquo; and then include the attribute &ldquo;raised&rdquo; for a Raised Button or the attribute &ldquo;fab&rdquo; for a Floating Action Button. Buttons with no attributes are Flat Buttons by default.</p>
						</div>
						<div class="row eq-height">
							<div class="col col-4">
								<div class="sg-element eq-height-item">
									<button class="btn">Flat Button</button>
								</div>
							</div>
							<div class="col col-4">
								<div class="sg-element eq-height-item">
									<button class="btn" raised>Raised Button</button>
								</div>
							</div>
							<div class="col col-4">
								<div class="sg-element eq-height-item">
									<button class="btn" fab><i class="material-icons">keyboard_arrow_down</i></button>
								</div>
							</div>
						</div>
						<div class="sg-summary">
							<p>Styles at /sass/components/buttons/_buttons.scss</p>
						</div>
						<a href="/home/" class="btn link-scroll" fab fixed><i class="material-icons">expand_less</i></a>
					</section>
					<section id="forms" class="sg-section">
						<h2 class="sg-hdr">Form Elements</h2>
						<div class="sg-summary">
							<p>Text inputs are all inputs with type equal to text, password, email, url, time, date, datetime-local, tel, number, and search, as well as textarea elements.</p>
							<p>Inputs with class=&ldquo;req&rdquo; will highlight to an invalid state when a value has not been provided.</p>
							<p>An optional attribute &ldquo;min-chars&rdquo; can be applied. When present, the onblur event will check for a valid a number of characters.</p>
							<p>Use * to prefix labels for any required fields.</p>
							<p>Automatic validation should take place for fields with type email, tel, and url.</p>
							<p>To validate dates in MM/DD/YYYY format, add class&ldquo;input-date&rdquo;.</p>
							<p>When a placeholder attribute is provided, the label will automatically be moved up and will have no transition.</p>
						</div>
						<div class="form-row">
							<div class="col col-4">
								<div class="input-field">
									<input type="text" id="tb-demo" class="req" value="John" />
									<label for="tb-demo">* First Name:</label>
								</div>
							</div>
							<div class="col col-4">
								<div class="input-field">
									<input type="text" id="tb-invalid" class="req" min-chars="4" />
									<label for="tb-invalid">* Last Name:</label>
								</div>
							</div>
							<div class="col col-4">
								<div class="input-field">
									<input type="email" id="tb-email" class="req" />
									<label for="tb-email">* Email:</label>
								</div>
							</div>
						</div>
						<div class="form-row">
							<div class="col col-4">
								<div class="input-field">
									<input type="tel" id="tb-tel" class="req input-icon-prefix" placeholder="Phone Number" />
									<label for="tb-tel">* Phone Number:</label>
									<i class="material-icons">phone</i>
								</div>
							</div>
							<div class="col col-4">
								<div class="input-field">
									<input type="url" id="tb-url" class="input-icon-prefix" placeholder="http://" />
									<label for="tb-url">Website:</label>
									<i class="material-icons">public</i>
								</div>
							</div>
							<div class="col col-4">
								<div class="input-field">
									<input type="date" id="tb-date" class="input-date input-icon-prefix" placeholder="MM/DD/YYYY" />
									<label for="tb-date">* Date Published:</label>
									<i class="material-icons">today</i>
								</div>
							</div>
						</div>
						<div class="form-row">
							<div class="input-field">
								<textarea id="ta-msg"></textarea>
								<label for="ta-msg">Message:</label>
							</div>
						</div>
						<div class="form-row">
							<div class="col col-6">
								<div class="input-field">
									<select id="ddl-opt1" class="req">
										<option value="1">Option 1</option>
										<option value="2">Option 2</option>
										<option value="3">Option 3</option>
										<option value="4">Option 4</option>
									</select>
									<label for="ddl-opt1">Select Required Item:</label>
								</div>
							</div>
							<div class="col col-6">
								<div class="input-field">
									<select id="ddl-opt2" multiple>
										<option value="1">Option 1</option>
										<option value="2">Option 2</option>
										<option value="3">Option 3</option>
										<option value="4">Option 4</option>
									</select>
									<label for="ddl-opt2">Select Multiple:</label>
								</div>
							</div>
						</div>
						<div class="form-row">
							<div class="col col-4">
								<p>Radio Buttons</p>
								<input type="radio" id="rb-radio1" name="group1" checked />
								<label for="rb-radio1">Option 1</label><br />
								<input type="radio" id="rb-radio2" name="group1" />
								<label for="rb-radio2">Option 2</label>
							</div>
							<div class="col col-4">
								<p>Checkbox</p>
								<input type="checkbox" id="cb-featured" />
								<label for="cb-featured">Featured?</label>
							</div>
							<div class="col col-4">
								<p>Switch</p>
								<input type="checkbox" id="cb-switch" switch />
								<label for="cb-switch">Off<span class="switch-toggle"></span>On</label>
							</div>
						</div>
						<div class="form-row">
							<div class="col col-4">
								<p>Slider</p>
								<input type="range" min="0" max="100" step="10" value="0" />
							</div>
						</div>
						<div class="sg-summary">
							<p>JavaScript at /js/app/src/app_forms.js</p>
							<p>Styles at /sass/components/forms/_forms.scss</p>
						</div>
					</section>
					<section id="alerts" class="sg-section">
						<h2 class="sg-hdr">Alert/Confirmation Boxes</h2>
						<div class="sg-summary">
							<p>Alerts/Confirmation dialogs can be displayed by calling app.alerts.promptAlert( hdrText, html, confirmText, denyText, fnConfirm, fnDeny );. All parameters should be provided.</p>
							<p>@hdrText - String - The text of the alert header.</p>
							<p>@html - String - The body content to be displayed in the dialog.</p>
							<p>@confirmText - String - The text displayed for the confirmation button.</p>
							<p>@denyText - String - The text displayed for the cancel button.</p>
							<p>@fnConfirm - Function - The function to be executed when the user clicks the confirm button.</p>
							<p>@fnDeny - Function - The function to be executed when the user clicks the deny/cancel button.</p>
						</div>
						<button id="btn-show-alert" class="btn" raised>Delete Something</button>
						<div class="sg-summary">
							<p>HTML Template at /templates/components/alerts/alert.html</p>
							<p>JavaScript at /js/app/src/app_alerts.js</p>
							<p>Styles at /css/sass/components/alerts/_alerts.scss</p>
						</div>
					</section>
					<section id="toasts" class="sg-section">
						<h2 class="sg-hdr">Status Messaging - Toasts</h2>
						<div class="sg-summary">
							<p>Toasts can be displayed by calling app.toast.show( msg, duration, callback );. All 3 parameters are optional, but msg really should be provided every time unless a default toast is added in the HTML.</p>
							<p>@msg - String - Message to be displayed in the post.</p>
							<p>@duration - Integer - Duration of time for toast to be displayed before disappearing. If no duration is provided, a default duration will be applied. A value of -1 can be passed to indicate a persistent toast.</p>
							<p>@callback - Function - A function to be executed when the toast is hidden.</p>
						</div>
						<button id="btn-show-toast" class="btn" raised>Action</button>
						<div class="sg-summary">
							<p>HTML Template at /templates/components/toast/toast.html</p>
							<p>JavaScript at /js/app/src/app_toasts.js</p>
							<p>Styles at /css/sass/components/toasts/_toasts.scss</p>
						</div>
					</section>
					<section id="tabs" class="sg-section">
						<h2 class="sg-hdr">Tabs</h2>
						<div class="sg-summary">
							<p>Tabs...</p>
						</div>
						<ul class="tab-links" data-tab-group="1">
							<li><a href="#tab1" class="active">Tab 1</a></li>
							<li><a href="#tab2">Tab 2</a></li>
							<li><a href="#tab3">Tab 3</a></li>
							<li><a href="#tab4">Tab 4</a></li>
						</ul>
						<div data-tab-group="1" data-tab="tab1" class="tab active">
							<h3 class="tab-hdr">Tab 1</h3>
							<div class="tab-content">
								<p>Tincidunt integer eu augue augue nunc elit dolor, luctus placerat scelerisque euismod, iaculis eu lacus nunc mi elit, vehicula ut laoreet ac, aliquam sit amet justo nunc tempor, metus vel.</p>
							</div>
						</div>
						<div data-tab-group="1" data-tab="tab2" class="tab">
							<h3 class="tab-hdr">Tab 2</h3>
							<div class="tab-content">
								<p>Tincidunt integer eu augue augue nunc elit dolor, luctus placerat scelerisque euismod, iaculis eu lacus nunc mi elit, vehicula ut laoreet ac, aliquam sit amet justo nunc tempor, metus vel.</p>
							</div>
						</div>
						<div data-tab-group="1" data-tab="tab3" class="tab">
							<h3 class="tab-hdr">Tab 3</h3>
							<div class="tab-content">
								<p>Tincidunt integer eu augue augue nunc elit dolor, luctus placerat scelerisque euismod, iaculis eu lacus nunc mi elit, vehicula ut laoreet ac, aliquam sit amet justo nunc tempor, metus vel.</p>
							</div>
						</div>
						<div data-tab-group="1" data-tab="tab4" class="tab">
							<h3 class="tab-hdr">Tab 4</h3>
							<div class="tab-content">
								<p>Tincidunt integer eu augue augue nunc elit dolor, luctus placerat scelerisque euismod, iaculis eu lacus nunc mi elit, vehicula ut laoreet ac, aliquam sit amet justo nunc tempor, metus vel.</p>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	</div>
	<div id="container-drawer-overlay"></div>
	<uc:includedScripts runat="server" ID="ucIncludedScripts" />
	<script>
		( function( doc ) {

			// demo alert box
			doc.getElementById( 'btn-show-alert' ).addEventListener( 'click', function( e ) {
				app.alerts.promptAlert( 'Confirm', '<p>Are you sure you want to delete this post?', 'Delete', 'Cancel', function( e ) {
					console.log( 'Confirm button clicked.' );
					app.toast.show( 'Item deleted.' );
					app.alerts.dismissAlert();
					e.preventDefault();
				}, function( e ) {
					console.log( 'Deny button clicked.' );
					app.alerts.dismissAlert();
					e.preventDefault();
				} );

				e.preventDefault();
			}, false );

			// demo toast
			doc.getElementById( 'btn-show-toast' ).addEventListener( 'click', function( e ) {
				app.toast.show( 'This is a toast', -1, function() {
					console.log( 'Toast callback' );
				} );
				e.preventDefault();
			}, false );

		}( document ) );
	</script>
</body>
</html>