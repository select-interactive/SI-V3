Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.IO
Imports Parse
Imports Util
Imports System.Web.Script.Serialization

<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsApp
	Inherits System.Web.Services.WebService

	Private parseAppId As String = "caIzDF1iPPqqdTRXaKeC83tblCsx8tDpSchvTPkz"
	Private parseDotNetKey As String = "WrOnMq9fT3DGV5kIkZUHkGnJMBSl8mwz5ZBoG6g6"
	Private pUtil As New ParseUtil(parseAppId, parseDotNetKey)

	Private jss As New JavaScriptSerializer

#Region "Content"

	<WebMethod()>
	Public Function loadControlContent(controlName As String, url As String) As String
		Dim title As String = ""
		Dim html As String = ""
		Dim pc As New PageContent

		If Not url Is Nothing AndAlso url.Length > 0 AndAlso url.Contains("/project/") Then
			pc = loadProjectAsPageContent(url.Substring(url.LastIndexOf("/") + 1))
			html = pc.html
			title = pc.title
		ElseIf Not url Is Nothing AndAlso url.Length > 0 AndAlso url.Contains("/news/") AndAlso Not url.Contains("/tag/") AndAlso url <> "/news/" Then
			pc = loadArticleDetailsAsPageContent(url.Substring(url.IndexOf("news/") + 5))
			html = pc.html
			title = pc.title
		ElseIf Not url Is Nothing AndAlso url.Length > 0 AndAlso url.Contains("/news/") AndAlso url.Contains("/tag/") Then
			pc = loadArticlesByTag(1, 999, url.Substring(url.LastIndexOf("/") + 1))
			html = addArticleThumbsContainer(pc.html, pc.title)
			title = pc.title
		Else
			html = renderPartialToString("/controls/pages/" & controlName & ".ascx")

			' Page titles -- need to think of a different way?
			If controlName = "about" Then
				title = "Fort Worth Web Developers, Building Website and Web Applications"
			ElseIf controlName = "services" Then
				title = "Website Design, Website Development, Search Engine Optimization (SEO)"
			ElseIf controlName = "portfolio" Then
				title = "Award Winning Website Design and Development Projects from Select Interactive"
			ElseIf controlName = "news" Then
				title = "Web Design and Development news, awards, and notes from Select Interactive"
			ElseIf controlName = "contact" Then
				title = "Contact Us to Discuss Your Website or Web Application Needs"
			Else
				title = "Fort Worth Website Design and Web Development. Select Interactive."
			End If
		End If

		Return jss.Serialize(New PageContent(title, html))
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

		pUtil.query("Blog", "datePublished", False, "active", "true")

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

	' Load article thumbnails
	<WebMethod()>
	Public Function loadArticlesByYearOrMonth(start As Integer, max As Integer, url As String) As String
		Dim html As New StringBuilder
		Dim endIndex As Integer = start + max - 1

		pUtil.query("Blog", "datePublished", False, "url", url, True)

		If pUtil.itemList.Count > 0 Then
			If pUtil.itemList.Count < endIndex Then
				endIndex = pUtil.itemList.Count
			End If

			Dim countAdded As Integer = 0
			Dim index As Integer = 0

			While countAdded < endIndex And index < pUtil.itemList.Count
				If pUtil.getField(index, "active") = True Then
					html.Append(pUtil.generateHtml("article-thumb", index))
					countAdded = countAdded + 1
				End If

				index = index + 1
			End While
		End If

		Return html.ToString
	End Function

	' Load article thumbnails
	<WebMethod()>
	Public Function loadArticlesByTag(start As Integer, max As Integer, tagUrl As String) As PageContent
		Dim tagObjId As String = ""
		Dim title As String = ""
		Dim desc As String = ""
		Dim html As New StringBuilder
		Dim endIndex As Integer = start + max - 1

		' First get the tag objectId
		pUtil.query("BlogTag", "", True, "url", tagUrl)

		If pUtil.itemList.Count = 1 Then
			tagObjId = pUtil.itemList(0).ObjectId
			title = pUtil.getField(0, "tag")
			desc = title & " - news and notes from Select Interactive. Website design and development Fort Worth, TX"

			pUtil.query("Blog", "datePublished", False, "tags", tagObjId, True)

			If pUtil.itemList.Count > 0 Then
				If pUtil.itemList.Count < endIndex Then
					endIndex = pUtil.itemList.Count
				End If

				Dim countAdded As Integer = 0
				Dim index As Integer = 0

				While countAdded < endIndex And index < pUtil.itemList.Count
					If pUtil.getField(index, "active") = True Then
						html.Append(pUtil.generateHtml("article-thumb", index))
						countAdded = countAdded + 1
					End If

					index = index + 1
				End While
			End If
		End If

		Return New PageContent(title, desc, html.ToString)
	End Function

	Private Function addArticleThumbsContainer(thumbHTML As String, title As String) As String
		Dim html As New StringBuilder
		html.Append("<div class=""paper paper-gray-dark"">" _
				  & "<h2 Class=""copy-hdr copy-hdr-xl text-center"">" & title & "</h2>" _
				  & "<ul Class=""articles three-cols"">" & thumbHTML & "</ul>" _
				  & "</div>")

		Return html.ToString
	End Function

	' Load article details as PageContent
	<WebMethod()>
	Public Function loadArticleDetailsAsPageContent(url As String) As PageContent
		Dim title As String = ""
		Dim desc As String = ""
		Dim html As New StringBuilder
		Dim ogImage As String = ""

		pUtil.query("Blog", "", True, "url", url)

		If pUtil.itemList.Count = 1 Then
			title = pUtil.getField(0, "title")
			desc = pUtil.getField(0, "metaDesc")

			Dim tagNames As String = pUtil.getField(0, "tagNames")
			Dim arrTagNames() As String = tagNames.Split(", ")
			Dim tagUrls As String = pUtil.getField(0, "tagUrls")
			Dim arrTagUrls() As String = tagUrls.Split(", ")

			Dim tags As String = ""

			For i As Integer = 0 To arrTagNames.Length - 1
				tags &= " <li><a href=""/news/tag/" & arrTagUrls(i) & """ data-control=""news"" class=""navigation"">" & arrTagNames(i) & "</a></li>"
			Next

			Dim datePublished As DateTime = pUtil.getField(0, "datePublished")
			pUtil.setField(0, "datePublished", datePublished.ToString("MMMM dd, yyyy"))

			pUtil.setField(0, "tags", tags)
			html.Append(pUtil.generateHtml("article-details", 0))

			ogImage = "https://www.select-interactive.com/img/news/med/" & pUtil.getField(0, "banner")
		End If

		Return New PageContent(title, desc, html.ToString, ogImage)
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