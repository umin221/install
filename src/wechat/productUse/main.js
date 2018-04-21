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
import buttonGroup from 'public/components/cus-button-group';
import App from '../../App';
import store from './store';
import empty from 'public/components/cus-empty';
import './filters'; // Vue Filter

// For back
Vue.component('fallback', fallback);

Vue.component('empty', empty);

Vue.component('buttonGroup', buttonGroup);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
