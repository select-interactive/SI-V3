<%@ Page Title="" Language="VB" MasterPageFile="~/masterpages/empty.master" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="news_tag_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphMeta" Runat="Server">
	<title><asp:Literal runat="server" ID="ltrlTitle" /></title>
	<asp:Literal runat="server" ID="ltrlMeta" />
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphHead" Runat="Server">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="cphMain" Runat="Server">
	<div class="paper paper-gray-dark">
		<h2 class="copy-hdr copy-hdr-xl text-center"><asp:Literal runat="server" id="ltrlHdr" /></h2>
		<ul class="articles three-cols"><asp:Literal runat="server" ID="ltrlBody" /></ul>
	</div>
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="cphBody" Runat="Server">
</asp:Content>

<asp:Content ID="Content5" ContentPlaceHolderID="cphJS" Runat="Server">
</asp:Content>