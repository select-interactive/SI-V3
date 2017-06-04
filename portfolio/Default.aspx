<%@ Page Title="" Language="VB" MasterPageFile="~/masterpages/empty.master" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="portfolio_Default" %>
<%@ Register TagPrefix="page" TagName="portfolio" Src="~/controls/pages/portfolio.ascx" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphMeta" Runat="Server">
	<title>Websites Designed and Developed by Select Interactive</title>
	<meta name="description" content="Award winning websites designed and developed by Select Interactive, a Dallas, Fort Worth based website design and website development firm.">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphHead" Runat="Server">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="cphMain" Runat="Server">
	<page:portfolio runat="server" ID="pagePortfolio" />
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="cphBody" Runat="Server">
</asp:Content>

<asp:Content ID="Content5" ContentPlaceHolderID="cphJS" Runat="Server">
</asp:Content>