import Vue from 'vue';
import Vuex from 'vuex';
import { app } from 'public/store';

Vue.use(Vuex);

// 缓存页面
app.state.alive = ['index'];

export default new Vuex.Store({
  modules: {
    app,
    index: {
      namespaced: true,
      state: {
        value: ''
      },
      actions: {
      },
      mutations: {
      }
    },
    detail: {
      namespaced: true,
      state: {
      }
    },
    sign: {
      namespaced: true,
      state: {
        form: '',
        attach: {
          list: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}],
          edit: false,
          title: '合同附件'
        } // 附件
      }
    }

  }
});
