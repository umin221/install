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
        url: ('https://kas.kinlong.cn:8090/webchat/api/local/permission?url=' + encodeURIComponent(location.href.split('#')[0]) + '&appNO=CONTACT'),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          data.debug = true;
          wx.config(data);
          wx.ready(() => {
            console.log('WeChatAPI success');
          });
        }
      });
    },

    /**
     * 获取附件
     */
    getMediaById({state}, option) {
      ajax({
        method: 'post',
        url: 'service/Workflow Process Manager/RunProcess',
        data: {
          'body': {
            'ProcessName': 'KL Attachment Base64 Query Process',
            'Type': option.type, // 'Partner',
            'Object Id': option.id // '1-2BSEPVGX'
          }
        },
        success: data => {
          console.log(123);
        }
      });
    }
  }
};
