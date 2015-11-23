
Partial Class controls_pages_news
	Inherits System.Web.UI.UserControl

	Private ws As New wsApp

	Protected Sub Page_Load(sender As Object, e As EventArgs) Handles MyBase.Load
		Dim ctx As HttpContext = HttpContext.Current
		Dim webUrl As String = ctx.Request.QueryString("webUrl")

		Dim hdr As String = "What&rsquo; Happening"
		Dim html As String = ""

		If Not webUrl Is Nothing Then
			If ctx.Request.Url.ToString.Contains("=tag/") Then
				Dim tag As String = ctx.Request.Url.ToString
				tag = tag.Substring(tag.IndexOf("=tag/") + 5)

				Dim pc As PageContent = ws.loadArticlesByTag(1, 999, tag)
				hdr = pc.title
				html = pc.html
			Else
				Dim year As Integer = Now.Year
				Dim month As Integer = -1

				Dim dateParts() As String = webUrl.Split("/")
				year = dateParts(0)

				If dateParts.Length > 1 Then
					month = CInt(dateParts(1))
				End If

				hdr = "Entries from "

				If month > -1 Then
					hdr &= MonthName(month) & " "
				End If

				hdr &= year

				html = ws.loadArticlesByYearOrMonth(1, 999, webUrl)
			End If
		Else
			html = ws.loadArticles(1, 999)
		End If

		ltrlHdr.Text = hdr
		ltrlArticles.Text = html
	End Sub

End Class
