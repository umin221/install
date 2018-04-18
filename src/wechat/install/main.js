/**
 * @author umin
 * @since
 * @copyright Copyright (c) 2018, YZKJ
 * @description main
 */
import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';
import 'public/js/base/main';
import 'public/js/base/mint';
import fallback from 'public/components/cus-fallback';
import attach from 'public/components/cus-attach';
import empty from 'public/components/cus-empty';
import indicator from './components/indicator';
import App from '../../App';
import sto from './store';
import './mapp'; // Status Mapp
import './js/tools.cordova'; // cordova tools
import vp from 'public/plugin/validator';

// use plugin
Vue.use(vp);
// For back
Vue.component('fallback', fallback);
// Attach
Vue.component('attach', attach);
// For Empty
Vue.component('empty', empty);
// For Indicator
Vue.component('indicator', indicator);

Vue.config.productionTip = false;

Vue.use(Vuex);

let store = new Vuex.Store(sto);

// 楼栋编辑不支持离线操作
config.offline = true;

/**
 * 导航守卫
 * 如果未匹配到路由
 * 如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
 * 如果匹配到正确跳转
 */
router.beforeEach((to, from, next) => {
  // 物理返回直接返回系统桌面
  if (from.name === 'index' && to.name === 'login') {
    if (to.query.login !== true) {
      next(false);
      tools.cordova.goHome();
      return;
    }
  };
  to.matched.length === 0 ? from.name ? next({ name: from.name }) : next('/') : next();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
