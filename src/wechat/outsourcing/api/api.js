let apiList = {
  // 委外列表
  getList: (option) => {
    return Object.assign({
      url: 'http://192.168.166.8:9001/siebel-rest/v1.0/data/Channel Partner/Channel Partner/?searchspec=[KL Partner Status] = "' + option.status + '"&PageSize=10&StartRowNum=0'
    }, option);
  },

  // 委外详情
  getDetail: (option) => {
    return Object.assign({
      method: 'post',
      url: 'http://192.168.166.8:9001/siebel-rest/v1.0/service/EAI Siebel Adapter/Query/?OutputIntObjectName=Base Channel Partner&PrimaryRowId=' + option.id,
      data: {}
    }, option);
  }
};

let ajax = (api) => {
  // eslint-disable-next-line
  if (config.online) {
    // eslint-disable-next-line
    KND.Native.ajax(api);
  } else {
    let data = require('./data.json');
    api.success(data[api.key]);
  }
};

const get = (option) => {
  ajax(apiList[option.key](option));
};

export default {
  get
};
