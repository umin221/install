import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/api';
import { app } from 'public/store';

Vue.use(Vuex);

// 缓存页面
app.state.alive = ['index'];

const STATUS2LIST = {
  '待审批': 'pending',
  '有效': 'valid',
  '失效': 'invalid'
};

export default new Vuex.Store({
  modules: {
    app,
    /**
     * 委外团队列表
     */
    index: {
      namespaced: true,
      state: {
        // 待审批
        pending: '',
        // 有效
        valid: '',
        // 失效
        invalid: ''
      },
      mutations: {
        setPartners(state, {partners, type}) {
          state[type] = KND.Util.toArray(partners);
        }
      },
      actions: {
        // 获取委外列表
        getPartners({state, commit, dispatch}, status = '待审批') {
          api.get({
            key: 'getPartners',
            data: {
              status
            },
            success: function(data) {
              commit('setPartners', {partners: data.items, type: STATUS2LIST[status]});
            }
          });
        }
      }
    },
    /**
     * 委外详情&新增&编辑
     */
    detail: {
      namespaced: true,
      state: {
        form: {},
        attach: { // 附件
          list: [], // [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}],
          edit: false,
          title: '合同附件'
        }
      },
      mutations: {
        setPartner(state, form) {
          state.form = form;
          if (form.Contact) {
            state.form.Contact = KND.Util.toArray(form.Contact);
          };
        },
        clear(state) {
          state.form = {
            'Id': new Date().getTime(),
            'Name': '',
            'Alias': '',
            'KL Partner Owner Name': '',
            'Main Phone Number': '',
            'Primary Address Street': ''
          };
        }
      },
      actions: {
        // 获取委外详情
        findPartner({commit}, id) {
          api.get({
            key: 'findPartner',
            data: {
              id
            },
            success: function(data) {
              commit('setPartner', data.SiebelMessage['Channel Partner']);
            }
          });
        },
        // 创建委外团队
        addPartner({state, commit}, success) {
          // Alias 为必填，默认填入 Name
          state.form.Alias = state.form.Name;
          api.get({
            key: 'addPartner',
            data: {
              partner: state.form
            },
            success: success
          });
        }
      }
    }
  }
});
