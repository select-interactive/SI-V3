
Partial Class login_Default
	Inherits System.Web.UI.Page

	Protected Sub pageLoad(sender As Object, e As EventArgs) Handles MyBase.Load
		Dim uname As String = Context.Request.Form.Item("username")
		Dim pwd As String = Context.Request.Form.Item("password")

		If Not uname Is Nothing And Not pwd Is Nothing Then
			If uname = "siadmin" And pwd = "SI_devs!" Then
				Session("adminUser") = "active"
				Response.Redirect("/admin/")
			Else
				Response.Redirect("/login/?lgnfail")
			End If
		End If
	End Sub

End Class
