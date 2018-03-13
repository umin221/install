/**
 * @author umin
 * @copyright Copyright (c) 2018, YZKJ
 * @description 工具库
 */
(function(global) {

  class Tools {

    constructor() {
      KND.Util.log('Tools init...');
    };

    /**
     * 标准成功返回处理回调
     */
    success(data, option = {}) {
      let opt = Object.assign({
        successTips: '操作成功!', // 成功提示
        errorTips: '', // 错误提示
        back: false // 成功后是否返回
      }, option);
      // 成功回调
      let success = opt.success;
      // 失败回调
      let error = opt.error;
      let tips = opt.errorTips;
      // 有 ERROR 表示失败
      let errorMessage = data.ERROR;

      if (errorMessage) {
        error ? error() : Toast(tips || errorMessage);
      } else {
        if (success) {
          success();
        } else {
          tips = opt.successTips;
          Toast(tips);
          if (opt.back) KND.Util.back();
        }
      }
    };

  };

  global['tools'] = new Tools();

})(window);
