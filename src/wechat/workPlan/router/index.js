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
    path: '/', // 首页
    name: 'index',
    component(resolve) {
      require(['../page/index'], resolve);
    }
  }, {
    path: '/add', // 新建
    name: 'add',
    component(resolve) {
      require(['../page/add'], resolve);
    }
  }, {
    path: '/edit', // 编辑
    name: 'edit',
    component(resolve) {
      require(['../page/add'], resolve);
    }
  }, {
    path: '/detail', // 详情
    name: 'detail',
    component(resolve) {
      require(['../page/detail'], resolve);
    }
  }, {
    path: '/select', // 选择项目
    name: 'select',
    component(resolve) {
      require(['../page/select'], resolve);
    }
  }]
});
