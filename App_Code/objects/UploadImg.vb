Imports Microsoft.VisualBasic
Imports System.IO
Imports Microsoft.Azure
Imports Microsoft.WindowsAzure.Storage
Imports Microsoft.WindowsAzure.Storage.Blob
Imports System.Drawing
Imports System.Drawing.Imaging
Imports System.Drawing.Drawing2D
Imports System.Diagnostics

Public Class UploadedFile

	Private filePath As String
	Private storagePath As String
	Private fileName As String
	Private mimeType As String
	Private maxWidth As Integer
	Private maxHeight As Integer
	Public Property fileData As UploadedFileData

	' For documents like PDFS...
	Public Sub New(filePath As String, storagePath As String, fileName As String, mimeType As String)
		Me.filePath = filePath
		Me.storagePath = storagePath
		Me.fileName = fileName
		Me.mimeType = mimeType
		Me.uploadFile()
	End Sub

	' For images
	Public Sub New(filePath As String, storagePath As String, fileName As String, maxWidth As Integer, maxHeight As Integer)
		Me.filePath = filePath
		Me.storagePath = storagePath

		Me.fileName = fileName
		Dim ext As String = Path.GetExtension(Me.fileName)

		Me.maxWidth = maxWidth
		Me.maxHeight = maxHeight

		Me.resizeImage()

		If ext = ".jpg" Then
			Me.optimizeImage()
		Else
			Me.uploadFile()
		End If
	End Sub

	Private Sub resizeImage()
		Dim saveAsFileType As Imaging.ImageFormat = Imaging.ImageFormat.Jpeg

		Dim ext As String = Path.GetExtension(fileName)

		If ext = ".jpg" Then
			saveAsFileType = Imaging.ImageFormat.Jpeg
		ElseIf ext = ".png" Then
			saveAsFileType = Imaging.ImageFormat.Png
		End If

		Dim bmp As New Bitmap(Me.filePath)
		Dim curWidth As Integer = bmp.Width
		Dim curHeight As Integer = bmp.Height
		bmp.Dispose()

		' Resizing Codecs
		Dim ratio As New EncoderParameter(Encoder.Quality, 100L)
		Dim codecParams As New EncoderParameters(2)
		codecParams.Param(0) = ratio
		codecParams.Param(1) = New EncoderParameter(Encoder.RenderMethod, EncoderValue.RenderProgressive)

		Dim originalWidth As Integer = curWidth
		Dim originalHeight As Integer = curHeight
		Dim percentWidth As Single = CSng(maxWidth) / CSng(originalWidth)
		Dim percentHeight As Single = CSng(maxHeight) / CSng(originalHeight)
		Dim percent As Single = If(percentHeight > percentWidth, percentHeight, percentWidth)
		Dim newWidth As Integer = CInt(originalWidth * percent)
		Dim newHeight As Integer = CInt(originalHeight * percent)

		Dim largeWidth As Integer = 0
		Dim startX As Integer = 0
		Dim largeHeight As Integer = 0
		Dim startY As Integer = 0

		If newWidth < maxWidth Then
			largeWidth = maxWidth

			newWidth = maxWidth
			largeHeight = CInt(newWidth * curHeight / curWidth)

			startY = CInt((largeHeight - maxHeight) / 2)
		ElseIf newWidth > maxWidth Then
			largeWidth = newWidth

			startX = CInt((largeWidth - maxWidth) / 2)
		End If

		Dim img As Image = Image.FromFile(Me.filePath)
		Dim oBmp As New Bitmap(maxWidth, maxHeight)

		Dim g As Graphics = Graphics.FromImage(oBmp)
		g.CompositingQuality = CompositingQuality.HighQuality
		g.SmoothingMode = SmoothingMode.HighQuality
		g.InterpolationMode = InterpolationMode.HighQualityBicubic
		g.PixelOffsetMode = PixelOffsetMode.HighQuality

		Dim rec As New Rectangle(0 - startX, 0 - startY, newWidth, newHeight)
		g.DrawImage(img, rec)

		img.Dispose()
		g.Dispose()
		bmp.Dispose()

		oBmp.Save(Me.filePath, Me.GetEncoder(saveAsFileType), codecParams)
		oBmp.Dispose()
	End Sub

	Private Sub optimizeImage()
		Dim opt As New Process
		Dim optStartInfo As New ProcessStartInfo
		optStartInfo.FileName = HttpContext.Current.Server.MapPath("/img/uploads/jpegtran.exe")
		optStartInfo.Arguments = "-optimize -progressive -outfile """ & filePath & """ """ & filePath
		optStartInfo.WindowStyle = ProcessWindowStyle.Hidden

		opt.StartInfo = optStartInfo
		opt.Start()

		Me.checkOptComplete(opt)
	End Sub

	Private Sub checkOptComplete(opt As Process)
		If opt.HasExited Then
			opt.Close()
			Me.uploadFile()
		Else
			Threading.Thread.Sleep(500)
			checkOptComplete(opt)
		End If
	End Sub

	Private Sub uploadFile()
		' Get Azure storage account/container info
		Dim storageAccount As CloudStorageAccount = CloudStorageAccount.Parse(ConfigurationManager.AppSettings("StorageConnectionString"))
		Dim blobClient As CloudBlobClient = storageAccount.CreateCloudBlobClient()
		Dim container As CloudBlobContainer = blobClient.GetContainerReference(ConfigurationManager.AppSettings("StorageContainerName"))

		' Set the blob path
		Dim blockBlob As CloudBlockBlob = container.GetBlockBlobReference(Me.storagePath & Me.fileName)

		' if this is an image, add cache control and content type
		Dim ext As String = Path.GetExtension(Me.fileName)
		If ext.Contains("jpg") Or ext.Contains("jpeg") Or ext.Contains("png") Then
			' Add cache
			blockBlob.Properties.CacheControl = "public:max-age=31536000"

			If ext.Contains("png") Then
				blockBlob.Properties.ContentType = "image/png"
			Else
				blockBlob.Properties.ContentType = "image/jpg"
			End If
		Else
			blockBlob.Properties.ContentType = Me.mimeType
		End If

		blockBlob.UploadFromFile(filePath)

		' set the file data to have the URI to the file and the filename
		fileData = New UploadedFileData(blockBlob.Uri.ToString(), Me.fileName)
	End Sub

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

Public Class UploadedFileData

	Public Property filePath As String
	Public Property fileName As String

	Public Sub New(path As String, name As String)
		Me.filePath = path
		Me.fileName = name
	End Sub

End Class