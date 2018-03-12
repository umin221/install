import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/api';
import { app } from 'public/store';

Vue.use(Vuex);

// 缓存页面
app.state.alive = ['index'];

// 每页加载条数
const PAGESIZE = config.pageSize;
// mapp
let mapp = config.mapp['list'];

export default new Vuex.Store({
  modules: {
    app,
    /**
     * 安装交接单列表
     */
    index: {
      namespaced: true,
      state: {
        // 待审批
        pending: [],
        // 处理中
        process: [],
        // 已完成
        completed: [],
        // 搜索结果
        result: []
      },
      mutations: {
        setTransferOrders(state, {TransferOrders, list}) {
          state[list] = TransferOrders;
        },
        addTransferOrders(state, {TransferOrders, list}) {
          state[list].push(...TransferOrders);
        }
      },
      actions: {
        /**
         * 获取交接
         * @param {Object} data 必填 接口请求参数
         * @param {Boolean} more 选填 是否加载更多
         * @param {Function} callback 选填 处理回调
         * @param {Function} error 选填 错误回调
         */
        getTransferOrder({state, commit, dispatch}, {data, more, callback, error}) {
          let list = mapp[data['Status']] || 'result'; // 搜索所有时，没有状态
          api.get({
            key: 'getTransferOrder',
            data: data,
            paging: {
              StartRowNum: more ? state[list].length : 0,
              PageSize: PAGESIZE
            },
            success: function(data) {
              let TransferOrders = KND.Util.toArray(data.SiebelMessage.Project);
              commit(more ? 'addTransferOrders' : 'setTransferOrders', {
                TransferOrders: TransferOrders,
                list: list
              });
              if (callback) {
                callback(TransferOrders);
              }
            },
            error
          });
        }
      }
    },

    /**
     * 安装交接单详情
     */
    detail: {
      namespaced: true,
      state: {
        form: {},
        record: [{state: '已提交', time: '2017-02-01 18:00'},
          {state: '总部安装主管xx审批中', time: '2017-02-01 19:00'}],
        order: [{
          code: '1-182624597380',
          number: '500',
          state: 'pending'
        }]
      },
      mutations: {
        setTransferOrder(state, form) {
          state.form = form;
          if (form.User) {
            state.form.User = KND.Util.toArray(form.User);
          };
        },
        clear(state) {
          state.form = {
            'Id': KND.Util.now(),
            'Name': '',
            'Alias': '',
            'KL Partner Owner Name': '',
            'Main Phone Number': '',
            'Primary Address Street': ''
          };
        }
      },
      actions: {
        /**
         * 通过id获取安装交接单信息
         * @param {String} id 必填 id
         */
        findTransferOrderById({commit}, id) {
          api.get({
            key: 'findTransferOrderById',
            data: {
              id: id
            },
            success: function(data) {
              commit('setTransferOrder', data);
            }
          });
        },
        /**
         * 更新安装交接单状态
         * @param {Object} setting 必填 请求参数配置
         */
        update({state}, setting) {
          api.get(Object.extend(true, {
            key: 'update',
            data: {
              Id: state.form.Id
            },
            success: (data) => {
              if (data) {
                Toast('更新成功');
                KND.Util.back();
              } else {
                Toast('更新失败');
              }
            }
          }, setting));
        }
      }
    },

    /**
     * 指派安装工程师
     */
    engineer: {
      namespaced: true,
      state: {
        result: [],
        select: {
          'Last Name': '请选择'
        }
      },
      mutations: {
        setEngineer(state, engineer) {
          state.result = engineer;
        },
        addEngineer(state, engineer) {
          state.result.push(...engineer);
        },
        selEngineer(state, engineer) {
          state.select = engineer;
        }
      },
      actions: {
        /**
         * 查找安装工程师
         * @param {Object} data 必填 查询条件 键值对
         */
        findEngineer({state, commit}, {data, more, callback}) {
          api.get({
            key: 'findEngineer',
            data: data,
            paging: {
              StartRowNum: more ? state.result.length : 0,
              PageSize: PAGESIZE
            },
            success: (data) => {
              let engineer = KND.Util.toArray(data.items);
              commit(more ? 'addEngineer' : 'setEngineer', engineer);
              if (callback) {
                callback(engineer);
              }
            },
            error: (error) => {
              if (callback) {
                callback();
              };
              console.log(error);
            }
          });
        }
      }
    },

    /**
     * 安装订单产品收集
     */
    order: {
      namespaced: true,
      state: {
        form: {}
      },
      actions: {
        submit() {
        }
      }
    }
  }
});
