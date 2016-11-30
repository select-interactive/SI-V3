Imports System.Web.Script.Serialization

Partial Class admin_news_Default
	Inherits System.Web.UI.Page

	Private ws As New wsApp
	Private jss As New JavaScriptSerializer

	Protected Sub pageLoad(sender As Object, e As EventArgs) Handles MyBase.Load
		loadAuthors()
		loadTags()
	End Sub

	Private Sub loadAuthors()
		Dim rsp As WSResponse = jss.Deserialize(Of WSResponse)(ws.biosGetOptions())

		If rsp.success Then
			ltrlAuthor.Text = rsp.obj
		End If
	End Sub

	Private Sub loadTags()
		Dim rsp As WSResponse = jss.Deserialize(Of WSResponse)(ws.articlesTagsGetOptions())

		If rsp.success Then
			ltrlTags.Text = rsp.obj
		End If
	End Sub

End Class
