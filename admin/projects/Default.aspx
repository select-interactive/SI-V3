<%@ Page Title="" Language="VB" MasterPageFile="~/masterpages/admin.master" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="admin_projects_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphMeta" Runat="Server">
	<title>Manage Projects</title>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphHead" Runat="Server">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="cphLeft" Runat="Server">
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="cphPageTitle" Runat="Server">
	Manage Portfolio
</asp:Content>

<asp:Content ID="Content5" ContentPlaceHolderID="cphMain" Runat="Server">
	<div class="form form-full-width">
		<div id="form-options">
			<p class="form-row">To edit or delete a project, select one from the list. To add a new project, click the &ldquo;Add New Project&rdquo; button.</p>
			<div class="row form-row">
				<div class="col-4">
					<label for="ddl-options">Select a Project:</label>
					<select id="ddl-options"></select>
				</div>
			</div>
			<div class="form-row">
				<button id="btn-item-new" class="btn" raised>+ Add New Project</button>
			</div>
		</div>
		<div id="form-edit" class="hidden">
			<div class="row form-row">
				<div class="col col-6">
					<div class="input-field">
						<input type="text" id="tb-name" name="name" class="req" />
						<label for="tb-name">* Project Name:</label>
					</div>
				</div>
				<div class="col col-6">
					<div class="input-field">
						<input type="url" id="tb-url" name="url" class="req" />
						<label for="tb-url">* Project URL:</label>
					</div>
				</div>
			</div>
			<div class="row form-row">
				<label for="ta-summary">* Project Summary:</label>
				<textarea id="ta-summary" name="summary" class="req"></textarea>
			</div>
			<div class="row form-row">
				<div class="col col-6">
					<input type="file" id="f-img" class="hidden" />
					<button id="btn-img-trigger" class="btn" raised>Upload Project Thumbnail</button><br />
					<div id="img-prev" class="row-preview" style="margin-top:15px;margin-bottom:15px;"></div>
					<button id="btn-img-delete" class="btn hidden btn-load-action" raised>Delete Image</button>
				</div>
			</div>
			<div class="row form-row">
				<div class="col col-4">
					<div class="input-field">
						<input type="number" id="tb-sort-order" name="sortOrder" class="req" />
						<label for="tb-sort-order">* Sort Order</label>
					</div>
				</div>
				<div class="col col-4">
					<input type="checkbox" id="cb-active" /><label for="cb-active" class="lbl-cb">Is Active?</label>
				</div>
				<div class="col"></div>
			</div>
			<div class="row form-row">
				<div class="col">
					<button id="btn-item-save" class="btn btn-green" raised>Save</button>
					<button id="btn-item-back" class="btn" raised>Back</button>
					<button id="btn-item-delete" class="btn btn-red hidden" raised>Delete</button>
				</div>
			</div>
		</div>
	</div>
</asp:Content>

<asp:Content ID="Content6" ContentPlaceHolderID="cphBody" Runat="Server">
</asp:Content>

<asp:Content ID="Content7" ContentPlaceHolderID="cphJS" Runat="Server">
	<script defer src="/ckeditor/ckeditor.js"></script>
	<script defer src="/js/app/admin.projects.v-1.0.js"></script>
</asp:Content>