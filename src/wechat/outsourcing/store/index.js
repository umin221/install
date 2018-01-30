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
      },
      actions: {
      }
    }
  }
});
