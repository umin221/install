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
        // loginMeg: {
        //   'Last Name': '代一',
        //   'Emp #': '16013107',
        //   'Job Title': 'install'
        // },
        loginMeg: {
          'Last Name': 'IM01',
          'Emp #': 'IM01',
          'Job Title': 'install',
          'KL Employee Full Name': 'IM01 IM01',
          'Id': '1-2BSBYRFU'
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
              state.cusService.push(data[i]);
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
              let partners = KND.Util.toArray(data.SiebelMessage['Service Request']);
              commit('dataType', partners);
              if (callback) {
                callback(data.SiebelMessage['Service Request'].length);
              }
            }
          });
        }
      }
    },
    addService: {
      namespaced: true,
      state: {
        mustField: [
          {name: '联系电话', key: 'Contact_Phone'},
          {name: '报修联系人', key: 'Contact_Name'},
          {name: '联系人类型', key: 'SR_TYPE'},
          {name: '省市', key: 'KL_PROVINCE'},
          {name: '详细地址', key: 'Address'}
        ],
        search: [],
        provinceSlots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'},
          {divider: true, content: '-', className: 'slot2'},
          {flex: 1, values: [], className: 'slot3', textAlign: 'center'}
        ],
        typeSlots: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        areaSlots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'},
          {divider: false, values: [], content: '-', className: 'slot2'},
          {flex: 1, values: [], className: 'slot3', textAlign: 'center'}
        ],
        form: {
          KL_Product_Model: '', // 产品类型
          KL_Cutoff_Date: '',  // 移交日期
          Product_Warranty_Flag: '' // 保修期限
        }
      },
      mutations: {
        getSearch(state, data) {
          state.search = [];
          if (data.constructor === Array) {
            state.search = data;
          } else {
            state.search.push(data);
          }
        },
        removeSearch(state) {
          state.search = [];
        },
        addValue(state, val) {
          state.provinceSlots[0].values = [];
          state.typeSlots[0].values = [];
          state.areaSlots[0].values = [];
          for (let i = 0; i < val.data.length; i++) {
            if (val.type === 'KL_PROVINCE') {
              state.provinceSlots[0].values.push(val.data[i].Value);
            } else if (val.type === 'CONTACT_TYPE') {
              state.typeSlots[0].values.push(val.data[i].Value);
            } else if (val.type === 'SR_AREA') {
              state.areaSlots[0].values.push(val.data[i].Value);
            }
          }
        },
        changeValue(state, val) {
          if (val !== 'error') {
            state.areaSlots[1].values = [];
            state.areaSlots[2].values = [];
            state.provinceSlots[2].values = [];
            if (val.data.constructor === Array) {
              for (let i = 0; i < val.data.length; i++) {
                if (val.type === 'SR_AREA') {
                  state.areaSlots[1].values.push(val.data[i].High);
                  state.areaSlots[2].values.push(val.data[i].Value);
                } else if (val.type === 'KL_PROVINCE') {
                  state.provinceSlots[2].values.push(val.data[i].Value);
                }
              }
            } else {
              if (val.type === 'SR_AREA') {
                state.areaSlots[2].values.push(val.data.Value);
                state.areaSlots[1].values.push(val.data.High);
              } else if (val.type === 'KL_PROVINCE') {
                state.provinceSlots[2].values.push(val.data.Value);
              }
            }
          } else {
            state.areaSlots[2].values = [];
          }
        },
        setSn(state, data) {
          state.form['KL_Product_Model'] = data['KL Product Model']; // 产品类型
          state.form['KL_Cutoff_Date'] = data['Install Date'];  // 移交日期
          state.form['Product_Warranty_Flag'] = data['Product Warranty Flag'];  // 保修期限
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
              if (data.items) {
                commit('getSearch', data.items);
              } else {
                commit('getSearch', data);
              }
            },
            error: function(data) {
              commit('removeSearch', '');
            }
          });
        },
        getValue({commit}, val) {
          api.get({
            key: 'getLov1',
            data: {
              type: val.type,
              parent: val.parent
            },
            success: function(data) {
              commit('addValue', {data: data.items, type: val.type});
            }
          });
        },
        valueChange({commit}, val) {
          let type = val.type;
          if (type === 'KL_PROVINCE') {
            type = 'KL_CITY';
          }
          api.get({
            key: 'getParentLov1',
            data: {
              value: val.value,
              type: type
            },
            success: function(data) {
              commit('changeValue', {data: data.items, type: val.type});
            },
            error: function(data) {
              commit('changeValue', 'error');
            }
          });
        },
        getSn({commit}, Sn) {
          api.get({
            key: 'getSn',
            data: {
              Sn
            },
            success: function(data) {
              console.log(data);
              commit('setSn', data['SiebelMessage']['Asset Mgmt - Asset']);
            },
            error: function(data) {
              // commit('changeValue', 'error');
            }
          });
        },
        submitService({commit}, form) {
          console.log(this);
          api.get({
            key: form.key,
            data: {
              form
            },
            success: function(data) {
              if (form.key === 'upDateContact' && data) {
                api.get({
                  key: 'submitService',
                  data: {
                    form
                  },
                  success: function(data) {
                    tipBox('新建成功！');
                  },
                  error: function(data) {
                    commit('changeValue', 'error');
                  }
                });
              }
              // commit('setSn', data['SiebelMessage']['Asset Mgmt - Asset']);
            },
            error: function(data) {
              commit('changeValue', 'error');
            }
          });
        }
      }
    },
    detail: {
      namespaced: true,
      state: {
        ServiceRequest: {},
        Action: {},
        processDate: [],
        Statu: {
          '接单': 'Accept',
          '出发': 'Depart',
          '上门': 'Arrive',
          '预约': 'Appoint',
          '完成': 'Done'
        },
        tabList: [
          {name: '基础信息', id: 'tab-container1'},
          {name: '维修记录', id: 'tab-container2'},
          {name: '流程记录', id: 'tab-container3'}
        ],
        BtnStatu: ''
      },
      mutations: {
        setPartner(state, form) {
          state.ServiceRequest = form;
          let Note = null;
          Note = form['FIN Service Request Notes'];
          if (Note) {
            if (Object.prototype.toString.call(Note) !== '[object Array]') {
              state.processDate.push(Note);
            } else {
              state.processDate = Note;
            }
          } else {
            state.processDate = [{Note: '暂无数据'}];
          }
          if (form.Action) {
            let Action = KND.Util.isArray(form.Action) ? form.Action[0] : form.Action;
            if (Action.Status === '已派工' || Action.Status === '未开始') {
              state.BtnStatu = 'status1';
            } else if (Action.Status === '已接单') {
              state.BtnStatu = 'status2';
            } else if (Action.Status === '已预约' || Action.Status === '已出发' || Action.Status === '已上门') {
              state.BtnStatu = 'status3';
            } else {
              state.BtnStatu = '';
            }
            state.Action = Action;
          } else {
            if (form.Status === '待分配') {
              state.BtnStatu = 'status5';
            } else if (form.Status === '未开始') {
              state.BtnStatu = 'status4';
            }
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
        setStatus({commit}, obj) {          // 工单状态
          // let key = obj.type ? obj.key : 'setStatus';
          api.get({
            key: obj.parms.key,
            data: {
              obj: obj.parms
            },
            success: function(data) {
              if (data) {
                api.get({
                  key: 'getDetail',
                  data: {
                    srNumber: obj.srNum
                  },
                  success: function(data) {
                    commit('setPartner', data.SiebelMessage['Service Request']);
                  }
                });
              }
            }
          });
        },
        setContact({commit}, contacts) {        // 主管指派自己
          api.get({
            key: 'getActivity',
            data: {
              id: contacts.id,
              empId: contacts.empId,
              empFullName: contacts.empFullName,
              type: contacts.type
            },
            success: function(data) {
              if (data) {
                api.get({
                  key: 'getDetail',
                  data: {
                    srNumber: contacts.srNum
                  },
                  success: function(data) {
                    commit('setPartner', data.SiebelMessage['Service Request']);
                  }
                });
              }
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
        slots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'},
          {divider: false, values: [], content: '-', className: 'slot2'},
          {flex: 1, values: [], className: 'slot3', textAlign: 'center'}
        ],
        slots1: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        form: {
          ProductModel: '', // 产品型号
          Personal: '',    // 省市
          Address: ''      // 详细地址
        }
      },
      mutations: {
        errorTips(state) {
          Toast(state.tips);
        },
        successCall(state, data) {
          state.ProductModel = data['KL Product Model']; // 产品型号
          state.Personal = data['KL Personal Province'] + data['Personal City'];   // 省市
          state.Address = data['Personal Address'];    // 详细地址
        },
        addValue1(state, val) {
          state.slots[0].values = [];
          state.slots1[0].values = [];
          for (let i = 0; i < val.data.length; i++) {
            if (val.type === 'SR_AREA') {
              state.slots[0].values.push(val.data[i].Value);
            } else {
              state.slots1[0].values.push(val.data[i].Value);
            }
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
        getLov1({commit}, type) {
          api.get({
            key: 'getLov1',
            data: {
              type
            },
            success: function(data) {
              commit('addValue1', {data: data.items, type: type});
            }
          });
        },
        valueChange1({commit}, val) {
          api.get({
            key: 'getParentLov1',
            data: {
              value: val.value,
              type: val.type
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
        result: [],
        selected: [],
        returnSelect: []
      },
      mutations: {
        count(state, val) {
          if (val.isShow) {
            state.selected.splice(val.index, 1, false);
          } else {
            state.selected.splice(val.index, 1, true);
          }
        },
        selectProduct(state) {                    // 确认选择的配件
          state.returnSelect = [];
          for (let i = 0; i < state.result.length; i++) {
            if (state.selected[i]) {
              state.returnSelect.push(state.result[i]);
            }
          }
          if (!state.returnSelect.length) {
            Toast('请选择配件');
          }
        },
        setProduct(state, data) {
          state.result = [];
          state.selected = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].Product) {
              if (KND.Util.isArray(data[i].Product)) {
                state.result = state.result.concat(data[i].Product);
              } else {
                state.result.push(data[i].Product);
              }
            }
          }
          for (let i = 0; i < state.result.length;i++) {
            state.selected.push(false);
          }
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
    },
    contact: {
      namespaced: true,
      state: {
        result: [],
        select: {
          'Last Name': '请选择'
        }
      },
      mutations: {
        setContact(state, contacts) {
          state.result = contacts;
        },
        addContact(state, contacts) {
          state.result.push(...contacts);
        },
        selContact(state, contact) {
          state.select = contact;
        }
      },
      actions: {
        /**
         * 查找安装工程师
         * @param {Object} data 必填 查询条件 键值对
         */
        findContact({state, commit}, {data, more, callback}) {
          api.get({
            key: 'findEngineer',
            data: data,
            paging: {
              StartRowNum: more ? state.result.length : 0,
              PageSize: PAGESIZE
            },
            success: (data) => {
              let contacts = KND.Util.toArray(data.items);
              commit(more ? 'addContact' : 'setContact', contacts);
              if (callback) {
                callback(contacts);
              }
            },
            error: (error) => {
              if (callback) {
                callback();
              };
              console.log(error);
            }
          });
        },
        setContact({commit}, contacts) {
          api.get({
            key: 'getActivity',
            data: {
              id: contacts.id,
              empId: contacts.empId,
              empFullName: contacts.empFullName,
              type: contacts.type
            },
            success: function(data) {
              console.log(data);
            }
          });
        }
      }
    },
    searchList: {                     // 首页搜素列表
      namespaced: true,
      state: {
        result: []
      },
      mutations: {
        dataType(state, data) {
          state.result = data;
        }
      },
      actions: {
        /**
         * 查找安装工程师
         * @param {Object} data 必填 查询条件 键值对
         */
        getList({state, commit, dispatch}, status) {
          console.log(status);
          api.get({
            key: 'getSearchList',
            data: {
              status: status.data['SR Number'],
              Owner: status.data['Owner']
            },
            paging: {
              StartRowNum: status.data.more ? state[STATUS2LIST[status]].length : 0,
              PageSize: PAGESIZE
            },
            success: function(data) {
              let partners = KND.Util.toArray(data.SiebelMessage['Service Request']);
              commit('dataType', partners);
              if (status.data.callback) {
                status.data.callback(data.SiebelMessage['Service Request'].length);
              }
            }
          });
        }
      }
    }
  }
});
