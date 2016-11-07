
Partial Class admin_projects_Default
	Inherits System.Web.UI.Page

	Private ws As New wsApp

	Protected Sub Page_Load(sender As Object, e As EventArgs) Handles MyBase.Load
		ltrlTags.Text = ws.loadProjectTagOptions()
	End Sub

End Class
