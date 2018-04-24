let apiList = {
  /**
   * 交接单列表&搜索
   * @param {String} option.data.ViewMode 必填 视图
   * @param {Object} option.data 必填 其他查询条件
   * @param {Object} option.paging 必填 翻页参数
   * @returns {{method: string, url: string, data: {body: {OutputIntObjectName: string, ViewMode: string, SearchSpec: *, StartRowNum: (*|string), PageSize: (*|string|PAGESIZE)}}}}
   */
  getTransferOrder: option => {
    let condition = Object.assign({}, option.data);
    let status = condition.Status;
    let viewMode = condition.ViewMode;
    // 用户职位
    let position = config.userInfo['KL Primary Position Type LIC'];
    delete condition.ViewMode;
    // 总部支持专员只看协作团队的单
    if (position === 'HQ Support Assistant') viewMode = 'Sales Rep';
    // 总部支持主管只看下属的单
    if (position === 'HQ Support Manager') viewMode = 'Manager';
    // 状态多匹配 逗号分隔
    if (status) {
      condition['Status'] = status.split(',');
    };
    // 运算符
    let operator = option.data.Status ? ' = ' : ' ~LIKE ';
    return {
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': {
          'OutputIntObjectName': 'Base Project',
          'ViewMode': viewMode,
          'SearchSpec': KND.Util.condition2D(condition, 'Project', ' OR ', operator),
          'StartRowNum': option.paging.StartRowNum,
          'PageSize': option.paging.PageSize
        }
      }
    };
  },

  /**
   * 查找交接单详情
   * @param {String} option.data.id 必填 交接单id
   * @returns {{method: string, url: string, data: {}}}
   */
  findTransferOrderById: option => {
    return {
      method: 'get',
      url: 'data/Project/Project/' + option.data.id,
      data: {}
    };
  },

  /**
   * 查找交接单详情
   * @param {String} option.data.body.OutputIntObjectName 必填 固定 KL Project
   * @param {String} option.data.body.id 必填 交接单Id
   * @returns {{method: string, url: string, data: {}}}
   */
  queryTransferOrderById: option => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'KL Install Delivery IO',
          'SearchSpec': '[Project.Id]="' + option.data.id + '" AND [MACD FS Agreement Item.KL Product Division Name]="海贝斯事业部"' // '[Project.Status]="' + option.data.Status + '"',
        }
      }
    };
  },

  /**
   * 查找交接单详情
   * @param {data} option.data 查询条件
   * @returns {{url: string, data: {}}}
   */
  findTransferOrder: option => {
    return {
      url: 'data/Channel Partner/Channel Partner/?searchspec=' + KND.Util.condition(option.data) + '&PageSize=2&StartRowNum=0',
      data: {}
    };
  },

  /**
   * 通过交接单id获取订单列表
   * @param option
   */
  queryOrdersById: option => {
    return {
      method: 'get',
      url: 'data/Order Entry (Sales)/Order Entry - Orders/?searchspec=' + KND.Util.condition(option.data) + '&PageSize=100&StartRowNum=0'
    };
  },

  /**
   * 获取订单行
   * @param option
   */
  queryOrderLines: option => {
    return {
      method: 'get',
      url: 'data/Order Entry - Line Items/Order Entry - Line Items/?searchspec=' + KND.Util.condition(option.data) + '&PageSize=100&StartRowNum=0',
      error: data => {
        console.log(data);
      }
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
      method: 'get',
      url: 'data/KL Employee Interface BO/Employee/?searchspec=' + specName + '(' + specPosi.join(' OR ') + ')&' + KND.Util.param(option.paging)
    };
  },

  /**
   * 更新安装交接单状态 已拒绝/已交接
   * @param {Object} option.data 必填 需要更新的实体字段
   * @returns {{method: string, url: string}}
   */
  update: option => {
    return {
      method: 'put',
      url: 'data/Project/Project/'
      // data: {
      //  'Status': '', // 已拒绝/已交接
      //  'Id': '' // 交接单id
      // }
    };
  },

  /**
   * 交接单指派工程师
   * @param {String} option.data.body['Object Id'] 必填 安装交接单Id
   * @param {String} option.data.body['InboxTaskId'] 必填 交接单待办Id
   * @param {String} option.data.body['PositionId'] 必填 选择的安装人员职位Id
   * @param {String} option.data.body['Status'] 必填 当前安装交接单状态
   * @param {String} option.data.body['ProcessName'] 必填 安装交接单指派安装工程师流程
   * @returns {{method: string, url: string, data: object}}
   */
  assign: option => {
    return {
      url: 'service/Workflow Process Manager/RunProcess'
    };
  },

  /**
   * 更新待办 <废弃>
   * @param {String} option.data.body['OwnerInfoId'] 必填 交接单待办Id
   * @returns {{method: string, url: string}}
   */
  deactivateInbox: option => {
    return {
      url: 'service/Universal Inbox/DeactivateInboxOwner'
    };
  },

  /**
   * 交接单驳回
   * @param {String} option.data.body['ProcessName'] 必填 驳回安装交接单
   * @param {String} option.data.body['Object Id'] 必填 安装交接单Id
   */
  reject: option => {
    return {
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'ProcessName': 'KL Contract Delivery Reject Process',
          'Object Id': option.data.id
        }
      }
    };
  },

  /**
   * 关闭安装交接单
   * @param option
   * @returns {{url: string}}
   */
  close: option => {
    return {
      url: ''
    };
  },

  /**
   * 创建订单 <废弃>
   * @param {String} option.data.body['ProcessName'] 固定 KL Install Order Create Process
   * @param {String} option.data.body['Project Id'] 必填 交接单id
   * @param {String} option.data.body['KL Hole Type'] 必填 开孔方式
   * @param {String} option.data.body['KL Delivery Check Box 1'] 必填 是否安装锁体
   * @param {String} option.data.body['KL Delivery Check Box 2'] 必填 是否安装替代锁
   * @returns {{method: string, url: string}}
   */
  saveOrder: option => {
    return {
      url: 'service/Workflow Process Manager/RunProcess'
    };
  },

  /**
   * SIEBEL生成安装订单
   * @param {String} option.data.body['ProcessName'] 固定 KL Project Generate Order Process 安装交接单自动生成订单流程
   * @param {String} option.data.body['Object Id'] 必填 交接单id
   * @returns {{url: string, data: {body: {Object Id: string, ProcessName: string}}}}
   */
  generateOrder: option => {
    let id = option.data['Object Id'];
    delete option.data;
    return {
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'ProcessName': 'KL Project Generate Order Process', // 安装交接单自动生成订单流程
          'Object Id': id // 安装交接单Id
        }
      }
    };
  },

  /**
   * 修改订单
   * @param {Object} option.data 必填 需要修改的键值对对象
   * @returns {{url: string}}
   */
  updateOrder: option => {
    return {
      method: 'put',
      url: 'data/Order Entry (Sales)/Order Entry - Orders'
    };
  },

  /**
   * 查询安装订单详情（包括订单头、行项目、安装任务）
   * @param {String} option.data.body['OutputIntObjectName'] 必填 固定 Base Order Entry (Sales)
   * @param {String} option.data.body['SearchSpec'] 必填 查询条件 [Order Entry - Orders.Id]='1-2BSAS9OT'
   * @returns {{method: string, url: string}}
   */
  getOrder: option => {
    return {
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        body: {
          OutputIntObjectName: 'Base Order Entry (Sales)',
          SearchSpec: ''
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
   * 转发门厂技术 & 提交订单
   * @param {String} option.data.body['ProcessName'] 必填 操作流程 转发门厂 KL Install Order Transfer Process / 提交订单 KL Product Model No
   * @param {String} option.data.body['Object Id'] 必填 订单id
   * @returns {{method: string, url: string}}
   */
  runProcess: option => {
    return {
      method: 'post',
      url: 'service/Workflow Process Manager/RunProcess'
    };
  },

  /**
   * 删除订单
   * @param {String} option.data.id 必填 订单id
   */
  deleteOrder: option => {
    return {
      method: 'delete',
      url: 'data/Order Entry (Sales)/Order Entry - Orders/' + option.data.id
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
    api.success(data[api.key]);
  }
};

const get = option => {
  ajax(Object.extend(true, option, apiList[option.key](option)));
};

export default {
  get
};
