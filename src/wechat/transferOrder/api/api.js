let apiList = {
  // 交接单列表&搜索
  getTransferOrder: option => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': {
          'OutputIntObjectName': 'Base Project',
          'ViewMode': 'Sales Rep',
          'SearchSpec': KND.Util.condition(option.data, 'Project', ' OR ', ' ~LIKE '), // '[Project.Status]="' + option.data.Status + '"',
          'StartRowNum': option.paging.StartRowNum,
          'PageSize': option.paging.PageSize
        }
      }
    };
  },

  // id 查找交接单详情
  findTransferOrderById: option => {
    return {
      method: 'get',
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

  // 查找所有产品安装工程师&主管 搜索&获取列表
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

  // 更新安装交接单状态 已拒绝/已交接
  update: option => {
    return {
      method: 'put',
      url: 'data/Project/Project/'
      // data: {
      //  'Status': '', // 已拒绝/已交接
      //  'Id': ''
      // }
    };
  },

  // 关闭安装交接单
  close: option => {
    return {
      url: ''
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
