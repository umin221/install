let ApiList = {
  getList: {
    url: 'http://192.168.166.8:9001/siebel-rest/v1.0/service/EAI Siebel Adapter/Query'
    // 列表
  },
  getAdd: {
    url: 'http://192.168.166.8:9001/siebel-rest/v1.0/service/EAI Siebel Adapter/Upsert'
    // 创建
  },
  getContact: {
    url: 'http://192.168.166.8:9001/siebel-rest/v1.0/data/KL Contact Interface BO/Contact'
    // 联系人
  },
  getUser: {
    url: 'http://192.168.166.8:9001/siebel-rest/v1.0/data/KL Employee Interface BO/Employee'
    // 用户信息
  },
  getValue: {
    url: 'http://192.168.166.8:9001/siebel-rest/v1.0/data/List Of Values/List Of Values/?searchspec=Active="Y"  AND Language="CHS" AND Type="SR_TYPE"'
    // lov值
  }
};
// 16113009 袁静
// 14080088 张沙沙
// 16013107 代一
let ajax = (api) => {
  // eslint-disable-next-line
  KND.Native.ajax(Object.assign({
    timeout: 30000,
    method: 'POST',
    headers: {
      'Authorization': 'Basic MTYxMTMwMDk6MTYxMTMwMDk='
    }
  }, api));
};

const get = (option) => {
  ajax(typeof option === 'string' ? ApiList[option] : Object.assign(option, ApiList[option.key]));
};

export default {
  get
};
