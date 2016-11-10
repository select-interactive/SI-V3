<%@ Control Language="VB" AutoEventWireup="false" CodeFile="portfolio.ascx.vb" Inherits="controls_pages_portfolio" %>
<div class="banner">
	<div class="banner-overlay"></div>
	<div class="banner-content no-pull">
		<div class="banner-col solo">
			<h2 class="banner-hdr">Website Development Projects</h2>
			<p>Take a look below at a few of the websites we have worked on over the last 24 months.</p>
		</div>
	</div>
</div>
<section class="section section-gray section-mbl-pad">
	<div class="section-content">
		<div class="projects-grid"><asp:Literal runat="server" ID="ltrlProjects" /></div>
	</div>
</section>