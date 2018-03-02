let apiList = {
  // 委外列表
  getPartners: (option) => {
    return {
      url: 'data/Channel Partner/Channel Partner/?searchspec=[KL Partner Status] = "' + option.data.status + '"&PageSize=10&StartRowNum=0'
    };
  },

  // 委外详情
  findPartner: (option) => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query/?OutputIntObjectName=Base Channel Partner&PrimaryRowId=' + option.data.id,
      data: {}
    };
  },

  // 添加委外团队
  addPartner: (option) => {
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
  }
};

let ajax = (api) => {
  if (config.online) {
    KND.Native.ajax(api);
  } else {
    let data = require('./data.json');
    api.success(data[api.key]);
  }
};

const get = (option) => {
  ajax(Object.assign(option, apiList[option.key](option)));
};

export default {
  get
};
