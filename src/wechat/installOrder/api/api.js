let ApiList = {
  getList: {
    url: 'http://192.168.166.8:9001/siebel-rest/v1.0/data/Order Entry (Sales)/Order Entry - Orders/?searchspec=[KL Agreement Opportunity Name] like "*测试*" &PageSize=2&StartRowNum=0'
    // 列表
  },
  getDetail: {
    url: 'http://192.168.166.8:9001/siebel-rest/v1.0/service/EAI Siebel Adapter/Query'
  }, // 详情
  getTaskAdd: {
    url: 'http://192.168.166.8:9001/siebel-rest/v1.0/data/KL Installation Task/KL Installation Task'
  }, // 任务开始更新状态
  getUPStatus: {
    url: 'http://192.168.166.8:9001/siebel-rest/v1.0/service/Workflow Process Manager/RunProcess'
  } // 任务结束关闭
};

let ajax = (api) => {
  // eslint-disable-next-line
  KND.Native.ajax(Object.assign({
    timeout: 30000,
    method: 'get',
    headers: {
      'Authorization': 'Basic MTQwODAwODg6MTQwODAwODg='
    }
  }, api));
};

const get = (option) => {
  ajax(typeof option === 'string' ? ApiList[option] : Object.assign(option, ApiList[option.key]));
};

export default {
  get
};
