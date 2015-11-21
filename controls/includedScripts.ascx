<%@ Control Language="VB" AutoEventWireup="false" CodeFile="includedScripts.ascx.vb" Inherits="controls_includedScripts" %>
<%--<script defer src="/bower_components/es6-promise/promise.min.js"></script>
<script defer src="/bower_components/fetch/fetch.js"></script>--%>
<script defer src="/js/app/main.v-1.<%= Month(Now) & Day(Now) & Year(Now) & Hour(Now) & Minute(Now) & Second(Now)%>.js"></script>