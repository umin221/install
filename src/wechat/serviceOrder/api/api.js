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
  getSn: option => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base KL Asset Interface BO',
          'SearchSpec': '[Asset Mgmt - Asset.Serial Number]= "' + option.data.Sn + '"'
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
  getActivity: option => {
    return {
      method: 'post',
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'Object Id': option.data.id,
          'function': 'Dispatch',
          'empId': option.data.empId,
          'ifRefresh': 'N',
          'empFullName': option.data.empFullName,
          'ProcessName': 'KL SR Pick Owner Process'
        }
      }
    };
  },
  getSearch: option => {
    return {
      url: 'data/KL Contact Interface BO/Contact/?searchspec=[Cellular Phone %23] ~LIKE "*' + option.data.val + '*" &PageSize=10&StartRowNum=0'
    };
  },
  submitService: option => {
    return {
      method: 'PUT',
      url: 'data/Service Request/Service Request',
      data: {
        'KL Contact Mobile Phone': option.data.form.Contact_Phone,
        'Contact Last Name': option.data.form.Contact_Name,
        'KL Personal Province': option.data.form.PROVINCE,
        'Personal City': option.data.form.CITY,
        'Personal Street Address': option.data.form.Address,
        'Area': option.data.form.Area,
        'Sub-Area': option.data.form.SR_AREA,
        'Priority': option.data.form.Priority,
        'Description': option.data.form.ProductFlag,
        'CEM Planned Start Date': option.data.form.Start_Date,
        'KL SN': option.data.form.KL_SN,
        'KL Product Model': option.data.form.KL_Product_Model,
        'KL Cutoff Date': option.data.form.KL_Cutoff_Date,
        'Product Warranty Flag': option.data.form.Product_Warranty_Flag,
        'Id': '1',
        'Owner': '16113009'
      }
    };
  },
  searchAddress: option => {
    return {
      url: 'data/CUT Address/CUT Address/?searchspec=[Street Address] = "' + option.data.Address + '"'
    };
    // 查找地址
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
  upDateAddr: option => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Upsert',
      data: {
        'body': {
          'SiebelMessage': {
            'MessageId': '',
            'MessageType': 'Integration Object',
            'IntObjectName': 'Base KL Contact Interface BO',
            'IntObjectFormat': 'Siebel Hierarchical',
            'ListOfBase KL Contact Interface BO': {
              'Contact': {
                'Id': '1-2BSBQ0KF',
                'ListOfContact_PersonalAddress': {
                  'Contact_Personal Address': [
                    {
                      'Id': '1-2BSBQ0KF',
                      'Personal Country': '中国',
                      'Personal Province': option.data.Province,
                      'Personal City': option.data.City,
                      'Personal Street Address': option.data.Address,
                      'IsPrimaryMVG': 'Y'
                    }
                  ]
                }
              }
            }
          }
        }
      }
    };
    // 更新地址
  },
  getLov: option => {
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
    return {
      url: 'data/KL Asset Interface BO/Asset Mgmt - Asset/?searchspec=[Serial Number] = "' + option.data.num + '"'
    };
  },
  getLov1: option => {
    option.data.parent = option.data.parent ? option.data.parent : 'Parent is null';
    return {
      url: 'data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type= "' + option.data.type + '" AND ' + option.data.parent + ' &PageSize=100&StartRowNum=0'
    };
  },
  getParentLov1: option => {
    return {
      url: 'data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type="' + option.data.type + '" AND Parent Value="' + option.data.value + '" &PageSize=100&StartRowNum=0'
    };
    // 下拉二级
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
    // 产品目录
  },
  getPrice: option => {
    return {
      url: 'data/Price List/Price List/?searchspec=KL Default Flag="Y"'
    };
    // 产品价格
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
