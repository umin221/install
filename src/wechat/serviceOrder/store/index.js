import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/api';
// import { MessageBox } from 'mint-ui';
import { app } from 'public/store';

Vue.use(Vuex);

// 缓存页面
app.state.alive = ['index'];

//
// const STATUS2LIST = {
//   '待处理': 'pending',
//   '处理中': 'valid',
//   '已处理': 'invalid'
// };
// 每页加载条数
const PAGESIZE = config.pageSize;
let mapps;
// tipBox
const systemSort = function(array, type) {
  return array.sort(function(a, b) {
    return new Date(b[type]) - new Date(a[type]);
  });
};

export default new Vuex.Store({
  modules: {
    app,
    index: {
      namespaced: true,
      state: {
        loginMeg: {
          'Last Name': 'IM01',
          'Emp #': 'IM01',
          'Job Title': '产品安装工程师',
          'KL Employee Full Name': 'IM01 IM01',
          'Id': '1-2BSBYRFU'
        },
        role: '',       // 角色
        // 工号
        owner: '',
        // 待处理
        pending: [],
        // 处理中
        process: [],
        // 已处理
        completed: [],
        // 客服待处理
        cusPending: [],
        // 客服已分配
        cusProcess: []

      },
      mutations: {
        setManager(state, isManager) {
          mapps = config.mapp[isManager.role];
          state.role = isManager.role;
          state.owner = isManager.owner;
        },
        setOrders(state, {serviceOrders, list}) {
          state[list] = serviceOrders;
          console.log(state['cusPending']);
          // for (let i = 0; i < serviceOrders.length; i++) {
          //   console.log(serviceOrders[i]['Created']);
          // }
        },
        addOrders(state, {serviceOrders, list}) {
          state[list].push(...serviceOrders);
        },
        setLoginMeg(state, info) {
          state['loginMeg'] = info;
        }
      },
      actions: {
        getList({state, commit, dispatch}, {data, more, callback, error}) {
          let key = '';
          if (state.role === 'custom') {
            data.owner = state.owner;
            key = 'getServiceList';
          } else {
            key = 'getList';
          }
          let status = data['Status'];
          let mapp = mapps[status] || {};
          // 搜索时，没有状态
          let list = mapp['list'] || 'result';
          data['Status'] = mapp['status'];
          api.get({
            key: key,
            data: data,
            paging: {
              StartRowNum: more ? state[list].length : 0,
              PageSize: PAGESIZE
            },
            success: data => {
              let serviceOrders = KND.Util.toArray(data.SiebelMessage['Service Request']);
              if (serviceOrders) {
                serviceOrders = systemSort(serviceOrders, 'Created');
                commit(more ? 'addOrders' : 'setOrders', {
                  serviceOrders: serviceOrders,
                  list: list
                });
                if (callback) {
                  callback(serviceOrders);
                }
              }
            },
            error
          });
        },
        getLoginMeg({commit}) {
          KND.Native.getUserInfo((info) => {
            commit('setLoginMeg', info);
          });
        }
      }
    },
    addService: {
      namespaced: true,
      state: {
        mustField: [
          {name: '联系人电话', key: 'Contact_Phone'},
          {name: '报修联系人', key: 'Contact_Name'},
          {name: '联系人类型', key: 'CONTACT_TYPE'},
         /* {name: '省市', key: 'KL_PROVINCE'},
          {name: '详细地址', key: 'Address'},*/
          {name: '服务类型', key: 'SR_TYPE'},
          {name: '故障现象', key: 'SR_AREA'}
        ],
        Municipality: ['上海', '天津', '澳门', '重庆', '香港', '北京'],
        search: [],
        provinceSlots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'},
          {divider: true, content: '-', className: 'slot2'},
          {flex: 1, values: [], className: 'slot3', textAlign: 'center'}
        ],
        typeSlots: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        srTypeSlots: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        areaSlots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'},
          {divider: false, values: [], content: '-', className: 'slot2'},
          {flex: 1, values: [], className: 'slot3', textAlign: 'center'}
        ],
        form: {
          AssetNumber: '',
          KL_Product_Model: '', // 产品类型
          KL_MODEL_CONFIG: '', // 型号配置
          KL_LOCK_MODEL: '', // 面板型号
          KL_LOCK_BODY_MODEL: '', // 锁体型号
          KL_Cutoff_Date: '',  // 移交日期
          Cutoff_Date: '',
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
          state.srTypeSlots[0].values = [];
          for (let i = 0; i < val.data.length; i++) {
            if (val.type === 'KL_PROVINCE') {
              state.provinceSlots[0].values.push(val.data[i].Value);
            } else if (val.type === 'CONTACT_TYPE') {
              state.typeSlots[0].values.push(val.data[i].Value);
            } else if (val.type === 'SR_AREA') {
              state.areaSlots[0].values.push(val.data[i].Value);
            } else if (val.type === 'SR_TYPE') {
              state.srTypeSlots[0].values.push(val.data[i].Value);
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
        setType(state, data) {
          if (data) {
            state.form[data.type] = data.value || '';
          }
        },
        setSn(state, data) {
          if (data.length) {
            state.form['AssetNumber'] = data[0]['Asset Number'];
            state.form['KL_LOCK_BODY_MODEL'] = data[0]['KL Lock Body Model'] || ''; // 锁体型号
            state.form['KL_LOCK_MODEL'] = data[0]['KL Lock Model'] || ''; // 面板型号
            state.form['KL_Product_Model'] = data[0]['KL Product Model'] || ''; // 产品类型
            state.form['KL_Cutoff_Date'] = data[0]['Install Date'] ? KND.Util.format(data[0]['Install Date'], 'yyyy-MM-dd hh:mm:ss') : '';
            state.form['Cutoff_Date'] = data[0]['Install Date'] || '';
            state.form['Product_Warranty_Flag'] = data[0]['KL Warranty Flag'];  // 保修期限
          } else {
            state.form['AssetNumber'] = '';
            state.form['KL_LOCK_BODY_MODEL'] = ''; // 锁体型号
            state.form['KL_LOCK_MODEL'] = ''; // 面板型号
            state.form['KL_Product_Model'] = '';
            state.form['KL_Cutoff_Date'] = '';
            state.form['Cutoff_Date'] = '';
            state.form['Product_Warranty_Flag'] = '';
          }
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
              let arr = KND.Util.toArray(data['SiebelMessage']['Asset Mgmt - Asset']);
              commit('setSn', arr);
            },
            error: function(data) {
              commit('setSn');
              // commit('changeValue', 'error');
            }
          });
        },
        // 新建联系人
        addContact({commit, dispatch}, form) {
          api.get({
            key: 'addContact',
            data: {
              form
            },
            success: function(data) {
              form.Contact_Id = data.PrimaryRowId;
              dispatch('submitService', form);
            },
            error: function(data) {
              commit('changeValue', 'error');
            }
          });
        },
        upDateContact({commit, dispatch}, form) {
          api.get({
            key: form.key,
            data: {
              form
            },
            success: function(data) {
              dispatch('submitService', form);
            },
            error: function(data) {
              commit('changeValue', 'error');
            }
          });
        },
        submitService({commit}, form) {
          api.get({
            key: 'submitService',
            data: {
              form
            },
            success: function(data) {
              form.callback(data);
            },
            error: function(data) {
              commit('changeValue', 'error');
            }
          });
        },
        getLov1({commit}, {type, parent, success, error}) {
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
        }
      }
    },
    detail: {
      namespaced: true,
      state: {
        ServiceRequest: {},
        Action: {},
        allChildService: [],
        childService: {},
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
        BtnStatu: '',
        starAddress: '',
        visitAddress: '',
        endAddress: '',
        orderEntry: {},
        orderEntryItem: [],
        ProblemRecord: [],
        JobSheet: [],
        meg: ''
      },
      mutations: {
        setPartner(state, form) {
          state.ServiceRequest = form;
          state.processDate = [];
          state.BtnStatu = '';
          let Note = null;
          Note = form['FIN Service Request Notes'];
          if (Note) {
            if (Object.prototype.toString.call(Note) !== '[object Array]') {
              state.processDate.push(Note);
            } else {
              state.processDate = systemSort(Note, 'Created');
            }
          } else {
            state.processDate = [{Note: '暂无数据'}];
          }
          if (form.Action) {
            let Action = KND.Util.toArray(form.Action);
            let Action1 = [];
            for (let i = 0;i < Action.length;i++) {
              if (Action[i]['KL Detail Type'] === '派工') {
                Action1.push(Action[i]);
              }
            }
            state.Action = systemSort(Action1, 'Created')[0];
          }
          if (state.role === 'custom') {
            if (form.Owner === state.meg['Emp #'] || !form.Owner) {
              if ((form['KL Status LIC'] === 'Not Started' || form['KL Status LIC'] === 'To Be Assigned') && form['SR Type'] === '上门维修') {
                state.BtnStatu = 'status4';
              }
            }
          } else {
            if (form.Action) {
              // let Action = KND.Util.isArray(form.Action) ? form.Action[0] : form.Action;
              if (state.Action['Status INT'] === 'Not Started') {
                state.BtnStatu = 'status1';
              } else if (state.Action['Status INT'] === 'Accepted') {
                state.BtnStatu = 'status2';
              } else if (state.Action['Status INT'] === 'Appointed' || state.Action['Status INT'] === 'Departed' || state.Action['Status INT'] === 'Arrived') {
                state.BtnStatu = 'status3';
              } else if (state.Action['Status INT'] === 'Done') {
                state.BtnStatu = '';
              }
              console.log(state.Action);
            } else {
              state.BtnStatu = '';
            }
          }
          console.log(state.BtnStatu);
          if (form['Order Entry - Orders']) {
            state.orderEntry = form['Order Entry - Orders'];
            if (form['Order Entry - Orders']['Order Entry - Line Items']) {
              state.orderEntryItem = KND.Util.toArray(form['Order Entry - Orders']['Order Entry - Line Items']);
            }
          }
          if (form['KL Child Service Request']) {
            let childService = KND.Util.toArray(form['KL Child Service Request']);
            childService = systemSort(childService, 'Opened Date');
            state.ProblemRecord = [];
            state.JobSheet = [];
            for (let i = 0; i < childService.length;i++) {
              let attrch = { // 故障记录 附件
                list: [],
                edit: false,
                title: '故障附件'
              };
              let attrch1 = { // 故障记录 附件
                list: [],
                edit: false,
                title: '完工附件'
              };
              state.ProblemRecord.push(attrch);
              state.JobSheet.push(attrch1);
            }
            state.allChildService = childService;
            state.childService = childService[0];
          } else {
            state.allChildService = [];
            state.childService = {};
          }
        },
        setAddress(state, {data, type}) {
          state[type] = data['formatted_address'] + data['sematic_description'];
        },
        setRole(state, {meg, role}) {
          state.role = role;
          state.meg = meg;
        },
        setAttachs(state, {index, data, type}) {
          state[type][index].list = data;
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
        setStatus({commit}, {parms, srNum, callback, error}) {          // 工单状态
          // let key = obj.type ? obj.key : 'setStatus';
          api.get({
            key: parms.key,
            data: {
              parms
            },
            success: function(data) {
              if (data) {
                api.get({
                  key: 'getDetail',
                  data: {
                    srNumber: srNum
                  },
                  success: function(data) {
                    commit('setPartner', data.SiebelMessage['Service Request']);
                    if (parms.key === 'getDone') {
                      Toast('维修完成您辛苦了');
                    }
                    if (callback) {
                      callback();
                    }
                  },
                  error
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
        },
        getMapAddress({commit}, {LngLat, type}) {        // 获取地址
          let showLocation = function(data) {
            console.log(data);
            commit('setAddress', {data: data.result, type: type});
          };
          api.get({
            key: 'getMapAddress',
            data: {
              LngLat,
              showLocation
            },
            success: function(data) {
              showLocation(data);
            },
            error: function(data) {
              console.log(data);
            }
          });
        },
        // getMoreOrder({commit}, {ContactId, ContactName, LocationId}) {
        //   api.get({
        //     key: 'getMoreOrder',
        //     data: {
        //       ContactId,
        //       ContactName,
        //       LocationId
        //     },
        //     success: function(data) {
        //       commit('setAddress', {data: data['formatted_address'], type: type});
        //       console.log(data);
        //     }
        //   });
        // },
        addChildService({commit, dispatch}, {parentId, contactId, lastName, locationId, srNumber}) {
          api.get({
            key: 'addChildService',
            data: {
              parentId,
              contactId,
              lastName,
              locationId
            },
            success: function(data) {
              if (data) {
                dispatch('getDetail', srNumber);
              }
            },
            error: function(data) {
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
        slots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'}
        ],
        slots1: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        ProductModel: '',  // 产品型号
        mustForm: [
          // {name: '产品条形码', key: 'SerialNumber'},
          // {name: '产品型号', key: 'ProductModel'},
          {name: '型号配置', key: 'KL_MODEL_CONFIG'},
          {name: '面板型号', key: 'KL_LOCK_MODEL'},
          {name: '锁体型号', key: 'KL_LOCK_BODY_MODEL'},
          {name: '故障现象', key: 'SR_ROOTCAUSE'},
          {name: '责任划分', key: 'KL_SR_RESP'},
          {name: '解决方法', key: 'repairDetails'}
        ]
      },
      mutations: {
        successCall(state, data) {
          data.type = data.type || '';
          state.ProductModel = data.item['KL Product Model' + data.type];
        },
        errorTips(state) {
          Toast(state.tips);
        },
        setProductModel(state, value) {
          state.ProductModel = value;
        },
        addValue1(state, val) {
          state.slots[0].values = [];
          state.slots1[0].values = [];
          for (let i = 0; i < val.data.length; i++) {
            if (val.type === 'SR_ROOTCAUSE') {
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
              }
              // commit('successCall', {item: data});
              callback(datas[0]);
            },
            error: function(data) {
              let error = 'error';
              callback(error);
              // commit('errorTips', data);
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
              // commit('changeValue1', data.items);
            },
            error: function(data) {
              // commit('changeValue1', 'error');
            }
          });
        },
        upDateService({commit}, form) {
          api.get({
            key: 'upDateService',
            data: {
              form
            },
            success: function(data) {

              form.callback(data);
              // callback(data);
            },
            error: function(data) {
              console.log(data);
            }
          });
        },
        getServiceR({commit}, {Id, callback}) {
          api.get({
            key: 'getServiceR',
            data: {
              Id
            },
            success: function(data) {
              callback(data);
            },
            error: function(data) {
              console.log('error');
            }
          });
        },
        upDateAddress({dispatch}, {address, form}) {
          api.get({
            key: 'upDateAddress',
            data: {
              address
            },
            success: function(data) {
              dispatch('upDateService', form);
            },
            error: function(data) {
              console.log('error');
            }
          });
        }
      }
    },
    searchTrans: {
      namespaced: true,
      state: {
        result: [],
        result1: [],
        result2: {},
        result3: [],
        result4: [],
        selected: [],
        returnSelect: [],
        priceId: ''
      },
      mutations: {
        count(state, val) {
          console.log(val);
          if (val.isShow) {
            state.selected.splice(val.index, 1, false);
          } else {
            state.selected.splice(val.index, 1, true);
          }
        },
        setProduct(state, data) {
          // for (let i = 0; i < data.length;i++) {
          //   state.result2[data[i].Id] = [];
          // }
          // if (val === '2') {
          //   console.log(this);
          // } else {
          // state['result1'] = data;
          state['result'] = data;
          // }
          // state.selected = [];
          // state.result = [];
          // state.selected = [];
          // for (let i = 0; i < data.length; i++) {
          //   if (data[i].Product) {
          //     if (KND.Util.isArray(data[i].Product)) {
          //       state.result = state.result.concat(data[i].Product);
          //     } else {
          //       state.result.push(data[i].Product);
          //     }
          //   }
          // }
          // for (let i = 0; i < state.result.length;i++) {
          //   state.selected.push(false);
          // }
        },
        initSelected(state) {
          state.selected = [];
          for (let i = 0; i < state.result.length;i++) {
            state.selected.push(false);
          }
        },
        deleteSelected(state) {
          state.selected = [];
        }
      },
      actions: {
        getProduct({state, commit}, {val, callback}) {
          api.get({
            key: 'getProduct',
            data: {
              val
            },
            success: function(data) {
              let product = KND.Util.toArray(data.SiebelMessage['KL FS Invloc Product']);
              if (product) {
                commit('setProduct', product);
                if (callback) {
                  callback(product);
                }
              }
            }
          });
        },
        getPrice({state, commit}, val) {
          api.get({
            key: 'getPrice',
            success: function(data) {
              state.priceId = data.Id;
            }
          });
        }
        // getProduct({state, commit}, val) {
        //   api.get({
        //     key: 'getPrice',
        //     success: function(data) {
        //       state.priceId = data.Id;
        //       if (data.Id) {
        //         api.get({
        //           key: 'getProduct',
        //           data: {
        //             val: val.value,
        //             ParentId: val.ParentId,
        //             // type: val.type,
        //             id: data.Id
        //           },
        //           success: function(data) {
        //             let Catalog = KND.Util.toArray(data.SiebelMessage['Catalog Category']);
        //             if (Catalog.length) {
        //               // commit('setProduct', {data: Catalog, item: val.value});
        //               // let name = val.value === '1' ? 'setProduct' : 'setProduct1';
        //               if (val.value === '1') {
        //                 commit('setProduct', Catalog);
        //               }
        //               if (val.callback) {
        //                 val.callback(Catalog);
        //               }
        //             }
        //           }
        //         });
        //       }
        //     }
        //   });
        // }
      }
/*      mutations: {
        count(state, val) {
          console.log(val);
          if (val.isShow) {
            state.selected.splice(val.index, 1, false);
          } else {
            state.selected.splice(val.index, 1, true);
          }
        },
        setProduct(state, data) {
          for (let i = 0;i < data.length;i++) {
            state.result2[data[i].Id] = [];
          };
          state.result = data;
          state.selected = [];
          // for (let i = 0; i < data.length; i++) {
          //   if (data[i].Product) {
          //     if (KND.Util.isArray(data[i].Product)) {
          //       state.result = state.result.concat(data[i].Product);
          //     } else {
          //       state.result.push(data[i].Product);
          //     }
          //   }
          // }
          // for (let i = 0; i < state.result.length;i++) {
          //   state.selected.push(false);
          // }
        },
        setProduct2(state, {Catalog, parentId}) {
          state.result2[parentId] = Catalog;
        },
        initSelected(state) {
          state.selected = [];
          for (let i = 0; i < state.result.length;i++) {
            state.selected.push(false);
          }
        },
        deleteSelected(state) {
          state.selected = [];
        }
      },
      actions: {
        getProduct({state, commit}, {Number, parentId, callback}) {
          api.get({
            key: 'getPrice',
            success: function(data) {
              state.priceId = data.Id;
              if (data.Id) {
                api.get({
                  key: 'getProduct',
                  data: {
                    parentId: parentId,
                    id: data.Id,
                    Number: Number
                  },
                  success: function(data) {
                    let Catalog = KND.Util.toArray(data.SiebelMessage['Catalog Category']);
                    if (Catalog) {
                      if (Number === 1) {
                        commit('setProduct', Catalog);
                        callback(Catalog[0].Id);
                      }
                      if (Number === 2) {
                        console.log(11);
                        commit('setProduct2', {Catalog: Catalog, parentId});
                      }
                    } else {
                      console.log(data);
                    }
                  },
                  error: function(data) {
                    console.log(data);
                  }
                });
              }
            }
          });
        }
      }*/
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
        setContact({commit}, {contacts, callback}) {
          api.get({
            key: 'getActivity',
            data: {
              id: contacts.id,
              empId: contacts.empId,
              empFullName: contacts.empFullName,
              type: contacts.type
            },
            success: function(data) {
              if (callback) {
                callback(data);
              }
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
        setSearch(state, data) {
          state.result = data;
        },
        addSearch(state, data) {
          state.result.push(...data);
        }
      },
      actions: {
        /**
         * 查找安装工程师
         * @param {Object} data 必填 查询条件 键值对
         */
        getList({state, commit, dispatch}, {data, more, callback, error}) {
          console.log(status);
          api.get({
            key: 'getList',
            data: {
              srNum: data.srNum
            },
            paging: {
              StartRowNum: more ? state.result.length : 0,
              PageSize: PAGESIZE
            },
            success: function(data) {
              let partners = KND.Util.toArray(data.SiebelMessage['Service Request']);
              if (partners) {
                commit(more ? 'addSearch' : 'setSearch', partners);
                if (callback) {
                  callback(partners);
                }
              }
            },
            error
          });
        }
      }
    },
    saveFault: {                     // 完成工单
      namespaced: true,
      state: {
        isBn: '',
        returnSelect: [],
        dataService: {},
        attach: { // 附件
          list: [],
          edit: true,
          title: '维修记录表'
        }
      },
      mutations: {
        setIsBn(state, value) {
          state.isBn = value;
        },
        setSelectBn(state, value) {
          for (let i = 0; i < state.returnSelect.length; i++) {
            state.returnSelect[i].isBn = value;
          }
        },
        selectProduct(state, select) {                    // 确认选择的配件
          if (state.returnSelect.length) {
            for (let i = 0;i < state.returnSelect.length;i++) {
              if (select.Id === state.returnSelect[i].Id) {
                return;
              }
            }
          }
          select.isBn = (state.isBn === '保内');
          state.returnSelect.push(select);
        },
        initSelect(state) {
          state.returnSelect = [];
          state.attach.list = [];
        },
        ProductNum(state, {num, val}) {
          let arr = state.returnSelect[num];
          arr.num = val;
          state.returnSelect.splice(num, 1, arr);
        },
        deleteProduct(state, index) {
          state.returnSelect.splice(index, 1);
        },
        setA(state, {data, type}) {
          state[type] = data;
        },
        setSelect(state, {index, val}) {
          state.returnSelect[index].select = val;
        }
      },
      actions: {
        addServiceOrder({state, commit, dispatch}, form) {
          api.get({ // 新增订单 新增成功后调提交接口   失败后后台自动回滚
            key: 'addServiceOrder',
            data: {
              form
            },
            success: function(data) {
              api.get({ // 提交完工确认单到EBS
                key: 'toSubmitOrder',
                data: {
                  'Object Id': data.PrimaryRowId
                },
                success: function(data) {
                  dispatch('backDone', form);
                },
                error: function(error) {
                  let message = error.response && error.response.data.ERROR;
                  Toast(message);
                  form.error();
                }
              });
            }
          });
        },
        deleteOrderEntry({commit, dispatch}, form) {
          api.get({
            key: form.key,
            data: {
              id: form.EntryOrdersId
            },
            success: function(data) {
              if (form.lineItems.length) {
                dispatch('addServiceOrder', form);
              } else {
                dispatch('backDone', form);
              }
            }
          });
        },
        upDateOrderStatu({commit, dispatch}, {Id, type, callback}) {
          let datas = {Id: Id};
          if (!type) {
            datas['KL Parent SR Complete Flag'] = 'Y';
          } else {
            datas['Product Warranty Flag'] = type;
          }
          api.get({
            key: 'upDateOrderStatu',
            data: datas,
            success: function(data) {
              // form.callBack(data);
              callback(data);
              // dispatch('backDone', form);
            }
          });
        },
        getServiceR({commit}, {Id, callback}) {
          api.get({
            key: 'getServiceR',
            data: {
              Id
            },
            success: function(data) {
              callback(data);
            },
            error: function(data) {
              console.log('error');
            }
          });
        },
        getOrderDetail({state, commit}, {id, callback}) {
          api.get({
            key: 'getOrderDetail',
            data: {
              id
            },
            success: function(data) {
              let EntryOrders = KND.Util.toArray(data.SiebelMessage['Order Entry - Orders']['Order Entry - Line Items']);
              if (EntryOrders.length) {
                for (let i = 0; i < EntryOrders.length;i++) {
                  commit('selectProduct', {
                    'Name': EntryOrders[i].Product,
                    'num': parseInt(EntryOrders[i]['Quantity Requested'], 0),
                    'KL Translated Name': EntryOrders[i]['KL Product Name Join'],
                    'Unit Price': EntryOrders[i]['Adjusted List Price - Display'],
                    'Id': EntryOrders[i]['Product Id'],
                    'isBn': (EntryOrders[i]['KL Warranty Flag'] === 'Y')
                  });
                }
                // callback(EntryOrders);
              }
            }
          });
        },
        deleteOrderline({commit, dispatch}, {EntryId, LineId}) {
          api.get({
            key: 'deleteOrderline',
            data: {
              EntryId,
              LineId
            },
            success: function(data) {
            }
          });
        },
        backDone({commit, dispatch}, form) {
          if (form.type === 'child') {
            api.get({
              key: 'serviceDone',
              data: {
                'Object Id': form.ServiceRequestId
              },
              success: function(data) {
                form.callBack(data);
              }
              // error: function(data) {
              //   console.log(data);
              // }
            });
          } else {
            dispatch('upDateOrderStatu', {
              Id: form.parentId,
              callback: form.callBack
            });
          }
        }
      }
    }
  }
});
