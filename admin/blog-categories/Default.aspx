<%@ Page Title="" Language="VB" MasterPageFile="~/masterpages/admin.master" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="admin_blog_categories_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphMeta" Runat="Server">
	<title>Manage Blog Categories</title>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphHead" Runat="Server">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="cphLeft" Runat="Server">
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="cphPageTitle" Runat="Server">
	Manage Blog Categories
</asp:Content>

<asp:Content ID="Content5" ContentPlaceHolderID="cphMain" Runat="Server">
	<div class="form form-full-width">
		<div id="form-options">
			<p class="form-row">To edit or delete a category, select one from the drop down list. To add a new category, click the &ldquo;Add New Category&rdquo; button.</p>
			<div class="row form-row">
				<div class="col-4">
					<select id="ddl-options" class="material-select"></select>
				</div>
			</div>
			<div class="form-row">
				<button id="btn-item-new" class="btn" raised>+ Add New Category</button>
			</div>
		</div>
		<div id="form-edit" class="hidden">
			<div class="form-row">
				<div class="col col-4">
					<div class="input-field">
						<label for="tb-category">* Category Name:</label>
						<input type="text" id="tb-category" name="category" class="req" />
					</div>
				</div>
				<div></div>
			</div>
			<div class="form-row">
				<button id="btn-item-save" class="btn btn-green" raised>Save</button>
				<button id="btn-item-back" class="btn" raised>Back</button>
				<button id="btn-item-delete" class="btn btn-red hidden" raised>Delete</button>
			</div>
		</div>
	</div>
</asp:Content>

<asp:Content ID="Content6" ContentPlaceHolderID="cphBody" Runat="Server">
</asp:Content>

<asp:Content ID="Content7" ContentPlaceHolderID="cphJS" Runat="Server">
	<script defer src="/js/app/admin.blogCategories.v-1.0.js"></script>
</asp:Content>