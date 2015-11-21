Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.IO

<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsApp
	Inherits System.Web.Services.WebService

#Region "Content"

	<WebMethod()>
	Public Function loadControlContent(controlName As String) As String
		Return renderPartialToString("/controls/pages/" & controlName & ".ascx")
	End Function

	Private Function renderPartialToString(controlName As String) As String
		Dim p As New Page()
		Dim c As Control = p.LoadControl(controlName)
		p.Controls.Add(c)

		Dim w As New StringWriter
		HttpContext.Current.Server.Execute(p, w, False)

		Return w.ToString
	End Function

#End Region

End Class