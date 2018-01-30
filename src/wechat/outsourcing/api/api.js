let apiList = {
  getList: {
    url: 'http://192.168.166.8:9001/siebel-rest/v1.0/data/Service Request/Service Request/1-2BSAQ63P'
  }
};

let ajax = (api) => {
  // eslint-disable-next-line
  if (config.online) {
    // eslint-disable-next-line
    KND.Native.ajax(Object.assign({
      timeout: 30000,
      method: 'get',
      headers: {
        'Authorization': 'Basic RUFJTU9CSUxFMTpFQUlNT0JJTEUx'
      }
    }, api));
  } else {
    let data = require('./data.json');
    api.success(data[api.key]);
  }
};

const get = (option) => {
  ajax(typeof option === 'string' ? apiList[option] : Object.assign(option, apiList[option.key]));
};

export default {
  get
};
