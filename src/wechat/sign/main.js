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
import App from '../../App';
import store from './store';
import './filters'; // Vue Filter
import BaiduMap from 'vue-baidu-map'; // 百度地图
// For back
Vue.component('fallback', fallback);
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'y2OvzrZBF4GqiLb699vK7CwsHu374OmS'
});
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  BaiduMap,
  template: '<App/>',
  components: { App }
});
