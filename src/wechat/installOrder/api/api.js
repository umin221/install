let apiList = {
  getLov: option => {
    option.data.parent = option.data.parent ? 'Parent Value = "' + option.data.parent + '"' : 'Parent is null';
    return {
      method: 'get',
      url: 'data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type= "' + option.data.type + '" AND ' + option.data.parent + ' &PageSize=100&StartRowNum=0'
    };
  },
  /* getList: {
    url: 'service/EAI Siebel Adapter/QueryPage'
    // 列表
  },*/
  getList: option => {

    var data = option.data;
    var boby = {
      'OutputIntObjectName': 'KL Install Order Header',
      // 'OutputIntObjectName': 'KL Install Order',
      'StartRowNum': option.paging.StartRowNum,
      'PageSize': option.paging.PageSize
    };
//    默认获取非草稿订单，类型为安装订单
    var searchSpec = ['[Order Entry - Orders.Order Type]="Install Order"'];
    // 状态条件
    var status = data.Status || '';
    // 搜索条件
    var search = data.search || '';
//    用户职位
    var position = data.infoUser['KL Primary Position Type LIC'];
//    是否查看团队
    var isTeam = data.isTeam;
    // 所有人都不看草稿
//    门厂技术安装员
    if (position === 'Door Factory Engineer' || position === 'Door Factory Manager') {
      boby.ViewMode = 'Sales Rep';
//      安装主管(我的安装订单) 安装工程师(我的安装订单) 部长
    } else if ((position === 'Field Service Manager' || position === 'Field Service Engineer' || position === 'FS Department Manager') && !isTeam) {
      var id = data.infoUser['Id'];
      var pid = data.infoUser['Primary Position Id'];
      // 查询负责人是自己的订单 或者 门厂负责人是自己的订单
      searchSpec.push(`([Order Entry - Orders.Primary Position Id]='${pid}' OR [Order Entry - Orders.KL Delivery Partner Owner Id]='${id}')`);
//      searchSpec.push('[Order Entry - Orders.Status]<>"In Confirming"');
    }
//    isTeam 等于true 安装主管、门厂技术主管 我的团队
    if (isTeam) {
      boby.ViewMode = 'Manager';
    }
    // 订单状态过滤
    if (status) {
      searchSpec.push(KND.Util.condition2D({Status: data.Status.split(',')}, 'Order Entry - Orders', ' OR ', '='));
    } else {
      let status = ['Draft', 'Rejected', 'Door Factory Return'];
      searchSpec.push(KND.Util.condition2D({Status: status}, 'Order Entry - Orders', ' AND ', '<>'));
    }
    // 订单搜索条件过滤
    if (search) {
      searchSpec.push(KND.Util.condition2D(search, 'Order Entry - Orders', ' OR ', ' LIKE '));
    }
    boby.SearchSpec = searchSpec.join(' AND ');
    return {
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': boby
      }
    };
  },
  deletePlan: option => {
    return {
      method: 'delete',
      url: 'data/KL Installation Task Detail Plan/KL Installation Task Detail Plan/' + option.data.id
    };
  },
  getJournal: option => {
    return {
      url: 'service/EAI Siebel Adapter/QueryPage'
    };
  },
  getDetail: option => { // 详情
    return {
      url: 'service/EAI Siebel Adapter/Query'
    };
  },
  /*
  * 获取经纬度
  */
  getLatLong: option => {
    return {
      url: 'service/EAI Siebel Adapter/Query'
    };
  },
  /*
  * 打卡提交
  */
  setPunchClock: option => {
    return {
      url: 'data/KL Order Employee Clock/KL Order Employee Clock/'
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
   * 合作伙伴
   * */
  findCompany: option => {
    let name = option.data['Last Name'];
    let specName = '';
    // 名字过滤
    if (name) {
      specName += '[Channel Partner.Name] ~LIKE ' + "'" + name + '*' + "'" + ' AND ';
    };
    return {
      method: 'POST',
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': {
          'OutputIntObjectName': 'KL Channel Partner',
          'SearchSpec': specName + '[Channel Partner.KL Partner Status]=LookupValue(\'ORG_STATUS\',\'Active\') AND [Channel Partner.KL Partner Type]=LookupValue(\'KL_PARTNER_TYPE\',\'Outsourcing Manufacturer\')',
          'ViewMode': 'All',
          'StartRowNum': option.paging.StartRowNum,
          'PageSize': option.paging.PageSize
        }
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
      specName += '[Last Name] ~LIKE "' + name + '*" OR ([KL Parent Service Region Name] ~LIKE "' + name + '*" OR [Service Region] ~LIKE "' + name + '*") AND';
    };
    return {
      method: 'get',
      url: 'data/KL Employee Interface BO/Employee/?searchspec=' + specName + '(' + specPosi.join(' OR ') + ')&' + KND.Util.param(option.paging)
    };
  },
  /**
   * 查找委外安装员
   * @param {String} option.data.position 必填 职位
   * @param {String} option.data['Last Name'] 选填 用户名字 模糊查询
   * @param {Object} option.paging 必填 翻页参数
   * @returns {{url: string}}
   */
  findInstaller: option => {
    let companyId = option.data['companyId'];
    let name = option.data['Last Name'];
    let specName = '';
    // 名字过滤
    if (name) {
      specName += '[User.Last Name] ~LIKE ' + "'" + name + '*' + "'" + ' AND ';
    };
    return {
      method: 'POST',
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': {
          'OutputIntObjectName': 'Base Channel Partner',
          'SearchSpec': specName + '[Channel Partner.Id]=' + "'" + companyId + "'" + ' AND [User.User Type]=LookupValue(\'CONTACT_USER_TYPE\',\'Outsourcing Worker\')',
          // 'SearchSpec': specName + '[Channel Partner.Id]=\'1-2BSAS0OA\' AND [User.User Type]=LookupValue(\'CONTACT_USER_TYPE\',\'Outsourcing Worker\')',
          'ViewMode': 'All',
          'StartRowNum': option.paging.StartRowNum,
          'PageSize': option.paging.PageSize
        }
      }
    };
  },
  /*
  * 协同团队修改负责人
  * */
  upPerson: option => {
    return {
      url: 'service/Workflow Process Manager/RunProcess'
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
  getInstaller: option => { // 获取批次详情联系人
    return {
      url: 'service/EAI Siebel Adapter/Query'
    };
  },
  /**
   * getSearch 查询联系人信息
   * option.data.val 电话号码
   * */
  getSearch: option => {
    return {
      method: 'get',
      url: 'data/KL Contact Interface BO/Contact/?searchspec = [User Type]<>LookupValue("CONTACT_USER_TYPE", "Sales") AND ([Work Phone %23] ~LIKE "' + option.data.val + '*" OR [Cellular Phone %23] ~LIKE "' + option.data.val + '*") &PageSize=10&StartRowNum=0'
      // url: 'data/KL Contact Interface BO/Contact/?searchspec=[Work Phone %23] ~LIKE "' + option.data.val + '*" AND [User Type]<>LookupValue("CONTACT_USER_TYPE", "Sales") &PageSize=10&StartRowNum=0'
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
  setApproval: option => { // 审批操作
    return {
      url: 'service/Workflow Process Manager/RunProcess'
    };
  },
  /*
  * 打开记录
  * */
  getClock: option => {
    return {
      // url: 'data/KL Order Employee Clock/KL Order Employee Clock/?searchspec=[Parent Row Id] = \'1-2BSBJVLW\''
      url: 'data/KL Order Employee Clock/KL Order Employee Clock/?searchspec=[Parent Row Id] = ' + "'" + option.data.id + "'"
    };
  },
  /*
  * 审批列表数据
  * */
  getApproval: option => {
    return {
      url: 'service/EAI Siebel Adapter/Query'
    };
  },
  /**
   * 查询联系人
   * @param {Object} option.data 必填 联系人查询条件 键值对
   * @returns {{method: string, url: string}}
   */
  findContact: option => {
    return {
      method: 'get',
      url: 'data/KL User/User/?searchspec=' + KND.Util.condition(option.data) + '&PageSize=100&StartRowNum=0'
    };
  },
  /**
   * 创建 或 更新联系人
   * @param {Object} option.data['partner'] 必填 委外厂商信息 键值对
   * @returns {{method: string, url: string}}
   */
  upsertContact: option => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Upsert',
      data: {
        'body': {
          'SiebelMessage': {
            'MessageId': '',
            'MessageType': 'Integration Object',
            'IntObjectName': 'Base Channel Partner',
            'IntObjectFormat': 'Siebel Hierarchical',
            'ListOfBase Channel Partner': {
              'Channel Partner': option.data.partner
            }
          }
        }
      }
    };
  },
  selIntaller: option => { // 选择委外安装员保存
    return {
      url: 'service/EAI Siebel Adapter/Synchronize'
    };
  },
  /*
  * 真锁初始化楼栋
  * */
  setBuild: option => {
    return {
      url: 'service/Workflow Process Manager/RunProcess/'
    };
  },
  /**
   * 真锁零星安装删除
   * @param option
   * @param {String} option.data.id 房间ID
   * @returns {{url: string, data: {}}}
   */
  setDelete: option => {
    return {
      url: 'data/KL Install Order Asset/KL Install Order Asset/' + option.data.id,
      // url: 'data/KL Install Order Asset/Base KL Install Order Asset/' + option.data.id,
      data: {}
    };
  },
  /*
  * 获取零星房屋信息
  * */
  getSporadic: option => {
    /* return {
      method: 'get',
      url: 'data/KL Install Order Asset/KL Install Order Asset/?searchspec=[KL Activity Id]=' + "'" + option.data.id + "'" + '&PageSize=100&StartRowNum=0',
      data: {}
    };*/
    return {
      url: 'service/EAI Siebel Adapter/QueryPage'
    };
  },
  /*
  * 零星扫码新增后更新条形码
  * */
  getUPNumber: option => {
    return {
      url: 'data/KL Install Order Asset/KL Install Order Asset/'
    };
  },
  /*
  * 真锁移交工程类更新
  * */
  setUpyj: option => { // 更新提交
    return {
      url: 'service/Workflow Process Manager/RunProcess'
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
  },

  /**
   * 门厂技术退回订单到安装工程师
   * @param {String} option.data.id 必填 订单id
   * @returns {{url: string}}
   */
  rollback: option => {
    return {
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'ProcessName': 'KL Install Order Door Factory Return To Install Engineer Process',
          'Object Id': option.data.id
        }
      }
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
