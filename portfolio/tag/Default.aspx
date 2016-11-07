<%@ Page Title="" Language="VB" MasterPageFile="~/masterpages/empty.master" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="portfolio_tag_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphMeta" Runat="Server">
	<title><asp:Literal runat="server" ID="ltrlTitle" /></title>
	<asp:Literal runat="server" ID="ltrlMeta" />
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphHead" Runat="Server">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="cphMain" Runat="Server">
	<div class="paper">
		<div class="content-container">
			<h2 class="copy-hdr copy-hdr-xl text-center"><asp:Literal runat="server" ID="ltrlHdr" /></h2>
			<ul class="projects">
				<asp:Literal runat="server" ID="ltrlProjects" />
			</ul>
		</div>
	</div
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="cphBody" Runat="Server">
</asp:Content>

<asp:Content ID="Content5" ContentPlaceHolderID="cphJS" Runat="Server">
</asp:Content>