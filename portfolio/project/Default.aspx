<%@ Page Title="" Language="VB" MasterPageFile="~/masterpages/empty.master" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="portfolio_project_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphMeta" Runat="Server">
	<title><asp:Literal runat="server" ID="ltrlTitle" /></title>
	<asp:Literal runat="server" ID="ltrlMeta" />
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphHead" Runat="Server">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="cphMain" Runat="Server">
	<asp:Literal runat="server" ID="ltrlProject" />
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="cphBody" Runat="Server">
</asp:Content>

<asp:Content ID="Content5" ContentPlaceHolderID="cphJS" Runat="Server">
</asp:Content>