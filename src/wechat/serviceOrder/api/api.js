let ApiList = {
  getList: {
    url: 'http://192.168.166.8:9001/siebel-rest/v1.0/data/KL Employee Interface BO/Employee/1-AVNR-1'
  }
};

let ajax = (api) => {
  // eslint-disable-next-line
  KND.Native.ajax(Object.assign({
    timeout: 30000,
    method: 'GET',
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
