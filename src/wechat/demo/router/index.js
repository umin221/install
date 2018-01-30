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
    path: '/test', // 测试页面
    name: 'detail',
    component(resolve) {
      require(['../page/detail'], resolve);
    }
  }, {
    path: '/icon', // 图标清单
    name: 'icon',
    component(resolve) {
      require(['../page/icon'], resolve);
    }
  }, {
    path: '/loading', // 拖动加载
    name: 'loading',
    component(resolve) {
      require(['../page/loading'], resolve);
    }
  }, {
    path: '/toast', // 弱 toast 提醒
    name: 'toast',
    component(resolve) {
      require(['../page/toast'], resolve);
    }
  }, {
    path: '/indicator', // 加载框
    name: 'indicator',
    component(resolve) {
      require(['../page/indicator'], resolve);
    }
  }, {
    path: '/messageBox', // 对话框
    name: 'messageBox',
    component(resolve) {
      require(['../page/messageBox'], resolve);
    }
  }, {
    path: '/actionSheet', // 操作表
    name: 'actionSheet',
    component(resolve) {
      require(['../page/actionSheet'], resolve);
    }
  }]
});
