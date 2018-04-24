import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/api';
import { app } from 'public/store';

Vue.use(Vuex);

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
        isManager: false,
        // 待处理
        pending: [],
        // 处理中
        valid: [],
        // 已完成
        invalid: []
      },
      actions: {
        getList({state, commit, dispatch}, {data, more, callback, error}) {
          let status = data['Status'];
          let mapp = mapps[status] || {};
          // 搜索时，没有状态
          let list = mapp['list'] || 'result';

          data['Status'] = mapp['status'];
          // ViewMode 随当前状态切换
          api.get({
            key: 'getList',
            data: data,
            paging: {
              StartRowNum: more ? state[list].length : 0,
              PageSize: PAGESIZE
            },
            success: data => {
              let ProductUse = KND.Util.toArray(data.SiebelMessage['Order Entry - Orders']);
              commit(more ? 'addProductUse' : 'setProductUse', {
                TransferOrders: ProductUse,
                list: list
              });
              if (callback) {
                callback(ProductUse);
              }
            },
            error
          });
        }
      },
      mutations: {
        setManager(state, isManager) {
          mapps = config.mapp['manager'];
          state.isManager = isManager;
        },
        setProductUse(state, {TransferOrders, list}) {
          state[list] = TransferOrders;
        },
        addProductUse(state, {TransferOrders, list}) {
          state[list].push(...TransferOrders);
        }
      }
    },
    add: {
      namespaced: true,
      state: {
        partList: [],
        project: {}
      },
      actions: {
        /* 设置配件列表
        *  @param {Object} data 必填
        */
        setPartList({state, commit, dispatch}, data) {
          commit('partList', data);
        },
        /* 删除配件列表
        *  @param {Object} index 必填 删除哪一个配件的索引
        */
        deletePart({state, commit, dispatch}, index) {
          state.partList.splice(index, 1);
        },
        /* 设置项目
        *  @param {Object} data 必填
        */
        setProject({state, commit, dispatch}, data) {
          commit('project', data);
        },
        /* 设置日期
        *  @param {Object} data 必填
        */
        setTime({state, commit, dispatch}, time) {
          commit('timeDate', time);
        },
        /* 配件的数量
        *  @param {Object} data 必填
        */
        setpartNum({state, commit, dispatch}, index, sumVal) {
          commit('partSum', index, sumVal);
        },
        addServiceOrder({state, commit, dispatch}, form) {
          api.get({
            key: 'addServiceOrder',
            data: {
              form
            },
            success: data => {
              dispatch('toApproval', {id: data.PrimaryRowId, form});
            },
            error: data => {
              form.callBack('保存失败');
            }
          });
        },
        toApproval({commit}, {id, form}) {
          api.get({
            key: 'toApproval',
            data: {
              id
            },
            success: data => {
              console.log(data);
              form.callBack('保存成功');
            },
            error: data => {
              form.callBack('保存失败');
            }
          });
        }
      },
      mutations: {
        selectProduct(state, select) {                    // 确认选择的配件
          state.partList.push(select);
        },
        project(state, data) {
          state.project = data;
        },
        initSelect(state) {
          state.partList = [];
        },
        timeDate(state, data) {
          state.time.year = data.year;
          state.time.month = data.month;
          state.time.day = data.day;
        }
      }
    },
    selectParts: {
      namespaced: true,
      state: {
        result: [],
        selected: [],
        returnSelect: []
      },
      actions: {
        getProduct({state, commit}, val) {
          api.get({
            key: 'getPrice',
            success: function(data) {
              state.priceId = data.Id;
              if (data.Id) {
                api.get({
                  key: 'getProduct',
                  data: {
                    val: val.value,
                    id: data.Id
                  },
                  success: function(data) {
                    let Catalog = KND.Util.toArray(data.SiebelMessage['Catalog Category']);
                    if (Catalog) {
                      commit('setProduct', Catalog);
                    }
                  }
                });
              }
            }
          });
        }
      },
      mutations: {
        count(state, val) {
          if (val.isShow) {
            state.selected.splice(val.index, 1, false);
          } else {
            state.selected.splice(val.index, 1, true);
          }
        },
        setProduct(state, data) {
          state.result = [];
          state.selected = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].Product) {
              if (KND.Util.isArray(data[i].Product)) {
                state.result = state.result.concat(data[i].Product);
              } else {
                state.result.push(data[i].Product);
              }
            }
          }
          for (let i = 0; i < state.result.length;i++) {
            state.selected.push(false);
          }
        },
        initSelected(state) {
          state.selected = [];
          for (let i = 0; i < state.result.length;i++) {
            state.selected.push(false);
          }
        },
        deleteSelected(state) {
          state.selected = [];
        }
      }
    },
    selectProject: {
      namespaced: true,
      state: {
        installList: []
      },
      actions: {
        getinstall({state, commit}, {id, name}) {
          api.get({
            key: 'getinstall',
            data: {
              id,
              name
            },
            success: function(data) {
              let installList = KND.Util.toArray(data['SiebelMessage']['Order Entry - Orders']);
              commit('setinstall', installList);
            }
          });
        }
      },
      mutations: {
        setinstall(state, list) {
          state.installList = list;
        }
      }
    },
    detail: {
      namespaced: true,
      state: {
        orderEntry: {},
        lineItems: []
      },
      mutations: {
        setOrderEntry(state, {data, list}) {
          state.orderEntry = data;
          state['lineItems'] = list;
        }
      },
      actions: {
        getOrderEntry({state, commit}, {id, callback}) {
          api.get({
            key: 'getOrderEntry',
            data: {
              id
            },
            success: function(data) {
              let orderdetail = data['SiebelMessage']['Order Entry - Orders'];
              let orderItem = KND.Util.toArray(orderdetail['Order Entry - Line Items']);
              if (!orderItem) {
                orderItem = [];
              }
              commit('setOrderEntry', {data: orderdetail, list: orderItem});
              if (callback) {
                callback(orderdetail);
              }
            }
          });
        }
      }
    }
  }
});
