Imports Microsoft.VisualBasic

Public Class WSResponse

	Public Property success As Boolean
	Public Property msg As String
	Public Property obj As Object

	Public Sub New()

	End Sub

	Public Sub setSuccess()
		Me.success = True
	End Sub

	Public Sub setSuccess(obj As Object)
		Me.success = True
		Me.obj = obj
	End Sub

	Public Sub setError(msg As String)
		Me.success = False
		Me.msg = msg
	End Sub

End Class