
Partial Class masterpages_admin
	Inherits System.Web.UI.MasterPage

	Protected Sub Page_Load(sender As Object, e As EventArgs)
		If Session("adminUser") Is Nothing Then
			Response.Redirect("/login/")
		End If
	End Sub

End Class