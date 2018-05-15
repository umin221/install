let apiList = {
  /**
   * 获取安装批次列表
   * @param {String} option.data.body['PrimaryRowId'] 必填 当前委外人员id
   * @returns {{method: string, url: string}}
   */
  queryInstallTask: option => {
    return {
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base KL Contact - Installation Task', // 固定 io 名
          'PrimaryRowId': option.data.id, // 1-2BSH6IWP 1-2BSBXX0D  contact001 1-2BSBXX0D
          'SearchSpec': `(${KND.Util.condition2D({
            'Calculated Activity Status': ['In Progress', 'Approved'] // 状态是 进行中 & 审批通过 的批次
          }, 'KL Installation Task', ' OR ')}) AND ${KND.Util.condition({
            'KL Detail Type LIC': 'Lock Installation Batch' // 真锁批次
          }, 'KL Installation Task')}`,
          'ViewMode': 'All', // 选填 固定 All
          'StartRowNum': '0',
          'PageSize': '100'
        }
      }
    };
  },

  /**
   * 查询安装员的安装批次
   * @param option
   */
  queryEmpInstallTask: option => {
    let success = option.success;
    return {
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base KL Installation Task',
          'SearchSpec': `(${KND.Util.condition2D({
            'Calculated Activity Status': ['In Progress', 'Approved'] // 状态是 进行中 & 审批通过 的批次
          }, 'KL Installation Task', ' OR ')}) AND ${KND.Util.condition({
            'KL Detail Type LIC': 'Lock Installation Batch', // 真锁批次
            'Primary Owner Id': option.data.id // 员工id
          }, 'KL Installation Task')}`,
          'StartRowNum': '0',
          'PageSize': '100'
          // 'SearchSpec': '[KL Installation Task.KL Detail Type LIC]="Lock Installation" AND [KL Installation Task.Primary Owner Id]="1-2BSANMMF" AND ([KL Installation Task.Calculated Activity Status]="In Progress" OR [KL Installation Task.Calculated Activity Status]="Approved")'
        }
      },
      success: result => {
        // 统一委外获取回调
        let data = result.SiebelMessage;
        result.SiebelMessage = {
          Contact: data
        };
        success(result);
      }
    };
  },

  /**
   * 获取楼栋下所有楼层和房间
   * @param {Object} option.data 必填，过滤条件
   * @param {String} option.data['KL Activity Id'] 必填，批次id 1-2BSEB2Z2
   * @param {String} option.data['KL Building Number'] 必填，楼栋编号 1
   * @returns {{method: string, url: string, data: {}}}
   */
  getLayer: option => {
    return {
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base KL Install Order Asset',
          'SearchSpec': KND.Util.condition(option.data, 'Asset Room') // '[Asset Room.KL Activity Id]="1-2BSEB2Z2" AND [Asset Room.KL Building Number]="1"'
        }
      }
    };
  },

  /**
   * 获取楼栋下所有楼层和房间
   * @param {Object} option.data 必填，过滤条件
   * @param {String} option.data['KL Activity Id'] 必填，批次id 1-2BSEB2Z2
   * @param {String} option.data['KL Building Number'] 必填，楼栋编号 1
   * @returns {{method: string, url: string, data: {}}}
   */
  getLayerSort: option => {
    return {
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': {
          'OutputIntObjectName': 'Base KL Install Order Asset',
          'SearchSpec': KND.Util.condition(option.data, 'Asset Room'), // '[Asset Room.KL Activity Id]="1-2BSEB2Z2" AND [Asset Room.KL Building Number]="1"'
          'SortSpec': 'KL Room Number(ASCENDING)', // 'KL Floor Number(ASCENDING),KL Room Number(ASCENDING)',
          'StartRowNum': 0,
          'PageSize': 100
        }
      }
    };
  },

  /**
   * 新增&更新房间信息
   * @param {Object} option.data 必填 需新增或更新的房间信息
   * @returns {{url: string, data: {}}}
   */
  upsertRoom: option => {
    return {
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'ProcessName': 'KL Install Order Asset Room Upsert Process',
          'SiebelMessage': {
            'MessageId': '',
            'MessageType': 'Integration Object',
            'IntObjectName': 'Base KL Install Order Asset Address',
            'IntObjectFormat': 'Siebel Hierarchical',
            'ListOfBase KL Install Order Asset Address': {
              'Base KL Install Order Asset Address': option.data
            }
          }
        }
      }
    };
  },

  /**
   * 删除房号
   * @param {String} option.data.id 房号id
   * @returns {{url: string, data: {}}}
   */
  removeRoom: option => {
    return {
      method: 'delete',
      url: 'data/KL Install Order Asset/KL Install Order Asset/' + option.data.id,
      data: {}
    };
  },

  /**
   * 删除 整栋 或 整层
   * @param {String} option.data['Object Id'] 必填 批次id
   * @param {String} option.data['BuildingNum'] 必填 楼栋编号
   * @param {String} option.data['FloorNum'] 必填 楼层编号 如不传则删除整栋
   * @returns {{url: string, data: {body: {ProcessName: string, Object Id: string, BuildingNum: string, FloorNum: string}}}}
   */
  removeBuilding: option => {
    let body = option.data;
    body.ProcessName = 'KL Install Order Asset Room Delete Process';
    delete option.data;
    return {
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': body
      }
    };
  },

  /**
   * 查询楼栋列表
   * @param {String} option.data['ProcessName'] 必填 工作流名称
   * @param {String} option.data['OrderId'] 选填 订单id 与批次id 2填1
   * @param {String} option.data['TaskId'] 选填 批次id 与订单id 2填1
   * @returns {{url: string, data: {body: {ProcessName: string, Object Id: string, BuildingNum: string, FloorNum: string}}}}
   */
  queryBuilding: option => {
    return {
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'ProcessName': 'KL Install Order Asset Building Query Process',
          'OrderId': option.data.OrderId,
          'TaskId': option.data.TaskId
        }
      }
    };
  },

  /**
   * 新增楼栋
   * @param {String} option.data['OrderId'] 必填 订单id
   * @param {String} option.data['TaskId'] 必填 批次id
   * @param {String} option.data['Country'] 必填 国家
   * @param {String} option.data['Province'] 必填 省
   * @param {String} option.data['City'] 必填 市
   * @param {String} option.data['DetailAddress'] 必填 详细地址
   * @returns {{url: string, data: {body: {ProcessName: string, Object Id: string, BuildingNum: string, FloorNum: string}}}}
   */
  addBuilding: option => {
    let body = Object.extend({
      'Type': 'Add',
      'BuilingName': '栋',
      'FloorName': 'F',
      'BuildingNum': '1',
      'RoomNum': '4',
      'ProcessName': 'KL Install Order Asset Create Process',
      'FloorNum': '1'
    }, option.data);
    delete option.data;
    return {
      url: 'service/Workflow Process Manager/RunProcess/',
      data: {
        'body': body
      }
    };
  },

  /**
   * 更新楼栋名字
   * @param {String} option.data['ProcessName'] 选填 更新楼栋名字的工作流名字
   * @param {String} option.data['Object Id'] 必填 批次id
   * @param {String} option.data['BuildingNum'] 必填 楼栋编号
   * @param {String} option.data['Builing'] 必填 更新的名字
   * @returns {{url: string, data: {body: {ProcessName: string, Object Id: string, BuildingNum: string, FloorNum: string}}}}
   */
  updateBuildingName: option => {
    let body = option.data;
    body.ProcessName = 'KL Install Order Asset Building Update Process';
    delete option.data;
    return {
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': body
      }
    };
  },

  /**
   * 查询订单行
   * @param option
   */
  queryOrderLines: option => {
    return {
      method: 'get',
      url: 'data/Order Entry - Line Items/Order Entry - Line Items/?searchspec=' + KND.Util.condition(option.data) + '&PageSize=100&StartRowNum=0'
    };
  },

  /**
   * 绑定资产条码型号等
   * @param {String} option.data['Id'] 必填 资产id 1-2BSHWBOE
   * @param {String} option.data['Serial Number'] 必填 条码
   * @param {String} option.data['Product Id'] 必填 面板 final product id
   * @param {String} option.data['KL Product Model No Lock Body'] 必填 锁体型号 S070B
   * @param {String} option.data['KL Product Model No Panel'] 必填 面板型号 SZ3010
   * @returns {{url: string}}
   */
  installOrderAssets: option => {
    return {
      method: 'put',
      url: 'data/KL Install Order Asset/KL Install Order Asset'
      // data: {
      //  'Id': '',
      //  'Serial Number': '',
      //  'Product Id': '',
      //  'KL Product Model No Lock Body': '',
      //  'KL Product Model No Panel': ''
      // }
    };
  },

  /**
   * 获取账号密码匹配的委外联系人信息
   * @param {String} option.data['LoginName'] 必填 登陆名
   * @param {String} option.data['Password'] 必填 密码
   * @returns {{method: string, url: string}}
   */
  queryUserInfo: option => {
    let data = option.data;
    let error = option.error;
    let success = option.success;
    return {
      method: 'get',
      url: `data/KL User/User/?searchspec=${KND.Util.condition(data)}&PageSize=2&StartRowNum=0`,
      error: err => {
        console.log(err);
        // sso 登陆成功回调
        let EmpSSOLoginSuccess = result => {
          apiList['queryInstallTask'] = apiList['queryEmpInstallTask'];
          // 设置userID
          KND.Native.userID = data['Login Name'];
          // 获取员工信息
          KND.Native.getUserInfo(info => {
            console.log(info);
            success({items: info});
          });
        };
        // 生产环境走sso登陆认证
        if (config.env === 'prod') {
          // 员工登陆
          get({
            key: 'queryEmployeeInfo',
            data: data,
            success: EmpSSOLoginSuccess,
            error: err => {
              console.log(err);
              error(err);
            }
          });
        } else {
          // 非生产环境 不走登陆校验
          data['KL Outsource Password'] === 'Asdf2017' ? EmpSSOLoginSuccess() : Toast('密码错误');
        }
      }
    };
  },

  /**
   * 工程师登陆
   * @param option
   * @returns
   */
  queryEmployeeInfo: option => {
    let data = option.data;
    return {
      url: 'https://www.kinlong.cn/sso/users/access/',
      data: {
        'X-Idaas-Rest-Subject-Type': 'USERCREDENTIAL',
        'X-Idaas-Rest-Subject-Username': data['Login Name'],
        'X-Idaas-Rest-Subject-Password': data['KL Outsource Password'],
        'X-Idaas-Rest-New-Token-Type-To-Create': 'USERTOKEN'
      }
    };
  }

};

let ajax = api => {
  if (config.online) {
    KND.Native.ajax(api);
  } else {
    let data = require('./data.json');
    api.success(data[api.key]);
  }
};

const get = option => {
  ajax(Object.extend(true, option, apiList[option.key](option)));
};

export default {
  get
};
