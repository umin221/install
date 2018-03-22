/**
 * @author umin
 * @since
 * @copyright Copyright (c) 2018, YZKJ
 * @description router
 */
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/', // 首页列表
    name: 'index',
    component(resolve) {
      require(['../page/index'], resolve);
    }
  }, {
    path: '/address', // 首页列表
    name: 'address',
    component(resolve) {
      require(['../page/address'], resolve);
    }
  }, {
    path: '/myRepair', // 首页列表
    name: 'myRepair',
    component(resolve) {
      require(['../page/myRepair'], resolve);
    }
  }, {
    path: '/repairDetail', // 首页列表
    name: 'repairDetail',
    component(resolve) {
      require(['../page/repairDetail'], resolve);
    }
  }]
});
