Imports System.Web.Script.Serialization

Partial Class controls_pages_project
	Inherits System.Web.UI.UserControl

	Private ws As New wsApp
	Private jss As New JavaScriptSerializer

	Protected Sub pageLoad(Sender As Object, e As EventArgs) Handles MyBase.Load
		Dim url As String = Page.Request.QueryString("url")

		If url Is Nothing Or url = "" Then
			Response.Redirect("/portfolio/", True)
		End If

		loadProject(url)
	End Sub

	Private Sub loadProject(url As String)
		Dim rsp As WSResponse = ws.projectGetHtml(url)

		If rsp.success Then
			Dim content As PageContent = rsp.obj
			ltrlContent.Text = content.html
		Else
			Response.Redirect("/portfolio/", True)
		End If
	End Sub

End Class
