<%@ Control Language="VB" AutoEventWireup="false" CodeFile="portfolio.ascx.vb" Inherits="controls_pages_portfolio" %>
<div class="banner">
	<div class="banner-bg banner-bg-portfolio"></div>
	<div class="banner-overlay"></div>
	<div class="banner-content">
		<div class="banner-col solo">
			<h2 class="banner-hdr">Take A Peek at Our Website Development Portfolio</h2>
			<p>Please browse through a few of our recent website design and development projects below. Click on a project to learn more about the goals and process involved.</p>
			<p>If you&rsquo;re curious to learn about some of our web application and iOS projects, please <a href="mailto:contact@select-interactive.com">contact us</a> to request more information.</p>
		</div>
	</div>
</div>
<section class="section section-gray section-mbl-pad">
	<div class="section-content">
		<div class="projects-grid"><asp:Literal runat="server" ID="ltrlProjects" /></div>
	</div>
</section>