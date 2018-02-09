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
    path: '/dateControl',
    name: 'dateControl',
    component(resolve) {
      require(['../page/dateControl'], resolve);
    }
  }, {
    path: '/close',
    name: 'close',
    component(resolve) {
      require(['../page/close'], resolve);
    }
  }, {
    path: '/faultRecord',
    name: 'faultRecord',
    component(resolve) {
      require(['../page/faultRecord'], resolve);
    }
  }, {
    path: '/search',
    name: 'search',
    component(resolve) {
      require(['../page/search'], resolve);
    }
  }, {
    path: '/contact',
    name: 'contact',
    component(resolve) {
      require(['../page/contact'], resolve);
    }
  }]
});
