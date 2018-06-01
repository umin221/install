let ApiList = {
  getLov: option => {
    option.data.parent = option.data.parent ? 'Parent Value = "' + option.data.parent + '"' : 'Parent is null';
    return {
      method: 'get',
      url: 'data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type= "' + option.data.type + '" AND ' + option.data.parent + ' &PageSize=100&StartRowNum=0'
    };
  },
  submitService: option => {           // 公众号提交服务请求
    return {
      method: 'POST',
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'Address Id': option.data.form['Address Id'], // 如果是用户自己新建了地址，传新建的地址Id,如果只是简单定位，不用传
          'Appoint Time': option.data.form['Appoint Time'], // 用户的预约上门时间
          'Asset Id': option.data.form['Asset Id'], // 如果是用户扫码了，并带出了资产，传资产Id，扫不出来，不用传
          'Brand': '海贝斯', // 品牌
          'Country': '中国', // 国家
          'Province': option.data.form['Province'], // 省
          'City': option.data.form['City'], // 城市
          'Town': option.data.form['Town'], // 区
          'Detail Address': option.data.form['Detail Address'], // 详细地址
          'Building': option.data.form['Building'], // 详细地址
          'Floor': option.data.form['Floor'], // 详细地址
          'Room': option.data.form['Room'], // 详细地址
          'Contact Name': option.data.form['Contact Name'], // 名字
          'Contact Phone': option.data.form['Contact Phone'], // 电话
          'WeChat Id': option.data.form['WeChat Id'], //
          'Area': option.data.form['Area'], // 故障分类
          'Sub-Area': option.data.form['Sub-Area'], // 故障描述
          'Complaint Description': option.data.form['Complaint Description'], // 故障详情描述
          'Open Id': option.data.form['Open Id'], // 微信端的OpenId
          'ProcessName': 'KL WeChat Public Account CreateSR Process'
        }
      }
    };
  },
  /**
   * 发送短信
   * @param {String} option.data.account 必填 短信平台账号
   * @param {String} option.data.ts 必填 时间戳
   * @param {String} option.data.pswd 必填 短信平台账号 + 密码 + 时间戳
   * @param {String} option.data.mobile 必填 电话号码
   * @param {String} option.data.msg 必填 短信内容，发送前 encodeURI 编码
   * @returns {{method: string, url: string}}
   */
  sendMsg: option => {
    let data = option.data;
    // 构造默认参数
    data.needstatus = true;
    data.resptype = 'json';

    return {
      method: 'POST',
      url: 'https://www.kinlong.cn/msg/HttpBatchSendSM',
      // url: 'http://120.27.244.164/msg/HttpBatchSendSM',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'dataType': 'json'
      },
      data: KND.Util.param(data)
    };
  },
  setWXphone: option => {
    return {
      method: 'POST',
      url: 'service/Workflow Process Manager/RunProcess'
    };
  },
  getAsset: option => {
    return {
      method: 'get',
      url: 'data/KL Asset Interface BO/Asset Mgmt - Asset/?searchspec=[Serial Number] = "' + option.data.num + '"'
    };
  },
  addressManage: option => {           // 新增地址
    return {
      method: 'put',
      url: 'data/CUT Address/CUT Address',
      data: {
        'Id': '1',
        'Country': '中国',
        'Province': option.data.form.Province,
        'City': option.data.form.City,
        'County': option.data.form.County,
        'Street Address': option.data.form['Street Address'],
        'Street Address 2': option.data.form['Street Address 2'],
        'Street Address 3': option.data.form['Street Address 3'],
        'Street Address 4': option.data.form['Street Address 4']
      }
    };
  },
  deleteAddress: option => {           // 删除地址
    return {
      method: 'DELETE',
      url: 'data/CUT Address/CUT Address/' + option.data.Id,
      data: {
        body: {}
      }
    };
  },
  upDateAddress: option => {           // 更新地址
    return {
      method: 'put',
      url: 'data/CUT Address/CUT Address',
      data: {
        'Id': option.data.form.addrId,
        'Country': '中国',
        'Province': option.data.form.Province,
        'City': option.data.form.City,
        'County': option.data.form.County,
        'Street Address': option.data.form['Street Address'],
        'Street Address 2': option.data.form['Street Address 2'],
        'Street Address 3': option.data.form['Street Address 3'],
        'Street Address 4': option.data.form['Street Address 4']
      }
    };
  },
  setContactAddress: option => {           // 关联地址到联系人
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
                'Id': option.data.contactId,
                'ListOfCutAddress': {
                  'CUT Address': [
                    {
                      'Id': option.data.addressId
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
  /**
   * 获取联系人信息
   * @param {String} option.data['openId'] 用户 openid
   * @returns {{method: string, url: string}}
   */
  getContact: option => {
    return {
      method: 'POST',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base KL Contact Interface BO',
          // 'SearchSpec': '[Contact.KL Open Id]="o9AqWtwHRjLhycFLsZUxdOKuAq1o"'
          'SearchSpec': '[Contact.KL Open Id]="' + option.data.openId + '"'
        }
      }
    };
  },
  searchAddrId: option => {           // 获取地址信息
    return {
      method: 'get',
      url: 'data/CUT Address/CUT Address/' + option.data.addrId
    };
  },
  setDefaultAddress: option => {           // 设置默认地址
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
                'Id': option.data.contactId,
                'ListOfCutAddress': {
                  'CUT Address': [
                    {
                      'Id': option.data.addressId,
                      'SSA Primary Field': 'Y'
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
  // upDateAddress: option => {           // 编辑更新地址
  //   return {
  //     method: 'post',
  //     url: 'service/EAI Siebel Adapter/Upsert',
  //     data: {
  //       'body': {
  //         'SiebelMessage': {
  //           'MessageId': '',
  //           'MessageType': 'Integration Object',
  //           'IntObjectName': 'Base KL Contact Interface BO',
  //           'IntObjectFormat': 'Siebel Hierarchical',
  //           'ListOfBase KL Contact Interface BO': {
  //             'Contact': {
  //               'Id': option.data.form.contactId,
  //               'ListOfCutAddress': {
  //                 'CUT Address': [
  //                   {
  //                     'Id': option.data.form.addressId,
  //                     'Country': option.data.form.Country,
  //                     'Province': option.data.form.Province,
  //                     'City': option.data.form.City,
  //                     'County': option.data.form.County,
  //                     'Street Address': option.data.form['Street Address']
  //                   }
  //                 ]
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   };
  // },
  getServiceList: option => {           // 服务工单列表请求
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': {
          'OutputIntObjectName': 'Base KL Service Request Interface BO',
          'SearchSpec': '[Service Request.' + option.data.search + ']= ' + '"' + option.data.value + '" AND [Service Request.Parent Service Request Id] IS NULL',
          'SortSpec': 'Created(DESCENDING)',
          'StartRowNum': 0,
          'PageSize': 100
        }
      }
    };
  },
  getAssetdetail: option => {           // 查询资产
    return {
      method: 'get',
      url: 'data/KL Asset Interface BO/Asset Mgmt - Asset/?searchspec=[' + option.data.search + '] = "' + option.data.value + '"  &PageSize=100&StartRowNum=0'
    };
  },
  setContactAsset: option => {           // 联系人关联资产
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
                'Id': option.data.ContactId,
                'ListOfContact_Asset': {
                  'Contact_Asset': [
                    {
                      'KL Asset Id': option.data.AssetId
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
  customerSurvey: option => {           // 维修服务完成后回访
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Upsert',
      data: {
        'body': {
          'SiebelMessage': {
            'MessageId': '',
            'MessageType': 'Integration Object',
            'IntObjectName': 'Base KL Service Request Interface BO',
            'IntObjectFormat': 'Siebel Hierarchical',
            'ListOfBase KL Service Request Interface BO': {
              'Service Request': {
                'Id': option.data.form.Id,
                'ListOfCustomer Survey': {
                  'Customer Survey': {
                    'Id': '1',
                    'Accessible': option.data.form.Accessible,     // 是否有预约？
                    'Knowledgable': option.data.form.Knowledgable,   // 维修服务技术？
                    'Overall': option.data.form.Overall,          // 维修服务态度？
                    'Resolved': option.data.form.Resolved,        // 是否维修完成？
                    'Comments': option.data.form.Comments,        // 建议与反馈
                    'KL Status': '用户已点评'
                  }
                }
              }
            }
          }
        }
      }
    };
  },
  commentLov: option => {           // 五星评价lov
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base List Of Values',
          'SearchSpec': '[List Of Values.Active]="Y" AND [List Of Values.Language]="CHS" AND [List Of Values.Type] = "' + option.type + '"'
        }
      }
    };
  },
  /**
   *
   * @param option
   * @returns {{method: string, url: *}}
   */
  getContactInfo: option => {
    return {
      method: 'get',
      url: `${config.host}/weixin-service/authorized/get_user_info?openid=${option.data.openId}`
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
