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
let mappList = config.mapp['list'];
let mappStatus;

export default new Vuex.Store({
  modules: {
    app,
    /**
     * 安装交接单列表
     */
    index: {
      namespaced: true,
      state: {
        isManager: false,
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
        },
        setManager(state, isManager) {
          mappStatus = config.mapp[isManager ? 'manager' : 'employee'];
          state.isManager = isManager;
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
          data['Status'] = mappStatus[data['Status']];
          let list = mappList[data['Status']] || 'result'; // 搜索所有时，没有状态
          api.get({
            key: 'getTransferOrder',
            data: data,
            paging: {
              StartRowNum: more ? state[list].length : 0,
              PageSize: PAGESIZE
            },
            success: data => {
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
        orders: ''
      },
      mutations: {
        setTransferOrder(state, form) {
          state.form = form;
        },
        setOrders(state, orders) {
          state.orders = KND.Util.toArray(orders);
        },
        clear(state) {
          state.form = {};
        },
        removeOrder(state, index) {
          state.orders.splice(index, 1);
        }
      },
      actions: {
        /**
         * 通过id获取安装交接单信息
         * @param {String} id 必填 id
         */
        findTransferOrderById({commit}, id) {
          api.get({
            key: 'queryTransferOrderById', // 'findTransferOrderById', //
            data: {
              id: id
            },
            success: data => {
              commit('setTransferOrder', data.SiebelMessage.Project);
            }
          });
        },
        /**
         * 获取订单头
         */
        queryOrdersById({commit}, id) {
          api.get({
            key: 'queryOrdersById',
            data: {
              'Project Id': id
            },
            success: data => {
              commit('setOrders', data.items);
            }
          });
        },
        /**
         * 驳回交接单
         */
        reject({state, dispatch}) {
          // 交接单待办Id
          let ownerInfoId = state.form['Inbox Task Id'];
          // 更新待办
          api.get({
            key: 'deactivateInbox',
            data: {
              body: {
                OwnerInfoId: ownerInfoId
              }
            },
            success: data => {
              tools.success(data, {
                success: () => {
                  // 更新交接单状态
                  dispatch('update', {
                    data: {
                      'Status': '已驳回'
                    }
                  });
                }
              });
            }
          });
        },
        /**
         * 更新安装交接单状态
         * @param {Object} setting 必填 请求参数配置
         */
        update({state}, setting) {
          // 交接单id
          let Id = state.form.Id;
          api.get(Object.extend(true, {
            key: 'update',
            data: {
              Id: Id
            },
            success: data => {
              tools.success(data, {
                back: true,
                successTips: '更新成功'
              });
            }
          }, setting));
        },
        /**
         * 指派安装工程师
         * @param {String} positionId 必填 选择的安装人员职位Id
         */
        assign({state}, positionId) {
          let form = state.form;
          api.get({
            key: 'assign',
            data: {
              'body': {
                'Object Id': form['Id'], // 安装交接单Id
                'InboxTaskId': form['Inbox Task Id'], // 交接单待办Id
                'PositionId': positionId, // 选择的安装人员职位Id
                'Status': form['Status'], // 当前安装交接单状态
                'ProcessName': 'KL Contract Delivery Assign Setter Process' // 固定 安装交接单指派安装工程师流程
              }
            },
            success: data => {
              tools.success(data, {
                back: true,
                successTips: '指派成功'
              });
            }
          });
        },
        /**
         * 删除订单
         */
        delete({commit}, setting) {
          api.get({
            key: 'deleteOrder',
            data: {
              id: setting.id
            },
            success: data => {
              commit('removeOrder', setting.index);
              tools.success(data);
            }
          });
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
            success: data => {
              let engineer = KND.Util.toArray(data.items);
              commit(more ? 'addEngineer' : 'setEngineer', engineer);
              if (callback) {
                callback(engineer);
              }
            },
            error: error => {
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
      },
      mutations: {
      },
      actions: {
        submit() {
        },
        /**
         * 保存安装订单
         * @param {Object} data 必填 交接单对象
         * @param {Function} success 选填 成功回调
         */
        save({state}, setting) {
          api.get({
            key: 'saveOrder',
            data: {
              'body': Object.assign({
                'ProcessName': 'KL Install Order Create Process'
              }, setting.data)
            },
            success: setting.success || (data => {
              tools.success(data);
            })
          });
        },
        /**
         * 更新安装订单
         */
        update({state}, order) {
          api.get({
            key: 'updateOrder',
            data: order,
            success: data => {
              tools.success(data);
            }
          });
        },
        /**
         * 获取订单行
         */
        queryOrderLines({state}, setting) {
          setting.key = 'queryOrderLines';
          api.get(setting);
        },
        /**
         * 转发或提交订单
         */
        runProcess({state}, setting) {
          setting.key = 'runProcess';
          api.get(setting);
        }
      }
    },

    /**
     * 创建&更新订单行
     */
    orderLine: {
      namespaced: true,
      state: {},
      mutations: {},
      actions: {
        saveOrderLine({state}, data) {
          api.get({
            key: 'saveOrderLine',
            data: Object.assign({}, data),
            success: data => {
              tools.success(data, {
                back: true
              });
            }
          });
        }
      }
    }
  }
});
