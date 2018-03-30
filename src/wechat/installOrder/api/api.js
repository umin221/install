let apiList = {
  /* getList: {
    url: 'service/EAI Siebel Adapter/QueryPage'
    // 列表
  },*/
  getList: option => {

    var boby = {
      'OutputIntObjectName': 'KL Install Order Header',
      // 'OutputIntObjectName': 'KL Install Order',
      'StartRowNum': option.paging.StartRowNum,
      'PageSize': option.paging.PageSize
    };
    var searchSpec = [];
    // 状态条件
    var status = option.data.Status || '';
    // 搜索条件
    var search = option.data.search || '';
    // 所有人都不看草稿
    if (option.data.infoUser['KL Primary Position Type LIC'] === 'Door Factory Engineer') { // 门厂技术安装员
      boby.ViewMode = 'Sales Rep';
    } else if (option.data.infoUser['KL Primary Position Type LIC'] === 'Field Service Manager' && !option.data.isTeam) { // 安装主管(我的安装订单)
      searchSpec.push('[Order Entry - Orders.Primary Position Id]="' + option.data.infoUser['Primary Position Id'] + '"');
    } else if (option.data.infoUser['KL Primary Position Type LIC'] === 'Field Service Engineer') { // 安装工程师(我的安装订单)
      searchSpec.push('[Order Entry - Orders.Primary Position Id]="' + option.data.infoUser['Primary Position Id'] + '"');
    } else if (option.data.infoUser['KL Primary Position Type LIC'] === 'Field Service Manager' && option.data.isTeam) { // option.data.isTeam 等于true 是我的团队 安装主管我的团队
      boby.ViewMode = 'Manager';
    } else if (option.data.infoUser['KL Primary Position Type LIC'] === 'Door Factory Manager') { // 门厂技术主管
      boby.ViewMode = 'Manager';
    }
    // 订单状态过滤
    if (status) {
      searchSpec.push('(' + KND.Util.condition2D({Status: option.data.Status.split(',')}, 'Order Entry - Orders', ' OR ', '=') + ')');
    }
    // 订单搜索条件过滤
    if (search) {
      searchSpec.push('(' + KND.Util.condition2D(search, 'Order Entry - Orders', ' OR ', ' LIKE ') + ')');
    }
    boby.SearchSpec = searchSpec.join(' AND ');
    return {
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': boby
      }
    };
  },
  getDetail: option => { // 详情
    return {
      url: 'service/EAI Siebel Adapter/Query'
    };
  },
  getTaskAdd: option => { // 任务开始更新状态
    return {
      url: 'service/Workflow Process Manager/RunProcess/'
    };
  },
  getXttd: option => { // 协同团队
    return {
      url: 'service/EAI Siebel Adapter/Query'
    };
  },
  /**
   * 查找所有产品安装工程师&主管 搜索&获取列表
   * @param {String} option.data.position 必填 职位
   * @param {String} option.data['Last Name'] 选填 用户名字 模糊查询
   * @param {Object} option.paging 必填 翻页参数
   * @returns {{url: string}}
   */
  findEngineer: option => {
    let position = option.data.position.split('||');
    let name = option.data['Last Name'];
    let specPosi = [];
    let specName = '';
    // 职位过滤
    for (let i in position) {
      specPosi.push('[KL Primary Position Type]="' + position[i] + '"');
    };
    // 名字过滤
    if (name) {
      specName += '[Last Name] ~LIKE "' + name + '*" AND ';
    };
    return {
      url: 'data/KL Employee Interface BO/Employee/?searchspec=' + specName + '(' + specPosi.join(' OR ') + ')&' + KND.Util.param(option.paging)
    };
  },
  /*
  * 协同团队修改负责人
  * */
  upPerson: option => {
    return {
      url: 'service/EAI Siebel Adapter/Synchronize',
      data: {
        'body': {
          'SiebelMessage': {
            'MessageId': '',
            'MessageType': 'Integration Object',
            'IntObjectName': 'KL Install Order Sales Team',
            'IntObjectFormat': 'Siebel Hierarchical',
            'ListOfKL Install Order Sales Team': {
              'Order Entry - Orders': {
                'Id': option.data.Id,
                'ListOfPosition': {
                  'Position': option.data.personList
                }
              }
            }
          }
        }
      }
    };
  },
  getUPStatus: option => {
    return {
      url: 'service/Workflow Process Manager/RunProcess'
    };
  }, // 任务结束关闭
  getUPData: option => {
    return {
      url: 'data/KL Installation Task/KL Installation Task/'
    };
  }, // 子任务 数据提交
  findBatchById: option => {
    return {
      method: 'get',
      url: 'data/KL Installation Task/KL Installation Task/' + option.data.id,
      data: {}
    };
  },
  getPlan: option => { // 获取批次详情计划数据
    return {
      method: 'get',
      url: 'data/KL Installation Task Detail Plan/KL Installation Task Detail Plan/?searchspec=[Parent Activity Id] =' + "'" + option.data.id + "'",
      data: {}
    };
  },
  setPlan: option => { // 批次详细计划提交
    return {
      url: 'data/KL Installation Task/KL Installation Task/' + option.data['Parent Activity Id'] + '/KL Installation Task Detail Plan'
      // url: 'data/KL Installation Task Detail Plan/KL Installation Task Detail Plan/'
    };
  },
  getAppData: option => { // 审批详情头
    return {
      url: 'service/EAI Siebel Adapter/Query'
    };
  },
  getJournalData: option => {
    return {
      method: 'get',
      url: 'data/KL Installation Detail/KL Installation Detail/?searchspec=[Activity Id] =' + "'" + option.data.id + "'",
      data: {}
    };
  },
  setJourna: option => {
    return {
      url: 'data/KL Installation Detail/KL Installation Detail'
    };
  },

  /**
   * 提交安装订单－门厂技术工程师
   * @param option
   * @returns {{url: string, data: {}}}
   */
  submit: option => {
    return {
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'ProcessName': 'KL Install Order Submit Process',
          'Object Id': option.data.id
        }
      }
    };
  },

  /**
   * 新增或修改订单行项目(在订单下新建或修改）
   * @param {String} option.data['KL Hole Direction'] 选填 开向 左开
   * @param {String} option.data['KL World Flag'] 选填 Y
   * @param {String} option.data['Scheduled Ship Date'] 选填 03/01/2018
   * @param {String} option.data['KL Door Thickness'] 选填 锁舌导向板规格
   * @param {String} option.data['KL Parts Requirement'] 选填 配件要求
   * @param {String} option.data['Quantity Requested'] 选填 125
   * @param {String} option.data['KL Agreement Item Id'] 选填 1-DGFJM0
   * @param {String} option.data['KL Door Material Quality'] 选填 木门
   * @param {String} option.data['KL Gate Plate Specification'] 选填 门扣板规格
   * @param {String} option.data['Description'] 选填 备注
   * @param {String} option.data['Id'] 选填 1-111
   * @returns {{method: string, url: string}}
   */
  saveOrderLine: option => {
    return {
      method: 'put',
      url: 'data/Order Entry (Sales)/Order Entry - Orders/' + option.data['Order Header Id'] + '/Order Entry - Line Items'
      // url: 'data/Order Entry (Sales)/Order Entry - Orders/1-2BSAS9OT/Order Entry - Line Items/1-2BSB7L33xxx'
    };
  },

  /**
   * 删除订单行
   * @param {String} option.data.id 必填 订单行id
   * @returns {{method: string, url: string}}
   */
  deleteOrderLine: option => {
    return {
      method: 'delete',
      url: 'data/Order Entry - Line Items/Order Entry - Line Items/' + option.data.id
    };
  }
};

let ajax = api => {
  if (config.online) {
    KND.Native.ajax(api);
  } else {
    let data = require('./data.json');
    setTimeout(() => {
      api.success(data[api.key]);
    }, 100);
  }
};

const get = option => {
  ajax(Object.assign(option, apiList[option.key](option)));
};
export default {
  get
};
