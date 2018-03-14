let ajax = api => {
  KND.Native.ajaxCache(api);
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
     * 获取siebel lov，类似平台数据字典
     * @param {String} option['type'] 必填 lov type
     */
    getLov({state}, option) {
      ajax(Object.assign({
        method: 'get',
        url: 'data/List Of Values/List Of Values/?searchspec=Active="Y"  AND Language="CHS" AND Type="' + option.type + '"',
        success: data => {
          console.log(data);
        }
      }, option));
    }
  }
};
