webpackJsonp([7],{NH33:function(t,e,n){var o=n("m/KY");"string"==typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);n("rjj0")("15b76a54",o,!0)},"m/KY":function(t,e,n){(t.exports=n("FZ+f")(!1)).push([t.i,'\n@charset "UTF-8";\n/* ==================================================\n * \t\t\t \t\t 全局Sass变量\n * ================================================= */\n.login-form {\n  padding: 0 20px 20px;\n}\n.login-form .mint-button {\n    width: 100%;\n    border-radius: 20px;\n    color: #00599f;\n}\n',""])},uCzs:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n("Dd8w"),s=n.n(o),l=n("NYxO"),r={name:"setting",created:function(){this.user=KND.Util.parse(KND.Session.get("userInfo"))},data:function(){return{user:"",version:tools.cordova.app.version}},methods:s()({},Object(l.mapActions)("login",["logout"]),{logoutFn:function(){var t=this;t.logout({success:function(e){KND.Session.remove("userInfo"),t.$router.replace({name:"login",query:{login:!0}})}})}})},a={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("mt-header",{attrs:{fixed:"",title:"个人中心"}},[n("fallback",{attrs:{slot:"left"},slot:"left"})],1),t._v(" "),n("div",{staticClass:"wrapper"},[n("div",{staticClass:"mint-content multiple"},[n("mt-cell",{attrs:{label:"姓名",value:t.user["Last Name"]}}),t._v(" "),n("mt-cell",{attrs:{label:"账号",value:t.user["Login Name"]}}),t._v(" "),n("mt-cell",{attrs:{label:"版本",value:t.version}})],1),t._v(" "),n("div",{staticClass:"login-form"},[n("mt-button",{nativeOn:{click:function(e){t.logoutFn(e)}}},[t._v("注销")])],1)])],1)},staticRenderFns:[]},i=n("VU/8")(r,a,!1,function(t){n("NH33")},null,null);e.default=i.exports}});