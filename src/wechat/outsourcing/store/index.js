import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/api';
import { app } from 'public/store';

Vue.use(Vuex);

// 缓存页面
app.state.alive = ['index'];

let status2list = {
  '待审批': 'pending',
  '有效': 'valid',
  '失效': 'invalid'
};

export default new Vuex.Store({
  modules: {
    app,
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
      actions: {
        // 获取委外列表
        getList({state, commit, dispatch}, status = '待审批') {
          api.get({
            key: 'getList',
            status: status,
            success: function(data) {
              // eslint-disable-next-line
              state[status2list[status]] = KND.Util.toArray(data.items);
            }
          });
        }
      }
    },
    detail: {
      namespaced: true,
      state: {
        form: '',
        attach: {
          list: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}],
          edit: false,
          title: '合同附件'
        }, // 附件
        contact: {
          list: [{ // 联系人列表
            id: '1',
            name: '张晓明',
            loginID: 'zhangxm'
          }, {
            id: '2',
            name: '张晓飞',
            loginID: 'zhangxf'
          }, {
            id: '2',
            name: '张晓飞',
            loginID: 'zhangxf'
          }]
        }
      },
      actions: {
        // 获取委外详情
        getDetail({state, commit, dispatch}, id) {
          api.get({
            key: 'getDetail',
            id: id,
            success: function(data) {
              delete data.Link;
              state.form = data.SiebelMessage['Channel Partner'];
            }
          });
        }
      }
    }
  }
});
