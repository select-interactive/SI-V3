<%@ Page Title="" Language="VB" MasterPageFile="~/masterpages/empty.master" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="about_Default" %>
<%@ Register TagPrefix="page" TagName="about" Src="~/controls/pages/about.ascx" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphMeta" Runat="Server">
	<title>Fort Worth Web Developers, Building Website and Web Applications</title>
    <meta name="description" content="We are a team of passionate web developers that create websites, develop web applications, build content management systems, and provide search engine optimization.">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphHead" Runat="Server">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="cphMain" Runat="Server">
	<page:about runat="server" ID="pageAbout" />
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="cphBody" Runat="Server">
</asp:Content>

<asp:Content ID="Content5" ContentPlaceHolderID="cphJS" Runat="Server">
</asp:Content>