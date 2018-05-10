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
    path: '/search', // 搜索列表
    name: 'search',
    component(resolve) {
      require(['../page/search'], resolve);
    }
  }, {
    path: '/detail', // 详情明细
    name: 'detail',
    component(resolve) {
      require(['../page/detail'], resolve);
    }
  }]
});
