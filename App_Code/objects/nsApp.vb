Imports Microsoft.VisualBasic
Imports System.Data

Namespace nsApp

	Public Class Partner

		Public Property partnerId As Integer
		Public Property name As String
		Public Property description As String
		Public Property logoPath As String
		Public Property logoFileName As String
		Public Property website As String
		Public Property contactName As String
		Public Property contactEmail As String
		Public Property contactPhone As String
		Public Property url As String
		Public Property active As Boolean
		Public Property deleted As Boolean
		Public Property createDate As DateTime
		Public Property editDate As DateTime

		Public Sub New()

		End Sub

		Public Sub New(ByRef row As dsPartners.PartnersRow)
			For Each col As DataColumn In row.Table.Columns
				If row(col.ColumnName) Is System.DBNull.Value Then
					Me.GetType().GetProperty(col.ColumnName).SetValue(Me, Nothing, Nothing)
				Else
					Me.GetType().GetProperty(col.ColumnName).SetValue(Me, row(col.ColumnName), Nothing)
				End If
			Next
		End Sub

	End Class


	Public Class Project

		Public Property projectId As Integer
		Public Property name As String
		Public Property description As String
		Public Property imgPath As String
		Public Property imgFileName As String
		Public Property website As String
		Public Property url As String
		Public Property sortOrder As Integer
		Public Property featured As Boolean
		Public Property active As Boolean
		Public Property deleted As Boolean
		Public Property createDate As DateTime
		Public Property editDate As DateTime

		Public Sub New()

		End Sub

		Public Sub New(ByRef row As dsProjects.ProjectsRow)
			For Each col As DataColumn In row.Table.Columns
				If row(col.ColumnName) Is System.DBNull.Value Then
					Me.GetType().GetProperty(col.ColumnName).SetValue(Me, Nothing, Nothing)
				Else
					Me.GetType().GetProperty(col.ColumnName).SetValue(Me, row(col.ColumnName), Nothing)
				End If
			Next
		End Sub

	End Class

	Public Class ProjectTag

		Public Property tagId As Integer
		Public Property tag As String
		Public Property url As String
		Public Property active As Boolean
		Public Property deleted As Boolean
		Public Property createDate As DateTime
		Public Property editDate As DateTime

		Public Sub New()

		End Sub

		Public Sub New(ByRef row As dsProjects.Projects_TagsRow)
			For Each col As DataColumn In row.Table.Columns
				If row(col.ColumnName) Is System.DBNull.Value Then
					Me.GetType().GetProperty(col.ColumnName).SetValue(Me, Nothing, Nothing)
				Else
					Me.GetType().GetProperty(col.ColumnName).SetValue(Me, row(col.ColumnName), Nothing)
				End If
			Next
		End Sub
	End Class


End Namespace