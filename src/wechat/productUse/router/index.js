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
    path: '/detail', // 详情
    name: 'detail',
    component(resolve) {
      require(['../page/detail'], resolve);
    }
  }, {
    path: '/add', // 新增
    name: 'add',
    component(resolve) {
      require(['../page/add'], resolve);
    }
  }, {
    path: '/selectParts', // 选择配件
    name: 'selectParts',
    component(resolve) {
      require(['../page/selectParts'], resolve);
    }
  }, {
    path: '/selectProject', // 选择项目
    name: 'selectProject',
    component(resolve) {
      require(['../page/selectProject'], resolve);
    }
  }]
});
