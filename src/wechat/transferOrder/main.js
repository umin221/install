/**
 * @author umin
 * @since
 * @copyright Copyright (c) 2018, YZKJ
 * @description main
 * 1. SIT 阶段需求变更，新增安装支持专员和安装支持主管的操作视图，分配交接单操作由安装主管变更为安装支持专员处理
 * 2. SIT 阶段 5月8日 需求变更，安装支持专员需要维护和同行信息，确认专员和主管的操作不在移动端实现
 */
import Vue from 'vue';
import router from './router';
import 'public/js/base/main';
import 'public/js/base/mint';
import './mapp'; // Status Mapp
import fallback from 'public/components/cus-fallback';
import attach from 'public/components/cus-attach';
import empty from 'public/components/cus-empty';
import buttonGroup from 'public/components/cus-button-group';
import App from '../../App';
import store from './store';

// For back
Vue.component('fallback', fallback);
// Attach
Vue.component('attach', attach);
// For Empty
Vue.component('empty', empty);
// For Buttons
Vue.component('button-group', buttonGroup);

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
