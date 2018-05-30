/**
 * @author umin
 * @since
 * @copyright Copyright (c) 2018, YZKJ
 * @description validator
 */
import rules from './rules';

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
            let rule = rules[ms[i]];
            let flag = rule.reg.test(value) || (!modifiers.require && !value);
            if (flag) {
              KND.Util.removeClass(el, 'error');
              break;
            } else {
              KND.Util.addClass(el, 'error');
            };
            msg = rule.msg(tag);
          };
        };
        return msg;
      };
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
        for (let i in group) {
          if (group[i].el === el) {
            group.splice(i, 1);
          }
        }
        errors = [];
//        group = [];
      }
    });
  };
};

export default new ValidatorPlug();
