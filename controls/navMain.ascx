<%@ Control Language="VB" AutoEventWireup="false" CodeFile="navMain.ascx.vb" Inherits="controls_navMain" %>
<nav id="nav-main" role="navigation">
	<ul>
		<li class="mbl-logo"><a class="navigation" data-control="home" data-nav-class="home" href="/"><img src="/img/logos/select-interactive.v1.svg" width="200" height="60" alt="Select Interactive" /></a></li>
		<li class="mbl-only"><a class="navigation" data-control="home" data-nav-class="home" href="/">Home</a></li>
		<li><a class="navigation" data-control="about" href="/about/">About Us</a></li>
		<li><a class="navigation" data-control="services" href="/services/">What We Do</a></li>
		<li><a class="navigation" data-control="portfolio" href="/portfolio/">Our Work</a></li>
		<li><a class="navigation" data-control="news" href="/news/">News</a></li>
		<li class="last-main"><a class="navigation" data-control="contact" href="/contact/">Contact</a></li>
		<li class="mbl-only">
			<a class="inline" href="tel:817.210.4303"><i class="material-icons">local_phone</i></a>
			<a class="inline" href="mailto:contact@select-interactive.com"><i class="material-icons">email</i></a>
			<a class="inline" href="https://twitter.com/sel_interactive" target="_blank"><i class="icon icon-twitter-white"></i></a>
			<a class="inline" style="margin-right:0;" href="https://www.facebook.com/SelectInteractive" target="_blank"><i class="icon icon-facebook-white"></i></a>
			<a class="inline" href="https://instagram.com/select_interactive" target="_blank"><i class="icon icon-insta-white"></i></a>
			<a class="inline" href="https://plus.google.com/+SelectInteractiveFortWorth" target="_blank"><i class="icon icon-gplus-white"></i></a>
			<a class="inline material" href="http://goo.gl/maps/SQuyV" target="_blank"><i class="material-icons">place</i></a>
		</li>
		<li class="mbl-only text">&copy; 2012 - <%=Year(Now) %> Select Interactive, LLC.<br />All rights reserved.</li>
	</ul>
</nav>