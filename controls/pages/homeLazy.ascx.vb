Imports System.Web.Script.Serialization

Partial Class controls_pages_homeLazy
	Inherits System.Web.UI.UserControl

	Private ws As New wsApp
	Private jss As New JavaScriptSerializer

	Protected Sub pageLoad(sender As Object, e As EventArgs) Handles MyBase.Load
		loadPartners()
	End Sub

	Private Sub loadPartners()
		Dim rsp As WSResponse = jss.Deserialize(Of WSResponse)(ws.partnersGetGrid())

		If rsp.success Then
			ltrlPartners.Text = rsp.obj
		End If
	End Sub

End Class