let apiList = {
  // 委外列表
  getPartners: option => {
    return {
      url: 'data/Channel Partner/Channel Partner/?searchspec=[KL Partner Status]="' + option.data.status + '&' + KND.Util.param(option.paging)
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

  findContact: () => {
    return {
      url: 'service/EAI Siebel Adapter/Upsert'
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
  ajax(Object.assign(option, apiList[option.key](option)));
};

export default {
  get
};
