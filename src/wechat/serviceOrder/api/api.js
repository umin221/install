let ApiList = {
  getList: option => {
    let condition = Object.assign({}, option.data);
    let status = condition.Status;
    let srNum = condition.srNum;
    let parmer = '';
    if (status) {
      condition['Status'] = status.split(',');
      for (let i = 0; i < condition['Status'].length; i++) {
        if (!parmer) {
          parmer = '[Service Request.Status] = LookupValue("SR_STATUS",' + '"' + condition['Status'][i] + '"' + ')';
        } else {
          parmer = parmer + 'OR [Service Request.Status] = LookupValue("SR_STATUS",' + '"' + condition['Status'][i] + '"' + ')';
        }
      }
    } else if (srNum) {
      parmer = '[Service Request.SR Number] ~LIKE ' + '"*' + srNum + '*"';
    }
    // let operator = option.data.Status ? ' = ' : ' ~LIKE ';
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/QueryPage?ViewMode=Personal',
      data: {
        'body': {
          'OutputIntObjectName': 'Base KL Service Request Interface BO',
          'SearchSpec': '(' + parmer + ')AND [Service Request.Parent Service Request Id] IS NULL',
          'SortSpec': 'Created(DESCENDING)',
          'StartRowNum': option.paging.StartRowNum,
          'PageSize': option.paging.PageSize
        }
      }
    };
    // 工程师列表
  },
  getServiceList: option => {
    console.log(option);
    let condition = Object.assign({}, option.data);
    let status = condition.Status;
    let parmer = '';
    let SearchSpec = '';
    if (status) {
      condition['Status'] = status.split(',');
      for (let i = 0; i < condition['Status'].length; i++) {
        if (!parmer) {
          parmer = '[Service Request.Status] = LookupValue("SR_STATUS",' + '"' + condition['Status'][i] + '"' + ')';
        } else {
          parmer = parmer + 'OR [Service Request.Status] = LookupValue("SR_STATUS",' + '"' + condition['Status'][i] + '"' + ')';
        }
      }
      SearchSpec = '([Service Request.Owner] = "' + option.data.owner + '" OR [Service Request.Owner] IS NULL) AND (' + parmer + ') AND [Service Request.Parent Service Request Id] IS NULL';
    } else {
      SearchSpec = '[Service Request.KL Dispatcher Login] = ' + option.data.owner + ' AND [Service Request.Parent Service Request Id] IS NULL';
    }
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': {
          'OutputIntObjectName': 'Base KL Service Request Interface BO',
          'SearchSpec': SearchSpec,
          'SortSpec': 'Created(DESCENDING)',
          'StartRowNum': option.paging.StartRowNum,
          'PageSize': option.paging.PageSize
        }
      }
    };
    // 客服列表
  },
  getServiceR: option => {
    return {
      method: 'get',
      url: 'data/KL Service Request Interface BO/Service Request/' + option.data.Id
    };
  // 通过ID查询服务请求
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
    // 详情
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
    // 通过序列号查询
  },
  addContact: option => {
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
                'Id': '1',
                'M/F': '男',
                'Type': option.data.form.CONTACT_TYPE,
                'Last Name': option.data.form.Contact_Name,
                'Work Phone #': option.data.form.Contact_Phone,
                'User Type': '售后',
                'ListOfCutAddress': {
                  'CUT Address': [
                    {
                      'Id': '1',
                      'Country': '中国',
                      'Province': option.data.form.KL_PROVINCE,
                      'City': option.data.form.KL_CITY,
                      'County': option.data.form.KL_TOWN,
                      'Street Address': option.data.form.Address
                    }
                  ]
                }
              }
            }
          }
        }
      }
    };
  },
  getClose: option => {
    return {
      method: 'get',
      url: 'data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type="FIN_NO_SALE_REASON"'
    };
    // 关闭工单 lov
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
          'function': option.data.type,
          'empId': option.data.empId,
          'ifRefresh': 'N',
          'empFullName': option.data.empFullName,
          'ProcessName': 'KL SR Pick Owner Process'
        }
      }
      // 分配、派发工单
    };
  },
  getAccept: option => {
    return {
      method: 'post',
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'Object Id': option.data.parms['Object Id'],
          'ActivityId': option.data.parms.ActivityId,
          'inStatus': 'Accept',
          'ProcessName': 'KL SR Action Status Change Process'
        }
      }
    };
    // 接单状态
  },
  getAssign: option => {
    return {
      method: 'post',
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'Object Id': option.data.parms['Object Id'],
          'ActivityId': option.data.parms.ActivityId,
          'inStatus': 'Accept',
          'ProcessName': 'KL SR Action Status Change Process'
        }
      }
    };
    // 分配工单
  },
  getAppoint: option => {
    return {
      method: 'post',
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'Object Id': option.data.parms['Object Id'],
          'ActivityId': option.data.parms.ActivityId,
          'ActionPlanned': option.data.parms.starTime,  // 计划开始时间
          'ActionPlanEnd': option.data.parms.endTime,   // 计划完成时间
          'inStatus': 'Appoint',
          'ProcessName': 'KL SR Action Status Change Process'
        }
      }
    };
    // 预约状态
  },
  getDepart: option => {
    let data = {};
    if (option.data.parms.type === 'setOut') {
      data['KL Departure Location'] = option.data.parms['KL Departure Location'];
    } else {
      data['MeetingLocation'] = option.data.parms['MeetingLocation'];
    }
    data.Id = option.data.parms['ActivityId'];
    console.log(data);
    return {
      method: 'put',
      url: 'data/KL Service Request Interface BO/Service Request/' + option.data.parms['Object Id'] + '/Action',
      data: data
    };
    // 出发 、 上门
  },
  getDone: option => {
    return {
      method: 'post',
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'Object Id': option.data.parms['Object Id'],
          'ActivityId': option.data.parms.ActivityId,
          'inStatus': 'Done',
          'DoneLoc': option.data.parms.DoneLoc,
          'ProcessName': 'KL SR Action Status Change Process'
        }
      }
    };
    // 完成状态
  },
  getSearch: option => {
    return {
      method: 'get',
      url: 'data/KL Contact Interface BO/Contact/?searchspec=[Work Phone %23] ~LIKE "' + option.data.val + '*" AND [User Type]<>LookupValue("CONTACT_USER_TYPE", "Sales") &PageSize=10&StartRowNum=0'
    };
    // 搜索电话联系人
  },
  submitService: option => {
    return {
      method: 'PUT',
      url: 'data/KL Service Request Interface BO/Service Request/1-2BSB0DZ1',
      data: {
        // 'KL Contact Mobile Phone': option.data.form.Contact_Phone,
        'KL Country': '中国',
        'KL Province': option.data.form.KL_PROVINCE,
        'KL City': option.data.form.KL_CITY,
        'KL Town': option.data.form.KL_TOWN,
        'KL Address': option.data.form.Address,
        // 'KL Personal Province': option.data.form.KL_PROVINCE,
        // 'Personal City': option.data.form.KL_CITY,
        // 'Personal Town': option.data.form.KL_TOWN,
        // 'Personal Street Address': option.data.form.Address,
        'Contact Last Name': option.data.form.Contact_Name,
        'Primary Personal Address Id': option.data.form['Primary Personal Address Id'],
        'Contact Id': option.data.form.Contact_Id,
        'Area': option.data.form.Area,
        'Sub-Area': option.data.form.SR_AREA,
        'Priority': option.data.form.Priority,
        'Description': option.data.form.ProductFlag,
        'SR Type': option.data.form.SR_TYPE,
        'CEM Planned Start Date': option.data.form.Start_Date || '',
        'KL SN': option.data.form.KL_SN,
        'KL Product Model': option.data.form.KL_Product_Model,
        'KL Cutoff Date': option.data.form.KL_Cutoff_Date,
        'Product Warranty Flag': option.data.form.Product_Warranty_Flag,
        'Id': '1',
        'Owner': option.data.form.Owner
      }
    };
    // 提交服务请求
  },
  upDateService: option => {
    return {
      method: 'PUT',
      url: 'data/KL Service Request Interface BO/Service Request',
      data: {
        'Id': option.data.form['Id'],
        'Asset Number': option.data.form['Asset Number'], // 产品ID
        'SR Rootcause': option.data.form['SR Rootcause'],               // 故障反馈
        'KL Responsbility': option.data.form['KL Responsibility'],     // 责任划分
        'Repair Details': option.data.form['Repair Details'], // 解决方法明细
        'KL Lock Body Model': option.data.form['KL Lock Body Model'],
        'KL Lock Model': option.data.form['KL Lock Model']
      }
    };
    // 更新服务请求
  },
  searchAddress: option => {
    return {
      method: 'get',
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
      specName += '[Last Name] ~LIKE "' + name + '*" OR ([KL Parent Service Region Name] ~LIKE "' + name + '*" OR [Service Region] ~LIKE "' + name + '*") AND';
    };
    return {
      method: 'get',
      url: 'data/KL Employee Interface BO/Employee/?searchspec=' + specName + '(' + specPosi.join(' OR ') + ')&' + KND.Util.param(option.paging)
    };
  },
  upDateContact: option => {
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
                'Id': option.data.form.Contact_Id,
                'M/F': '女',
                'Type': option.data.form.CONTACT_TYPE,
                'Last Name': option.data.form.Contact_Name,
                'Work Phone #': option.data.form.Contact_Phone,
                'ListOfCUT Address': {
                  'CUT Address': [
                    {
                      'Id': option.data.form.AddressId,
                      'Country': '中国',
                      'Province': option.data.form.KL_PROVINCE,
                      'City': option.data.form.KL_CITY,
                      'County': option.data.form.KL_TOWN,
                      'Street Address': option.data.form.Address
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
  getAsset: option => {
    return {
      method: 'get',
      url: 'data/KL Asset Interface BO/Asset Mgmt - Asset/?searchspec=[Serial Number] = "' + option.data.num + '"'
    };
  },
  getLov: option => {
    option.data.parent = option.data.parent ? 'Parent Value = "' + option.data.parent + '"' : 'Parent is null';
    return {
      method: 'get',
      url: 'data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type= "' + option.data.type + '" AND ' + option.data.parent + ' &PageSize=100&StartRowNum=0'
    };
  },
  getLov1: option => {
    option.data.parent = option.data.parent ? option.data.parent : 'Parent is null';
    return {
      method: 'get',
      url: 'data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type= "' + option.data.type + '" AND ' + option.data.parent + ' &PageSize=100&StartRowNum=0'
    };
  },
  getParentLov1: option => {
    return {
      method: 'get',
      url: 'data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type="' + option.data.type + '" AND Parent Value="' + option.data.value + '" &PageSize=100&StartRowNum=0'
    };
    // 下拉二级
  },
  getProduct: option => {
    let model = '';
    if (option.data.type) {
      model = ' AND [Product.KL Translated Description] ~LIKE "*' + option.data.val + '*"';
    } else {
      model = 'AND [Product.KL Translated Name] ~LIKE "*' + option.data.val + '*"';
    }
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base Catalog Category (Content Management)',
          'SearchSpec': '[Catalog Category.Catalog Id]="1-UBGBGH" AND [Product.Price List Id]="' + option.data.id + '" ' + model + ' AND [Catalog Category.KL Brand Name]="海贝斯"'
        }
      }
    };
    // 产品目录
  },
  getPrice: option => {
    return {
      method: 'get',
      url: 'data/Price List/Price List/?searchspec=KL Default Flag="Y"'
    };
    // 产品价格
  },
  addServiceOrder: option => {
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
              'Order Entry - Orders': {
                'Id': '1',
                'Order Type': '服务订单',    // 设为服务订单
                'KL Warranty Flag': option.data.form.warrantyFlag,     // 服务订单是否保内
                'Price List Id': option.data.form.priceId,  // 价格列表的Id
                'Service Request Id': option.data.form.ServiceRequestId, // 服务请求Id
                'Contact Id': option.data.form.contactId, // 联系人Id
                'KL Asset Id': option.data.form.assetId, // 资产Id
                'ListOfOrderEntry-LineItems': {
                  'Order Entry - Line Items': option.data.form.lineItems
                }
              }
            }
          }
        }
      }
    };
  },
  upDateOrderStatu: option => {

    return {
      method: 'PUT',
      url: 'data/KL Service Request Interface BO/Service Request',
      data: option.data
    };
    // 更新服务请求
  },
  addChildService: option => {          // 创建子服务请求再记一单
    return {
      method: 'PUT',
      url: 'data/KL Service Request Interface BO/Service Request/',
      data: {
        'Id': '1', // 新建传1
        'Parent Service Request Id': option.data.parentId,  // 父服务请求的Id，一定要填
        'Contact Id': option.data.contactId, // 父服务请求的联系人Id
        'Contact Last Name': option.data.lastName,  // 父服务请求的联系人名字
        'Personal Location Id': option.data.locationId  // 父服务请求的主要维修地址Id
      }
    };
  },
  serviceDone: option => {
    return {
      method: 'post',
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'Object Id': option.data['Object Id'], // 服务请求Id
          'inStatus': 'Complete', // 完成
          'ProcessName': 'KL SR Status Change Process' // 服务请求状态改变逻辑WF
        }
      }
    };
    //  服务请求完成状态
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
