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
  }, { // 选择工程师
    path: '/engineer',
    name: 'engineer',
    component(resolve) {
      require(['../page/engineer'], resolve);
    },
    meta: {
      transition: 'push'
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
    path: '/batch', // 批次新增页面
    name: 'batch',
    component(resolve) {
      require(['../page/batch'], resolve);
    }
  }, {
    path: '/batchDetail', // 批次详情页面
    name: 'batchDetail',
    component(resolve) {
      require(['../page/batchDetail'], resolve);
    }
  }, {
    path: '/detailPlan', // 批次详细计划页面
    name: 'detailPlan',
    component(resolve) {
      require(['../page/detailPlan'], resolve);
    }
  }, {
    path: '/approval', // 审批记录
    name: 'approval',
    component(resolve) {
      require(['../page/approval'], resolve);
    }
  }, {
    path: '/company', // 合作伙伴
    name: 'company',
    component(resolve) {
      require(['../page/company'], resolve);
    }
  }, {
    path: '/installer', // 委外安装员
    name: 'installer',
    component(resolve) {
      require(['../page/installer'], resolve);
    }
  }, {
    path: '/updateDoor', // 验收更新1
    name: 'updateDoor',
    component(resolve) {
      require(['../page/updateDoor'], resolve);
    }
  }, {
    path: '/updateDoorNext', // 验收更新2
    name: 'updateDoorNext',
    component(resolve) {
      require(['../page/updateDoorNext'], resolve);
    }
  }, {
    path: '/updateLIS', // 真锁更新验收2
    name: 'updateLIS',
    component(resolve) {
      require(['../page/updateLIS'], resolve);
    }
  }, {
    path: '/journal', // 日志页面 -——————统一页面
    name: 'journal',
    component(resolve) {
      require(['../page/journal'], resolve);
    }
  }, {
    path: '/journalLIS', // 日志页面 ——————真锁专用
    name: 'journalLIS',
    component(resolve) {
      require(['../page/journalLIS'], resolve);
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
    path: '/orderLine', // 锁体&面板
    name: 'orderLine',
    component(resolve) {
      require(['../page/orderLine'], resolve);
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
