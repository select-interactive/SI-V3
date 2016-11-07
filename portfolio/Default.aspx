<%@ Page Title="" Language="VB" MasterPageFile="~/masterpages/empty.master" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="portfolio_Default" %>
<%@ Register TagPrefix="page" TagName="portfolio" Src="~/controls/pages/portfolio.ascx" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphMeta" Runat="Server">
	<title>Award Winning Website Design and Development Projects from Select Interactive</title>
    <meta name="description" content="View a number of our website design and development projects featuring a number of responsive web design and custom content management projects.">
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