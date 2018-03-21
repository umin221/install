let ajax = api => {
  KND.Native.ajax(api);
};

export const app = {
  namespaced: true,
  state: {
    transitionName: '',
    alive: []
  },
  mutations: {
    setTransition: (state, transition) => {
      state.transitionName = transition;
    },
    setAlive: (state, alive) => {
      state.alive = alive;
    }
  },
  actions: {
    /**
     * 获取 siebel lov，类似平台数据字典
     * @param {String} option['type'] 必填 lov type
     */
    getLov({state}, option) {
      let data = option.data || {Type: option.type};
      ajax(Object.assign({
        method: 'get',
        cache: true, // PickList Hierarchical
        url: 'data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND ' + KND.Util.condition(data) + '&PageSize=100&StartRowNum=0',
        success: data => {
          console.log(data);
        }
      }, option));
    },

    /**
     * 获取企业微信 js sdk 权限
     */
    getAuthority({state}, option) {
      ajax({
        method: 'get',
        url: ('https://kas.kinlong.cn:8090/webchat/api/local/permission?url=http://mp.weixin.qq.com?params=' + location.href.split('#')[0] + '&appNO=CONTACT'),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          data.debug = true;
          wx.config(data);
          wx.ready(() => {
            console.log('WeChatAPI success');
          });
          wx.error(() => {
            console.log('WeChartAPI fail');
          });
        }
      });
    }
  }
};
