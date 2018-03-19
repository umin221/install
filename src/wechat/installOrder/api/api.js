let apiList = {
  /* getList: {
    url: 'service/EAI Siebel Adapter/QueryPage'
    // 列表
  },*/
  getList: option => {

    var boby = {
      'OutputIntObjectName': 'KL Install Order',
      'StartRowNum': option.paging.StartRowNum,
      'PageSize': option.paging.PageSize
    };
    var bing = ''; // 安装工程师跟安装主管需要参数Primary Postion Id
    if (option.data.infoUser['KL Primary Position Type LIC'] === 'Door Factory Engineer') { // 门厂技术安装员
      boby.ViewMode = 'Sales Rep';

    } else if (option.data.infoUser['KL Primary Position Type LIC'] === 'Field Service Manager' || option.data.infoUser['KL Primary Position Type LIC'] === 'Field Service Engineer') { // 安装工程师、安装主管
      // boby.ViewMode = 'Manager';
      // bing = '[Order Entry - Orders.Primary Postion Id]="' + option.data.infoUser['Primary Position Id'] + '" AND ';
    }
    boby.SearchSpec = bing + '(' + KND.Util.condition2D({Status: option.data.Status.split(',')}, 'Order Entry - Orders', ' OR ', '=') + ')';
    return {
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': boby
      }
    };
  },
  getDetail: option => {
    return {
      url: 'service/EAI Siebel Adapter/Query'
    };
  }, // 详情
  getTaskAdd: option => {
    return {
      url: 'service/Workflow Process Manager/RunProcess/'
    };
  }, // 任务开始更新状态
  getXttd: option => {
    return {
      url: 'service/EAI Siebel Adapter/Query'
    };
  }, // 协同团队
  /**
   * 查找所有产品安装工程师&主管 搜索&获取列表
   * @param {String} option.data.position 必填 职位
   * @param {String} option.data['Last Name'] 选填 用户名字 模糊查询
   * @param {Object} option.paging 必填 翻页参数
   * @returns {{url: string}}
   */
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
  /*
  * 协同团队修改负责人
  * */
  upPerson: option => {
    return {
      url: 'service/EAI Siebel Adapter/Synchronize',
      data: {
        'body': {
          'SiebelMessage': {
            'MessageId': '',
            'MessageType': 'Integration Object',
            'IntObjectName': 'KL Install Order Sales Team',
            'IntObjectFormat': 'Siebel Hierarchical',
            'ListOfKL Install Order Sales Team': {
              'Order Entry - Orders': {
                'Id': option.data.Id,
                'ListOfPosition': {
                  'Position': option.data.personList
                }
              }
            }
          }
        }
      }
    };
  },
  getUPStatus: option => {
    return {
      url: 'service/Workflow Process Manager/RunProcess'
    };
  }, // 任务结束关闭
  getUPData: option => {
    return {
      url: 'data/KL Installation Task/KL Installation Task/'
    };
  }, // 子任务 数据提交
  findBatchById: option => {
    return {
      method: 'get',
      url: 'data/KL Installation Task/KL Installation Task/' + option.data.id,
      data: {}
    };
  } // 批次详情
};

let ajax = (api) => {
  // eslint-disable-next-line
  KND.Native.ajax(Object.assign({
    timeout: 30000,
    method: 'get',
    headers: {
      'Authorization': 'Basic WFlKOlhZSg=='
    }
  }, api));
};

const get = option => {
  ajax(Object.assign(option, apiList[option.key](option)));
};
export default {
  get
};
