/**
 * @author umin
 * @since
 * @copyright Copyright (c) 2018, YZKJ
 * @description main
 */
import Vue from 'vue';
import router from './router';
import 'public/js/base/main';
import 'public/js/base/mint';
import fallback from 'public/components/cus-fallback';
import empty from 'public/components/cus-empty';
import App from '../../App';
import store from './store';
import './filters'; // Vue Filter

// 文档ready前追加js文件
tools.preAppend('https://map.qq.com/api/js?v=2.exp');
// For back
Vue.component('fallback', fallback);
// For Empty
Vue.component('empty', empty);

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
