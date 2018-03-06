let apiList = {
  // 交接单列表
  getTransferOrder1: option => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'OutputIntObjectName': 'KL Project',
        'SearchSpec': '[Project.Setter Id]="1-SF7863"'
      }
    };
  },

  getTransferOrder: option => {
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

  // id 查找交接单详情
  findTransferOrderById: option => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query/?OutputIntObjectName=Base Channel Partner&PrimaryRowId=' + option.data.id,
      data: {}
    };
  },

  // 查找交接单详情
  findTransferOrder: option => {
    return {
      url: 'data/Channel Partner/Channel Partner/?searchspec=' + KND.Util.condition(option.data) + '&PageSize=2&StartRowNum=0',
      data: {}
    };
  },

  // 添加交接单团队
  addTransferOrder: option => {
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
    api.success(data[api.key]);
  }
};

const get = option => {
  ajax(Object.assign(option, apiList[option.key](option)));
};

export default {
  get
};
