import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/api';
import { app } from 'public/store';

Vue.use(Vuex);

// 缓存页面
app.state.alive = ['index'];

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
        invalid: [],
        // 搜索结果
        result: [],
        // status 2 list
        status2list: {
          '待审批': 'pending',
          '有效': 'valid',
          '失效': 'invalid',
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
         * 获取委外团队列表
         * @param {Object} data 必填 接口请求参数
         * @param {Boolean} more 选填 是否加载更多
         * @param {Function} callback 选填 处理回调
         * @param {Function} error 选填 错误回调
         */
        getPartners({state, commit, dispatch}, {data, more, callback, error}) {
          let list = state.status2list[data['KL Partner Status']];
          api.get({
            key: 'queryPartners',
            data: data,
            paging: {
              StartRowNum: more ? state[list].length : 0,
              PageSize: PAGESIZE
            },
            success: function(data) {
              let partners = KND.Util.toArray(data.SiebelMessage['Channel Partner']);
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

    /**
     * 委外详情&新增&编辑
     */
    detail: {
      namespaced: true,
      state: {
        form: {
          User: []
        },
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
          state.form.User = KND.Util.toArray(form.User);
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
         * 通过id获取委外团队信息
         * @param {String} id 必填 id
         */
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
        /**
         * 获取委外团队信息
         * @param {Object} condition 必填 查询条件 键值对
         */
        findPartner({commit}, condition) {
          api.get(Object.assign({
            key: 'findPartner',
            success: function(data) {
              commit('setPartner', data.items);
            }
          }, condition));
        },
        /**
         * 创建委外团队
         * 绑定当前表单数据
         */
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
        /**
         * 更新委外团队信息
         * @param {Object} data 必填 需要修改的信息 键值对
         */
        update({state}, data) {
          delete state.form['Channel Partner_Position'];
          delete state.form['User'];
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
        /**
         * 查找委外联系人
         * @param {Object} data 必填 查询条件 键值对
         */
        findContact({commit}, data) {
          api.get({
            key: 'findContact',
            data: data,
            success: (data) => {

            },
            error: (data) => {
              console.log(data);
            }
          });
        },
        /**
         * 创建&更新联系人信息
         * @param {Object} contact 必填 人员信息 键值对
         */
        upsertContact({state}, contact) {
          api.get({
            key: 'upsertContact',
            data: {
              partner: {
                Id: this.state.detail.form.Id,
                ListOfUser: {
                  User: contact
                }
              }
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
        }
      }
    }
  }
});
