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
    path: '/submitService', // 首页列表
    name: 'submitService',
    component(resolve) {
      require(['../page/submitService'], resolve);
    }
  }, {
    path: '/address', // 地址管理
    name: 'address',
    component(resolve) {
      require(['../page/address'], resolve);
    }
  }, {
    path: '/myRepair', // 报修列表
    name: 'myRepair',
    component(resolve) {
      require(['../page/myRepair'], resolve);
    }
  }, {
    path: '/repairDetail', // 报修详情
    name: 'repairDetail',
    component(resolve) {
      require(['../page/repairDetail'], resolve);
    }
  }, {
    path: '/addAddress', // 新建地址
    name: 'addAddress',
    component(resolve) {
      require(['../page/addAddress'], resolve);
    }
  }, {
    path: '/address', // 地址列表
    name: 'address',
    component(resolve) {
      require(['../page/address'], resolve);
    }
  }, {
    path: '/commentOn', // 点评
    name: 'commentOn',
    component(resolve) {
      require(['../page/commentOn'], resolve);
    }
  }, {
    path: '/personal', // 个人中心
    name: 'personal',
    component(resolve) {
      require(['../page/personal'], resolve);
    }
  }, {
    path: '/myDevice', // 我的设备
    name: 'myDevice',
    component(resolve) {
      require(['../page/myDevice'], resolve);
    }
  }, {
    path: '/deviceDetail', // 设备详情
    name: 'deviceDetail',
    component(resolve) {
      require(['../page/deviceDetail'], resolve);
    }
  }, {
    path: '/addDevice', // 添加设备
    name: 'addDevice',
    component(resolve) {
      require(['../page/addDevice'], resolve);
    }
  }, {
    path: '/hotTelephone', // 热线电话
    name: 'hotTelephone',
    component(resolve) {
      require(['../page/hotTelephone'], resolve);
    }
  }, {
    path: '/repairPolicy', // 报修政策
    name: 'repairPolicy',
    component(resolve) {
      require(['../page/repairPolicy'], resolve);
    }
  }, {
    path: '/engineer', // 工程师通道
    name: 'engineer',
    component(resolve) {
      require(['../page/engineer'], resolve);
    }
  }, {
    path: '/scanSn', // 扫码指引
    name: 'scanSn',
    component(resolve) {
      require(['../page/scanSn'], resolve);
    }
  }, {
    path: '/telValidate', // 手机验证
    name: 'telValidate',
    component(resolve) {
      require(['../page/telValidate'], resolve);
    }
  }]
});
