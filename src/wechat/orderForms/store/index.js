import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/api';
import { app } from 'public/store';

Vue.use(Vuex);
//
const PAGESIZE = config.pageSize;
let mapps;

// 缓存页面
app.state.alive = ['index'];

export default new Vuex.Store({
  modules: {
    app,
    index: {
      namespaced: true,
      state: {
        orderEntry: [],
        isManager: false,
        // 查看团队
        isTeam: false,
        // 待处理
        pending: [],
        // 处理中
        valid: [],
        // 已完成
        invalid: []
      },
      actions: {
        getList({state, commit}, {data, more, callback, error}) {
          // data.team = data.team || '';
          let status = data['Status'];
          let mapp = mapps[status] || {};
          // 搜索时，没有状态
          let list = mapp['list'] || 'result';
          data['Status'] = mapp['status'];
          data.team = state.isTeam;
          api.get({
            key: 'getList',
            data: data,
            paging: {
              StartRowNum: more ? state[list].length : 0,
              PageSize: PAGESIZE
            },
            success: function(data) {
              let TransferOrders = KND.Util.toArray(data.SiebelMessage['Order Entry - Orders']);
              if (TransferOrders) {
                commit(more ? 'addList' : 'setList', {
                  TransferOrders: TransferOrders,
                  list: list
                });
              }
              if (callback) {
                callback(data);
              }
            },
            error
          });
        }
      },
      mutations: {
        setList(state, {TransferOrders, list}) {
          state[list] = TransferOrders;
        },
        addList(state, {TransferOrders, list}) {
          state[list].push(...TransferOrders);
        },
        setManager(state, isManager) {
          mapps = config.mapp['manager'];
          state.isManager = isManager;
        },
        setTeam(state, isTeam) {
          state.isTeam = isTeam;
          // 清空列表数据
          state.pending = [];
          state.valid = [];
          state.invalid = [];
        }
      }
    },
    detail: {
      namespaced: true,
      state: {
        orderDatail: {},
        lineItems: []
      },
      actions: {
        getDetail({commit}, orNumber) {
          api.get({
            key: 'getDetail',
            data: {
              orNumber
            },
            success: function(data) {
              commit('setdetail', data.SiebelMessage['Order Entry - Orders']);
            }
          });
        }
      },
      mutations: {
        setdetail(state, data) {
          data = data || {};
          state.lineItems = [];
          state.orderDatail = data;
          let lineItems = state.orderDatail['Order Entry - Line Items'];
          if (lineItems) {
            if (KND.Util.isArray(lineItems)) {
              for (let i = 0; i < lineItems.length;i++) {
                state.lineItems.push(lineItems[i]);
              }
            } else {
              state.lineItems.push(lineItems);
            }
          }
        }
      }
    },
    searchList: {
      namespaced: true,
      state: {
        result: []
      },
      actions: {
        getSearchList({state, commit}, {orNumber, more, callback, error}) {
          api.get({
            key: 'getSearchList',
            data: {
              orNumber
            },
            paging: {
              StartRowNum: more ? state['result'].length : 0,
              PageSize: PAGESIZE
            },
            success: function(data) {
              let orderEntry = KND.Util.toArray(data.SiebelMessage['Order Entry - Orders']);
              if (orderEntry) {
                commit(more ? 'addSearchList' : 'setSearchList', orderEntry);
                if (callback) {
                  callback(orderEntry);
                }
              }
            },
            error
          });
        }
      },
      mutations: {
        setSearchList(state, data) {
          state.result = data;
        },
        addSearchList(state, data) {
          state.result.push(...data);
        }
      }
    }
  }
});
