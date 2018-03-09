let apiList = {
  // 委外列表
  getPartners: option => {
    let name = option.data.Name;
    let spec = '';
    if (name) {
      spec = '[Name] LIKE \'' + name + '*\'';
      delete option.data.Name;
    }
    return {
      url: 'data/Channel Partner/Channel Partner/?searchspec=' + spec + KND.Util.condition(option.data) + '&' + KND.Util.param(option.paging)
    };
  },

  // 获取委外列表 只获取团队内的
  queryPartners: option => {
    let name = option.data.Name;
    let spec = '';
    if (name) {
      spec = '[Channel Partner.Name] LIKE \'' + name + '*\'';
      delete option.data.Name;
    };
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': {
          'OutputIntObjectName': 'KL Channel Partner',
          'SearchSpec': spec + KND.Util.condition(option.data, 'Channel Partner'),
          'ViewMode': 'Sales Rep',
          'StartRowNum': option.paging.StartRowNum,
          'PageSize': option.paging.PageSize
        }
      }
    };
  },

  // id 查找委外详情
  findPartnerById: option => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query/?OutputIntObjectName=Base Channel Partner&PrimaryRowId=' + option.data.id,
      data: {}
    };
  },

  // 查找委外详情
  findPartner: option => {
    return {
      url: 'data/Channel Partner/Channel Partner/?searchspec=' + KND.Util.condition(option.data) + '&PageSize=2&StartRowNum=0',
      data: {}
    };
  },

  // 添加委外团队
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

  // 更新团队状态
  update: option => {
    return {
      method: 'put',
      url: 'data/Channel Partner/Channel Partner/'
    };
  },

  // 创建&更新联系人
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

  findContact: (option) => {
    return {
      url: 'data/Base User/Base User/?searchspec=' + KND.Util.condition(option.data) + '&PageSize=2&StartRowNum=0'
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
  ajax(Object.extend(true, option, apiList[option.key](option)));
};

export default {
  get
};
