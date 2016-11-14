Imports System.Web.Script.Serialization

Partial Class portfolio_tag_Default
	Inherits System.Web.UI.Page

	Private ws As New wsApp
	Private jss As New JavaScriptSerializer

	Protected Sub pageLoad(sender As Object, e As EventArgs) Handles MyBase.Load
		Dim url As String = Page.Request.QueryString("url")

		If url Is Nothing Or url = "" Then
			Response.Redirect("/portfolio/", True)
		End If

		loadTag(url)
	End Sub

	Private Sub loadTag(tagUrl As String)
		Dim rsp As WSResponse = ws.projectTagGetPageHtml(tagUrl)

		If rsp.success Then
			Dim content As PageContent = rsp.obj
			ltrlMeta.Text = "<title>" & content.title & "</title>"
			ltrlContent.Text = content.html
		End If
	End Sub

End Class
