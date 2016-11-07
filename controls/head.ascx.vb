Imports System.Reflection

Partial Class controls_head
    Inherits System.Web.UI.UserControl

	Protected Sub Page_Load(sender As Object, e As EventArgs) Handles MyBase.Load
		Dim css As String = "<link rel=""stylesheet"" href=""/css/styles.v-" & ConfigurationManager.AppSettings("cssVersion")

		If Request.Url.Host.ToString.Contains(".com") Then
			css &= ".min"
		Else
			css &= Now.Year & Now.Month & Now.Year & Now.Hour & Now.Minute & Now.Second
		End If

		css &= ".css"">"

		ltrlCss.Text = css
	End Sub

End Class