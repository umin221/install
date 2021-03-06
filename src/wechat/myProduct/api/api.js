let ApiList = {
  getList: option => {
    let condition = Object.assign({}, option.data);
    let status = condition.Status;
    let viewMode = condition.ViewMode;
    delete condition.ViewMode;
    let operator = option.data.Status ? ' = ' : ' ~LIKE ';
    let SearchSpec = '';
    if (status) {
      condition['Status'] = status.split(',');
    };
    if (status) {
      SearchSpec = '[KL FS Invloc Product.KL Inventory Product Status]=LookupValue("KL_PROD_STATUS", "' + status + '")';
    } else {
      SearchSpec = KND.Util.condition2D(condition, 'KL FS Invloc Product', ' OR ', operator);
    }
    SearchSpec += ' AND [KL FS Invloc Product.KL Inventory Qty]>0';
    return {
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': {
          'OutputIntObjectName': 'Base KL FS InvLoc Product',
          'ViewMode': viewMode,
          'SearchSpec': SearchSpec, // 配件
          'StartRowNum': option.paging.StartRowNum,
          'PageSize': option.paging.PageSize
        }
      }
    };
  },
  getDetail: option => {
    console.log(option.data);
    let searchspec = option.data.Status + '= "' + option.data.InvID + '" AND Product ID = "' + option.data.ProductId + '"';
    delete option.data;
    return {
      method: 'GET',
      url: 'data/FS Inventory Transaction/FS Inventory Transaction/?searchspec=' + searchspec + '&PageSize= ' + option.paging.PageSize + '&StartRowNum=' + option.paging.StartRowNum
    };
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
