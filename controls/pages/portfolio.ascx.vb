
Partial Class controls_pages_portfolio
	Inherits System.Web.UI.UserControl

	Private ws As New wsApp

	Protected Sub Page_Load(sender As Object, e As EventArgs) Handles MyBase.Load
		ltrlProjects.Text = ws.loadProjects()
	End Sub

End Class