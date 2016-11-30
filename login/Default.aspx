<%@ Page Title="" Language="VB" MasterPageFile="~/masterpages/empty.master" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="login_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphMeta" Runat="Server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphHead" Runat="Server">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="cphMain" Runat="Server">
	<form id="form-login" class="form form-full-width" style="max-width:400px;margin:4rem auto;" method="post" action="/login/default.aspx">
		<div class="form-row">
			<label for="username">Username:</label>
			<input type="text" name="username" autofocus />
		</div>
		<div class="form-row">
			<label for="password">Password:</label>
			<input type="password" name="password" />
		</div>
		<div class="form-row text-right">
			<button id="btn-login" class="btn btn-raised">Login</button>
		</div>
		<div id="status" class="status hidden"></div>
	</form>
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="cphBody" Runat="Server">
</asp:Content>

<asp:Content ID="Content5" ContentPlaceHolderID="cphJS" Runat="Server">
	<script defer src="/js/app/login.v-1.0.js"></script>
</asp:Content>