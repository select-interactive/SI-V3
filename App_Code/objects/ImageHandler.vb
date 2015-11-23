Imports Microsoft.VisualBasic
Imports System.IO

Public Class ImageHandler
    Implements IHttpHandler

	Public ReadOnly Property IsReusable As Boolean Implements IHttpHandler.IsReusable
		Get
			Return True
		End Get
	End Property

	Public Sub ProcessRequest(context As HttpContext) Implements IHttpHandler.ProcessRequest
		Dim url As String = context.Request.RawUrl
		Dim path As String = context.Request.Path
		Dim ext As String = System.IO.Path.GetExtension(path).ToLower
		Dim contentType As String = ""

		If ext = ".jpg" Then
			contentType = "image/jpeg"
		ElseIf ext = ".png" Then
			contentType = "image/png"
		End If

		Dim cacheTime As New TimeSpan(90, 0, 0, 0)

		If context.Request.Headers.Get("accept").Contains("image/webp") Then
			Dim webpUrl As String = path.Replace(".jpg", ".webp")
			webpUrl = webpUrl.Replace(".png", ".webp")

			If File.Exists(context.Server.MapPath(webpUrl)) Then
				contentType = "image/webp"
				path = webpUrl
			End If
		End If

		context.Response.StatusCode = 200
		context.Response.ContentType = contentType
		context.Response.Cache.SetCacheability(HttpCacheability.Public)
		context.Response.Cache.SetExpires(Now.Add(cacheTime))
		context.Response.Cache.SetMaxAge(cacheTime)
		context.Response.WriteFile(path)
	End Sub

End Class
