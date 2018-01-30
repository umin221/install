/**
 * @author umin
 * @copyright Copyright (c) 2018, YZKJ
 * @description 工具库
 */
import axios from 'axios';
import {Toast} from 'mint-ui';

(function(context) {

  class Native {

    constructor() {
      console.info('native init ...');
    };

    /**
     *
     * @returns {string}
     */
    getLoginInfo() {
      return 'umin';
    };

    /**
     *
     * @param option
     */
    ajax(option) {
      axios(option).then((response) => {
        option.success(response.data);
      }).catch((error) => {
        if (option.error) {
          option.error(error);
        } else {
          // eslint-disable-next-line
          Toast({
            message: '获取数据失败',
            position: 'bottom',
            duration: 2000
          });
        }
      });
    };

  };

  context['Native'] = new Native();

})(global[global['context']]);
