
Partial Class _Default
	Inherits System.Web.UI.Page

	Protected Sub pageLoad(sender As Object, e As EventArgs) Handles MyBase.Load
		If Page.Request.Url.ToString.Contains("?logout") Then
			Session("adminUser") = Nothing
		End If
	End Sub

End Class
