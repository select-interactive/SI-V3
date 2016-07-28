Imports Microsoft.VisualBasic
Imports System.Data

Namespace nsApp

	Public Class Project

		Public Property projectId As Integer
		Public Property name As String
		Public Property summary As String
		Public Property thumbnail As String
		Public Property primaryImg As String
		Public Property designFirmUrl As String
		Public Property designFirm As String
		Public Property url As String
		Public Property sortOrder As Integer
		Public Property tagIds As String
		Public Property active As Boolean
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

	Public Class Project_Tag

		Public Property tagId As Integer
		Public Property tag As String
		Public Property url As String

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

	Public Class Blog

		Public Property blogId As Integer
		Public Property title As String
		Public Property shortTitle As String
		Public Property metaDesc As String
		Public Property postSummary As String
		Public Property postBody As String
		Public Property thumbnail As String
		Public Property banner As String
		Public Property projectUrl As String
		Public Property tagIds As String
		Public Property categoryId As Integer
		Public Property url As String
		Public Property active As Boolean
		Public Property publishDate As DateTime
		Public Property createDate As DateTime
		Public Property editDate As DateTime

		Public Sub New()

		End Sub

		Public Sub New(ByRef row As dsBlogs.BlogsRow)
			For Each col As DataColumn In row.Table.Columns
				If row(col.ColumnName) Is System.DBNull.Value Then
					Me.GetType().GetProperty(col.ColumnName).SetValue(Me, Nothing, Nothing)
				Else
					Me.GetType().GetProperty(col.ColumnName).SetValue(Me, row(col.ColumnName), Nothing)
				End If
			Next
		End Sub

	End Class

	Public Class Blog_Category

		Public Property categoryId As Integer
		Public Property category As String
		Public Property url As String

		Public Sub New()

		End Sub

		Public Sub New(ByRef row As dsBlogs.Blogs_CategoryRow)
			For Each col As DataColumn In row.Table.Columns
				If row(col.ColumnName) Is System.DBNull.Value Then
					Me.GetType().GetProperty(col.ColumnName).SetValue(Me, Nothing, Nothing)
				Else
					Me.GetType().GetProperty(col.ColumnName).SetValue(Me, row(col.ColumnName), Nothing)
				End If
			Next
		End Sub

	End Class

	Public Class Blog_Tag

		Public Property tagId As Integer
		Public Property tag As String
		Public Property url As String

		Public Sub New()

		End Sub

		Public Sub New(ByRef row As dsBlogs.Blogs_TagsRow)
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
