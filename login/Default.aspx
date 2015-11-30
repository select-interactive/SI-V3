<%@ Page Title="" Language="VB" MasterPageFile="~/masterpages/empty.master" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="login_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphMeta" Runat="Server">
	<title>Login</title>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphHead" Runat="Server">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="cphMain" Runat="Server">
	<div class="paper copy">
		<form id="form-login" class="form form-full-width" style="max-width:400px;margin:0 auto;" method="post" action="/login/login.ashx">
			<h3 class="copy-hdr">Login</h3>
			<div class="row form-row">
				<div class="input-field">
					<input id="tb-uname" type="text" name="username" autofocus />
					<label for="tb-uname">Username:</label>
				</div>
			</div>
			<div class="row form-row">
				<div class="input-field">
					<input id="tb-pwd" type="password" name="password" />
					<label for="tb-pwd">Password:</label>
				</div>
			</div>
			<div class="form-row text-right">
				<button id="btn-login" class="btn" raised>Login</button>
			</div>
			<div class="form-row">
				<div id="status" class="status"></div>
			</div>
		</form>
	</div>
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="cphBody" Runat="Server">
</asp:Content>

<asp:Content ID="Content5" ContentPlaceHolderID="cphJS" Runat="Server">
	<script defer src="/js/app/login.v-1.0.js"></script>
</asp:Content>