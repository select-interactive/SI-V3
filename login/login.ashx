<%@ WebHandler Language="VB" Class="login" %>

Imports System
Imports System.Web
Imports wsApp

Public Class login : Implements IHttpHandler

	Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		Dim username As String = context.Request.Form.Item("username")
		Dim pwd As String = context.Request.Form.Item("password")
		Dim response As String = ""

		Dim ws As New wsApp
		ws.logUserIn(username, pwd)

		context.Response.ContentType = "text/plain"
		context.Response.Write(response)
	End Sub

	Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
		Get
			Return False
		End Get
	End Property

End Class