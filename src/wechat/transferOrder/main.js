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
