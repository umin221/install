import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/api';
import { app } from 'public/store';

Vue.use(Vuex);

// 缓存页面
app.state.alive = ['index'];

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
        submitService({commit}, form) {
          api.get({
            key: 'submitService',
            data: {
              form
            },
            success: data => {
              console.log(data);
              if (form.callback) {
                form.callback(data);
              }
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
        Contact: [],
        cutAddress: []
      },
      mutations: {
        setContact(state, data) {
          state.Contact = data;
          state.cutAddress = KND.Util.toArray(data['CUT Address']);
        },
        setaddAddress(state, data) {
          state.addAddress.push(data);
        },
        deleteAddress(state, data) {
          state.addAddress = [];
        }
      },
      actions: {
        getContact({commit}, callback) {
          api.get({
            key: 'getContact',
            success: function(data) {
              let Contact = data.SiebelMessage.Contact;
              if (Contact) {
                commit('setContact', Contact);
              }
              if (callback) {
                callback(Contact);
              }
            },
            error: data => {
              console.log(data);
            }
          });
        },
        deleteAddress({commit, dispatch}, {Id, type}) {
          api.get({
            key: 'deleteAddress',
            data: {
              Id
            },
            success: data => {
              if (type === 'add') {
                commit('deleteAddress');
              } else {
                dispatch('getContact');
              }
            },
            error: data => {
              console.log(data);
            }
          });
        },
        setDefaultAddress({commit, dispatch}, {contactId, addressId}) {
          api.get({
            key: 'setDefaultAddress',
            data: {
              contactId: contactId,
              addressId: addressId
            },
            success: data => {
              console.log(data);
              dispatch('getContact');
            },
            error: data => {
              console.log(data);
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
              dispatch('setContactAddress', {
                contactId: form.contactId,
                addressId: data.items.Id,
                callback: form.success
              });
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
        note: []
      },
      mutations: {
        setServiceDetail(state, data) {
          state.serviceDetail = data;
          if (state.serviceDetail.Action) {
            state.action = state.serviceDetail.Action;
          }
          if (state.serviceDetail['FIN Service Request Notes']) {
            state.note = KND.Util.toArray(state.serviceDetail['FIN Service Request Notes']);
          } else {
            state.note = [{Note: '暂无数据'}];
          }
        }
      },
      actions: {
        getServiceDetail({commit}, {search, value}) {
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
          api.get({
            key: 'getContact',
            success: data => {
              console.log(data);
              let Contact = data.SiebelMessage.Contact;
              if (Contact) {
                commit('setContact', Contact);
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
              if (data.items) {
                commit('getAsset', data.items);
                callback(data.items);
              }
            },
            error: data => {
              Toast('系统中找不到该此产品条形码');
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
    }
  }
});
