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
import './mapp'; // Status Mapp
import fallback from 'public/components/cus-fallback';
import attach from 'public/components/cus-attach';
import empty from 'public/components/cus-empty';
import App from '../../App';
import sto from './store';
import './filters'; // Vue Filter

// For back
Vue.component('fallback', fallback);
// Attach
Vue.component('attach', attach);
// For Empty
Vue.component('empty', empty);

Vue.config.productionTip = false;

Vue.use(Vuex);

let store = new Vuex.Store(sto);

/**
 * 导航守卫
 * 如果未匹配到路由
 * 如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
 * 如果匹配到正确跳转
 */
router.beforeEach((to, from, next) => {
  to.matched.length === 0 ? from.name ? next({ name: from.name }) : next('/login') : next();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
