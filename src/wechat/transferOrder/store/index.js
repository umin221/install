import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/api';
import { app } from 'public/store';

Vue.use(Vuex);

// 缓存页面
app.state.alive = ['index'];

// 每页加载条数
const PAGESIZE = config.pageSize;
// mapps
let mapps;

export default new Vuex.Store({
  modules: {
    app,
    /**
     * 安装交接单列表
     */
    index: {
      namespaced: true,
      state: {
        // 是否主管权限，可分配交接单给工程师
        isManager: false,
        // 查看团队，此状态下所有信息只可查看，不可编辑
        isTeam: false,
        // 是否安装工程师&安装主管，非安装人员不可操作安装订单
        isEngineer: false,
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
        // 查看个人交接单&团队交接单
        setTeam(state, isTeam) {
          state.isTeam = isTeam;
          // 清空列表数据
          state.pending = [];
          state.process = [];
          state.completed = [];
        },
        // 根据用户职位，设置用户权限
        setAuthority(state, position) {
          // 总部支持主管 & 总部支持专员，具备管理权限，可查看&分配未完成的交接单。
          let isManager = position === 'HQ Support Assistant' || position === 'HQ Support Manager';
          mapps = config.mapp[isManager ? 'manager' : 'employee'];
          state.isManager = isManager;
          // 只有安装人员可操作安装订单
          state.isEngineer = position === 'Field Service Manager' || position === 'Field Service Engineer';
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
          let status = data['Status'];
          let mapp = mapps[status] || {};
          // 搜索时，没有状态
          let list = mapp['list'] || 'result';

          data['Status'] = mapp['status'];
          // 查看个人交接单&团队交接单
          data['ViewMode'] = state.isTeam ? 'Manager' : 'Personal';

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
        orders: ''
      },
      mutations: {
        setTransferOrder(state, form) {
          state.form = form;
        },
        setOrders(state, orders) {
          state.orders = KND.Util.toArray(orders);
        },
        removeOrder(state, index) {
          state.orders.splice(index, 1);
        }
      },
      actions: {
        generateOrder({state}, setting) {
          setting.key = 'generateOrder';
          api.get(setting);
        },
        /**
         * 通过id获取安装交接单信息
         * @param {String} id 必填 id
         */
        findTransferOrderById({commit, dispatch}, id) {
          api.get({
            key: 'queryTransferOrderById', // 'findTransferOrderById', //
            data: {
              id: id
            },
            success: data => {
              let form = data.SiebelMessage.Project;
              commit('setTransferOrder', form);
              if (form['Status'] !== '已提交') {
                // 获取安装订单
                dispatch('queryOrdersById', id);
              }
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
              commit('setOrders', data.SiebelMessage['Order Entry - Orders']);
            }
          });
        },
        /**
         * 驳回交接单 <废弃>
         */
        reject({state}) {
          api.get({
            key: 'reject',
            data: {
              id: state.form.Id // 交接单id
            },
            success: data => {
              tools.success(data, {
                back: true,
                successTips: '驳回成功'
              });
            }
          });
        },
        /**
         * 驳回交接单 <废弃>
         */
        reject1({state, dispatch}) {
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
          'KL Employee Full Name': '请选择'
        }
      },
      mutations: {
        setEngineer(state, engineer) {
          state.result = engineer;
        },
        addEngineer(state, engineer) {
          state.result.push(...engineer);
        },
        selEngineer(state, engineer = {'KL Employee Full Name': '请选择'}) {
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
        order: '',
        lines: ''
      },
      mutations: {
        setOrder(state, order) {
          state.lines = [];
          state.order = order;
        },
        removeLine(state, id) {
          let lines = state.lines;
          for (let i = 0, len = lines.length; i < len; i++) {
            if (lines[i].Id === id) {
              state.lines.splice(i, 1);
              break;
            }
          }
        },
        setLines(state, lines) {
          state.lines = KND.Util.toArray(lines);
        }
      },
      actions: {
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
        update({state}, setting) {
          let param = KND.Util.mappDTO(setting.data, ['Id', 'KL Hole Type', 'KL Delivery Partner Id', 'KL Delivery Partner Name', 'KL Delivery Check Box 1', 'KL Delivery Check Box 2']);
          // 现场改孔， 清除门厂信息
          if (setting.data['KL Hole Type'] === '现场改孔') {
            delete param['KL Delivery Partner Id'];
            delete param['KL Delivery Partner Name'];
          };
          setting.key = 'updateOrder';
          setting.data = param;
          // 更新订单不操作订单行
          setting.success = setting.success || (data => {
            tools.success(data);
          });
          api.get(setting);
        },
        /**
         * 获取订单行
         */
        queryLines({commit}, data) {
          commit('setLines', []);
          api.get({
            key: 'queryOrderLines',
            data: data,
            success: data => {
              commit('setLines', data.items);
            }
          });

        },
        /**
         * 转发或提交订单
         */
        runProcess({state}, setting) {
          setting.key = 'runProcess';
          api.get(setting);
        },
        /**
         * 删除订单行
         */
        delete({commit}, id) {
          api.get({
            key: 'deleteOrderLine',
            data: {
              id: id
            },
            success: data => {
              commit('removeLine', id);
              tools.success(data);
            }
          });
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
    },

    /**
     * 更改门厂
     */
    doorFactory: {
      namespaced: true,
      state: {
        result: [],
        select: {
          'Name': '请选择'
        }
      },
      mutations: {
        setFactory(state, factory) {
          state.result = factory;
        },
        addFactory(state, factory) {
          state.result.push(...factory);
        },
        selFactory(state, factory = {'Name': '请选择'}) {
          state.select = factory;
        }
      },
      actions: {
        /**
         * 查找门厂
         * @param {Object} data 必填 查询条件 键值对
         */
        findFactory({state, commit}, {data, more, callback}) {
          api.get({
            key: 'findDoorFactory',
            data: data,
            paging: {
              StartRowNum: more ? state.result.length : 0,
              PageSize: PAGESIZE
            },
            success: data => {
              let factory = KND.Util.toArray(data.SiebelMessage['Channel Partner']);
              commit(more ? 'addFactory' : 'setFactory', factory);
              if (callback) {
                callback(factory);
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
    }
  }
});
