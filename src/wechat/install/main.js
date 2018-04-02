/**
 * @author umin
 * @since
 * @copyright Copyright (c) 2018, YZKJ
 * @description main
 */
import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';
import 'public/js/base/main';
import 'public/js/base/mint';
import './mapp'; // Status Mapp
import fallback from 'public/components/cus-fallback';
import attach from 'public/components/cus-attach';
import empty from 'public/components/cus-empty';
import App from '../../App';
import sto from './store';
import './filters'; // Vue Filter

// For back
Vue.component('fallback', fallback);
// Attach
Vue.component('attach', attach);
// For Empty
Vue.component('empty', empty);

Vue.config.productionTip = false;

Vue.use(Vuex);

let store = new Vuex.Store(sto);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
