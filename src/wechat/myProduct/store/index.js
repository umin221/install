import Vue from 'vue';
import Vuex from 'vuex';
import { app } from 'public/store';
import api from '../api/api';

Vue.use(Vuex);

// 缓存页面
app.state.alive = ['index'];

export default new Vuex.Store({
  modules: {
    app,
    index: {
      namespaced: true,
      state: {
        dataList: [] // 列表数据
      },
      actions: {
        getData({state, commit, dispatch}, {data, callback}) {
          api.get({
            key: 'getList',
            data: {
              Id: data
            },
            success: data => {
              commit('setData', data);
              callback && callback(data);
            }
          });
        }
      },
      mutations: {
        setData(state, data) {
          state.dataList = data;
        }
      }
    },
    detail: {
      namespaced: true,
      state: {
      }
    },
    searchTrans: {
      namespaced: true,
      state: {
      },
      actions: {
        getData({state, commit, dispatch}, {data, callback}) {
          api.get({
            key: 'getList',
            data: {
              Id: data
            },
            success: data => {
              callback && callback(data);
            }
          });
        }
      }
    }
  }
});
