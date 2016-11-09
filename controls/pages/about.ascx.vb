Imports System.Web.Script.Serialization

Partial Class controls_pages_about
	Inherits System.Web.UI.UserControl

	Private ws As New wsApp
	Private jss As New JavaScriptSerializer

	Protected Sub pageLoad(sender As Object, e As EventArgs) Handles MyBase.Load
		loadTeam()
	End Sub

	Private Sub loadTeam()
		Dim rsp As WSResponse = jss.Deserialize(Of WSResponse)(ws.biosGetGrid())

		If rsp.success Then
			ltrlTeam.Text = rsp.obj
		End If
	End Sub

End Class
