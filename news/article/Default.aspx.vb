Imports System.Web.Script.Serialization

Partial Class news_article_Default
	Inherits System.Web.UI.Page

	Private ws As New wsApp
	Private jss As New JavaScriptSerializer

	Protected Sub pageLoad(Sender As Object, e As EventArgs) Handles MyBase.Load
		Dim url As String = Page.Request.QueryString("url")

		If url Is Nothing Or url = "" Then
			Response.Redirect("/news/", True)
		End If

		loadProject(url)
	End Sub

	Private Sub loadProject(url As String)
		Dim rsp As WSResponse = ws.articleGetHtml(url)

		If rsp.success Then
			Dim content As PageContent = rsp.obj

			Dim meta As New StringBuilder
			meta.Append("<title>" & content.title & "</title>")
			meta.Append("<meta name=""description"" content=""" & content.description & """>")
			meta.Append("<meta property=""og:title"" content=""" & content.title & """>")
			meta.Append("<meta property=""og:site_name"" content=""Select Interactive"">")
			meta.Append("<meta property=""og:url"" content=""" & Request.Url.ToString & """>")
			meta.Append("<meta property=""og:description"" content=""" & content.description & """>")
			meta.Append("<meta property=""og:type"" content=""article"">")
			meta.Append("<meta property=""og:image"" content=""" & content.ogImage & """>")
			ltrlMeta.Text = meta.ToString

			ltrlContent.Text = content.html
		Else
			Response.Redirect("/portfolio/", True)
		End If
	End Sub

End Class
