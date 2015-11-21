<%@ Control Language="VB" AutoEventWireup="false" CodeFile="navAdmin.ascx.vb" Inherits="controls_navAdmin" %>
<nav id="drawer-nav">
	<ul>
		<li><a href="/admin/"><i class="material-icons">dashboard</i>Admin Dashboard</a></li>
		<li><a href="/admin/blogs/"><i class="material-icons">mode_edit</i>Manage Blogs</a></li>
		<li><a href="/admin/blog-tags/"><i class="material-icons">mode_edit</i>Manage Blog Tags</a></li>
		<li><a href="/admin/blog-categories/"><i class="material-icons">mode_edit</i>Manage Blog Categories</a></li>
		<li><a href="/admin/projects/"><i class="material-icons">insert_drive_file</i>Manage Projects</a></li>
		<li>&nbsp;</li>
		<li><a href="/"><i class="material-icons">home</i>Website Home Page</a></li>
		<li><a href="#logout" class="logout"><i class="material-icons">clear</i>Logout</a></li>
	</ul>
</nav>