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
  routes: [{ // 登录页
    path: '/',
    name: 'login',
    component(resolve) {
      require(['../page/login'], resolve);
    }
  }, { // 批次列表
    path: '/index',
    name: 'index',
    component(resolve) {
      require(['../page/index'], resolve);
    },
    meta: {
      transition: 'fade'
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
  }, { // 项目楼层信息采集---楼层
    path: '/assets',
    name: 'assets',
    component(resolve) {
      require(['../page/assets'], resolve);
    }
  }, { // 项目楼层信息采集 -- 栋
    path: '/building',
    name: 'building',
    component(resolve) {
      require(['../page/building'], resolve);
    }
  }, { // 项目楼层信息采集 -- 层
    path: '/floor',
    name: 'floor',
    component(resolve) {
      require(['../page/floor'], resolve);
    }
  }, { // 个人中心
    path: '/setting',
    name: 'setting',
    component(resolve) {
      require(['../page/setting'], resolve);
    }
  }, { // 常见问题
    path: '/faq',
    name: 'faq',
    component(resolve) {
      require(['../page/faq'], resolve);
    }
  }]
});
