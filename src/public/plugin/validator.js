/**
 * @author umin
 * @since
 * @copyright Copyright (c) 2018, YZKJ
 * @description validator
 */
class ValidatorPlug {
  /**
   * constructor
   */
  constructor() {
    this.group = [];
    this.errors = [];
    this.init();
  };

  init() {
    /**
     * Validator
     */
    this.Validator = class Validator {
      constructor(option) {
        // console.log(option);
        this.el = option.el;
        this.binding = option.binding;
      };

      valid(e) {
        // let target = e.target.querySelector('input') || e.target.querySelector('.mint-cell-value');
        let el = this.el;
        let target = e.target || el.querySelector('input') || el.querySelector('.mint-cell-value');
        let value = target.value || target.innerText;
        if (KND.Util.hasClass(target, 'is-link') && value === '请选择') value = '';
        let tag = el.getAttribute('tag');
        let msg;
        if (!tag) console.error(el + 'not tag!');
        let modifiers = this.binding.modifiers;
        for (var m in modifiers) {
          let ms = m.split('|');
          for (var i in ms) {
            let flag = regexs[ms[i]].test(value);
            if (flag) {
              KND.Util.removeClass(el, 'error');
              break;
            } else {
              KND.Util.addClass(el, 'error');
              // this.Vue.$emit('error', {
              //  msg: getErrMsg(tag, m),
              //  tag: tag
              // });
            };
            msg = getErrMsg(tag, ms[i]);
          };
        };
        return msg;
      };
    };

    /**
     * regexs
     * @type {{rule: RegExp, numericRegex: RegExp, email: RegExp, fax: RegExp, phone: RegExp, url: RegExp, money: RegExp, english: RegExp, chinese: RegExp, percent: RegExp}}
     */
    let regexs = {
      require: /[^\s]/,
      // 匹配 max_length(12) => ['max_length',12]
      rule: /^(.+?)\((.+)\)$/,
      // 数字
      number: /^[0-9]+$/,
      /**
       * @descrition:邮箱规则
       * 1.邮箱以a-z、A-Z、0-9开头，最小长度为1.
       * 2.如果左侧部分包含-、_、.则这些特殊符号的前面必须包一位数字或字母。
       * 3.@符号是必填项
       * 4.右则部分可分为两部分，第一部分为邮件提供商域名地址，第二部分为域名后缀，现已知的最短为2位。最长的为6为。
       * 5.邮件提供商域可以包含特殊字符-、_、.
       */
      email: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
      /**
       * @descrition:判断输入的参数是否是个合格的固定电话号码。
       * 待验证的固定电话号码。
       * 国家代码(2到3位)-区号(2到3位)-电话号码(7到8位)-分机号(3位)
       **/
      fax: /^(([0+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
      /**
       *@descrition:手机号码段规则
       * 13段：130、131、132、133、134、135、136、137、138、139
       * 14段：145、147
       * 15段：150、151、152、153、155、156、157、158、159
       * 17段：170、176、177、178
       * 18段：180、181、182、183、184、185、186、187、188、189
       * 国际码 如：中国(+86)
       */
      phone: /^((\+?[0-9]{1,4})|(\(\+86\)))?(13[0-9]|14[57]|15[012356789]|17[03678]|18[0-9])\d{8}$/,
      /**
       * @descrition 匹配 URL
       */
      url: /[a-zA-z]+:\/\/[^\s]/,
      money: /^(0|[1-9]\d*)(\.\d+)?$/,
      english: /^[A-Za-z]+$/,
      chinese: /^[\u0391-\uFFE5]+$/,
      percent: /^(?:[1-9][0-9]?|100)(?:\.[0-9]{1,2})?$/
    };
    let getErrMsg = (tag, type) => {
      var errMsgs = {
        require: `${tag}不能为空`,
        number: `${tag}必须是数字`,
        email: `${tag}格式不正确`,
        fax: `${tag}格式错误`,
        phone: `${tag}格式错误`
      };
      return errMsgs[type];
    };
  };

  install(Vue, options) {
    let V = this.Validator;
    let group = this.group;
    let errors = this.errors;
    this.Vue = Vue;
    // Global Method
    Vue.prototype.valid = () => {
      errors = [];
      Array.prototype.map.call(group, r => {
        let result = r.v.valid(r.el);
        if (result) errors.push(result);
      });
      return errors;
    };
    // Global Directive
    Vue.directive('valid', {
      inserted: (el, binding) => {
        //
        let v = new V({
          el: el,
          binding: binding
        });
        // Add Style
        if (binding.modifiers.require) KND.Util.addClass(el, 'require');

        group.push({
          el: el,
          v: v
        });
        el.addEventListener('change', e => v.valid(e));
        el.addEventListener('blur', e => v.valid(e));
      },
      unbind: (el, binding) => {
        errors = [];
        group = [];
      }
    });
  };
};

export default new ValidatorPlug();
