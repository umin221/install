let ApiList = {
  getList: option => {
    option.data.team = option.data.team ? 'Manager' : 'Personal';
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': {
          'OutputIntObjectName': 'Base Order Entry',
          'SearchSpec': '[Order Entry - Orders.Order Type]= "服务订单"',
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
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': {
          'OutputIntObjectName': 'Base Order Entry',
          'SearchSpec': '[Order Entry - Orders.Order Number] ~LIKE "*' + option.data.orNumber + '*" OR [Order Entry - Orders.KL Primary Owner] ~LIKE "*' + option.data.orNumber + '*"',
          'StartRowNum': option.paging.StartRowNum,
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
