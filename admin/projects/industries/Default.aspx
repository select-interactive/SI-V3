<%@ Page Title="" Language="VB" MasterPageFile="~/masterpages/admin.master" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="admin_projects_industries_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphMeta" Runat="Server">
    <title>Manage Industries</title>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphHead" Runat="Server">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="cphPageTitle" Runat="Server">
    Manage Industries
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
                <div class="col col-6">
                    <div class="input-field">
                        <input type="text" id="tb-industry" name="industry" class="req" />
                        <label for="tb-industry">* Industry Name:</label>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <input type="checkbox" id="cb-active" name="active" /><label for="cb-active">Active Tag?</label>
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
    <script defer src="<%= JSPath.getPath("admin/projects_industries") %>"></script>
</asp:Content>

