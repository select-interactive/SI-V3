<%@ WebHandler Language="VB" Class="uploadFile" %>

Imports System
Imports System.Web
Imports System.Web.Script.Serialization
Imports System.IO

Public Class uploadFile : Implements IHttpHandler

	Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		Dim rsp As New WSResponse
		Dim jss As New JavaScriptSerializer

		Try
			Dim ctx As HttpContext = HttpContext.Current
			Dim length As Integer = context.Request.Headers("X-File-Size")
			Dim documentBytes = New Byte(length - 1) {}
			context.Request.InputStream.Read(documentBytes, 0, length)

			Dim fileName As String = context.Request.Headers("X-File-Name")
			Dim ext As String = Path.GetExtension(fileName)
			fileName = fileName.Substring(0, fileName.IndexOf(ext))
			fileName = fileName & "-" & Now.Month & Now.Day & Now.Hour & Now.Minute & Now.Second & ext

			Dim rootDir As String = ctx.Server.MapPath("~/img/uploads/")
			Dim tempDir As String = ctx.Server.MapPath("~/img/uploads/temp/")

			If Not Directory.Exists(tempDir) Then
				Directory.CreateDirectory(tempDir)
			End If

			Dim tempFile As String = tempDir & fileName
			context.Request.SaveAs(tempFile, False)

			Dim data As UploadedFileData = New UploadedFile(tempFile, context.Request.Headers("X-File-Path"), fileName, context.Request.Headers("X-Mime-Type")).fileData
			rsp.setSuccess(data)

			File.Delete(tempFile)
		Catch ex As Exception
			rsp.setError(ex.ToString())
		End Try

		context.Response.ContentType = "application/json"
		context.Response.Write(jss.Serialize(rsp))
	End Sub

	Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
		Get
			Return False
		End Get
	End Property

End Class