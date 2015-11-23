<%@ Page Title="" Language="VB" MasterPageFile="~/masterpages/empty.master" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="contact_Default" %>
<%@ Register TagPrefix="page" TagName="contact" Src="~/controls/pages/contact.ascx" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphMeta" Runat="Server">
	<title>Contact Us to Discuss Your Website or Web Application Needs</title>
    <meta name="description" content="Located just west of downtown Fort Worth, Select Interactive offers website design and development services to the Dallas / Fort Worth metroplex.">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphHead" Runat="Server">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="cphMain" Runat="Server">
	<page:contact runat="server" ID="pageContact" />
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="cphBody" Runat="Server">
</asp:Content>

<asp:Content ID="Content5" ContentPlaceHolderID="cphJS" Runat="Server">
</asp:Content>