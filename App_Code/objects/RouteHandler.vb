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

		HttpContext.Current.RewritePath(String.Concat(VirtualPath, qs))

		Dim page As IHttpHandler = BuildManager.CreateInstanceFromVirtualPath(VirtualPath, GetType(Page))
		Return page
	End Function
End Class