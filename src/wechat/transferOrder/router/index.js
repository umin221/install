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
  routes: [{ // 首页
    path: '/',
    name: 'index',
    component(resolve) {
      require(['../page/index'], resolve);
    }
  }, { // 创建/编辑/查看 安装交接单详情
    path: '/detail',
    name: 'detail',
    component(resolve) {
      require(['../page/detail'], resolve);
    }
  }, { // 搜索
    path: '/search',
    name: 'search',
    component(resolve) {
      require(['../page/search'], resolve);
    },
    meta: {
      transition: 'push'
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
  }, { // 驳回
    path: '/reject',
    name: 'reject',
    component(resolve) {
      require(['../page/reject'], resolve);
    }
  }, { // 安装交接单详情
    path: '/order',
    name: 'order',
    component(resolve) {
      require(['../page/order'], resolve);
    }
  }, { // 锁芯部分
    path: '/lockCore',
    name: 'lockCore',
    component(resolve) {
      require(['../page/lockCore'], resolve);
    }
  }, { // 锁体部分
    path: '/lockBody',
    name: 'lockBody',
    component(resolve) {
      require(['../page/lockBody'], resolve);
    }
  }]
});
