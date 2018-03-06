/**
 * @author umin
 * @since
 * @copyright Copyright (c) 2018, YZKJ
 * @description router
 */
import Vue from 'vue';
import Router from 'vue-router';
import Index from '../page/index';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'index',
    component: Index
  }, { // 切换用户
    path: '/switch',
    name: 'switch',
    component(resolve) {
      require(['../page/switch'], resolve);
    }
  }]
});
