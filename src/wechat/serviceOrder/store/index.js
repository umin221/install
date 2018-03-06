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
        loginMeg: {
          'Last Name': '袁静',
          'Emp #': '16113009',
          'Job Title': '400'
        }
        // loginMeg: {
        //   'Last Name': '代一',
        //   'Emp #': '16013107',
        //   'Job Title': 'install'
        // }
      },
      actions: {
      },
      mutations: {
      }
    },
    addService: {
      namespaced: true,
      state: {
      }
    }
  }
});
