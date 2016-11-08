Imports System.Web.Script.Serialization

Partial Class admin_projects_Default
	Inherits System.Web.UI.Page

	Private ws As New wsApp
	Private jss As New JavaScriptSerializer

	Protected Sub pageLoad(sender As Object, e As EventArgs) Handles MyBase.Load
		loadTags()
	End Sub

	Private Sub loadTags()
		Dim rsp As WSResponse = jss.Deserialize(Of WSResponse)(ws.projectTagsGetOptions())

		If rsp.success Then
			ltrlTags.Text = rsp.obj
		End If
	End Sub

End Class
