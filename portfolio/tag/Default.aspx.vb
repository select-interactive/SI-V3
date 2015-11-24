
Partial Class portfolio_tag_Default
	Inherits System.Web.UI.Page

	Private ws As New wsApp

	Protected Sub Page_Load(sender As Object, e As EventArgs) Handles MyBase.Load
		Dim url As String = Page.Request.QueryString("tagUrl")

		If Not url Is Nothing AndAlso url.Length > 0 AndAlso Not url = "award" Then
			Dim content As PageContent = ws.loadProjectsByTag(1, 999, url)

			If Not content Is Nothing Then
				ltrlTitle.Text = content.title
				ltrlMeta.Text = "<meta name=""description"" content=""" & content.description & """>"
				ltrlHdr.Text = content.title & " Projects"
				ltrlProjects.Text = content.html
			Else
				Response.Redirect("/portfolio/")
			End If
		Else
			Response.Redirect("/portfolio/")
		End If
	End Sub

End Class