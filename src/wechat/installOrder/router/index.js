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
  }, { // 搜索
    path: '/search',
    name: 'search',
    component(resolve) {
      require(['../page/search'], resolve);
    },
    meta: {
      transition: 'push'
    }
  }, {
    path: '/detail', // 详情页面
    name: 'detail',
    component(resolve) {
      require(['../page/detail'], resolve);
    }
  }, {
    path: '/xttd', // 协同页面页面
    name: 'xttd',
    component(resolve) {
      require(['../page/xttd'], resolve);
    }
  }, {
    path: '/updateState', // 更新状态页面
    name: 'updateState',
    component(resolve) {
      require(['../page/updateState'], resolve);
    }
  }, {
    path: '/sign', // 签收页面
    name: 'sign',
    component(resolve) {
      require(['../page/sign'], resolve);
    }
  }, {
    path: '/batch', // 批次页面
    name: 'batch',
    component(resolve) {
      require(['../page/batch'], resolve);
    }
  }, {
    path: '/journal', // 日志页面
    name: 'journal',
    component(resolve) {
      require(['../page/journal'], resolve);
    }
  }, {
    path: '/updateDoor', // 挂门更新
    name: 'updateDoor',
    component(resolve) {
      require(['../page/updateDoor'], resolve);
    }
  }, {
    path: '/sporadic', // 零星真锁安装页面
    name: 'sporadic',
    component(resolve) {
      require(['../page/sporadic'], resolve);
    }
  }, {
    path: '/scanCode', // 零星真锁安装扫码页面
    name: 'scanCode',
    component(resolve) {
      require(['../page/scanCode'], resolve);
    }
  }, {
    path: '/zsBatch', // 真锁安装新增页面
    name: 'zsBatch',
    component(resolve) {
      require(['../page/zsBatch'], resolve);
    }
  }, {
    path: '/lock', // 锁芯页面
    name: 'lock',
    component(resolve) {
      require(['../page/lock'], resolve);
    }
  }, { // 项目楼层信息采集
    path: '/buildingInfo',
    name: 'buildingInfo',
    component(resolve) {
      require(['../page/buildingInfo'], resolve);
    }
  }, { // 项目楼层信息采集---楼层
    path: '/building',
    name: 'building',
    component(resolve) {
      require(['../page/building'], resolve);
    }
  }, { // 项目楼层信息采集 -- 栋
    path: '/ban',
    name: 'ban',
    component(resolve) {
      require(['../page/ban'], resolve);
    }
  }, { // 项目楼层信息采集 -- 层
    path: '/floor',
    name: 'floor',
    component(resolve) {
      require(['../page/floor'], resolve);
    }
  }]
});
