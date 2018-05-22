import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/api';
import { app } from 'public/store';

Vue.use(Vuex);

// 缓存页面
app.state.alive = ['index', 'submit'];

const systemSort = function(array, type) {
  return array.sort(function(a, b) {
    return new Date(b[type]) - new Date(a[type]);
  });
};
export default new Vuex.Store({
  modules: {
    app,
    // 提交表单页
    index: {
      namespaced: true,
      state: {
        Contact: {},
        cutAddress: {},
        form: {}
      },
      mutations: {
        addressBack(state, data) {
          state.form = data;
        },
        // 设置用户信息
        setContact(state, contact) {
          state.Contact = contact;
          // 缓存用户信息，避免用户刷新页面后丢失
          KND.Session.set('Contact', JSON.stringify(contact));
        }
      },
      actions: {
        getLov({commit}, {type, parent, success, error}) {
          api.get({
            key: 'getLov',
            data: {
              type,
              parent
            },
            success,
            error: data => {
              console.log(data);
            }
          });
        },
        /**
         * 提交报修单
         * @param {Object} form 报修单信息健值队
         */
        submitService({commit}, form) {
          api.get({
            key: 'submitService',
            data: {
              form
            },
            success: data => {
              if (form.callback) {
                Toast('提交成功');
                form.callback(data);
              }
            }
          });
        },
        /**
         * 通过微信openid 获取联系人信息
         * @param {Function} cb 选填 回调函数
         */
        getContact({commit}, cb) {
          let openId = KND.Util.getParam('openid');
          console.log(openId);
          api.get({
            key: 'getContact',
            data: {
              openId
            },
            success: data => {
              let Contact = KND.Util.toArray(data.SiebelMessage.Contact);
              if (Contact.length) {
                Contact = systemSort(Contact, 'Updated');
                // 保存用户信息
                commit('setContact', (Contact[0]));
                // 填充默认地址
                let CUTAddress = KND.Util.toArray(Contact[0]['CUT Address']);
                for (let i = 0; i < CUTAddress.length; i++) {
                  if (CUTAddress[i]['SSA Primary Field'] === 'Y') {
                    commit('addressBack', CUTAddress[i]);
                  }
                };
                // 回调
                if (cb) cb(Contact[0]);
              }
            },
            error: data => {
              console.log(data);
            }
          });
        },
        getAsset({commit}, {num, callback}) {
          api.get({
            key: 'getAsset',
            data: {
              num
            },
            success: function(data) {
              let datas = [];
              if (data) {
                if (data.items) {
                  datas = KND.Util.toArray(data.items);
                } else {
                  datas = KND.Util.toArray(data);
                }
                console.log(datas);
                // commit('addressBack', datas[0]);
                callback(datas[0]);
              }
            },
            error: function(data) {
              Toast('该码未录入系统');
            }
          });
        }
      }
    },
    // 个人中心
    personal: {
      namespaced: true,
      actions: {
        /**
         * 获取用户昵称，头像
         */
        getContactInfo({commit, dispatch}, cb) {
          let openId = KND.Util.getParam('openid');
          api.get({
            key: 'getContactInfo',
            data: {
              openId
            },
            success: data => {
              cb(data);
            },
            error: data => {
              console.log(data);
            }
          });
        }
      }
    },
    // 地址管理
    address: {
      namespaced: true,
      state: {
        localAddress: []
      },
      mutations: {
        setLocalAddress(state, {data, index}) {
          if (index) {
            state.localAddress.splice(index - 1, 1, data);
          } else {
            state.localAddress.push(data);
          }
        }
      },
      actions: {
        /**
         * 删除用户地址
         * @param {String} id 选填 地址id
         * @param {Function} cb 选填 回调函数
         */
        deleteAddress({commit, dispatch}, {Id, cb}) {
          api.get({
            key: 'deleteAddress',
            data: {
              Id
            },
            success: data => {
              cb(data);
            },
            error: data => {
              console.log(data);
            }
          });
        },
        setDefaultAddress({commit, dispatch}, {contactId, addressId, success}) {
          api.get({
            key: 'setDefaultAddress',
            data: {
              contactId: contactId,
              addressId: addressId
            },
            success: data => {
              success(data);
            }
          });
        }
      }
    },
    // 添加地址
    addAddress: {
      namespaced: true,
      state: {
        Municipality: ['上海', '天津', '澳门', '重庆', '香港', '北京']
      },
      mutations: {
        dataType(state, data) {
        }
      },
      actions: {
        // 新增地址
        addressManage({commit, dispatch}, form) {
          api.get({
            key: 'addressManage',
            data: {
              form
            },
            success: data => {
              console.log(data);
              if (form.contactId) {
                dispatch('setContactAddress', {
                  contactId: form.contactId,
                  addressId: data.items.Id,
                  callback: form.success
                });
              } else {
                form.success(data);
              }
            },
            error: data => {
              console.log(data);
            }
          });
        },
        // 地址关联联系人
        setContactAddress({commit}, {contactId, addressId, callback}) {
          api.get({
            key: 'setContactAddress',
            data: {
              contactId,
              addressId
            },
            success: data => {
              if (data) {
                Toast('添加成功');
                callback(data);
              }
            },
            error: data => {
              console.log(data);
            }
          });
        },
        // 地址查询
        searchAddrId({commit}, {addrId, callback}) {
          api.get({
            key: 'searchAddrId',
            data: {
              addrId
            },
            success: callback,
            error: data => {
              console.log(data);
            }
          });
        },
        // 地址更新
        upDateAddress({commit}, form) {
          api.get({
            key: 'upDateAddress',
            data: {
              form
            },
            success: data => {
              console.log(data);
              form.callback(data);
            },
            error: data => {
              console.log(data);
            }
          });
        }
      }
    },
    // 维修服务列表页
    myRepair: {
      namespaced: true,
      state: {
        serviceList: []
      },
      mutations: {
        setServiceList(state, data) {
          state.serviceList = data;
        }
      },
      actions: {
        getServiceList({commit}, {search, value}) {
          api.get({
            key: 'getServiceList',
            data: {
              search: search,
              value: value
            },
            success: data => {
              let serviceList = KND.Util.toArray(data.SiebelMessage['Service Request']);
              if (serviceList) {
                commit('setServiceList', serviceList);
              }
            },
            error: data => {
              console.log(data);
            }
          });
        }
      }
    },
    // 维修服务详情页
    detail: {
      namespaced: true,
      state: {
        tabList: [
          {name: '基础信息', id: 'tab-container1'},
          {name: '流程记录', id: 'tab-container2'}
        ],
        serviceDetail: {},
        action: {},
        note: [],
        survey: true
      },
      mutations: {
        setServiceDetail(state, data) {
          state.serviceDetail = data;
          state.survey = true;
          state.action = {};
          if (state.serviceDetail.Action) {
            let action = state.serviceDetail.Action;
            state.action = KND.Util.isArray(action) ? action[0] : action;
          }
          if (state.serviceDetail['FIN Service Request Notes']) {
            let note = KND.Util.toArray(state.serviceDetail['FIN Service Request Notes']);
            state.note = systemSort(note, 'Created');
          } else {
            state.note = [{Note: '暂无数据'}];
          }
          if (state.serviceDetail['Customer Survey']) {
            let survey = KND.Util.toArray(state.serviceDetail['Customer Survey']);
            for (let i = 0;i < survey.length; i++) {
              if (survey[i]['KL Status'] === '用户已点评') {
                state.survey = false;
              }
            }
          }
        }
      },
      actions: {
        getServiceDetail({commit}, {search, value, callback}) {
          api.get({
            key: 'getServiceList',
            data: {
              search: search,
              value: value
            },
            success: data => {
              let serviceDetail = data.SiebelMessage['Service Request'];
              commit('setServiceDetail', serviceDetail);
            },
            error: data => {
              console.log(data);
            }
          });
        }
      }
    },
    myDevice: {
      namespaced: true,
      state: {
        serviceDetail: {},
        ContactAsset: [],
        Contact: {}
      },
      mutations: {
        setContact(state, data) {
          state.Contact = data;
          if (data.Contact_Asset) {
            state.ContactAsset = KND.Util.toArray(data.Contact_Asset);
          }
        }
      },
      actions: {
        getContact({commit}, callback) {
          let openId = KND.Util.getParam('openid');
          console.log(openId);
          api.get({
            key: 'getContact',
            data: {
              openId
            },
            success: data => {
              let Contact = KND.Util.toArray(data.SiebelMessage.Contact);
              if (Contact.length) {
                Contact = systemSort(Contact, 'Updated');
                commit('setContact', Contact[0]);
              }
            },
            error: data => {
              console.log(data);
            }
          });
        }
      }
    },
    deviceDetail: {
      namespaced: true,
      state: {
        assetDetail: {}
      },
      mutations: {
        setContact(state, data) {
          state.assetDetail = data;
        }
      },
      actions: {
        getAssetdetail({commit}, Id) {
          api.get({
            key: 'getAssetdetail',
            data: {
              search: 'Id',
              value: Id
            },
            success: data => {
              console.log(data);
              commit('setContact', data.items);
            },
            error: data => {
              Toast('该码未录入系统');
              console.log(data);
            }
          });
        }
      }
    },
    addDevice: {
      namespaced: true,
      state: {
        assetDetail: {}
      },
      mutations: {
        getAsset(state, data) {
          state.assetDetail = data;
        }
      },
      actions: {
        getAssetSn({commit}, {klsn, callback}) {
          api.get({
            key: 'getAssetdetail',
            data: {
              search: 'Serial Number',
              value: klsn
            },
            success: data => {
              let datas = [];
              if (data) {
                if (data.items) {
                  datas = KND.Util.toArray(data.items);
                } else {
                  datas = KND.Util.toArray(data);
                }
                commit('getAsset', datas[0]);
                callback(datas[0]);
              }
            },
            error: data => {
              Toast('该码未录入系统');
            }
          });
        },
        setContactAsset({commit}, {ContactId, AssetId, callback}) {
          api.get({
            key: 'setContactAsset',
            data: {
              ContactId,
              AssetId
            },
            success: data => {
              Toast('添加成功');
              callback(data);
              // commit('getAsset', data.items);
            },
            error: data => {
              Toast('添加失败');
              console.log(data);
            }
          });
        }
      }
    },
    commentOn: {
      namespaced: true,
      state: {
      },
      mutations: {
      },
      actions: {
        customerSurvey({commit}, form) {
          api.get({
            key: 'customerSurvey',
            data: {
              form
            },
            success: data => {
              Toast('点评成功');
              form.callback(data);
            },
            error: data => {
              Toast('点评失败，请联系管理员');
            }
          });
        },
        commentLov({commit}, {type, callback}) {
          api.get({
            key: 'commentLov',
            type: type,
            success: data => {
              callback(data);
            },
            error: data => {
              console.log(data);
            }
          });
        },
        getService({commit}, {search, value, callback}) {
          api.get({
            key: 'getServiceList',
            data: {
              search: search,
              value: value
            },
            success: data => {
              let Survey = data.SiebelMessage['Service Request']['Customer Survey'];
              if (callback) {
                callback(Survey);
              }
            },
            error: data => {
              console.log(data);
            }
          });
        }
      }
    },
    telValidate: {
      namespaced: true,
      state: {
        obj: {}
      },
      mutations: {
        clObj(state) {
          state.obj = {};
        }
      },
      actions: {
        toTelValidate({state}, obj) {
          state.obj = obj; // 存 发送验证码的手机号码与随机码
          api.get({
            key: 'getMsg',
            data: {
              account: obj.account,
              ts: obj.timestamp,
              pswd: obj.pswd,
              mobile: obj.phoneNumber,
              msg: obj.msg,
              needstatus: true,
              resptype: 'json'
            },
            success: data => {
              console.log(data);
            },
            error: data => {
              console.log(data);
            }
          });
        }
      }
    }
  }
});
