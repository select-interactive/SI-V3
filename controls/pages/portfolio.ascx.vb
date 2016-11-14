Imports System.Web.Script.Serialization

Partial Class controls_pages_portfolio
	Inherits System.Web.UI.UserControl

	Private ws As New wsApp
	Private jss As New JavaScriptSerializer

	Protected Sub pageLoad(sender As Object, e As EventArgs) Handles MyBase.Load
		loadProjects()
	End Sub

	Private Sub loadProjects()
		Dim rsp As WSResponse = jss.Deserialize(Of WSResponse)(ws.projectsGetGrid(""))

		If rsp.success Then
			ltrlProjects.Text = rsp.obj
		Else
			Response.Write(rsp.msg)
		End If
	End Sub

End Class
