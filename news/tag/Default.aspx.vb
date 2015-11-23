
Partial Class news_tag_Default
	Inherits System.Web.UI.Page

	Private ws As New wsApp

	Protected Sub Page_Load(sender As Object, e As EventArgs) Handles MyBase.Load
		Dim url As String = Page.Request.QueryString("tagUrl")

		If Not url Is Nothing AndAlso url.Length > 0 AndAlso Not url = "news" Then
			Dim content As PageContent = ws.loadArticlesByTag(1, 999, url)

			If Not content Is Nothing Then
				ltrlTitle.Text = content.title
				ltrlMeta.Text = "<meta name=""description"" content""" & content.description & """>"
				ltrlHdr.Text = content.title
				ltrlBody.Text = content.html
			Else
				Response.Redirect("/news/")
			End If
		Else
			Response.Redirect("/news/")
		End If
	End Sub

End Class
