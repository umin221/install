import Vue from 'vue';
import Vuex from 'vuex';
import { app } from 'public/store';
import api from '../api/api';

Vue.use(Vuex);

// 缓存页面
app.state.alive = ['index'];
// 每页加载条数
const PAGESIZE = config.pageSize;

export default new Vuex.Store({
  modules: {
    app,
    index: {
      namespaced: true,
      state: {
        // 待审批
        pending: [],
        // 有效
        valid: [],
        // 失效
        invalid: [],
        // 搜索结果
        result: [],
        // status 2 list
        status2list: {
          '待处理': 'pending',
          '处理中': 'valid',
          '已完成': 'invalid',
          '': 'result'
        }
      },
      mutations: {
        setPartners(state, {partners, list}) {
          state[list] = partners;
        },
        addPartners(state, {partners, list}) {
          state[list].push(...partners);
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
          let list = state.status2list[data['Order Entry - Orders']];
          api.get({
            key: 'getList',
            method: 'POST',
            data: data,
            paging: {
              StartRowNum: more ? state[list].length : 0,
              PageSize: PAGESIZE
            },
            success: function(data) {
              let partners = KND.Util.toArray(data.SiebelMessage['Order Entry - Orders']);
              commit(more ? 'addPartners' : 'setPartners', {
                partners: partners,
                list: list
              });
              if (callback) {
                callback(partners);
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
    sign: {
      namespaced: true,
      state: {
        form: '',
        attach: {
          list: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}],
          edit: false,
          title: '合同附件'
        } // 附件
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
