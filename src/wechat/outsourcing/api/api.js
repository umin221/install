let apiList = {
  /**
   * 查询 或 搜索 委外厂商列表
   * @param {String} option.data['Name'] 选填 厂商名称
   * @param {Object} option.data 选填 查询条件
   * @param {Object} option.paging 必填 翻页参数
   * @returns {{method: string, url: string}}
   */
  getPartners: option => {
    let name = option.data.Name;
    let arr = [];
    if (name) {
      arr.push('[Name] LIKE "*' + name + '*"');
      delete option.data.Name;
    };
    let spec = KND.Util.condition(option.data);
    if (spec) arr.push(spec);
    return {
      url: 'data/Channel Partner/Channel Partner/?searchspec=' + arr.join(' AND ') + '&' + KND.Util.param(option.paging)
    };
  },

  /**
   * 获取委外列表 只获取团队内的
   * @param {String} option.data['Name'] 选填 厂商名称
   * @param {Object} option.data 选填 查询条件
   * @param {Object} option.paging 必填 翻页参数
   * @returns {{method: string, url: string}}
   */
  queryPartners: option => {
    let condition = option.data;
    let name = condition.Name;
    let status = condition['KL Partner Status'];
    // 只查询委外厂商
    let arr = ['[Channel Partner.KL Partner Type] = "Outsourcing Manufacturer"'];
    if (name) {
      // 搜索界面按名字搜索
      arr.push('[Channel Partner.Name] LIKE "*' + name + '*"');
      delete condition.Name;
    };
    // 多状态处理
    if (status) condition['KL Partner Status'] = status.split(',');
    let spec = KND.Util.condition2D(condition, 'Channel Partner', ' OR ');
    if (spec) arr.push(spec);

    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': {
          'OutputIntObjectName': 'KL Channel Partner',
          'SearchSpec': arr.join(' AND '),
          'ViewMode': 'Sales Rep',
          'StartRowNum': option.paging.StartRowNum,
          'PageSize': option.paging.PageSize
        }
      }
    };
  },

  /**
   * 通过委外厂商id查找厂商详情
   * @param {String} option.data['id'] 必填 厂商id
   * @returns {{method: string, url: string}}
   */
  findPartnerById: option => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query/?OutputIntObjectName=Base Channel Partner&PrimaryRowId=' + option.data.id,
      data: {}
    };
  },

  /**
   * 查找委外详情
   * @param {String} option.data 必填 厂商查询条件
   * @returns {{method: string, url: string}}
   */
  findPartner: option => {
    return {
      method: 'get',
      url: 'data/Channel Partner/Channel Partner/?searchspec=' + KND.Util.condition(option.data) + '&PageSize=2&StartRowNum=0'
    };
  },

  /**
   * 添加委外团队 <废弃>
   * @param {Object} option.data[partner] 必填 委外厂商信息 键值对
   * @returns {{method: string, url: string}}
   */
  addPartner: option => {
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

  /**
   * 提交委外团队
   * @param {Object} option.data[partner] 必填 委外厂商信息 键值对
   * @returns {{method: string, url: string}}
   */
  submitPartner: option => {
    let partner = option.data;
//    负责人
//    let primary = option.primary;
//    协作团队，编辑时包含，创建人，负责人，安装支持专员
//    let partnerPosition = KND.Util.toArray(partner['Channel Partner_Position']);
//    协作团队
//    let arr = [];
//    默认类型
    partner['KL Partner Type'] = '委外厂商';
//    省市区地址
    partner['ListOfCUT Address'] = {
      'CUT Address': partner['CUT Address']
    };

//    添加负责人
//    if (primary) {
//      arr.push({
//        'Position Id': primary['Primary Position Id'],
//        'IsPrimaryMVG': 'Y'
//      });
//    编辑时包含，创建人，负责人，安装支持专员；添加除负责人以外的人员
//      for (let i in partnerPosition) {
//        let pos = partnerPosition[i];
//        if (pos.IsPrimaryMVG === 'N') {
//          arr.push({
//            'Position Id': pos['Position Id'],
//            'IsPrimaryMVG': 'N'
//          });
//        }
//      };
//      更新协作团队
//      partner['ListOfChannel Partner_Position'] = {
//        'Channel Partner_Position': arr
//      };
//    };

//    delete partner['CUT Address'];
    delete partner['User'];
    delete partner['Channel Partner_Position'];

    return {
      method: 'post',
      url: 'service/Workflow Process Manager/RunProcess/',
      data: {
        'body': {
          'ProcessName': 'KL Channel Partner Upsert Process',
          'SiebelMessage': {
            'MessageId': '',
            'MessageType': 'Integration Object',
            'IntObjectName': 'Base Channel Partner',
            'IntObjectFormat': 'Siebel Hierarchical',
            'ListOfBase Channel Partner': {
              'Channel Partner': partner
            }
          }
        }
      }
    };
  },

  /**
   * 更新委外厂商信息 <废弃>
   * @param {Object} option.data 必填 委外厂商信息 键值对
   * @returns {{method: string, url: string}}
   */
  update: option => {
    return {
      method: 'put',
      url: 'data/Channel Partner/Channel Partner/'
    };
  },

  /**
   * 更新委外厂商信息
   * @param {Object} option.data 必填 委外厂商信息 键值对
   * @returns {{method: string, url: string}}
   */
  updateSyn: option => {
    let partner = option.data;
    // 更新地址
    if (partner['CUT Address']) {
      partner['ListOfCUT Address'] = {
        'CUT Address': partner['CUT Address']
      };
      delete option.data['CUT Address'];
    }
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Synchronize',
      data: {
        'body': {
          'ProcessName': 'KL Channel Partner Upsert Process',
          'SiebelMessage': {
            'MessageId': '',
            'MessageType': 'Integration Object',
            'IntObjectName': 'Base Channel Partner',
            'IntObjectFormat': 'Siebel Hierarchical',
            'ListOfBase Channel Partner': {
              'Channel Partner': partner
            }
          }
        }
      }
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

  /**
   * 查询联系人
   * @param {Object} option.data 必填 联系人查询条件 键值对
   * @returns {{method: string, url: string}}
   */
  findContact: option => {
    return {
      method: 'get',
      url: 'data/KL User/User/?searchspec=' + KND.Util.condition(option.data) + '&PageSize=2&StartRowNum=0'
    };
  },

  /**
   * 委外保存附件
   * @param {Object} option.data['MediaId'] 必填 腾讯附件id
   * @param {Object} option.data['Object Id'] 必填 业务主键id
   * @returns {{method: string, url: string}}
   */
  pushMedia: option => {
    return {
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'ProcessName': 'KL Attachment Upload Process',
          'Type': 'Partner',
          'MediaId': option.data.mediaId,
          'Object Id': option.data.id
        }
      }
    };
  },

  /**
   * 获取审批记录
   * @param {Object} option.data['MediaId'] 必填 腾讯附件id
   * @param {Object} option.data['Object Id'] 必填 业务主键id
   * @returns {{method: string, url: string}}
   */
  queryApprovalList: option => {
    return {
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base UInbox Item History',
          'SearchSpec': `[UInbox Item.Item Object Id]="${option.data.id}"`
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
      specName += '[Last Name] ~LIKE "' + name + '*" AND ';
    };
    return {
      method: 'get',
      url: 'data/KL Employee Interface BO/Employee/?searchspec=' + specName + '(' + specPosi.join(' OR ') + ')&' + KND.Util.param(option.paging)
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
