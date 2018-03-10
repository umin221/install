let apiList = {
  /* getList: {
    url: 'service/EAI Siebel Adapter/QueryPage'
    // 列表
  },*/
  getList: option => {
    let name = option.data.Name;
    // let spec = '';
    if (name) {
      // spec = '[Name] LIKE \'' + name + '*\'';
      delete option.data.Name;
    }
    return {
      url: 'service/EAI Siebel Adapter/QueryPage'
      // url: 'service/EAI Siebel Adapter/QueryPage/?searchspec=' /* + spec*/ + KND.Util.condition(option.data) + '&' + KND.Util.param(option.paging)
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
  getUPStatus: option => {
    return {
      url: 'service/Workflow Process Manager/RunProcess'
    };
  } // 任务结束关闭
};

let ajax = (api) => {
  // eslint-disable-next-line
  KND.Native.ajax(Object.assign({
    timeout: 30000,
    method: 'get',
    headers: {
      'Authorization': 'Basic U0FETUlOOkNSTUFQUEFETUlO'
    }
  }, api));
};

const get = option => {
  ajax(Object.assign(option, apiList[option.key](option)));
};
export default {
  get
};
