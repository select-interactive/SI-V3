<%@ Page Title="" Language="VB" MasterPageFile="~/masterpages/admin.master" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="admin_bios_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphMeta" Runat="Server">
    <title>Manage Employee Bios</title>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphHead" Runat="Server">
    <link rel="stylesheet" href="/bower_components/medium-editor/dist/css/medium-editor.min.css">
    <link rel="stylesheet" href="/bower_components/medium-editor/dist/css/themes/beagle.min.css">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="cphPageTitle" Runat="Server">
    Employee Bios
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
                <div class="col col-4">
                    <div class="input-field">
                        <input type="text" id="tb-fname" name="fname" class="req" />
                        <label for="tb-fname">* Fist Name:</label>
                    </div>
                </div>
                <div class="col col-4">
                    <div class="input-field">
                        <input type="text" id="tb-lname" name="lname" class="req" />
                        <label for="tb-lname">* Last Name:</label>
                    </div>
                </div>
                <div class="col col-4">
                    <div class="input-field">
                        <input type="text" id="tb-title" name="title" class="req" />
                        <label for="tb-title">* Title:</label>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col col-4">
                    <div class="input-field">
                        <input type="email" id="tb-email" name="email" class="req" />
                        <label for="tb-email">* Email Address:</label>
                    </div>
                </div>
                <div class="col col-4">
                    <div class="input-field">
                        <input type="tel" id="tb-phone" name="phone" class="req" />
                        <label for-"tb-phone">* Phone Number:</label>
                    </div>
                </div>
                <div></div>
            </div>
            <div class="form-row">
                <div class="col">
                    <label>* Description:</label>
                    <div id="tb-description" name="description" class="req text-editor use-medium-editor"></div>
                </div>
            </div>
            <div class="form-row">
                <div class="col col-4">
                    <div class="input-field">
                        <input type="url" id="tb-twitter" name="twitter" />
                        <label for="tb-twitter">Twitter URL:</label>
                    </div>
                </div>
                <div class="col col-4">
                    <div class="input-field">
                        <input type="url" id="tb-linked-in" name="linkedIn" />
                        <label for="tb-linked-in">LinkedIn URL:</label>
                    </div>
                </div>
                <div class="col col-4">
                    <div class="input-field">
                        <input type="url" id="tb-insta" name="insta" />
                        <label for="tb-insta">Instagram URL:</label>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col col-6">
					<label>Image should be at least 354px by 278px</label><br />
					<button id="btn-upload-img" class="btn btn-raised">Upload Headshot</button>
					<input type="file" id="f-upload-img" class="hidden" />
					<div id="prev-img" style="padding:1rem 0;position:relative;"></div>
					<button id="btn-img-delete" class="btn btn-sm btn-raised hidden">Delete Image</button>
				</div>
            </div>
            <div class="form-row">
                <div class="col" style="width:170px;">
                    <div class="input-field">
                        <input type="text" id="tb-sort-order" name="sortOrder" class="req integer" />
                        <label for="tb-sort-order">* Sort Order:</label>
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
<script defer src="/bower_components/medium-editor/dist/js/medium-editor.min.js"></script>
    <script defer src="<%= JSPath.getPath("admin/bios") %>"></script>
</asp:Content>