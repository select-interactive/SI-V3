
Partial Class controls_pages_project
	Inherits System.Web.UI.UserControl

	Private ws As New wsApp

	Protected Sub Page_Load(sender As Object, e As EventArgs) Handles MyBase.Load
		Dim url As String = Page.Request.QueryString("objId")

		If Not url Is Nothing AndAlso url.Length > 0 AndAlso Not url = "project" Then
			Dim content As PageContent = ws.loadProjectAsPageContent(url)

			If Not content Is Nothing Then
				ltrlProject.Text = content.html
			Else
				Response.Redirect("/portfolio/")
			End If
		Else
			Response.Redirect("/portfolio/")
		End If
	End Sub

End Class
