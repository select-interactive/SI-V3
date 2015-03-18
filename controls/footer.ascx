<%@ Control Language="VB" AutoEventWireup="false" CodeFile="footer.ascx.vb" Inherits="controls_footer" %>
<footer>
	<div class="container">
		<div class="row row-cols-3">
			<div class="col">
				<h4 class="page-hdr">Connect.</h4>
				<ul class="list-footer-links">
					<li>T. <a href="tel:817.210.4303">817.210.4303</a></li>
					<li><a href="mailto:contact@select-interactive.com">contact@select-interactive.com</a></li>
					<li>3343 Locke Ave. Suite 107<br />Fort Worth, TX 76107</li>
				</ul>
			</div>
			<div class="col">
				<h4 class="page-hdr">Learn More.</h4>
				<ul class="list-footer-links">
					<li><a href="/about/">About Us</a></li>
					<li><a href="/services/">What We Do</a></li>
					<li><a href="/portfolio/">Our Portfolio</a></li>
					<li><a href="/news/">News</a></li>
					<li><a href="/contact/">Contact Us</a></li>
				</ul>
			</div>
			<div class="col">
				<h4 class="page-hdr">Striving to Build a Better Web.</h4>
				<p>Founded in 2012 by <a href="mailto:jeremy@select-interactive.com">Jeremy Burton</a> and <a href="mailto:dan@select-interactive.com">Dan Harris.</a></p>
				<p>&copy; 2012 - <%=Year(Now) %> Select Interactive, LLC. All rights reserved.</p>
			</div>
		</div>
	</div>
</footer>