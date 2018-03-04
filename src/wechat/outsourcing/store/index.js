import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/api';
import { app } from 'public/store';

Vue.use(Vuex);

// 缓存页面
app.state.alive = ['index'];

//
const STATUS2LIST = {
  '待审批': 'pending',
  '有效': 'valid',
  '失效': 'invalid'
};
// 每页加载条数
const PAGESIZE = config.pageSize;

export default new Vuex.Store({
  modules: {
    app,
    /**
     * 委外团队列表
     */
    index: {
      namespaced: true,
      state: {
        // 待审批
        pending: [],
        // 有效
        valid: [],
        // 失效
        invalid: []
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
        // 获取委外列表
        getPartners({state, commit, dispatch}, {status, more, callback}) {
          status = status || '待审批';
          api.get({
            key: 'getPartners',
            data: {
              status
            },
            paging: {
              StartRowNum: more ? state[STATUS2LIST[status]].length : 0,
              PageSize: PAGESIZE
            },
            success: function(data) {
              let partners = KND.Util.toArray(data.items);
              commit(more ? 'addPartners' : 'setPartners', {
                partners: partners,
                list: STATUS2LIST[status]
              });
              if (callback) {
                callback(partners);
              }
            }
          });
        }
      }
    },

    /**
     * 委外详情&新增&编辑
     */
    detail: {
      namespaced: true,
      state: {
        form: {},
        attach: { // 附件
          list: [], // [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}],
          edit: false,
          title: '合同附件'
        },
        record: [{state: '已提交', time: '2017-02-01 18:00'},
          {state: '总部安装主管xx审批中', time: '2017-02-01 19:00'}]
      },
      mutations: {
        setPartner(state, form) {
          state.form = form;
          if (form.Contact) {
            state.form.Contact = KND.Util.toArray(form.Contact);
          };
        },
        clear(state) {
          state.form = {
            'Id': new Date().getTime(),
            'Name': '',
            'Alias': '',
            'KL Partner Owner Name': '',
            'Main Phone Number': '',
            'Primary Address Street': ''
          };
        }
      },
      actions: {
        findPartnerById({commit}, id) {
          api.get({
            key: 'findPartnerById',
            data: {
              id: id
            },
            success: function(data) {
              commit('setPartner', data.SiebelMessage['Channel Partner']);
            }
          });
        },
        // 获取委外详情
        findPartner({commit}, setting) {
          api.get(Object.assign({
            key: 'findPartner',
            success: function(data) {
              commit('setPartner', data.items);
            }
          }, setting));
        },
        // 创建委外团队
        addPartner({state}) {
          let partner = state.form;
          // Alias 为必填，默认填入 Name
          partner.Alias = partner.Alias || partner.Name;
          // 失效编辑状态修改
          if (partner.state === '失效') {
            partner.state = '待审批';
          };
          api.get({
            key: 'addPartner',
            data: {
              partner: partner
            },
            success: (data) => {
              if (data.PrimaryRowId) {
                Toast({
                  message: '提交成功'
                });
                KND.Util.back();
              } else {
                Toast({
                  message: '提交失败'
                });
              }
            }
          });
        },
        // 更新委外状态 有效&失效
        update({state}, data) {
          delete state.form['Channel Partner_Position'];
          delete state.form['Contact'];
          api.get({
            key: 'update',
            data: Object.assign(state.form, data),
            success: (data) => {
              if (data['KL Partner Status'] !== status) {
                Toast('更新成功');
                KND.Util.back();
              } else {
                Toast('更新失败');
              }
            }
          });
        }
      }
    },

    /**
     * 委外联系人新增&编辑
     */
    contact: {
      namespaced: true,
      state: {},
      actions: {
        checkName(commit, name) {
          api.get({
            key: '',
            data: {

            },
            success: (data) => {

            }
          });
        }
      }
    }
  }
});
