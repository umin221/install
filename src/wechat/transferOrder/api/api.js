let apiList = {
  // 交接单列表
  getTransferOrder: option => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base Project',
          'ViewMode': 'Sales Rep',
          'SearchSpec': KND.Util.condition(option.data, 'Project', ' OR ', ' LIKE '), // '[Project.Status]="' + option.data.Status + '"',
          'StartRowNum': option.paging.StartRowNum,
          'PageSize': option.paging.PageSize
        }
      }
    };
  },

  // id 查找交接单详情
  findTransferOrderById: option => {
    return {
      method: 'post',
      url: 'data/Project/Project/' + option.data.id,
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

  // 查找所有产品安装工程师&主管
  findContact: (option) => {
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
      specName += '[Last Name] LIKE "' + name + '*" AND ';
    };
    return {
      url: 'data/KL Employee Interface BO/Employee/?searchspec=' + specName + specPosi.join(' OR ') + '&' + KND.Util.param(option.paging)
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
