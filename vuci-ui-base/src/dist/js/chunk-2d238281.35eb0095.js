(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d238281"],{fdd1:function(e,t,n){"use strict";n.r(t);var s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("card-table",{attrs:{title:"System Log",headers:e.headers,items:e.log,"hide-actions":"","hide-headers":""}})},a=[],l={data:function(){return{headers:[{value:"msg"}],log:[]}},mounted:function(){var e=this;this.$ubus.call("vuci.system","syslog").then(function(t){var n=t.log.replace(/\n+$/,"").split(/\n/);e.log=n.map(function(e){return{msg:e}})})}},o=l,u=n("2877"),i=Object(u["a"])(o,s,a,!1,null,null,null);i.options.__file="Syslog.vue";t["default"]=i.exports}}]);