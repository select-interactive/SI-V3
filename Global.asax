<%@ Application Language="VB" %>

<script runat="server">

	Sub Application_Start(ByVal sender As Object, ByVal e As EventArgs)
		' Code that runs on application startup
		RegisterRoutes(System.Web.Routing.RouteTable.Routes)
	End Sub

	Sub RegisterRoutes(ByVal routes As System.Web.Routing.RouteCollection)
		routes.Add("projectRoute", New System.Web.Routing.Route("portfolio/{url}/", New RouteHandler("~/portfolio/project/default.aspx")))
		routes.Add("projectTags", New System.Web.Routing.Route("portfolio/tags/{url}/", New RouteHandler("~/portfolio/tag/default.aspx")))
		routes.Add("newsRoute", New System.Web.Routing.Route("news/{year}/{month}/{day}/{url}/", New RouteHandler("~/news/article/default.aspx")))
	End Sub

	Sub Application_BeginRequest(ByVal sender As Object, ByVal e As EventArgs)
		Dim req = HttpContext.Current.Request.Url.AbsolutePath

		If req.Contains("/api/") Then
			Dim apiPath As String = "/webservices/wsApp.asmx/"

			Dim path As String = req.Substring(req.IndexOf("/api/") + 5)

			If path.Contains("/") Then
				Dim ws As String = path.Substring(0, path.IndexOf("/"))
				apiPath = "/webservices/ws" & ws & ".asmx/" & path.Substring(path.IndexOf("/") + 1)
			Else
				apiPath = "/webservices/wsApp.asmx/"
				apiPath &= req.Substring(req.IndexOf("/api/") + 5)
			End If


			Context.RewritePath(apiPath)
		End If
	End Sub

	Sub Application_Error(ByVal sender As Object, ByVal e As EventArgs)
		' Code that runs when an unhandled error occurs
	End Sub

	Sub Session_Start(ByVal sender As Object, ByVal e As EventArgs)
		' Code that runs when a new session is started
	End Sub

	Sub Session_End(ByVal sender As Object, ByVal e As EventArgs)
		' Code that runs when a session ends. 
		' Note: The Session_End event is raised only when the sessionstate mode
		' is set to InProc in the Web.config file. If session mode is set to StateServer 
		' or SQLServer, the event is not raised.
	End Sub

</script>