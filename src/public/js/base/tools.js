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
    success(data = {}, option = {}) {
      let opt = Object.assign({
        successTips: '操作成功!', // 成功提示
        errorTips: '', // 错误提示
        back: false, // 成功后是否返回
        error: tips => Toast(tips),
        success: (tips, back) => {
          Toast(tips);
          if (back) KND.Util.back();
        }
      }, option);
      // 有 ERROR 表示失败
      let errorMessage = data.ERROR;
      if (errorMessage) {
        opt.error(opt.errorTips || errorMessage);
      } else {
        opt.success(opt.successTips, opt.back);
      };
    };

    /**
     * 表单验证
     */
    valid(option) {
      let errors = this.valid();
      let opt = {
        error: errors => Toast({
          message: errors.join(' ， '),
          position: 'bottom',
          duration: 5000
        }),
        success: () => {}
      };
      if (KND.Util.isFunction(option)) {
        opt.success = option;
      } else {
        let opt = Object.assign(opt, option);
      };
      if (errors.length) {
        opt.error(errors);
      } else {
        opt.success();
      };
    };

  };

  global['tools'] = new Tools();

})(window);
