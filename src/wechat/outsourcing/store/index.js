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
        // 列表&导航
        navs: [],
        // 是否管理员权限
        isManager: false,
        // 待审批
        pending: [],
        // 有效
        valid: [],
        // 失效
        invalid: [],
        // 搜索结果
        result: []
      },
      mutations: {
        setPartners(state, {partners, list}) {
          state[list] = partners;
        },
        addPartners(state, {partners, list}) {
          state[list].push(...partners);
        },
        setManager(state, isManager) {
          state.navs = config.mapp[isManager ? 'manager' : 'employee'];
          state.isManager = isManager;
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
        getPartners({state, commit, dispatch}, {type, name, more, callback}) {
          let mapp = state.navs[type] || {};
          api.get({
            key: 'queryPartners',
            data: {
              'KL Partner Status': mapp.status,
              'Name': name
            },
            paging: {
              StartRowNum: more ? state[type].length : 0,
              PageSize: PAGESIZE
            },
            success: data => {
              let partners = KND.Util.toArray(data.SiebelMessage['Channel Partner']);
              commit(more ? 'addPartners' : 'setPartners', {
                partners: partners,
                list: type
              });
              if (callback) callback(partners);
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
        form: ''
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
        findPartnerById({commit, dispatch}, id) {
          api.get({
            key: 'findPartnerById',
            data: {
              id: id
            },
            success: data => {
              commit('setPartner', data.SiebelMessage['Channel Partner']);
            }
          });
        },
        /**
         * 获取委外团队信息
         * @param {Object} setting 必填 请求参数配置
         */
        findPartner({commit}, setting) {
          api.get(Object.extend({
            key: 'findPartner',
            success: data => {
              commit('setPartner', data.items);
            }
          }, setting));
        },
        /**
         * 创建委外团队
         * 绑定当前表单数据
         */
        addPartner({state}, success) {
          success = success || (data => console.log(data));
          let partner = state.form;
          // Alias 为必填，默认填入 Name
          partner.Alias = partner.Alias || partner.Name;
          // 失效编辑状态修改
          if (partner.state === '失效') {
            partner.state = '待审批';
          };
          api.get({
            key: 'submitPartner',
            data: {
              partner: partner
            },
            success: success
          });
        },
        /**
         * 更新委外团队信息
         * @param {Object} setting 必填 请求参数配置
         */
        update({state}, setting) {
          delete state.form['Channel Partner_Position'];
          delete state.form['User'];
          api.get(Object.extend(true, {
            key: 'update',
            data: state.form,
            success: data => {
              tools.success(data, {
                back: true,
                successTips: '更新成功'
              });
              // 标记列表刷新
              KND.Session.set('refresh', 'valid');
            }
          }, setting));
        },
        /**
         * 批量上传附件
         * @param {Array} mediaId 必填 附件mediaId数组
         */
        pushMedia({state}, mediaId) {
          console.log(mediaId);
          // 提交 siebel
          let push = (media) => {
            api.get({
              key: 'pushMedia',
              data: {
                id: state.form.Id,
                mediaId: media.serverId
              },
              success: result => {
                console.log(result);
                run(mediaId.pop(), result);
              }
            });
          };
          // 上传附件
          let run = (media, result) => {
            if (media) {
              push(media);
            } else {
              // 标记列表刷新
              KND.Session.set('refresh', 'valid');
              tools.success(result, {
                back: true,
                successTips: '提交成功'
              });
            };
          };
          run(mediaId.pop());
        },
        /**
         * 查询委外审批记录
         * @param {String} setting.data.id 必填 主键id
         */
        queryApprovalList({state}, setting) {
          setting.key = 'queryApprovalList';
          api.get(setting);
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
            success: data => {
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
            success: data => {
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
