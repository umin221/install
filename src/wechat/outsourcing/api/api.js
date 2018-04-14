let apiList = {
  /**
   * 查询 或 搜索 委外厂商劣列表
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
    let name = option.data.Name;
    let arr = [];
    if (name) {
      arr.push('[Channel Partner.Name] LIKE "*' + name + '*"');
      delete option.data.Name;
    };
    let spec = KND.Util.condition(option.data, 'Channel Partner');
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
      url: 'data/Channel Partner/Channel Partner/?searchspec=' + KND.Util.condition(option.data) + '&PageSize=2&StartRowNum=0',
      data: {}
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
    let partner = option.data.partner;
    partner['ListOfCUT Address'] = {
      'CUT Address': partner['CUT Address']
    };
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
   * 更新委外厂商信息
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
