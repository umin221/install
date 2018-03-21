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
    path: '/search',        // 列表搜索
    name: 'search',
    component(resolve) {
      require(['../page/search'], resolve);
    }
  }, {
    path: '/comEnter',    // 故障记录
    name: 'comEnter',
    component(resolve) {
      require(['../page/comEnter'], resolve);
    }
  }, {
    path: '/saveFault',    // 故障记录
    name: 'saveFault',
    component(resolve) {
      require(['../page/saveFault'], resolve);
    }
  }, {
    path: '/searchTrans',    // 搜索配件
    name: 'searchTrans',
    component(resolve) {
      require(['../page/searchTrans'], resolve);
    }
  }, { // 选择工程师
    path: '/engineer',
    name: 'engineer',
    component(resolve) {
      require(['../page/engineer'], resolve);
    },
    meta: {
      transition: 'push'
    }
  }]
});
