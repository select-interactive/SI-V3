<%@ Page Title="" Language="VB" MasterPageFile="~/masterpages/admin.master" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="admin_users_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphMeta" Runat="Server">
	<title>Manage Users</title>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphHead" Runat="Server">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="cphLeft" Runat="Server">
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="cphPageTitle" Runat="Server">
	Manage Users
</asp:Content>

<asp:Content ID="Content5" ContentPlaceHolderID="cphMain" Runat="Server">
	<div class="form form-full-width">
		<div id="form-grid">
			<div id="admin-grid" class="admin-grid">
				<h3 class="admin-grid-hdr">Users</h3>
				<div id="grid-container" class="admin-grid-rows"></div>
			</div>
			<button id="btn-new" class="btn" raised>+ Add New User</button>
		</div>
		<div id="form-edit" class="hidden">
			<div class="row form-row">
				<div class="col col-4">
					<div class="input-field">
						<input type="text" id="tb-uname" class="req" name="username" />
						<label for="tb-uname">* Username:</label>
					</div>
				</div>
			</div>
			<div class="row form-row">
				<div class="col col-4">
					<div class="input-field">
						<input type="password" id="tb-pwd" class="req" name="password" />
						<label for="tb-pwd">* Password:</label>
					</div>
				</div>
			</div>
			<div class="row form-row">
				<div class="col col-4">
					<div class="input-field">
						<input type="email" id="tb-email" class="req" name="email" />
						<label for="tb-email">* Email Address:</label>
					</div>
				</div>
			</div>
			<div class="row form-row">
				<div class="col col-4 text-right">
					<button id="btn-back" class="btn" raised>Back</button>
					<button id="btn-save" class="btn" raised>Save User</button>
				</div>
			</div>
		</div>
	</div>
</asp:Content>

<asp:Content ID="Content6" ContentPlaceHolderID="cphBody" Runat="Server">
</asp:Content>

<asp:Content ID="Content7" ContentPlaceHolderID="cphJS" Runat="Server">
	<script defer src="/js/app/admin.users.v-1.0.js"></script>
</asp:Content>