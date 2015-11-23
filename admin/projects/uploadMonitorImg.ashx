<%@ WebHandler Language="VB" Class="uploadMonitorImg" %>

Imports System
Imports System.Web
Imports System.IO
Imports System.Drawing
Imports System.Drawing.Imaging
Imports System.Drawing.Drawing2D
Imports System.Diagnostics

Public Class uploadMonitorImg : Implements IHttpHandler

	Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		Dim strResponse As String = ""

		Try
			Dim length As Integer = context.Request.Headers("X-File-Size")
			Dim documentBytes = New Byte(length - 1) {}
			context.Request.InputStream.Read(documentBytes, 0, length)

			Dim fileType As String = context.Request.Headers("X-File-Type")
			Dim saveAsFileType As Imaging.ImageFormat = Imaging.ImageFormat.Jpeg

			Dim fileName As String = context.Request.Headers("X-File-Name")
			Dim ext As String = Path.GetExtension(fileName)

			If ext = ".jpg" Then
				saveAsFileType = Imaging.ImageFormat.Jpeg
			ElseIf ext = ".png" Then
				saveAsFileType = Imaging.ImageFormat.Png
			End If

			fileName = fileName.Substring(0, fileName.LastIndexOf("."))
			fileName = fileName & Now.Month & Now.Day & Now.Hour & Now.Minute & Now.Second & ext

            ' Verify the directories exist
            Dim dir As String = context.Server.MapPath("~/img/projects/")
			Dim dirFull As String = dir & "primary\"
			Dim tempDir As String = dir & "temp\"

			If Not Directory.Exists(dir) Then
				Directory.CreateDirectory(dir)
			End If

			If Not Directory.Exists(tempDir) Then
				Directory.CreateDirectory(tempDir)
			End If

			Dim stopUpload As Boolean = False

            ' first check file size
            Dim fileSize As Integer = context.Request.Headers("X-File-Size")
			If fileSize > 16000000 Then
				stopUpload = True
			End If

			If stopUpload = True Then
				strResponse = "{""status"":""error"",""msg"":""The file is too large. File size maximum is 16MB.""}"
			Else
				Dim tempFile As String = tempDir & fileName
				Dim fullFile As String = dirFull & fileName

                ' Check to make sure a file with this name does not already exist
                If File.Exists(tempFile) AndAlso File.Exists(fullFile) Then
                    ' skip this file
                    strResponse = "{""status"":""error"",""msg"":""" & fileName & " already exists. Please rename and try again.""}"
				Else
                    ' Save the temp file
                    context.Request.SaveAs(tempFile, False)

                    ' Resizing Codecs
                    Dim ratio As New EncoderParameter(Encoder.Quality, 100L)
					Dim codecParams As New EncoderParameters(2)
					codecParams.Param(0) = ratio
					codecParams.Param(1) = New EncoderParameter(Encoder.RenderMethod, EncoderValue.RenderProgressive)

                    ' Check the sizing
                    Dim bmp As New Bitmap(tempFile)
					Dim curWidth As Integer = bmp.Width
					Dim curHeight As Integer = bmp.Height

					' ***** FULL SIZE FILE *****
					Dim maxWidth As Integer = 652
					Dim maxHeight As Integer = 500

					If curWidth <> maxWidth Or curHeight <> maxHeight Then
						strResponse = "{""status"":""error"",""msg"":""Error: The image must be " & maxWidth & "px by " & maxHeight & "px.""}"
					Else
						context.Request.SaveAs(fullFile, False)

						If saveAsFileType.Equals(Imaging.ImageFormat.Jpeg) Then
							optimizeImage(dir, fullFile)
						End If

						'createWebP(dir, fullFile)

						strResponse = "{""status"":""success"",""fileName"":""" & fileName & """}"
					End If

					bmp.Dispose()
					File.Delete(tempFile)
				End If
			End If
		Catch ex As Exception
			strResponse = "{""status"":""error"",""msg"":""" & ex.ToString & """}"
		End Try

		context.Response.ContentType = "text/plain"
		context.Response.Write(strResponse)
	End Sub

	Public Sub optimizeImage(dir As String, filePath As String)
		Dim pFull As New ProcessStartInfo
		pFull.FileName = dir & "jpegtran.exe"
		pFull.Arguments = "-optimize -progressive -outfile """ & filePath & """ """ & filePath
		pFull.WindowStyle = ProcessWindowStyle.Hidden
		Process.Start(pFull)
	End Sub

	Public Sub createWebP(dir As String, filePath As String)
		Dim webpPath As String = filePath.Replace(".jpg", ".webp").Replace(".png", ".webp")

		Dim pFull As New ProcessStartInfo
		pFull.FileName = dir & "cwebp.exe"
		pFull.Arguments = "-q 80 """ & filePath & """ -o """ & webpPath
		pFull.WindowStyle = ProcessWindowStyle.Hidden
		Process.Start(pFull)
	End Sub

	Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
		Get
			Return False
		End Get
	End Property

	Private Function GetEncoder(format As ImageFormat) As ImageCodecInfo
		Dim codecs As ImageCodecInfo() = ImageCodecInfo.GetImageDecoders()
		For Each codec As ImageCodecInfo In codecs
			If codec.FormatID = format.Guid Then
				Return codec
			End If
		Next

		Return Nothing
	End Function

End Class