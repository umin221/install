let apiList = {
  /**
   * 获取安装批次列表
   * @param {String} option.data['Name'] 选填 厂商名称
   * @param {Object} option.data 选填 查询条件
   * @param {Object} option.paging 必填 翻页参数
   * @returns {{method: string, url: string}}
   */
  queryInstallTask: option => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base KL Contact - Installation Task',
          'PrimaryRowId': '1-2BSH6IWP',
          'ViewMode': 'All',
          'StartRowNum': '0',
          'PageSize': '50'
        }
      }
    };
  },

  /**
   * 获取楼栋下所有楼层和房间
   * @param {Object} option.data 必填，过滤条件
   * @param {String} option.data['KL Activity Id'] 必填，批次id 1-2BSEB2Z2
   * @param {String} option.data['Integration Id 2'] 必填，楼栋编号 1
   * @returns {{method: string, url: string, data: {}}}
   */
  getLayer: option => {
    return {
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base KL Install Order Asset',
          'SearchSpec': KND.Util.condition(option.data, 'Asset Room') // '[Asset Room.KL Activity Id]="1-2BSEB2Z2" AND [Asset Room.Integration Id 2]="1"'
        }
      }
    };
  },

  /**
   * 获取楼栋下所有楼层和房间
   * @param {Object} option.data 必填，过滤条件
   * @param {String} option.data['KL Activity Id'] 必填，批次id 1-2BSEB2Z2
   * @param {String} option.data['Integration Id 2'] 必填，楼栋编号 1
   * @returns {{method: string, url: string, data: {}}}
   */
  getLayerSort: option => {
    return {
      url: 'service/EAI Siebel Adapter/QueryPage',
      data: {
        'body': {
          'OutputIntObjectName': 'Base KL Install Order Asset',
          'SearchSpec': KND.Util.condition(option.data, 'Asset Room'), // '[Asset Room.KL Activity Id]="1-2BSEB2Z2" AND [Asset Room.Integration Id 2]="1"'
          'SortSpec': 'KL Room Number(ASCENDING)', // 'KL Floor Number(ASCENDING),KL Room Number(ASCENDING)',
          'StartRowNum': 0,
          'PageSize': 100
        }
      }
    };
  },

  /**
   * 新增&更新房间信息
   * @param {Object} option.data 必填 需新增或更新的房间信息
   * @returns {{url: string, data: {}}}
   */
  upsertRoom: option => {
    return {
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'ProcessName': 'KL Install Order Asset Room Upsert Process',
          'SiebelMessage': {
            'MessageId': '',
            'MessageType': 'Integration Object',
            'IntObjectName': 'Base KL Install Order Asset Address',
            'IntObjectFormat': 'Siebel Hierarchical',
            'ListOfBase KL Install Order Asset Address': {
              'Base KL Install Order Asset Address': option.data
            }
          }
        }
      }
    };
  },

  /**
   * 删除房号
   * @param {String} option.data.id 房号id
   * @returns {{url: string, data: {}}}
   */
  removeRoom: option => {
    return {
      method: 'delete',
      url: 'data/KL Install Order Asset/KL Install Order Asset/' + option.data.id,
      data: {}
    };
  },

  /**
   * 删除 整栋 或 整层
   * @param {String} option.data['Object Id'] 必填 批次id
   * @param {String} option.data['BuildingNum'] 必填 楼栋编号
   * @param {String} option.data['FloorNum'] 必填 楼层编号 如不传则删除整栋
   * @returns {{url: string, data: {body: {ProcessName: string, Object Id: string, BuildingNum: string, FloorNum: string}}}}
   */
  removeBuilding: option => {
    let body = option.data;
    body.ProcessName = 'KL Install Order Asset Room Delete Process';
    delete option.data;
    return {
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': body
      }
    };
  },

  /**
   * 查询楼栋列表
   * @param {String} option.data['Object Id'] 必填 批次id
   * @param {String} option.data['BuildingNum'] 必填 楼栋编号
   * @param {String} option.data['FloorNum'] 必填 楼层编号
   * @returns {{url: string, data: {body: {ProcessName: string, Object Id: string, BuildingNum: string, FloorNum: string}}}}
   */
  queryBuilding: option => {
    return {
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': {
          'ProcessName': 'KL Install Order Asset Building Query Process',
          'TaskId': option.data.id
        }
      }
    };
  },

  /**
   * 更新楼栋名字
   * @param {String} option.data['ProcessName'] 选填 更新楼栋名字的工作流名字
   * @param {String} option.data['TaskId'] 必填 批次id
   * @param {String} option.data['BuildingNum'] 必填 楼栋编号
   * @param {String} option.data['Builing'] 必填 更新的名字
   * @returns {{url: string, data: {body: {ProcessName: string, Object Id: string, BuildingNum: string, FloorNum: string}}}}
   */
  updateBuildingName: option => {
    let body = option.data;
    body.ProcessName = 'KL Install Order Asset Building Update Process';
    delete option.data;
    return {
      url: 'service/Workflow Process Manager/RunProcess',
      data: {
        'body': body
      }
    };
  },

  /**
   * 查询订单行
   * @param option
   */
  queryOrderLines: option => {
    return {
      method: 'get',
      url: 'data/Order Entry - Line Items/Order Entry - Line Items/?searchspec=' + KND.Util.condition(option.data) + '&PageSize=100&StartRowNum=0',
      error: data => {
        console.log(data);
      }
    };
  },

  /**
   * 绑定资产条码型号等
   * @param option
   * @returns {{url: string}}
   */
  installOrderAssets: option => {
    return {
      method: 'put',
      url: 'data/KL Install Order Asset/KL Install Order Asset',
      data: {
        'Id': '1-2BSHWBOE',
        'Serial Number': '222111111'
      }
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
