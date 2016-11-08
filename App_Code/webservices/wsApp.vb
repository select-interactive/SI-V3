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
						  .imgPath,
						  .imgFileName,
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