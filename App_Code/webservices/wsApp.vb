Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.IO
Imports Parse
Imports Util

<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsApp
	Inherits System.Web.Services.WebService

	Private parseAppId As String = "caIzDF1iPPqqdTRXaKeC83tblCsx8tDpSchvTPkz"
	Private parseDotNetKey As String = "WrOnMq9fT3DGV5kIkZUHkGnJMBSl8mwz5ZBoG6g6"
	Private pUtil As New ParseUtil(parseAppId, parseDotNetKey)

#Region "Content"

	<WebMethod()>
	Public Function loadControlContent(controlName As String, url As String) As String
		If Not url Is Nothing AndAlso url.Length > 0 AndAlso url.Contains("project") Then
			Return loadProjectAsPageContent(url.Substring(url.LastIndexOf("/") + 1)).html
		ElseIf Not url Is Nothing AndAlso url.Length > 0 AndAlso url.Contains("news") Then
			Return loadArticleDetails(url.Substring(url.IndexOf("news/") + 5))
		Else
			Return renderPartialToString("/controls/pages/" & controlName & ".ascx")
		End If
	End Function

	Private Function renderPartialToString(controlName As String) As String
		Dim p As New Page()
		Dim c As Control = p.LoadControl(controlName)
		p.Controls.Add(c)

		Dim w As New StringWriter
		HttpContext.Current.Server.Execute(p, w, False)

		Return w.ToString
	End Function

#End Region


#Region "Blogs"

	' Load article thumbnails
	<WebMethod()>
	Public Function loadArticles(start As Integer, max As Integer) As String
		Dim html As New StringBuilder
		Dim endIndex As Integer = start + max - 1

		pUtil.query("Blog", "updatedAt", False)

		If pUtil.itemList.Count > 0 Then
			If pUtil.itemList.Count < endIndex Then
				endIndex = pUtil.itemList.Count
			End If

			For i As Integer = start - 1 To endIndex - 1
				html.Append(pUtil.generateHtml("article-thumb", i))
			Next
		End If

		Return html.ToString
	End Function

	' Load article details as PageContent
	<WebMethod()>
	Public Function loadArticleDetails(url As String) As String
		Dim html As New StringBuilder

		pUtil.query("Blog", "", True, "url", url)

		If pUtil.itemList.Count = 1 Then
			Dim tagNames As String = pUtil.getField(0, "tagNames")
			Dim arrTagNames() As String = tagNames.Split(",")
			Dim tagUrls As String = pUtil.getField(0, "tagUrls")
			Dim arrTagUrls() As String = tagUrls.Split(",")

			Dim tags As String = ""

			For i As Integer = 0 To arrTagNames.Length - 1
				tags &= "<li><a href=""/news/tags/" & arrTagUrls(i) & """ class=""navigation"">" & arrTagNames(i) & "</a></li>"
			Next

			pUtil.setField(0, "tags", tags)

			html.Append(pUtil.generateHtml("article-details", 0))
		End If

		Return html.ToString
	End Function

	' Load article details as PageContent
	<WebMethod()>
	Public Function loadArticleDetailsAsPageContent(url As String) As PageContent
		Dim title As String = ""
		Dim desc As String = ""
		Dim html As New StringBuilder

		pUtil.query("Blog", "", True, "url", url)

		If pUtil.itemList.Count = 1 Then
			title = pUtil.getField(0, "title")
			desc = pUtil.getField(0, "metaDesc")

			Dim tagNames As String = pUtil.getField(0, "tagNames")
			Dim arrTagNames() As String = tagNames.Split(",")
			Dim tagUrls As String = pUtil.getField(0, "tagUrls")
			Dim arrTagUrls() As String = tagUrls.Split(",")

			Dim tags As String = ""

			For i As Integer = 0 To arrTagNames.Length - 1
				tags &= "<li><a href=""/news/tags/" & arrTagUrls(i) & """ class=""navigation"">" & arrTagNames(i) & "</a></li>"
			Next

			pUtil.setField(0, "tags", tags)
			html.Append(pUtil.generateHtml("article-details", 0))
		End If

		Return New PageContent(title, desc, html.ToString)
	End Function

	' Load blog categories options for admin
	<WebMethod()>
	Public Function loadBlogCategoryOptions() As String
		Dim html As New StringBuilder

		pUtil.query("BlogCategory", "category")

		For i As Integer = 0 To pUtil.itemList.Count - 1
			Dim projectHTML As String = pUtil.generateHtml("blog-category-option", i)
			projectHTML = projectHTML.Replace("{{objId}}", pUtil.itemList(i).ObjectId)
			html.Append(projectHTML)
		Next

		Return html.ToString
	End Function

	' Load blog tags options for admin
	<WebMethod()>
	Public Function loadBlogTagOptions() As String
		Dim html As New StringBuilder

		pUtil.query("BlogTag", "tag")

		For i As Integer = 0 To pUtil.itemList.Count - 1
			Dim projectHTML As String = pUtil.generateHtml("blog-tag-option", i)
			projectHTML = projectHTML.Replace("{{objId}}", pUtil.itemList(i).ObjectId)
			html.Append(projectHTML)
		Next

		Return html.ToString
	End Function

#End Region


#Region "Projects"

	<WebMethod()>
	Public Function loadProjects() As String
		Dim html As New StringBuilder

		pUtil.query("Project", "sortOrder")

		For i As Integer = 0 To pUtil.itemList.Count - 1
			Dim projectHTML As String = pUtil.generateHtml("project-li", i)
			projectHTML = projectHTML.Replace("{{objId}}", pUtil.itemList(i).ObjectId)
			html.Append(projectHTML)
		Next

		Return html.ToString
	End Function

	<WebMethod()>
	Public Function loadProject(objId As String) As String
		Dim html As New StringBuilder

		pUtil.query("Project", "sortOrder", True, "objectId", objId)

		If pUtil.itemList.Count = 1 Then
			html.Append(pUtil.generateHtml("project-details", 0))
		End If

		Return html.ToString
	End Function

	<WebMethod()>
	Public Function loadProjectAsPageContent(objId As String) As PageContent
		Dim title As String = ""
		Dim html As New StringBuilder

		pUtil.query("Project", "sortOrder", True, "objectId", objId)

		If pUtil.itemList.Count = 1 Then
			title = "Website for " & pUtil.getField(0, "name")
			html.Append(pUtil.generateHtml("project-detail", 0))
		End If

		Return New PageContent(title, html.ToString)
	End Function

#End Region

End Class