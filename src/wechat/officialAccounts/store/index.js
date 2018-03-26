import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/api';
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
      mutations: {
      },
      actions: {
        getLov({commit}, {type, parent, success, error}) {
          api.get({
            key: 'getLov',
            data: {
              type,
              parent
            },
            success,
            error: data => {
              console.log(data);
            }
          });
        }
      }
    },
    address: {
      namespaced: true,
      state: {
      },
      mutations: {
        dataType(state, data) {
        }
      },
      actions: {
      }
    },
    detail: {
      namespaced: true,
      state: {
        tabList: [
          {name: '基础信息', id: 'tab-container1'},
          {name: '流程记录', id: 'tab-container2'}
        ]
      },
      mutations: {
        dataType(state, data) {
        }
      },
      actions: {
      }
    },
    addAddress: {
      namespaced: true,
      state: {
        Municipality: ['上海', '天津', '澳门', '重庆', '香港', '北京']
      },
      mutations: {
        dataType(state, data) {
        }
      },
      actions: {
      }
    }
  }
});
