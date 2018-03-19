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
  }, { // 驳回交接单
    path: '/reject',
    name: 'reject',
    component(resolve) {
      require(['../page/reject'], resolve);
    }
  }, { // 关闭交接单
    path: '/close',
    name: 'close',
    component(resolve) {
      require(['../page/close'], resolve);
    }
  }, { // 安装交接单详情
    path: '/order',
    name: 'order',
    component(resolve) {
      require(['../page/order'], resolve);
    }
  }, { // 订单行
    path: '/orderLine',
    name: 'orderLine',
    component(resolve) {
      require(['../page/orderLine'], resolve);
    }
  }]
});
