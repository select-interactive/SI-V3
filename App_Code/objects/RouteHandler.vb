Imports Microsoft.VisualBasic
Imports System.Web.Compilation
Imports System.Web.UI
Imports System.Web
Imports System.Web.Routing

Public Class RouteHandler : Implements IRouteHandler
	Public Property VirtualPath As String

	Public Sub New(ByVal virtualPath As String)
		Me.VirtualPath = virtualPath
	End Sub

	Public Function GetHttpHandler(requestContext As System.Web.Routing.RequestContext) As System.Web.IHttpHandler Implements System.Web.Routing.IRouteHandler.GetHttpHandler
		Dim qs As String = ""
		Dim url As String = requestContext.RouteData.Values("url")

		Dim year As String = requestContext.RouteData.Values("year")
		Dim month As String = requestContext.RouteData.Values("month")
		Dim day As String = requestContext.RouteData.Values("day")

		If Not year Is Nothing AndAlso year.Length > 0 AndAlso Not month Is Nothing AndAlso month.Length > 0 AndAlso Not day Is Nothing AndAlso day.Length > 0 AndAlso Not url Is Nothing AndAlso url.Length > 0 Then
			qs = "?url=" & year & "/" & month & "/" & day & "/" & url
		ElseIf Not url Is Nothing AndAlso url.Length > 0 Then
			qs = "?url=" & url
		End If

		HttpContext.Current.RewritePath(String.Concat(VirtualPath, qs))

		Dim page As IHttpHandler = BuildManager.CreateInstanceFromVirtualPath(VirtualPath, GetType(Page))
		Return page
	End Function
End Class