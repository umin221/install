/**
 * @author umin
 * @copyright Copyright (c) 2018, YZKJ
 * @description 工具库
 */
import axios from 'axios';

(function(context) {

  class Native {

    constructor() {
      console.info('native init ...');
    };

    /**
     * 获取用户信息
     * @returns {string}
     */
    getLoginInfo() {
      return 'umin';
    };

    /**
     * 异步请求
     * @param option
     */
    ajax(option) {
      // tips
      Indicator.open({
        spinnerType: 'fading-circle'
      });
      // post data
      let setting = Object.assign({
        headers: {
          'Authorization': 'Basic ' + btoa('XIEXW:XIEXW')
        },
        timeout: 30000,
        method: 'get'
      }, option);
      // url valid
      if (!/^http/i.test(option.url)) {
        setting.url = config.host + config.context + setting.url;
      };
      // get data
      axios(setting).then((response) => {
        Indicator.close();
        let data = response.data;
        // Error 字段判断是否存在系统异常
        if (data.ERROR) {
          Toast({
            message: '出了点小情况，请稍后再试。<' + data.ERROR + '>'
          });
        }
        // callback
        option.success(response.data);
      }).catch((error) => {
        Indicator.close();
        if (option.error) {
          option.error(error);
        } else {
          console.log(error);
          let message = error.response && error.response.data.ERROR;
          Toast({
            message: message || '获取数据失败',
            position: 'bottom',
            duration: 4000
          });
        }
      });
    };

  };

  context['Native'] = new Native();

})(global[global['context']]);
