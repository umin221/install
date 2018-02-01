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
    path: '/addService', // 创建维修服务
    name: 'addService',
    component(resolve) {
      require(['../page/addService'], resolve);
    }
  }, {
    path: '/serviceDetail', // 创建维修服务
    name: 'serviceDetail',
    component(resolve) {
      require(['../page/serviceDetail'], resolve);
    }
  }, {
    path: '/dateControl', // 创建维修服务
    name: 'dateControl',
    component(resolve) {
      require(['../page/dateControl'], resolve);
    }
  }]
});
