<%@ Page Title="" Language="VB" MasterPageFile="~/masterpages/admin.master" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="admin_blogs_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphMeta" Runat="Server">
	<title>Manage Blogs</title>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphHead" Runat="Server">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="cphLeft" Runat="Server">
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="cphPageTitle" Runat="Server">
	Manage Blogs
</asp:Content>

<asp:Content ID="Content5" ContentPlaceHolderID="cphMain" Runat="Server">
	<div class="form form-full-width">
		<div id="form-options">
			<p class="form-row">To edit or delete a blog, select one from the list. To add a new blog, click the &ldquo;Add New Blog&rdquo; button.</p>
			<div class="row form-row">
				<div class="col-4">
					<label for="ddl-options">Select a Blog:</label>
					<select id="ddl-options"></select>
				</div>
			</div>
			<div class="form-row">
				<button id="btn-item-new" class="btn" raised>+ Add New Blog</button>
			</div>
		</div>
		<div id="form-edit" class="hidden">
			<div class="row form-row">
				<div class="input-field">
					<input type="text" id="tb-title" name="title" class="req" />
					<label for="tb-title">* Blog Title:</label>
				</div>
			</div>
			<div class="row form-row">
				<div class="input-field">
					<input type="text" id="tb-short-title" name="shortTitle" class="req" />
					<label for="tb-short-title">* Blog Short Title:</label>
				</div>
			</div>
			<div class="row form-row">
				<div class="input-field">
					<input type="text" id="tb-meta-desc" name="metaDesc" class="req" />
					<label for="tb-meta-desc">* Meta Description:</label>
				</div>
			</div>
			<div class="row form-row">
				<div class="input-field">
					<input type="url" id="tb-project-url" name="projectUrl" />
					<label for="tb-project-url">Project URL:</label>
				</div>
			</div>
			<div class="row form-row">
				<label for="ta-body">* Blog Body:</label>
				<textarea id="ta-body" name="postBody" class="req"></textarea>
			</div>
			<div class="row form-row">
				<label for="ta-summary">* Blog Summary:</label>
				<textarea id="ta-summary" name="postSummary" class="req"></textarea>
			</div>
			<div class="row form-row">
				<input type="file" id="f-img" class="hidden" />
				<button id="btn-img-trigger" class="btn" raised>Upload Project Banner Pic</button><br />
				<div id="img-prev" class="row-preview" style="margin-top:15px;margin-bottom:15px;"></div>
				<button id="btn-img-delete" class="btn hidden btn-load-action" raised>Delete Image</button>
			</div>
			<div class="row form-row">
				<div class="col col-6">
					<input type="file" id="f-img-thumb" class="hidden" />
					<button id="btn-img-thumb-trigger" class="btn" raised>Upload Project Thumbnail</button><br />
					<div id="img-thumb-prev" class="row-preview" style="margin-top:15px;margin-bottom:15px;"></div>
					<button id="btn-img-thumb-delete" class="btn hidden btn-load-action" raised>Delete Image</button>
				</div>
				<div></div>
			</div>
			<div class="row form-row">
				<div class="col col-4">
					<div class="input-field">
						<select id="ddl-type" class="material-select req" multiple><asp:Literal runat="server" ID="ltrlTags" /></select>
						<label for="ddl-type">*Property Type:</label>
					</div>
				</div>
				<div class="col"></div>
			</div>
			<div class="row form-row">
				<input type="checkbox" id="cb-active" /><label for="cb-active" class="lbl-cb">Is Active?</label>
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
	<script defer src="/js/app/admin.blogs.v-1.0.js"></script>
</asp:Content>