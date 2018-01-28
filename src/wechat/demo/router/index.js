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
import Toast from '../page/toast';
import Indicator from '../page/indicator';
import MessageBox from '../page/messageBox';
import ActionSheet from '../page/actionSheet';

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
  }, {
    path: '/toast',
    name: 'toast',
    component: Toast
  }, {
    path: '/indicator',
    name: 'indicator',
    component: Indicator
  }, {
    path: '/messageBox',
    name: 'messageBox',
    component: MessageBox
  }, {
    path: '/actionSheet',
    name: 'actionSheet',
    component: ActionSheet
  }]
});
