/**
 * @author umin
 * @since
 * @copyright Copyright (c) 2018, YZKJ
 * @description router
 */
import Vue from 'vue';
import Router from 'vue-router';
import Index from '../page/index';
import Detail from '../page/detail';
import Icon from '../page/icon';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'index',
    component: Index
  }, {
    path: '/detail',
    name: 'detail',
    component: Detail
  }, {
    path: '/icon',
    name: 'icon',
    component: Icon
  }]
});
