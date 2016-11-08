
Partial Class _Default
	Inherits System.Web.UI.Page

	Protected Sub pageLoad(sender As Object, e As EventArgs) Handles MyBase.Load
		Dim body As HtmlControl = Master.FindControl("body")
		body.Attributes.Add("class", "home home-top")

		If Page.Request.Url.ToString.Contains("?logout") Then
			Session("adminUser") = Nothing
		End If
	End Sub

End Class
