<%@ Control Language="VB" AutoEventWireup="false" CodeFile="portfolio.ascx.vb" Inherits="controls_pages_portfolio" %>
<div class="banner">
	<div class="banner-content no-pull">
		<div class="banner-col solo">
			<h2 class="banner-hdr">Selected Projects</h2>
		</div>
	</div>
</div>
<section class="section">
	<div class="section-content">
		<div class="projects-grid"><asp:Literal runat="server" ID="ltrlProjects" /></div>
	</div>
</section>