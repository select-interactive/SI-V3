<%@ Control Language="VB" AutoEventWireup="false" CodeFile="navAdmin.ascx.vb" Inherits="controls_navAdmin" %>
<nav id="drawer-nav">
	<ul>
		<li><a href="/admin/"><i class="material-icons">dashboard</i>Admin Dashboard</a></li>
		<li><a href="/admin/bios/"><i class="material-icons">account_circle</i>Bios</a></li>
		<li>&nbsp;</li>
		<li><a href="/admin/projects/"><i class="material-icons">assignment</i>Projects</a></li>
		<li><a href="/admin/projects/tags/"><i class="material-icons">list</i>Project Tags</a></li>
		<li><a href="/admin/projects/industries/"><i class="material-icons">business_center</i>Project Industries</a></li>
		<li>&nbsp;</li>
		<li><a href="/admin/partners/"><i class="material-icons">recent_actors</i>Partners</a></li>
		<li>&nbsp;</li>
		<li><a href="/"><i class="material-icons">home</i>Website Home Page</a></li>
		<li><a href="/?logout"><i class="material-icons">clear</i>Logout</a></li>
	</ul>
</nav>