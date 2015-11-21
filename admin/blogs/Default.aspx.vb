
Partial Class admin_blogs_Default
	Inherits System.Web.UI.Page

	Private ws As New wsApp

	Protected Sub Page_Load(sender As Object, e As EventArgs) Handles MyBase.Load
		ltrlCategories.Text = ws.loadBlogCategoryOptions()
		ltrlTags.Text = ws.loadBlogTagOptions()
	End Sub

End Class
