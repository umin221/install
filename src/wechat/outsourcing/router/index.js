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
  }, { // 创建/编辑/查看 委外团队详情
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
  }, { // 联系人
    path: '/contact',
    name: 'contact',
    component(resolve) {
      require(['../page/contact'], resolve);
    }
  }, { // 负责人
    path: '/engineer',
    name: 'engineer',
    component(resolve) {
      require(['../page/engineer'], resolve);
    }
  }]
});
