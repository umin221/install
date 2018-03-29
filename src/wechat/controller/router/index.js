/**
 * @author umin
 * @since
 * @copyright Copyright (c) 2018, YZKJ
 * @description router
 */
import Vue from 'vue';
import Router from 'vue-router';
import Page from '../page/page';

Vue.use(Router);

export default new Router({
  routes: [{ path: '/', redirect: '/page' }, {
    path: '/page',
    name: 'page',
    component: Page
  }]
});
