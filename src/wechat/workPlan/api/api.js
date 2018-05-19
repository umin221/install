let ApiList = {
  /**
   * 取得整月数据
   */
  getList: option => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base KL Daily Action Interface BO',
          'SearchSpec': `[KL Daily Action.Planned Completion]>= ${option.data.start} AND [KL Daily Action.Planned] <= ${option.data.end}`,
          'ViewMode': 'Personal'
        }
      }
      // url: `?searchspec=Planned >= ${option.data.start} AND Planned <= ${option.data.end} AND Planned Completion <= ${option.data.end}`
    };
  },
  /**
   * 取得当天数据
   */
  getCurrData: option => {
    return {
      method: 'post',
      url: 'service/EAI Siebel Adapter/Query',
      data: {
        'body': {
          'OutputIntObjectName': 'Base KL Daily Action Interface BO',
          'SearchSpec': '[KL Daily Action.Planned Completion]>= ' + "'" + option.data + ' 00:00:00' + "'" + ' AND [KL Daily Action.Planned] <= ' + "'" + option.data + ' 00:00:00' + "'",
          'SortSpec': 'Created (DESCENDING)',
          'ViewMode': 'Personal'
        }
      }
      // url: `?searchspec=Planned >= ${option.data.start} AND Planned <= ${option.data.end} AND Planned Completion <= ${option.data.end}`
    };
  },
  /**
   * 新增计划
   */
  add: option => {
    return {
      method: 'put',
      url: 'data/KL Daily Action Interface BO/KL Daily Action/'
    };
  },
  /**
   * 删除计划
   */
  delete: option => {
    return {
      method: 'DELETE',
      url: `data/KL Daily Action Interface BO/KL Daily Action/${option.data.Id}`
    };
  }
};

let ajax = (api) => {
  // eslint-disable-next-line
  KND.Native.ajax(Object.assign({
    timeout: 30000
  }, api));
};

const get = (option) => {
  ajax(Object.extend(true, option, ApiList[option.key](option)));
};

export default {
  get
};
