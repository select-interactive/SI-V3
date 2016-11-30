<%@ Page Title="" Language="VB" MasterPageFile="~/masterpages/admin.master" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="admin_news_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphMeta" Runat="Server">
	<title>Manage Articles</title>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphHead" Runat="Server">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="cphPageTitle" Runat="Server">
	News Articles
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="cphLeft" Runat="Server">
</asp:Content>

<asp:Content ID="Content5" ContentPlaceHolderID="cphMain" Runat="Server">
    <div class="form form-full-width">
        <div id="form-grid">
            <div class="admin-grid">
                <div class="float-right" style="margin:16px 24px 0 0;"><button id="btn-new" class="btn btn-raised btn-ripple">+ Add New <span class="lbl-item"></span></button></div>
                <h3 class="admin-grid-hdr"><span class="lbl-items"></span></h3>
                <div id="grid-container" class="admin-grid-rows"></div>
            </div>
        </div>
        <div id="form-edit" class="hidden">
			<div class="form-row">
				<div class="col">
					<div class="input-field">
						<input type="text" id="tb-title" name="title" class="req" />
						<label for="tb-title">Title:</label>
					</div>
				</div>
			</div>
			<div class="form-row">
				<div class="col" style="max-width:240px;">
					<div class="input-field">
						<select id="ddl-author" name="authorId" class="req integer">
							<asp:Literal runat="server" ID="ltrlAuthor" />
						</select>
					</div>
				</div>
			</div>
			<div class="form-row">
                <div class="col">
                    <label>* Preview:</label>
                    <textarea id="tb-preview" name="preview" class="req use-ckeditor"></textarea>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <label>* Full Entry:</label>
                    <textarea id="tb-body" name="body" class="req use-ckeditor"></textarea>
                </div>
            </div>
            <div class="form-row">
                <div class="col col-6">
					<label>Image should be at least 600px by 480px</label><br />
					<button id="btn-upload-img" class="btn btn-raised">Upload Thumbnail</button>
					<input type="file" id="f-upload-img" class="hidden" />
					<div id="prev-img" style="padding:1rem 0;position:relative;"></div>
					<button id="btn-img-delete" class="btn btn-sm btn-raised hidden">Delete Image</button>
				</div>
				<div class="col col-6">
					<label>Image should be at least 2000px by 600px</label><br />
					<button id="btn-upload-img-banner" class="btn btn-raised">Upload Banner</button>
					<input type="file" id="f-upload-img-banner" class="hidden" />
					<div id="prev-img-banner" style="padding:1rem 0;position:relative;"></div>
					<button id="btn-img-banner-delete" class="btn btn-sm btn-raised hidden">Delete Image</button>
				</div>
            </div>
			 <div class="form-row">
                <div class="col col-6">
                    <label for="ddl-tags">* Tags:</label>
                    <select id="ddl-tags" data-placeholder="Tags..." class="chosen-select" multiple>
                        <asp:Literal runat="server" id="ltrlTags" />
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="col" style="width:250px;">
                    <div class="input-field">
                        <input type="text" id="tb-publish-date" name="publishDate" class="req input-date" />
                        <label for="tb-publish-date">* Publish Date:</label>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <input type="checkbox" id="cb-active" name="active" /><label for="cb-active">Active on Website?</label>
                </div>
            </div>
            <div class="form-row">
                <div class="col text-right">
                    <button id="btn-back" class="btn btn-raised btn-ripple">Back</button>
                    <button id="btn-delete" class="btn btn-raised btn-ripple hidden">Delete</button>
                    <button id="btn-save" class="btn btn-raised btn-ripple">Save</button>
                </div>
            </div>
        </div>
    </div>
</asp:Content>

<asp:Content ID="Content6" ContentPlaceHolderID="cphBody" Runat="Server">
</asp:Content>

<asp:Content ID="Content7" ContentPlaceHolderID="cphJS" Runat="Server">
	<script defer src="/js/libs/jquery/dist/jquery.min.js"></script>
    <script defer src="/js/libs/chosen/chosen.jquery.min.js"></script>
	<script defer src="/ckeditor/ckeditor.js"></script>
    <script defer src="<%= JSPath.getPath("admin/news") %>"></script>
</asp:Content>