
Partial Class controls_head
	Inherits System.Web.UI.UserControl

	Protected Sub Page_Load(sender As Object, e As EventArgs) Handles MyBase.Load
		Dim cssVersion As String = "3.8.min"
		Dim ctx As HttpContext = HttpContext.Current

		If ctx.Request.Path <> "/default.aspx" Then
			ltrlStyles.Text = "<link rel=""Stylesheet"" href=""/css/styles.v-" & cssVersion & ".css"">"
		End If
	End Sub

End Class
