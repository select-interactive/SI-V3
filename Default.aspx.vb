
Partial Class _Default
	Inherits System.Web.UI.Page

	Protected Sub Page_Load(sender As Object, e As EventArgs) Handles MyBase.Load
		Dim body As HtmlControl = Master.FindControl("body")
		body.Attributes.Add("class", "nocomponents home")
	End Sub

End Class
