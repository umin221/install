let ApiList = {
  /**
   * 获取配件数据
   */
  getPartList: {
    url: 'data/Service Request/Service Request/1-2BSAQ63P'
  },
  /**
   * 获取项目数据
   */
  getProjectList: {
    url: 'data/Service Request/Service Request/1-2BSAQ63P'
  }
};

let ajax = (api) => {
  // eslint-disable-next-line
  KND.Native.ajax(Object.assign({
    timeout: 30000,
    method: 'get',
    headers: {
      'Authorization': 'Basic RUFJTU9CSUxFMTpFQUlNT0JJTEUx'
    }
  }, api));
};

const get = (option) => {
  ajax(typeof option === 'string' ? ApiList[option] : Object.assign(option, ApiList[option.key]));
};

export default {
  get
};
