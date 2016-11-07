Imports Microsoft.VisualBasic

Public Class PageContent

	Public Property title As String
	Public Property description As String
	Public Property html As String
	Public Property ogImage As String

	Public Sub New()
		Me.title = ""
		Me.description = ""
		Me.html = ""
		Me.ogImage = ""
	End Sub

	Public Sub New(title As String, html As String)
		Me.title = title
		Me.html = html
		Me.description = ""
		Me.ogImage = ""
	End Sub

	Public Sub New(title As String, description As String, html As String)
		Me.title = title
		Me.description = description
		Me.html = html
		Me.ogImage = ""
	End Sub

	Public Sub New(title As String, description As String, html As String, ogImage As String)
		Me.title = title
		Me.description = description
		Me.html = html
		Me.ogImage = ogImage
	End Sub

End Class
