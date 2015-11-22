
Partial Class controls_pages_home
	Inherits System.Web.UI.UserControl

	Private ws As New wsApp

	Protected Sub Page_Load(sender As Object, e As EventArgs) Handles MyBase.Load
		ltrlArticles.Text = ws.loadArticles(1, 4)
	End Sub

End Class
