import Vue from 'vue';
import Vuex from 'vuex';
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
        value: ''
      },
      actions: {
      },
      mutations: {
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
          }
        ]
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
        calculationFn({state}) {
          console.dir('======' + state.buildingNum);
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
        toEditFn({state}) {
          console.dir('=============');
          console.dir(state.buildingList);

        }
      }
    }
  }
});
