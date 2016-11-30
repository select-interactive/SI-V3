Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.IO
Imports System.Web.Script.Serialization
Imports System.Data
Imports nsApp

<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class wsApp
	Inherits System.Web.Services.WebService

	Private jss As New JavaScriptSerializer


#Region "Projects"

	Private Function projectsGet(projectId As Integer,
								 partnerId As Integer,
								 tagId As Integer,
								 url As String,
								 featured As Boolean,
								 active As Boolean) As dsProjects.ProjectsDataTable
		Dim ta As New dsProjectsTableAdapters.ProjectsTableAdapter
		Dim dt As New dsProjects.ProjectsDataTable
		ta.Fill(dt, projectId, partnerId, tagId, url, featured, active)
		Return dt
	End Function

	<WebMethod()>
	Public Function projectsGetJson(projectId As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim dt As dsProjects.ProjectsDataTable = projectsGet(projectId, -1, -1, "", False, False)
			Dim projects As New List(Of Project)

			For Each row As dsProjects.ProjectsRow In dt
				projects.Add(New Project(row))
			Next

			rsp.setSuccess(projects)
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function projectsGetGrid(tagUrl As String) As String
		Dim rsp As New WSResponse

		Try
			Dim tagId As Integer = -1

			If tagUrl <> "" Then
				Dim dtTags As dsProjects.Projects_TagsDataTable = projectTagsGet(-1, -1, tagUrl, True)
				If dtTags.Rows.Count = 1 Then
					Dim tag As New ProjectTag(dtTags.Rows(0))
					tagId = tag.tagId
				End If
			End If

			Dim dt As dsProjects.ProjectsDataTable = projectsGet(-1, -1, tagId, "", False, True)
			Dim tmpl As String = File.ReadAllText(Server.MapPath("/templates/projects/list-item.html"))
			Dim html As New StringBuilder()

			Dim index As Integer = 0

			For Each row As dsProjects.ProjectsRow In dt
				html.Append(generateHtmlRowTmpl(tmpl, dt, row))

				If index >= 6 Then
					html.Replace("{{imgSrc}}", "data-src=""" & row.gridImgPath & """")
					html.Replace("{{lazy}}", "data-lazy")
				Else
					html.Replace("{{imgSrc}}", "src=""" & row.gridImgPath & """")
					html.Replace("{{lazy}}", "")
				End If

				Dim industries As New StringBuilder
				Dim dtIndustries As dsProjects.Projects_IndustriesDataTable = industriesGet(-1, row.projectId, "", True)

				If dtIndustries.Rows.Count > 0 Then
					industries.Append("<ul class=""project-item-industries"">")

					For Each rowInd As dsProjects.Projects_IndustriesRow In dtIndustries
						industries.Append("<li>" & rowInd.industry & "</li>")
					Next

					industries.Append("</ul>")
				End If

				html.Replace("{{industries}}", industries.ToString)

				index += 1
			Next

			rsp.setSuccess(html.ToString())
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function projectGetHtml(url As String) As WSResponse
		Dim rsp As New WSResponse

		Try
			Dim dt As dsProjects.ProjectsDataTable = projectsGet(-1, -1, -1, url, False, True)

			If dt.Rows.Count = 0 Then
				rsp.setError("Project not found.")
			ElseIf dt.Rows.Count = 1 Then
				Dim p As New Project(dt.Rows(0))
				Dim title As String = "Website Development for: " & p.name
				Dim description As String = "Select Interactive provided website development for " & p.name & ". " & p.location & "."

				Dim tmpl As String = File.ReadAllText(Server.MapPath("/templates/projects/details.html"))
				Dim html As String = generateHtmlTmpl(tmpl, dt)
				html = html.Replace("{{websiteShortUrl}}", p.websiteShortUrl)

				Dim rspTags As WSResponse = jss.Deserialize(Of WSResponse)(projectTagsGetHtml(p.projectId))

				If rspTags.success Then
					html = html.Replace("{{tags}}", rspTags.obj)
				Else
					html = html.Replace("{{tags}}", "")
				End If

				rsp.setSuccess(New PageContent(title, description, html, p.imgPath))
			End If
		Catch ex As Exception

		End Try

		Return rsp
	End Function

	<WebMethod()>
	Public Function projectSave(data As String) As String
		Dim rsp As New WSResponse

		Try
			Dim theId As Integer = -1
			Dim ta As New dsProjectsTableAdapters.ProjectsTableAdapter

			Dim params As Project = jss.Deserialize(Of Project)(data)
			params.url = generateURLString(params.name)

			With params
				ta.Update(.projectId,
						  .name,
						  .description,
						  .location,
						  .imgPath,
						  .imgFileName,
						  .gridImgPath,
						  .gridImgFileName,
						  .website,
						  .url,
						  .sortOrder,
						  .featured,
						  .active,
						  theId)
			End With

			rsp.setSuccess(theId)
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function projectDelete(projectId As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim ta As New dsProjectsTableAdapters.ProjectsTableAdapter
			ta.Delete(projectId)
			rsp.setSuccess()
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function projectsTagsAssign(projectId As Integer,
									   tags() As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim ta As New dsProjectsTableAdapters.ProjectsTableAdapter
			ta.Tags_Assign_Delete(projectId, -1)

			For Each tagId As Integer In tags
				ta.Tags_Assign_Save(projectId, tagId)
			Next

			rsp.setSuccess()
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function projectsIndustriesAssign(projectId As Integer,
											 industries() As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim ta As New dsProjectsTableAdapters.ProjectsTableAdapter
			ta.Industries_Assign_Delete(projectId, -1)

			For Each industryId As Integer In industries
				ta.Industries_Assign_Save(projectId, industryId)
			Next

			rsp.setSuccess()
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function projectsPartnersAssign(projectId As Integer,
										   partners() As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim ta As New dsProjectsTableAdapters.ProjectsTableAdapter
			ta.Partners_Assign_Delete(projectId, -1)

			For Each partnerId As Integer In partners
				ta.Partners_Assign_Save(projectId, partnerId)
			Next

			rsp.setSuccess()
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

#End Region


#Region "Project Tags"

	Private Function projectTagsGet(tagId As Integer,
									projectId As Integer,
									url As String,
									active As Boolean) As dsProjects.Projects_TagsDataTable
		Dim ta As New dsProjectsTableAdapters.Projects_TagsTableAdapter
		Dim dt As New dsProjects.Projects_TagsDataTable
		ta.Fill(dt, tagId, projectId, url, active)
		Return dt
	End Function

	<WebMethod()>
	Public Function projectTagsGetJson(tagId As Integer,
									   projectId As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim dt As dsProjects.Projects_TagsDataTable = projectTagsGet(tagId, projectId, "", False)
			Dim tags As New List(Of ProjectTag)

			For Each row As dsProjects.Projects_TagsRow In dt
				tags.Add(New ProjectTag(row))
			Next

			rsp.setSuccess(tags)
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function projectTagGetData(tagId As Integer,
									  url As String) As String
		Dim rsp As New WSResponse

		Try
			Dim dt As dsProjects.Projects_TagsDataTable = projectTagsGet(tagId, -1, url, False)

			If dt.Rows.Count = 1 Then
				rsp.setSuccess(jss.Serialize(New ProjectTag(dt.Rows(0))))
			Else
				rsp.setError("Tag not found.")
			End If
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function projectTagsGetOptions() As String
		Dim rsp As New WSResponse

		Try
			Dim dt As dsProjects.Projects_TagsDataTable = projectTagsGet(-1, -1, "", True)
			Dim html As New StringBuilder()

			For Each row As dsProjects.Projects_TagsRow In dt
				html.Append("<option value=""" & row.tagId & """>" & row.tag & "</option>")
			Next

			rsp.setSuccess(html.ToString())
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function projectTagsGetHtml(projectId As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim dt As dsProjects.Projects_TagsDataTable = projectTagsGet(-1, projectId, "", True)
			Dim html As New StringBuilder("<ul class=""project-tags"">")

			For Each row As dsProjects.Projects_TagsRow In dt
				html.Append("<li><a href=""/portfolio/tags/" & row.url & """>" & row.tag & "</a></li>")
			Next

			html.Append("</ul>")

			rsp.setSuccess(html.ToString())
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function projectTagGetPageHtml(url As String) As WSResponse
		Dim rsp As New WSResponse

		Try
			Dim dt As dsProjects.Projects_TagsDataTable = projectTagsGet(-1, -1, url, True)

			If dt.Rows.Count = 1 Then
				Dim tag As New ProjectTag(dt.Rows(0))
				Dim html As String = File.ReadAllText(Server.MapPath("/templates/projects/tag-page.html"))

				Dim tagName As String = tag.tag

				If tagName.ToLower = "award winner" Then
					tagName = "Award Winning Websites"
				End If

				html = html.Replace("{{tagName}}", tagName)

				Dim rspProjects As WSResponse = jss.Deserialize(Of WSResponse)(projectsGetGrid(url))

				If rspProjects.success Then
					html = html.Replace("{{projects}}", rspProjects.obj)
				Else
					rsp.setError("Unable to load projects.")
				End If

				rsp.setSuccess(New PageContent(tagName, html))
			Else
				rsp.setError("Tag not found.")
			End If
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return rsp
	End Function

	<WebMethod()>
	Public Function projectTagSave(data As String) As String
		Dim rsp As New WSResponse

		Try
			Dim theId As Integer = -1
			Dim ta As New dsProjectsTableAdapters.Projects_TagsTableAdapter

			Dim params As ProjectTag = jss.Deserialize(Of ProjectTag)(data)
			params.url = generateURLString(params.tag)

			With params
				ta.Update(.tagId,
						  .tag,
						  .url,
						  .active,
						  theId)
			End With

			rsp.setSuccess(theId)
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function projectTagDelete(tagId As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim ta As New dsProjectsTableAdapters.Projects_TagsTableAdapter
			ta.Delete(tagId)
			rsp.setSuccess()
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

#End Region


#Region "Project Industries"

	Private Function industriesGet(industryId As Integer,
								   projectId As Integer,
								   url As String,
								   active As Boolean) As dsProjects.Projects_IndustriesDataTable
		Dim ta As New dsProjectsTableAdapters.Projects_IndustriesTableAdapter
		Dim dt As New dsProjects.Projects_IndustriesDataTable
		ta.Fill(dt, industryId, projectId, url, active)
		Return dt
	End Function

	<WebMethod()>
	Public Function industriesGetJson(industryId As Integer,
									  projectId As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim dt As dsProjects.Projects_IndustriesDataTable = industriesGet(industryId, projectId, "", False)
			Dim industries As New List(Of Industry)

			For Each row As dsProjects.Projects_IndustriesRow In dt
				industries.Add(New Industry(row))
			Next

			rsp.setSuccess(industries)
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function industriesGetOptions() As String
		Dim rsp As New WSResponse

		Try
			Dim dt As dsProjects.Projects_IndustriesDataTable = industriesGet(-1, -1, "", False)
			Dim html As New StringBuilder()

			For Each row As dsProjects.Projects_IndustriesRow In dt
				html.Append("<option value=""" & row.industryId & """>" & row.industry & "</option>")
			Next

			rsp.setSuccess(html.ToString())
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function industrySave(data As String) As String
		Dim rsp As New WSResponse

		Try
			Dim theId As Integer = -1
			Dim ta As New dsProjectsTableAdapters.Projects_IndustriesTableAdapter

			Dim params As Industry = jss.Deserialize(Of Industry)(data)
			params.url = generateURLString(params.industry)

			With params
				ta.Update(.industryId,
						  .industry,
						  .url,
						  .active,
						  theId)
			End With

			rsp.setSuccess(theId)
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function industryDelete(industryId As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim ta As New dsProjectsTableAdapters.Projects_IndustriesTableAdapter
			ta.Delete(industryId)
			rsp.setSuccess()
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

#End Region


#Region "Partners"

	Private Function partnersGet(partnerId As Integer,
								 projectId As Integer,
								 url As String,
								 active As Boolean) As dsPartners.PartnersDataTable
		Dim ta As New dsPartnersTableAdapters.PartnersTableAdapter
		Dim dt As New dsPartners.PartnersDataTable
		ta.Fill(dt, partnerId, projectId, url, active)
		Return dt
	End Function

	<WebMethod()>
	Public Function partnersGetJson(partnerId As Integer,
									projectId As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim dt As dsPartners.PartnersDataTable = partnersGet(partnerId, projectId, "", False)
			Dim partners As New List(Of Partner)

			For Each row As dsPartners.PartnersRow In dt
				partners.Add(New Partner(row))
			Next

			rsp.setSuccess(partners)
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function partnersGetOptions() As String
		Dim rsp As New WSResponse

		Try
			Dim dt As dsPartners.PartnersDataTable = partnersGet(-1, -1, "", True)
			Dim html As New StringBuilder()

			For Each row As dsPartners.PartnersRow In dt
				html.Append("<option value=""" & row.partnerId & """>" & row.name & "</option>")
			Next

			rsp.setSuccess(html.ToString())
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function partnersGetGrid() As String
		Dim rsp As New WSResponse

		Try
			Dim dt As dsPartners.PartnersDataTable = partnersGet(-1, -1, "", True)
			Dim tmpl As String = File.ReadAllText(Server.MapPath("/templates/partners/list-item.html"))
			Dim html As String = generateHtmlTmpl(tmpl, dt)
			rsp.setSuccess(html)
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function partnerSave(data As String) As String
		Dim rsp As New WSResponse

		Try
			Dim theId As Integer = -1
			Dim ta As New dsPartnersTableAdapters.PartnersTableAdapter

			Dim params As Partner = jss.Deserialize(Of Partner)(data)
			params.url = generateURLString(params.name)

			With params
				ta.Update(.partnerId,
						  .name,
						  .description,
						  .logoPath,
						  .logoFileName,
						  .website,
						  .contactName,
						  .contactEmail,
						  .contactPhone,
						  .url,
						  .active,
						  theId)
			End With

			rsp.setSuccess(theId)
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function partnerDelete(partnerId As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim ta As New dsPartnersTableAdapters.PartnersTableAdapter
			ta.Delete(partnerId)
			rsp.setSuccess()
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

#End Region


#Region "Employee Bios"

	Private Function biosGet(bioId As Integer,
							 url As String,
							 active As Boolean) As dsBios.BiosDataTable
		Dim ta As New dsBiosTableAdapters.BiosTableAdapter
		Dim dt As New dsBios.BiosDataTable
		ta.Fill(dt, bioId, url, active)
		Return dt
	End Function

	<WebMethod()>
	Public Function biosGetJson(bioId As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim dt As dsBios.BiosDataTable = biosGet(bioId, "", False)
			Dim bios As New List(Of Bio)

			For Each row As dsBios.BiosRow In dt
				bios.Add(New Bio(row))
			Next

			rsp.setSuccess(bios)
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function biosGetOptions() As String
		Dim rsp As New WSResponse

		Try
			Dim dt As dsBios.BiosDataTable = biosGet(-1, "", True)
			Dim html As New StringBuilder()

			html.Append("<option value=""-1"">-- Select Author --</option>")

			For Each row As dsBios.BiosRow In dt
				html.Append("<option value=""" & row.bioId & """>" & row.fname & " " & row.lname & "</option>")
			Next

			rsp.setSuccess(html.ToString())
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function biosGetGrid() As String
		Dim rsp As New WSResponse

		Try
			Dim dt As dsBios.BiosDataTable = biosGet(-1, "", True)
			Dim tmpl As String = File.ReadAllText(Server.MapPath("/templates/team/list-item.html"))
			Dim html As String = generateHtmlTmpl(tmpl, dt)
			rsp.setSuccess(html)
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function bioSave(data As String) As String
		Dim rsp As New WSResponse

		Try
			Dim theId As Integer = -1
			Dim ta As New dsBiosTableAdapters.BiosTableAdapter

			Dim params As Bio = jss.Deserialize(Of Bio)(data)
			params.url = generateURLString(params.fname & "-" & params.lname)

			With params
				ta.Update(.bioId,
						  .fname,
						  .lname,
						  .title,
						  .email,
						  .phone,
						  .description,
						  .twitter,
						  .linkedIn,
						  .insta,
						  .url,
						  .imgPath,
						  .imgFileName,
						  .sortOrder,
						  .active,
						  .deleted,
						  theId)
			End With

			rsp.setSuccess(theId)
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function bioDelete(bioId As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim ta As New dsBiosTableAdapters.BiosTableAdapter
			ta.Delete(bioId)
			rsp.setSuccess()
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

#End Region


#Region "News"

	Private Function articlesGet(articleId As Integer,
								 authorId As Integer,
								 tagId As Integer,
								 url As String,
								 active As Boolean,
								 published As Boolean) As dsNews.ArticlesDataTable
		Dim ta As New dsNewsTableAdapters.ArticlesTableAdapter
		Dim dt As New dsNews.ArticlesDataTable
		ta.Fill(dt, articleId, authorId, tagId, url, active, published)
		Return dt
	End Function

	<WebMethod()>
	Public Function articlesGetJson(articleId As Integer,
									authorId As Integer,
									tagId As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim dt As dsNews.ArticlesDataTable = articlesGet(articleId, authorId, tagId, "", False, False)
			Dim articles As New List(Of Article)

			For Each row As dsNews.ArticlesRow In dt
				articles.Add(New Article(row))
			Next

			rsp.setSuccess(articles)
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function articleGetHtml(url As String) As WSResponse
		Dim rsp As New WSResponse

		Try
			Dim dt As dsNews.ArticlesDataTable = articlesGet(-1, -1, -1, url, True, False)

			If dt.Rows.Count = 0 Then
				rsp.setError("Article not found.")
			ElseIf dt.Rows.Count = 1 Then
				Dim a As New Article(dt.Rows(0))
				Dim title As String = a.title
				Dim description As String = a.preview

				Dim tmpl As String = File.ReadAllText(Server.MapPath("/templates/news/article.html"))
				Dim html As String = generateHtmlTmpl(tmpl, dt)

				html = html.Replace("{{publishDateStr}}", a.publishDateStr)

				'Dim rspTags As WSResponse = jss.Deserialize(Of WSResponse)(projectTagsGetHtml(p.projectId))
				'
				'If rspTags.success Then
				'	html = html.Replace("{{tags}}", rspTags.obj)
				'Else
				'	html = html.Replace("{{tags}}", "")
				'End If

				rsp.setSuccess(New PageContent(title, description, html, a.thumbPath))
			End If
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return rsp
	End Function

	<WebMethod()>
	Public Function articleSave(data As String) As String
		Dim rsp As New WSResponse

		Try
			Dim theId As Integer = -1
			Dim ta As New dsNewsTableAdapters.ArticlesTableAdapter

			Dim params As Article = jss.Deserialize(Of Article)(data)

			Dim publishYear As Integer = Year(params.publishDate)

			Dim publishMonth As String = CStr(Month(params.publishDate))
			If publishMonth.Length = 1 Then
				publishMonth = "0" & publishMonth
			End If

			Dim publishDay As String = CStr(Day(params.publishDate))
			If publishDay.Length = 1 Then
				publishDay = "0" & publishDay
			End If

			params.url = publishYear & "/" & publishMonth & "/" & publishDay & "/" & generateURLString(params.title)

			With params
				ta.Update(.articleId,
						  .authorId,
						  .title,
						  .preview,
						  .body,
						  .thumbPath,
						  .thumbFileName,
						  .bannerPath,
						  .bannerFileName,
						  .url,
						  .active,
						  .publishDate,
						  theId)
			End With

			rsp.setSuccess(theId)
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function articleDelete(articleId As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim ta As New dsNewsTableAdapters.ArticlesTableAdapter
			ta.Delete(articleId)
			rsp.setSuccess()
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function articleTagsAssign(articleId As Integer,
									  tags() As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim ta As New dsNewsTableAdapters.ArticlesTableAdapter
			ta.Tags_Assign_Delete(articleId, -1)

			For Each tagId In tags
				ta.Tags_Assign_Save(articleId, tagId)
			Next

			rsp.setSuccess()
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

#End Region


#Region "Article Tags"

	Private Function articlesTagsGet(tagId As Integer,
									 articleId As Integer,
									 url As String,
									 active As Boolean) As dsNews.Articles_TagsDataTable
		Dim ta As New dsNewsTableAdapters.Articles_TagsTableAdapter
		Dim dt As New dsNews.Articles_TagsDataTable
		ta.Fill(dt, tagId, articleId, url, active)
		Return dt
	End Function

	<WebMethod()>
	Public Function articlesTagsGetJson(tagId As Integer,
										articleId As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim dt As dsNews.Articles_TagsDataTable = articlesTagsGet(tagId, articleId, "", False)
			Dim tags As New List(Of ArticleTag)

			For Each row As dsNews.Articles_TagsRow In dt
				tags.Add(New ArticleTag(row))
			Next

			rsp.setSuccess(tags)
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function articlesTagsGetOptions() As String
		Dim rsp As New WSResponse

		Try
			Dim dt As dsNews.Articles_TagsDataTable = articlesTagsGet(-1, -1, "", True)
			Dim html As New StringBuilder()

			For Each row As dsNews.Articles_TagsRow In dt
				html.Append("<option value=""" & row.tagId & """>" & row.tag & "</option>")
			Next

			rsp.setSuccess(html.ToString())
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function articlesTagSave(data As String) As String
		Dim rsp As New WSResponse

		Try
			Dim theId As Integer = -1
			Dim ta As New dsNewsTableAdapters.Articles_TagsTableAdapter

			Dim params As ArticleTag = jss.Deserialize(Of ArticleTag)(data)
			params.url = generateURLString(params.tag)

			With params
				ta.Update(.tagId,
						  .tag,
						  .url,
						  .active,
						  theId)
			End With

			rsp.setSuccess(theId)
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

	<WebMethod()>
	Public Function articlesTagDelete(tagId As Integer) As String
		Dim rsp As New WSResponse

		Try
			Dim ta As New dsNewsTableAdapters.Articles_TagsTableAdapter
			ta.Delete(tagId)
			rsp.setSuccess()
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
	End Function

#End Region


#Region "Content"

	<WebMethod()>
	Public Function loadControlContent(controlName As String, url As String) As String
		Dim rsp As New WSResponse
		Dim title As String = ""
		Dim html As String = ""

		Try
			If controlName = "/" Then
				controlName = "home"
			End If

			If controlName.Contains("portfolio") AndAlso controlName <> "/portfolio/" AndAlso Not controlName.Contains("tags") Then
				controlName = "project"
			ElseIf controlName.Contains("portfolio/tags") Then
				controlName = "projectTag"
			ElseIf controlName.Contains("news") AndAlso Not controlName.Contains("tags") Then
				controlName = "article"
			End If

			' Get page HTML
			If controlName = "project" Then
				rsp = projectGetHtml(url.Substring(url.LastIndexOf("/") + 1))
			ElseIf controlName = "projectTag" Then
				rsp = projectTagGetPageHtml(url.Substring(url.LastIndexOf("/") + 1))
			ElseIf controlName = "article" Then
				rsp = articleGetHtml(url.Substring(url.LastIndexOf("/news/") + 6))
			Else
				html = renderPartialToString("/controls/pages/" & controlName.Replace("/", "") & ".ascx")
			End If

			' Page titles -- need to think of a different way?
			If controlName = "about" Then
				title = "Fort Worth Web Developers, Building Website And Web Applications"
			ElseIf controlName = "services" Then
				title = "Website Design, Website Development, Search Engine Optimization (SEO) Then"
			ElseIf controlName = "portfolio" Then
				title = "Award Winning Website Design And Development Projects from Select Interactive"
			ElseIf controlName = "news" Then
				title = "Web Design And Development news, awards, And notes from Select Interactive"
			ElseIf controlName = "contact" Then
				title = "Contact Us To Discuss Your Website Or Web Application Needs"
			Else
				title = "Fort Worth Website Design And Web Development. Select Interactive."
			End If

			If html <> "" Then
				rsp.setSuccess(New PageContent(title, html))
			End If
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		Return jss.Serialize(rsp)
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


#Region "Utilities"

	Private Function generateHtmlTmpl(tmpl As String, dt As Data.DataTable) As String
		Dim html As New StringBuilder()

		For i As Integer = 0 To dt.Rows.Count - 1
			Dim row As Data.DataRow = dt.Rows(i)
			Dim rowHtml As New StringBuilder(tmpl)

			For Each col As Data.DataColumn In dt.Columns
				rowHtml.Replace("{{" & col.ColumnName & "}}", row(col))
			Next

			html.Append(rowHtml)
		Next

		Return html.ToString()
	End Function

	Private Function generateHtmlRowTmpl(tmpl As String, dt As Data.DataTable, row As Data.DataRow) As String
		Dim rowHtml As New StringBuilder(tmpl)

		For Each col As Data.DataColumn In dt.Columns
			rowHtml.Replace("{{" & col.ColumnName & "}}", row(col))
		Next

		Return rowHtml.ToString
	End Function

	Private Function generateURLString(str As String) As String
		Dim url As String = str.ToLower

		url = url.Replace(".", "")
		url = url.Replace(",", "")
		url = url.Replace(":", "")
		url = url.Replace("(", "")
		url = url.Replace(")", "")
		url = url.Replace("&", "-")
		url = url.Replace("#", "-")
		url = url.Replace("!", "-")
		url = url.Replace("?", "")
		url = url.Replace("+", "-")
		url = url.Replace("'", "-")
		url = url.Replace("/", "-")
		url = url.Replace(" ", "-")
		url = url.Replace("----", "-")
		url = url.Replace("---", "-")
		url = url.Replace("--", "-")

		Return url
	End Function

#End Region


End Class