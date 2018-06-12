let ApiList = {
  getList: option => {
    option.data.team = option.data.team ? 'Manager' : 'Sales Rep';
    var searchSpec = [];

    var data = option.data;
    // 状态条件
    var status = data.Status || '';
    // 订单状态过滤
    if (status) {
      searchSpec.push('(' + KND.Util.condition2D({Status: data.Status.split(',')}, 'Order Entry - Orders', ' OR ', '=') + ')');
    }
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': {
          'OutputIntObjectName': 'Base Order Entry',
          'SearchSpec': '[Order Entry - Orders.Order Type LIC]= "Service Order" AND ' + searchSpec,
          'ViewMode': option.data.team,
          'StartRowNum': option.paging.StartRowNum,
          'PageSize': option.paging.PageSize
        }
      }
    };
    //  查询服务订单列表
  },
  getDetail: option => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base Order Entry',
          'SearchSpec': '[Order Entry - Orders.Order Number]= "' + option.data.orNumber + '"'
        }
      }
    };
    // 详情
  },
  getSearchList: option => {
    option.data.team = option.data.obj.team ? 'Manager' : 'Sales Rep';
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': {
          'OutputIntObjectName': 'Base Order Entry',
          'SearchSpec': '[Order Entry - Orders.Order Type LIC]= "Service Order" AND [Order Entry - Orders.Order Number] ~LIKE "*' + option.data.obj.orNumber + '*" OR [Order Entry - Orders.KL Primary Owner] ~LIKE "*' + option.data.obj.orNumber + '*"',
          'StartRowNum': option.paging.StartRowNum,
          'ViewMode': option.data.team,
          'PageSize': option.paging.PageSize
        }
      }
    };
    // 详情
  }
};

let ajax = api => {
  if (config.online) {
    KND.Native.ajax(api);
  } else {
  }
};

const get = option => {
  ajax(Object.assign(option, ApiList[option.key](option)));
};

export default {
  get
};
