<%@ Control Language="VB" AutoEventWireup="false" CodeFile="header.ascx.vb" Inherits="controls_header" %>
<%@ Register TagPrefix="uc" TagName="nav" Src="~/controls/navMain.ascx" %>
<header id="hdr-main">
	<h1 id="masthead-favicon"><a class="navigation" data-control="home" data-nav-class="home" href="/"><img src="/img/logos/select-interactive-s.v1.svg" width="50" height="44" alt="Select Interactive" /></a></h1>
	<uc:nav runat="server" ID="ucNav" />
</header>