import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/api';
import { app } from 'public/store';

Vue.use(Vuex);

// 缓存页面
app.state.alive = ['index'];

// 每页加载条数
const PAGESIZE = config.pageSize;
// map
let mapp = config.mapp['list'];

export default new Vuex.Store({
  modules: {
    app,
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
         * 安装订单列表
         * @param {Object} data 必填 接口请求参数
         * @param {Boolean} more 选填 是否加载更多
         * @param {Function} callback 选填 处理回调
         * @param {Function} error 选填 错误回调
         */
        getList({state, commit, dispatch}, {data, more, callback, error}) {
          let list = mapp[data['Status']] || 'result'; // 搜索所有时，没有状态
          api.get({
            key: 'getList',
            method: 'POST',
            data: data,
            paging: {
              StartRowNum: more ? state[list].length : 0,
              PageSize: PAGESIZE
            },
            success: data => {
              let TransferOrders = KND.Util.toArray(data.SiebelMessage['Order Entry - Orders']);
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
    detail: {
      namespaced: true,
      state: {
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
    sign: {
      namespaced: true,
      state: {
        form: '',
        attach: {
          list: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}],
          edit: false,
          title: '合同附件'
        } // 附件
      },
      mutations: {
        setSign(state, form) {
          state.form = form;
        },
        clear(state) {
          state.form = {
            'KL Signed Amount': '',
            'Description': ''
          };
        }
      },
      actions: {
        getSign({commit}, item) {
          var obj = {
            'KL Signed Amount': item['KL Signed Amount'],
            'Description': item.Description
          };
          commit('setSign', obj);
        },
        getUPData({state}, id) {
          let partner = state.form;
          api.get({ // 提交数据
            key: 'getUPData',
            method: 'PUT',
            data: {
              'KL Signed Amount': partner['KL Signed Amount'],
              'Description': partner.Description,
              'Id': id
            },
            success: function(data) {
              history.go(-1);
            }
          });
        }
      }
    },
    batch: {
      namespaced: true,
      actions: {
      }
    },
    updateDoor: {
      namespaced: true,
      state: {
        form: '',
        attach: {
          list: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}],
          edit: false,
          title: '合同附件'
        } // 附件
      },
      mutations: {
        setSign(state, form) {
          state.form = form;
        },
        clear(state) {
          state.form = {
            'KL Signed Amount': '',
            'KL Spot Check Amount': '',
            'Qualified Amount': '',
            'Unqualified Desc': '',
            'Unqualified Solve Desc': ''
          };
        }
      },
      actions: {
        getSign({commit}, item) { // 详情接口
          var obj = {
            'KL Signed Amount': item['KL Signed Amount'],
            'KL Spot Check Amount': item['KL Spot Check Amount'],
            'Qualified Amount': item['Qualified Amount'],
            'Unqualified Desc': item['Unqualified Desc'],
            'Unqualified Solve Desc': item['Unqualified Solve Desc']
          };
          commit('setSign', obj);
        },
        getUPData({state}, id) {
          let partner = state.form;
          api.get({ // 提交数据
            key: 'getUPData',
            method: 'PUT',
            data: {
              'KL Signed Amount': partner['KL Signed Amount'],
              'KL Spot Check Amount': partner['KL Spot Check Amount'],
              'Qualified Amount': partner['Qualified Amount'],
              'Unqualified Desc': partner['Unqualified Desc'],
              'Unqualified Solve Desc': partner['Unqualified Solve Desc'],
              'Id': id
            },
            success: function(data) {
              history.go(-1);
            }
          });
        }
      }
    },
    zsBatch: {
      namespaced: true,
      state: {
        form: '',
        attach: {
          list: [{id: 1}, {id: 2}, {id: 3}],
          edit: false,
          title: '签收单据归档'
        } // 附件
      }
    },
    buildingInfo: {
      namespaced: true,
      state: {
        buildingNum: '1',
        layerNum: '1',
        roomNum: '1',
        index: 0, // 标记栋索引
        buildingList: [
          {
            index: 1,
            val: 1,
            layerList: [
              {
                index: 1,
                val: 1,
                roomList: [
                  {
                    index: 1,
                    val: 1
                  },
                  {
                    index: 2,
                    val: 2
                  }
                ]
              },
              {
                index: 2,
                val: 2,
                roomList: [
                  {
                    index: 1,
                    val: 1
                  },
                  {
                    index: 2,
                    val: 2
                  }
                ]
              }
            ]
          },
          {
            index: 2,
            val: 2,
            layerList: [
              {
                index: 1,
                val: 1222,
                roomList: [
                  {
                    index: 1,
                    val: 1001
                  },
                  {
                    index: 2,
                    val: 1002
                  }
                ]
              },
              {
                index: 2,
                val: 23333,
                roomList: [
                  {
                    index: 1,
                    val: 2001
                  },
                  {
                    index: 2,
                    val: 2002
                  }
                ]
              }
            ]
          }
        ],
        layerList: [],
        roomList: []
      },
      actions: {
        // 数量加减
        plusValFn({state}, obj) {
          console.dir(state.buildingNum);
          var type = obj.type;
          if (type === 'buildingNum') {
            state.buildingNum ++;
          } else if (type === 'layerNum') {
            state.layerNum ++;
          } else if (type === 'roomNum') {
            state.roomNum ++;
          }
        },
        reduceValFn({state}, obj) {
          var type = obj.type;
          if (type === 'buildingNum') {
            if (state.buildingNum > 1) {
              state.buildingNum --;
            }
          } else if (type === 'layerNum') {
            if (state.layerNum > 1) {
              state.layerNum --;
            }
          } else if (type === 'roomNum') {
            if (state.roomNum > 1) {
              state.roomNum --;
            }
          }
        },
        calculationFn({state}, index) {
          console.dir('=====index=' + state.buildingNum);
          console.dir('=====index=' + index);
          this.index = index;
          state.layerList = state.buildingList[index].layerList;
          console.dir(state.layerList);
          /* if (state.buildingNum) {
            state.buildingList = [];
            for (var i = 0; i < state.buildingNum; i++) {
              var buildingObj = {};
              buildingObj.index = i + 1;
              buildingObj.val = i + 1;
              state.buildingList.push(buildingObj);
              /!* if (state.layerNum) {
                var layerVal = i + '000';
                for (var j = 0; j < state.layerNum; j++) {
                  var layerObj = {};
                  layerObj.index = layerVal + 1;
                  layerObj.val = layerVal + 1;
                  state.buildingList[i].push(layerObj);
                }
              }*!/
            }
            console.dir(state.buildingList);
          }*/
        },
        layerFn({state}, index) {
          state.roomList = state.buildingList[this.index].layerList[index];
          console.dir('======');
          console.dir(state.roomList);
        },
        toEditFn({state}) {
          console.dir('=============');
          console.dir(state.buildingList);

        }
      }
    }
  }
});
