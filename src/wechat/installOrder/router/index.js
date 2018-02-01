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
    path: '/detail', // 测试页面
    name: 'detail',
    component(resolve) {
      require(['../page/detail'], resolve);
    }
  }, {
    path: '/xttd', // 协同页面页面
    name: 'xttd',
    component(resolve) {
      require(['../page/xttd'], resolve);
    }
  }, {
    path: '/updateState', // 更新状态页面
    name: 'updateState',
    component(resolve) {
      require(['../page/updateState'], resolve);
    }
  }]
});