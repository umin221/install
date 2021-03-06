let apiList = {
  /**
   * 交接单列表&搜索
   * @param {String} option.data.ViewMode 必填 视图
   * @param {Object} option.data 必填 其他查询条件
   * @param {Object} option.paging 必填 翻页参数
   * @returns {{method: string, url: string, data: {body: {OutputIntObjectName: string, ViewMode: string, SearchSpec: *, StartRowNum: (*|string), PageSize: (*|string|PAGESIZE)}}}}
   */
  getList: option => {
    let condition = Object.assign({}, option.data);
    // 状态条件
    var status = condition.Status || '';
    var viewMode = condition.ViewMode;
    var searchSpec = '';
    delete option.data.Status;
    // 状态多匹配 逗号分隔
    if (status) {
      searchSpec = '(' + KND.Util.condition2D({Status: status.split(',')}, 'Order Entry - Orders', ' OR ', '=') + ')';
    };
    // 运算符
    return {
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': {
          'OutputIntObjectName': 'Base Order Entry',
          'ViewMode': viewMode,
          'SearchSpec': searchSpec + ' AND [Order Entry - Orders.Order Type] = LookupValue("FS_ORDER_TYPE", "Sparts Picking")',
          'StartRowNum': option.paging.StartRowNum,
          'PageSize': option.paging.PageSize
        }
      }
    };
  },
  getProduct: option => {
    // let model = '';
    // model = 'AND [Product.KL Translated Name] ~LIKE "*' + option.data.val + '*"';
    let oneCatalog = '';
    if (option.data.val === '1') {
      oneCatalog = 'AND [Catalog Category.Sequence Number] = "1"';
    } else {
      oneCatalog = 'AND [Catalog Category.Sequence Number] = "' + option.data.val + '" AND [Catalog Category.Parent Category Id] = "' + option.data.ParentId + '"';
    }
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base Catalog Category (Content Management)',
          'SearchSpec': '[Catalog Category.Private Flag] = "Y" AND [Product.Price List Id]= "' + option.data.id + '"' + oneCatalog,
          'ViewMode': 'Group'
        }
      }
    };
    // 产品目录
  },
  // 搜索
  getSearchProduct: option => {
    // let condition = Object.assign({}, option.data);
    let model = '';
    if (option.data) {
      model += ' AND ([Product.Name] ~LIKE "*' + option.data.name + '*" OR [Product.KL Translated Description] ~LIKE "*' + option.data.name + '*")';
      // model += KND.Util.condition2D(condition, 'Catalog Category', ' OR ', ' ~LIKE ');
     // model = 'AND ([Product.Name] ~LIKE "*' + option.data.val + '*" OR [Product.KL Product Model No] ~LIKE "*' + option.data.val + '*" OR [Product.KL Translated Name] ~LIKE "*' + option.data.val + '*")';
    }
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base Catalog Category (Content Management)',
          'SearchSpec': '[Catalog Category.Private Flag] = "Y" AND [Product.Price List Id]= "' + option.data.id + '"' + model,
          'ViewMode': 'Group'
        }
      }
    };
  },
/*  getProduct: option => {
    // let model = 'AND ([Product.Name] ~LIKE "*' + option.data.val + '*" OR [Product.KL Translated Description] ~LIKE "*' + option.data.val + '*" OR [Product.KL Translated Name] ~LIKE "*' + option.data.val + '*")';
    let id = option.data.id;
    delete option.data.id;
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base Catalog Category (Content Management)',
          'SearchSpec': '[Catalog Category.Private Flag] = "Y" AND [Product.Price List Id]= "' + id + '"',
          'ViewMode': 'Group'
        }
      }
    };
    // 产品目录
  },*/
  getPrice: option => {
    return {
      method: 'get',
      url: 'data/Price List/Price List/?searchspec=KL Default Flag="Y"'
    };
    // 产品价格
  },
  getinstall: option => {
    let positionId = option.data.id;
    let status = ' AND ([Order Entry - Orders.Status]="In Installing" OR [Order Entry - Orders.Status]="Sales Confirmed")';
    let searchId = '[Order Entry - Orders.Primary Position Id]="' + positionId + '"';
    let searchName = '';
    let SearchSpec = '';
    if (option.data.name) {
      searchName = ' AND [Order Entry - Orders.KL Agreement Opportunity Name] ~LIKE "*' + option.data.name + '*"';
      SearchSpec = searchId + searchName + status;
    } else {
      SearchSpec = searchId + status;
    }
    delete option.data.id;
    delete option.data.name;
    return {
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          OutputIntObjectName: 'KL Install Order Header',
          SearchSpec: SearchSpec
        }
      }
    };
    // 产品价格
  },
  deleteLine: option => {
    return {
      method: 'DELETE',
      url: 'data/Order Entry/Order Entry - Orders/' + option.data.obj.headerId + '/Order Entry - Line Items/' + option.data.obj.lineId,
      data: {
        'body': {}
      }
    };
  },
  addServiceOrder: option => {
    let data = {
      'Id': option.data.form.Id,
      'Order Type': '备件领料',
      'Description': option.data.form.Description,
      'ListOfOrderEntry-LineItems': {
        'Order Entry - Line Items': option.data.form.lineItems
      }
    };
    if (option.data.form.installId) {
      data['KL Install Order Id'] = option.data.form.installId;
      data['KL Install Order Opty Name'] = option.data.form.installName;
    }
    delete option.data.form;
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Upsert',
      data: {
        'body': {
          'SiebelMessage': {
            'MessageId': '',
            'MessageType': 'Integration Object',
            'IntObjectName': 'Base Order Entry',
            'IntObjectFormat': 'Siebel Hierarchical',
            'ListOfBase Order Entry': {
              'Order Entry - Orders': data
            }
          }
        }
      }
    };
  },
  toApproval: option => {
    let id = option.data.id;
    delete option.data.id;
    return {
      method: 'POST',
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'Object Id': id, // 领料订单Id
          'ProcessName': 'KL Sparts Order Submit Process'  // Workflow名字
        }
      }
    };
  },
  getOrderEntry: option => {
    let id = option.data.id;
    delete option.data.id;
    return {
      method: 'POST',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base Order Entry',
          'SearchSpec': '[Order Entry - Orders.Id] = "' + id + '"'
        }
      }
    };
  },
  getApproval: option => {
    return {
      url: 'service/EAI Siebel Adapter/Query'
    };
  },
  setApproval: option => { // 审批操作
    return {
      url: 'service/Workflow Process Manager/RunProcess'
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
  ajax(Object.extend(true, option, apiList[option.key](option)));
};

export default {
  get
};
