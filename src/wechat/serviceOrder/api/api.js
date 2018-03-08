let ApiList = {
  getList: option => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base KL Service Request Interface BO',
          'SearchSpec': '[Service Request.Owner]= "' + option.data.status + '"'
        }
      }
    };
  },

  getDetail: option => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base KL Service Request Interface BO',
          'SearchSpec': '[Service Request.SR Number]= "' + option.data.srNumber + '"'
        }
      }
    };
  },
  setStatus: option => {
    return {
      method: 'post',
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'Object Id': option.data.obj['Object Id'],
          'ActivityId': option.data.obj['ActivityId'],
          'inStatus': option.data.obj['inStatus'],
          'ProcessName': 'KL SR Action Status Change Process'
        }
      }
    };
  },
  getClose: option => {
    return {
      url: 'data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type="FIN_NO_SALE_REASON"'
    };
  },
  getRunProcess: option => {
    return {
      method: 'post',
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'Object Id': option.data.obj.srId, // 服务请求Id
          'ActivityId': option.data.obj.actionId, // 派工单Id
          'inStatus': 'Close', // 关闭
          'NoSalesReason': option.data.obj.closeMsg, // 关闭原因
          'ProcessName': 'KL SR Action Status Change Process' // 派工单状态改变逻辑WF
        }
      }
    };
  },
  getSearch: option => {
    return {
      url: 'data/KL Contact Interface BO/Contact/?*searchspec=[Cellular Phone %23] = "' + option.data.val + '"'
    };
  },
  getLov: option => {
    console.log(option);
    return {
      url: 'data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type="' + option.data.val.values + '"' + option.data.val.parent + ' &PageSize=100&StartRowNum=0'
    };
  },
  getParentLov: option => {
    return {
      url: 'data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type="' + option.data.val.type + '" AND Parent Value="' + option.data.val.values[0] + '" &PageSize=100&StartRowNum=0'
    };
  },
  getAsset: option => {
    console.log(option);
    return {
      url: 'data/KL Asset Interface BO/Asset Mgmt - Asset/?searchspec=[Serial Number] = "' + option.data.num + '"'
    };
  },
  getLov1: option => {
    return {
      url: 'data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type= "SR_AREA" AND Parent is null &PageSize=100&StartRowNum=0'
    };
  },
  getParentLov1: option => {
    return {
      url: 'data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type="SR_AREA" AND Parent Value="' + option.data.val + '" &PageSize=100&StartRowNum=0'
    };
  },
  getProduct: option => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base Catalog Category (Content Management)',
          'SearchSpec': '[Catalog Category.Catalog Id]="1-UBGBGH" AND [Product.Price List Id]="' + option.data.id + '" AND [Product.KL Translated Name] ~LIKE "*' + option.data.val + '*" AND [Catalog Category.KL Brand Name]="海贝斯"'
        }
      }
    };
  },
  getPrice: option => {
    return {
      url: 'http://192.168.166.8:9001/siebel-rest/v1.0/data/Price List/Price List/?searchspec=KL Default Flag="Y"'
    };
  }
};
// 16113009 袁静
// 14080088 张沙沙
// 16013107 代一
// let ajax = (api) => {
//   // eslint-disable-next-line
//   KND.Native.ajax(Object.assign({
//     timeout: 30000,
//     method: 'POST',
//     headers: {
//       'Authorization': 'Basic MTYwMTMxMDc6MTYwMTMxMDc='
//     }
//   }, api));
// };
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
