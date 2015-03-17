Imports Microsoft.VisualBasic
Imports Parse
Imports System.IO

Namespace Util

    Public Class ParseUtil

        Public Property parseAppId As String
        Public Property parseDotNetKey As String

        Public Property itemList As IEnumerable(Of ParseObject)

        Public Sub New()
        End Sub

        Public Sub New(parseAppId As String, parseDotNetKey As String)
            Me.parseAppId = parseAppId
            Me.parseDotNetKey = parseDotNetKey
            ParseInit()
        End Sub

        Public Sub ParseInit()
            ParseClient.Initialize(Me.parseAppId, Me.parseDotNetKey)
        End Sub

        Public Function getField(index As Integer, key As String) As String
            Return IIf(itemList(index).Item(key) Is Nothing, "", itemList(index).Item(key))
        End Function

        Public Sub query(obj As String, Optional orderBy As String = "", Optional sortAsc As Boolean = True)
            Dim q = ParseObject.GetQuery(obj)

            If orderBy.Length > 0 Then
                If sortAsc = True Then
                    q = q.OrderBy(orderBy)
                Else
                    q = q.OrderByDescending(orderBy)
                End If
            End If

            Dim results As System.Threading.Tasks.Task(Of IEnumerable(Of ParseObject)) = q.FindAsync()
            itemList = results.Result
        End Sub

        Public Function generateHtml(fileName As String, index As Integer) As String
            Dim html As String = File.ReadAllText(HttpContext.Current.Server.MapPath("/templates/" & fileName & ".html"))

            For Each key As String In itemList(index).Keys
                html = html.Replace("{{" & key & "}}", getField(index, key))
            Next

            Return html
        End Function

    End Class

End Namespace