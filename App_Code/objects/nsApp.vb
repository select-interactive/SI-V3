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
		Public Property location As String
		Public Property imgPath As String
		Public Property imgFileName As String
		Public Property gridImgPath As String
		Public Property gridImgFileName As String
		Public Property website As String
		Public Property url As String
		Public Property sortOrder As Integer
		Public Property featured As Boolean
		Public Property active As Boolean
		Public Property deleted As Boolean
		Public Property createDate As DateTime
		Public Property editDate As DateTime
		Public Property websiteShortUrl As String

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

			Me.websiteShortUrl = website.Substring(website.IndexOf("//") + 2)
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


	Public Class Industry

		Public Property industryId As Integer
		Public Property industry As String
		Public Property url As String
		Public Property active As Boolean
		Public Property deleted As Boolean
		Public Property createDate As DateTime
		Public Property editDate As DateTime

		Public Sub New()

		End Sub

		Public Sub New(ByRef row As dsProjects.Projects_IndustriesRow)
			For Each col As DataColumn In row.Table.Columns
				If row(col.ColumnName) Is System.DBNull.Value Then
					Me.GetType().GetProperty(col.ColumnName).SetValue(Me, Nothing, Nothing)
				Else
					Me.GetType().GetProperty(col.ColumnName).SetValue(Me, row(col.ColumnName), Nothing)
				End If
			Next
		End Sub

	End Class


	Public Class Bio

		Public Property bioId As Integer
		Public Property fname As String
		Public Property lname As String
		Public Property title As String
		Public Property email As String
		Public Property phone As String
		Public Property description As String
		Public Property twitter As String
		Public Property linkedIn As String
		Public Property insta As String
		Public Property url As String
		Public Property imgPath As String
		Public Property imgFileName As String
		Public Property sortOrder As Integer
		Public Property active As Boolean
		Public Property deleted As Boolean
		Public Property createDate As DateTime
		Public Property editDate As DateTime

		Public Sub New()

		End Sub

		Public Sub New(ByRef row As dsBios.BiosRow)
			For Each col As DataColumn In row.Table.Columns
				If row(col.ColumnName) Is System.DBNull.Value Then
					Me.GetType().GetProperty(col.ColumnName).SetValue(Me, Nothing, Nothing)
				Else
					Me.GetType().GetProperty(col.ColumnName).SetValue(Me, row(col.ColumnName), Nothing)
				End If
			Next
		End Sub

	End Class


	Public Class Article

		Public Property articleId As Integer
		Public Property authorId As Integer
		Public Property title As String
		Public Property preview As String
		Public Property body As String
		Public Property thumbPath As String
		Public Property thumbFileName As String
		Public Property bannerPath As String
		Public Property bannerFileName As String
		Public Property url As String
		Public Property active As Boolean
		Public Property deleted As Boolean
		Public Property publishDate As DateTime
		Public Property publishDateStr As String
		Public Property createDate As DateTime
		Public Property editDate As DateTime
		Public Property author As String
		Public Property authorTitle As String
		Public Property authorEmail As String
		Public Property authorTwitter As String

		Public Sub New()

		End Sub

		Public Sub New(ByRef row As dsNews.ArticlesRow)
			For Each col As DataColumn In row.Table.Columns
				If row(col.ColumnName) Is System.DBNull.Value Then
					Me.GetType().GetProperty(col.ColumnName).SetValue(Me, Nothing, Nothing)
				Else
					Me.GetType().GetProperty(col.ColumnName).SetValue(Me, row(col.ColumnName), Nothing)
				End If
			Next

			Me.publishDateStr = Me.publishDate.ToString("MMMM dd, yyyy")
		End Sub

	End Class


	Public Class ArticleTag

		Public Property tagId As Integer
		Public Property tag As String
		Public Property url As String
		Public Property active As Boolean
		Public Property deleted As Boolean
		Public Property createDate As DateTime
		Public Property editDate As DateTime

		Public Sub New()

		End Sub

		Public Sub New(ByRef row As dsNews.Articles_TagsRow)
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