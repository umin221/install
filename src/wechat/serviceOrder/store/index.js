import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/api';
import { MessageBox } from 'mint-ui';
import { app } from 'public/store';

Vue.use(Vuex);

// 缓存页面
app.state.alive = ['index', 'close'];

//
const STATUS2LIST = {
  '待处理': 'pending',
  '处理中': 'valid',
  '已处理': 'invalid'
};
// 每页加载条数
const PAGESIZE = config.pageSize;

// tipBox
const tipBox = (function() {
  return function(callback) {
    MessageBox({
      title: '提示',
      message: callback
    });
  };
})();

export default new Vuex.Store({
  modules: {
    app,
    index: {
      namespaced: true,
      state: {
        // loginMeg: {
        //   'Last Name': '袁静',
        //   'Emp #': '16113009',
        //   'Job Title': '400'
        // },
        loginMeg: {
          'Last Name': '代一',
          'Emp #': '16013107',
          'Job Title': 'install'
        },
        // 待处理
        pending: [],
        // 处理中
        valid: [],
        // 已处理
        invalid: [],
        // 客服
        cusService: []
      },
      mutations: {
        dataType(state, data) {
          if (state.loginMeg['Job Title'] === 'install') {
            state.pending = [];
            state.valid = [];
            state.invalid = [];
            for (let i = 0; i < data.length; i++) {
              if (data[i].Status !== '未开始') {
                if (data[i].Status === '待分配' || data[i].Status === '已派工') {
                  state.pending.push(data[i]);
                } else if (data[i].Status === '维修中') {
                  state.valid.push(data[i]);
                } else if (data[i].Status === '已完成' || data[i].Status === '关闭' || data[i].Status === '已取消') {
                  state.invalid.push(data[i]);
                }
              }
            }
          } else {
            state.cusService = [];
            for (let i = 0; i < data.length; i++) {
              if (data[i].Status !== '未开始') {
                state.cusService.push(data[i]);
              }
            }
          }
        }
      },
      actions: {
        getList({state, commit, dispatch}, {status, more, callback}) {
          status = status || state.loginMeg['Emp #'];
          api.get({
            key: 'getList',
            data: {
              status
            },
            paging: {
              StartRowNum: more ? state[STATUS2LIST[status]].length : 0,
              PageSize: PAGESIZE
            },
            success: function(data) {
              commit('dataType', data.SiebelMessage['Service Request']);
              if (callback) {
                callback(data.SiebelMessage['Service Request'].length);
              }
            }
          });
          // api.get({
          //   key: 'getList',
          //   data: {
          //     'body': {
          //       'OutputIntObjectName': 'Base KL Service Request Interface BO',
          //       'SearchSpec': '[Service Request.Owner]="16013107"'
          //     }
          //   },
          //   success: function(data) {
          //   }
          // });
        }
      }
    },
    addService: {
      namespaced: true,
      state: {
        search: [],
        slots: []
      },
      mutations: {
        getSearch(state, data) {
          state.search = data;
        },
        removeSearch(state) {
          state.search = [];
        },
        addValue(state, data) {
          state.slots = [];
          state.slots = data;
        },
        changeValue(state, data) {
          let datas = data;
          let Province = [];
          let High = [];
          if (datas.constructor === Array) {
            for (let i = 0; i < datas.length; i++) {
              Province.push(datas[i].Value);
              High.push(datas[i].High);
            }
            state.slots[2].values = Province;
            state.slots[1].values = High;
          } else {
            Province.push(datas.Value);
            High.push(datas.High);
            state.slots[2].values = Province;
            state.slots[1].values = High;
          }
          console.log(state.slots);
        }
      },
      actions: {
        getSearch({commit}, val) {
          api.get({
            key: 'getSearch',
            data: {
              val
            },
            success: function(data) {
              console.log(data);
              commit('getSearch', data.items);
            }
          });
        },
        getValue({commit}, val) {
          api.get({
            key: 'getLov',
            data: {
              val
            },
            success: function(data) {
              console.log(val);
              for (let i = 0; i < data.items.length; i++) {
                val.selectd[0].values.push(data.items[i].Value);
              }
              commit('addValue', val.selectd);
            }
          });
        },
        valueChange({commit}, val) {
          api.get({
            key: 'getParentLov',
            data: {
              val
            },
            success: function(data) {
              commit('changeValue', data.items);
            }
          });
        }
      }
    },
    detail: {
      namespaced: true,
      state: {
        ServiceRequest: {},
        processDate: [],
        Statu: {
          '接单': 'Receive',
          '出发': 'Depart',
          '上门': 'Arrive',
          '预约': 'Appoint',
          '完成': 'Done'
        },
        BtnStatu: ''
      },
      mutations: {
        setPartner(state, form) {
          state.ServiceRequest = form;
          if (Object.prototype.toString.call(form.Action) !== '[object Array]') {
            if (form.Action.Status === '已派工') {
              state.BtnStatu = 'status1';
            } else if (form.Action.Status === '已接单') {
              state.BtnStatu = 'status2';
            } else if (form.Action.Status === '已预约' || form.Action[0].Status === '已预约' || form.Action[0].Status === '已出发' || form.Action[0].Status === '已完成') {
              state.BtnStatu = 'status3';
            }
          }
          let Note = null;
          Note = state.ServiceRequest['FIN Service Request Notes'];
          if (Note) {
            if (Object.prototype.toString.call(Note) !== '[object Array]') {
              state.processDate.push(Note);
            } else {
              state.processDate = Note;
            }
          } else {
            state.processDate = [{Note: '暂无数据'}];
          }
        }
      },
      actions: {
        getDetail({commit}, srNumber) {
          api.get({
            key: 'getDetail',
            data: {
              srNumber
            },
            success: function(data) {
              commit('setPartner', data.SiebelMessage['Service Request']);
            }
          });
        },
        getCloseReason({commit}, obj) {
          console.log(obj);
          api.get({
            key: 'getRunProcess',
            data: {
              obj
            },
            success: function(data) {
              console.log(data);
            }
          });
        },
        setStatus({commit}, obj) {
          api.get({
            key: 'setStatus',
            data: {
              obj
            },
            success: function(data) {
              console.log(data);
            }
          });
        }
      }
    },
    close: {
      namespaced: true,
      state: {
        option: []
      },
      mutations: {
        closeLov(state, data) {
          state.option = [];
          for (let i = 0;i < data.length;i++) {
            state.option.push(data[i].Value);
          }
        }
      },
      actions: {
        getClose({commit}) {
          api.get({
            key: 'getClose',
            success: function(data) {
              commit('closeLov', data.items);
            }
          });
        }
      }
    },
    comEnter: {
      namespaced: true,
      state: {
        tips: '查询无此资产',
        form: {
          ProductFlag: '', // 故障描述
          ProductModel: '', // 产品型号
          Personal: '',    // 省市
          Address: '',       // 详细地址
          Responsbility: '', // 责任划分
          Area: '',           // 故障现象
          Description: '' // 故障描述
        },
        slots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'},
          {divider: false, values: [], content: '-', className: 'slot2'},
          {flex: 1, values: [], className: 'slot3', textAlign: 'center'}
        ]
      },
      mutations: {
        errorTips(state) {
          tipBox(state.tips);
        },
        successCall(state, data) {
          console.log(data);
          state.form.ProductModel = data['KL Product Model']; // 产品型号
          state.form.Personal = data['KL Personal Province'] + data['Personal City'];   // 省市
          state.form.Address = data['Personal Address'];    // 详细地址
        },
        addValue1(state, data) {
          state.slots[0].values = [];
          for (let i = 0; i < data.length; i++) {
            state.slots[0].values.push(data[i].Value);
          }
        },
        changeValue1(state, data) {
          if (data !== 'error') {
            state.slots[2].values = [];
            if (KND.Util.isArray(data)) {
              for (let i = 0; i < data.length; i++) {
                state.slots[2].values.push(data[i].Value);
              }
            } else {
              state.slots[2].values.push(data.Value);
            }
          } else {
            state.slots[2].values = [];
          }
        }
      },
      actions: {
        getAsset({commit}, num) {
          api.get({
            key: 'getAsset',
            data: {
              num
            },
            success: function(data) {
              console.log(data);
              commit('successCall', data);
            },
            error: function(data) {
              console.log(data);
              commit('errorTips', data);
            }
          });
        },
        getLov1({commit}, val) {
          api.get({
            key: 'getLov1',
            success: function(data) {
              commit('addValue1', data.items);
            }
          });
        },
        valueChange1({commit}, val) {
          api.get({
            key: 'getParentLov1',
            data: {
              val
            },
            success: function(data) {
              console.log(data);
              commit('changeValue1', data.items);
            },
            error: function(data) {
              commit('changeValue1', 'error');
            }
          });
        }
      }
    },
    searchTrans: {
      namespaced: true,
      state: {
        result: []
      },
      mutations: {
        setProduct(state, data) {
          state.result = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].Product) {
              if (KND.Util.isArray(data[i].Product)) {
                state.result = state.result.concat(data[i].Product);
              } else {
                state.result.push(data[i].Product);
              }
            }
          }
          console.log(state.result);
        }
      },
      actions: {
        getProduct({commit}, val) {
          api.get({
            key: 'getPrice',
            success: function(data) {
              if (data.Id) {
                api.get({
                  key: 'getProduct',
                  data: {
                    val: val,
                    id: data.Id
                  },
                  success: function(data) {
                    commit('setProduct', data.SiebelMessage['Catalog Category']);
                  }
                });
              }
            }
          });
        }
      }
    }
  }
});
