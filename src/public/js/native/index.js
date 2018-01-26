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
        option.callback(response.data);
      }).catch((error) => {
        option.callback(error);
      });
    };

  };

  context['Native'] = new Native();

})(global[global['context']]);
