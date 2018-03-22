let ApiList = {
  /**
   * 取得整月数据
   */
  getList: option => {
    return {
      method: 'get',
      url: `data/KL Daily Action Interface BO/KL Daily Action/?searchspec=Planned >= ${option.data.start} AND Planned <= ${option.data.end}&PageSize=100&StartRowNum=0`
    };
  },
  /**
   * 取得当天数据
   */
  getCurrData: option => {
    return {
      method: 'get',
      url: `data/KL Daily Action Interface BO/KL Daily Action/?searchspec=Planned = ${option.data}&PageSize=100&StartRowNum=0`
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
