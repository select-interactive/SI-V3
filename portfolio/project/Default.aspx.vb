
Partial Class portfolio_project_Default
	Inherits System.Web.UI.Page

	Private ws As New wsApp

	Protected Sub Page_Load(sender As Object, e As EventArgs) Handles MyBase.Load
		Dim url As String = Page.Request.QueryString("objId")

		If Not url Is Nothing AndAlso url.Length > 0 AndAlso Not url = "project" Then
			Dim content As PageContent = ws.loadProjectAsPageContent(url)

			If Not content Is Nothing Then
				ltrlTitle.Text = content.title

				Dim meta As New StringBuilder
				meta.Append("<meta name=""description"" content=""" & content.description & """>")
				meta.Append("<meta property=""og:title"" content=""" & content.title & """>")
				meta.Append("<meta property=""og:site_name"" content=""Select Interactive"">")
				meta.Append("<meta property=""og:url"" content=""" & Request.Url.ToString & """>")
				meta.Append("<meta property=""og:description"" content=""" & content.description & """>")
				meta.Append("<meta property=""og:type"" content=""article"">")
				meta.Append("<meta property=""og:image"" content=""" & content.ogImage & """>")
				ltrlMeta.Text = meta.ToString

				ltrlProject.Text = content.html
			Else
				Response.Redirect("/portfolio/")
			End If
		Else
			Response.Redirect("/portfolio/")
		End If
	End Sub

End Class