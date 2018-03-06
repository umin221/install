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
        roomNum: '1'
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
          } if (type === 'roomNum') {
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
          } if (type === 'roomNum') {
            if (state.roomNum > 1) {
              state.roomNum --;
            }
          }
        }
      }
    }

  }
});
