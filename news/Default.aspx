<%@ Page Title="" Language="VB" MasterPageFile="~/masterpages/empty.master" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="news_Default" %>
<%@ Register TagPrefix="page" TagName="news" Src="~/controls/pages/news.ascx" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphMeta" Runat="Server">
	<title>Web Design and Development news, awards, and notes from Select Interactive</title>
	<meta name="description" content="News, awards, and web design and development notes from Select Interactive.">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphHead" Runat="Server">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="cphMain" Runat="Server">
	<page:news runat="server" ID="pageNews" />
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="cphBody" Runat="Server">
</asp:Content>

<asp:Content ID="Content5" ContentPlaceHolderID="cphJS" Runat="Server">
</asp:Content>