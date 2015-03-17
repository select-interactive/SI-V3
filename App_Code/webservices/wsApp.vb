Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports Parse
Imports Util

<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class wsApp
    Inherits System.Web.Services.WebService

    Private parseAppId As String = ""
    Private parseDotNetKey As String = ""
    Private pUtil As New ParseUtil(parseAppId, parseDotNetKey)

    <WebMethod()>
    Public Function loadData() As String
        Dim html As New StringBuilder

        pUtil.query("obj", "sortOrder")

        For i As Integer = 0 To pUtil.itemList.Count - 1
            html.Append(pUtil.generateHtml("tmplFile", i))
        Next

        Return html.ToString
    End Function

End Class