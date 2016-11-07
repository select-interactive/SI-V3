Imports Microsoft.VisualBasic

Public Class JSPath

	Public Shared Function getPath(ByVal path As String) As String
		Return ConfigurationManager.AppSettings("jsDir") & path & getCacheVersion() & ".js"
	End Function

	Private Shared Function getCacheVersion() As String
		Dim cacheVersion As String = ".v-"

		If Not HttpContext.Current.Request.Url.ToString.Contains(".com") Then
			cacheVersion &= "1." & Month(Now) & Day(Now) & Year(Now) & Hour(Now) & Minute(Now) & Second(Now)
		Else
			'cacheVersion &= ConfigurationManager.AppSettings("jsVersion") & ".min"
			cacheVersion &= ConfigurationManager.AppSettings("jsVersion")
		End If

		Return cacheVersion
	End Function

End Class