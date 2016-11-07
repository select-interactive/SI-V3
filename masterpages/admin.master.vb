Imports Parse

Partial Class masterpages_admin
	Inherits System.Web.UI.MasterPage

	Protected Sub Page_Load(sender As Object, e As EventArgs)
		Dim parseAppId As String = "caIzDF1iPPqqdTRXaKeC83tblCsx8tDpSchvTPkz"
		Dim parseDotNetKey As String = "WrOnMq9fT3DGV5kIkZUHkGnJMBSl8mwz5ZBoG6g6"
		ParseClient.Initialize(parseAppId, parseDotNetKey)

		If ParseUser.CurrentUser Is Nothing Then
			Response.Redirect("/login/")
		End If
	End Sub

End Class
