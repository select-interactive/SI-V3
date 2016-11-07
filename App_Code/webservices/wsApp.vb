Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.IO
Imports System.Web.Script.Serialization

<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class wsApp
	Inherits System.Web.Services.WebService

	Private jss As New JavaScriptSerializer

	<WebMethod()>
	Public Function hello() As String
		Dim rsp As New WSResponse
		rsp.setSuccess("hello world")
		Return jss.Serialize(rsp)
	End Function

End Class