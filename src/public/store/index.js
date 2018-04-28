let ajax = api => {
  KND.Native.ajax(api);
};

// 代理服务接口
let proxy = config.proxy;
// 附件接口服务地址
let attachServer = config.attachServer;

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
     * @param {String} option['type'] 必填 lov type 或者 option['data'] lov type and parent
     */
    getLov({state}, option) {
      let data = option.data || {Type: option.type};
      ajax(Object.assign({
        method: 'get',
        cache: true, // PickList Hierarchical
        url: `data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND ${KND.Util.condition(data)}&PageSize=100&StartRowNum=0`,
        success: data => {
          console.log(data);
        }
      }, option));
    },

    /**
     * 获取企业微信&微信公众号 js sdk 权限
     */
    getAuthority({state}, option) {
      // app 无需权限认证
      if (config.offline) return;
      ajax({
        method: 'get',
        url: (`${proxy}/webchat/api/local/permission?url=${encodeURIComponent(location.href.split('#')[0])}&appNO=${config.appNo}`),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          // data.debug = true;
          if (!window.wx) return;
          wx.config(data);
          wx.ready(() => {
            console.log('WeChatAPI success');
          });
        },
        error: err => {
          console.log(err);
        }
      });
    },

    /**
     * 查询附件列表
     * @param {String} option['IOName'] 必填 上传io 安装任务：KL Action Attachment 委外管理：KL Channel Partner Attachments
     * @param {Array} option['sepc'] 必填 查询条件
     * @returns
     */
    queryMedias({state}, option) {
      let data = option.data;
      option.success = option.success || (data => console.log(data));
      ajax({
        url: 'service/EAI Siebel Adapter/QueryPage',
        data: {
          'body': {
            'OutputIntObjectName': data.IOName, // 'KL Action Attachment',
            'SearchSpec': KND.Util.condition(data.SearchSpec), // '[Action Attachment.Activity Id]="1-2BSE8H3R"'
            'SortSpec': 'Updated (DESCENDING)',
            'PageSize': '100'
          }
        },
        success: option.success
      });
    },

    /**
     * 上传附件
     * @param {String} option['IOName'] 必填 上传io 安装任务：KL Action Attachment 委外管理：KL Channel Partner Attachments
     * @param {String} option['Id'] 必填 业务id
     * @param {Array} option['MediaId'] 必填 腾讯mediaId
     * @param {Function} option['success'] 必填 成功回调
     * @param {Function} option['error'] 选填 失败回调
     */
    upload({state}, option) {
      let data = option.data;
      let MediaId = data.MediaId;
      option.success = option.success || (data => console.log(data));
      option.error = option.error || (data => console.log(data));
      // 提交 siebel
      let push = (media) => {
        ajax({
          method: 'get',
          url: (`${proxy}/webchat/api/external/uploadattachment?url=${attachServer}/siebel-rest/v1.0/service/Workflow Process Manager/RunProcess&IOName=${data.IOName}&Object Id=${data.Id}&Comment=${data.Comment || ''}&ProcessName=KL Attachment Upload Process&appNO=${config.appNo}&mediaID=${media}`),
          success: result => {
            console.log(result);
            run(MediaId.pop(), result);
          },
          error: option.error
        });
      };
      // 上传附件
      let run = (media, result) => {
        if (media) {
          push(media.serverId);
        } else {
          option.success(result);
        };
      };
      run(MediaId.pop());
    }
  }
};
