Imports Microsoft.VisualBasic

Public Class PageContent

	Public Property title As String
	Public Property description As String
	Public Property html As String

	Public Sub New()
		Me.title = ""
		Me.description = ""
		Me.html = ""
	End Sub

	Public Sub New(title As String, html As String)
		Me.title = title
		Me.html = html
		Me.description = ""
	End Sub

	Public Sub New(title As String, description As String, html As String)
		Me.title = title
		Me.description = ""
		Me.html = html
	End Sub

End Class
