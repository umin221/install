var base_library =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * @author umin
 * @copyright Copyright (c) 2018, YZKJ
 * @description 工具库
 */
(function(context) {

  class Util {

    constructor() {
      this.log('Util init...');
    };

    /**
     * json 字符串转 object
     * @param json json 字符串
     */
    parse(json) {
      try {
        return typeof json === 'string' ? JSON.parse(json) : json;
      } catch (e) {
        console.error('字符串转JSON对象失败！' + e);
        return { status: 'json parse fail！' };
      }
    };

    /**
     * 转数组对象
     */
    toArray(o) {
      return o === undefined ? [] : this.isArray(o) ? o : [o];
    };

    /**
     * 转时间对象
     */
    toDate(date) {
      return typeof date === 'string' ? new Date(date.replace(/-/g, '/')) : date;
    };

    /**
     * 判断是否数组
     * @param o
     * @returns {*|boolean}
     */
    isArray(o) {
      let ots = Object.prototype.toString;
      return o && (o.constructor === Array || ots.call(o) === '[object Array]');
    };

    /**
     * 判断是否对象
     * @param o
     * @returns {*|boolean}
     */
    isObject(o) {
      return typeof o === 'object';
    };

    /**
     * 判断是否布尔
     * @param o
     * @returns {*|boolean}
     */
    isBoolean(o) {
      return typeof o === 'boolean' || (o.constructor === Boolean);
    };

    /**
     * 判断是否数字
     * @param o
     * @returns {*|boolean}
     */
    isNumber(o) {
      return typeof o === 'number' || (o.constructor === Number);
    };

    /**
     * 判断是否 undefined
     * @param o
     * @returns {*|boolean}
     */
    isUndefined(o) {
      return o === undefined;
    };

    /**
     * 判断是否 null
     * @param o
     * @returns {*|boolean}
     */
    isNull(o) {
      return o === null;
    };

    /**
     * 是否无效值
     * @param o
     * @returns {*|boolean}
     */
    isInvalidValue(o) {
      return this.isNull(o) || this.isUndefined(o);
    };

    /**
     * 判断是否方法
     * @param o
     * @returns {*|boolean}
     */
    isFunction(o) {
      return typeof o === 'function' || (o.constructor === Function);
    };

    /**
     * 判断是否字符串
     * @param o
     * @returns {boolean|*}
     */
    isString(o) {
      return typeof o === 'string' || (o.constructor === String);
    };

    /**
     * 是否空对象
     * @param obj 对象
     * @returns {boolean} true / false
     */
    isEmptyObject(obj) {
      for (let n in obj) {
        return false;
      }
      return true;
    };

    /**
     * 时间格式化
     * @param date 日期字符串或对象
     * @param fmt 待转日期格式 eg: yyyy-MM-dd
     */
    format(date, fmt) {
      return new Date(date).format(fmt);
    };

    /**
     * 当前时间戳
     */
    now() {
      return new Date().getTime();
    };

    /**
     * 获取随机数
     * @param bit 位数
     * @returns {string} 随机数
     */
    random(bit) {
      bit = bit || 10;
      return Math.random().toString().substr(2, bit);
    };

    /**
     * 随机方法名
     * @param method 方法
     * @returns {string} 方法名
     */
    generateRandomNameForMethod(method) {
      let __name = 'random_name_' + new Date().getTime();
      window[__name] = function() {
        method.apply(null, Array.prototype.slice.call(arguments, 0));
        window[__name] = undefined;
      };
      return __name;
    };

    /**
     * 参数转换
     * @param obj
     */
    param(obj) {
      let arr = [];
      for (let i in obj) {
        arr.push(i + '=' + obj[i]);
      }
      return arr.join('&');
    };

    /**
     * SIEBEL 查询条件转换
     */
    condition(obj, entity, join = ' AND ', operator = '=') {
      let arr = [];
      entity = entity ? entity + '.' : '';
      for (let i in obj) {
        let val = obj[i];
        if (!this.isInvalidValue(val)) {
          val.indexOf('LookupValue') === -1 ? arr.push('[' + entity + i + ']' + operator + '"' + obj[i] + '"')
            : arr.push('[' + entity + i + ']' + operator + obj[i]);
        }
      }
      return arr.join(join);
    };

    /**
     * SIEBEL 查询条件转换
     */
    condition2D(obj, entity, join = ' AND ', operator = '=') {
      let arr = [];
      entity = entity ? entity + '.' : '';
      for (let i in obj) {
        let item = obj[i];
        if (item) {
          if (this.isArray(item)) {
            for (let j in item) {
              arr.push('[' + entity + i + ']' + operator + '"' + item[j] + '"');
            }
          } else {
            arr.push('[' + entity + i + ']' + operator + '"' + item + '"');
          }
        }
      }
      return `(${arr.join(join)})`;
    };

    /**
     * 获取url参数
     * @param name
     * @returns {null}
     */
    getParam(name) {
      let h = location.href;
      let param = h.substr(h.indexOf('?'));
      let reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(&|$)', 'i');
      let r = param.match(reg);
      if (r != null) return decodeURI(r[2]);
      return null;
    };

    /**
     * 设置url参数
     * @param name
     * @param value
     */
    setParam(name, value) {
      let content = this.getParam(name);
      location.replace((decodeURI(location.href).replace(content, value)));
    };

    /**
     * 日志输出
     */
    log(...args) {
      let normalStyle = 'padding:1px; color:#fff; background:#35495e; border-radius: 3px 0 0 3px;';
      let content = args.pop().split(' ');
      let style = normalStyle + (args.pop() || 'background:#41b883; border-radius: 0 3px 3px 0;');
      console.log('%c ' + content.join(' %c ') + ' %c',
        normalStyle,
        style,
        'background:transparent');
    };

    /**
     * 方法调用
     * @param method
     * @param args
     */
    invoke(method, ...args) {
      if (method) method.apply(this, args);
    };

    /**
     * 判断元素是否包含指定class
     * @param elements
     * @param cName
     * @returns {boolean}
     */
    hasClass(elements, cName) {
      return !!elements.className.match(new RegExp('(\\s|^)' + cName + '(\\s|$)')); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
    };

    /**
     * 元素添加class
     * @param elements
     * @param cName
     */
    addClass(elements, cName) {
      if (!this.hasClass(elements, cName)) elements.className += ' ' + cName;
    };

    /**
     * 元素移除class
     * @param elements
     * @param cName
     */
    removeClass(elements, cName) {
      if (this.hasClass(elements, cName)) elements.className = elements.className.replace(new RegExp('(\\s|^)' + cName + '(\\s|$)'), ' '); // replace方法是替换
    };

    /**
     * 获取当前平台类型
     * @returns {{}}
     */
    getDevice() {
      let ua = navigator.userAgent;
      let pf = navigator.platform;
      let platform = {};
      platform.android = ua.indexOf('Android') > -1;
      platform.iPhone = ua.indexOf('iPhone') > -1;
      platform.iPad = ua.indexOf('iPad') > -1;
      platform.iPod = ua.indexOf('iPod') > -1;
      platform.winPhone = ua.indexOf('IE') > -1;
      platform.PC = pf === 'MacIntel' || pf === 'Win32';
      platform.IOS = platform.iPad || platform.iPhone || platform.iPod;
      platform.touchDevice = 'ontouchstart' in window;
      return platform;
    };

    /**
     * DTO 对象 转换
     */
    mappDTO(target, image) {
      let obj = {};
      if (this.isArray(image)) {
        for (let i in image) {
          obj[image[i]] = target[image[i]];
        }
      } else {
        for (let i in image) obj[i] = target[i];
      }
      return obj;
    };

  };

  /**
   * 日期格式化
   * @param format 待转换的日期格式字符串 eg：yyyy-MM-dd
   */
  // eslint-disable-next-line
  Date.prototype.format = function(format) {
    if (this.getMonth() > -1) {
      let o = {
        'M+': this.getMonth() + 1, // month
        'd+': this.getDate(), // day
        'h+': this.getHours(), // hour
        'm+': this.getMinutes(), // minute
        's+': this.getSeconds(), // second
        'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
        'S': this.getMilliseconds() // millisecond
      };

      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      }

      for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
      };
    } else {
      format = '';
    }
    return format;
  };

  /**
   * 字符串比较 忽略大小写
   */
  // eslint-disable-next-line
  String.prototype.equalsIgnoreCase = function(str) {
    return this.toLowerCase() === str.toLowerCase();
  };

  context['Util'] = new Util();

})(global[global['context']]);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * @author umin
 * @copyright Copyright (c) 2018, YZKJ
 * @description session
 */
((context) => {

  const LOCK = 1521174072972;

  class Session {

    constructor() {
      context.Util.log('Session init...');
    };

    /**
     * 设置值
     * @param key
     * @param val
     */
    set(key, val) {
      key += LOCK;
      sessionStorage.setItem(key, val);
    };

    /**
     * 获取值
     * @param key
     */
    get(key) {
      key += LOCK;
      return sessionStorage.getItem(key);
    };

    /**
     * 删除值
     * @param key
     */
    remove(key) {
      key += LOCK;
      return sessionStorage.removeItem(key);
    };
  };

  context['Session'] = new Session();

})(global[global['context']]);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * @author umin
 * @copyright Copyright (c) 2018, YZKJ
 * @description event
 */
(function(context) {

  let stack = {};
  let point = {
    id: 1526649602787 // KND.Util.now()
  };

  class Event {
    bind() {
      var eventName, fn, pointer;
      var argArr = Array.prototype.slice.call(arguments, 0);
      if (argArr.length > 1) {
        eventName = argArr.shift();
        fn = argArr.shift();
        pointer = argArr.shift() || point;
      } else {
        return;
      }
      if (!stack[eventName]) {
        stack[eventName] = {
          callbacks: {}
        };
      }
      stack[eventName].callbacks[pointer.id] = fn;
    };
    emit() {
      var eventName, args, pointer;
      var argArr = Array.prototype.slice.call(arguments, 0);
      if (argArr.length > 0) {
        eventName = argArr.shift();
        args = argArr.shift() || {};
        pointer = argArr.pop();
        pointer = args.id && !pointer ? args : point;
      } else {
        return;
      }
      if (stack[eventName]) {
        let fn = stack[eventName].callbacks[pointer.id];
        if (fn) fn(args);
      }
    };
    unbind() {
      var eventName, pointer;
      var argArr = Array.prototype.slice.call(arguments, 0);
      if (argArr.length > 0) {
        eventName = argArr.shift();
        pointer = argArr.shift() || point;
      } else {
        return;
      }
      var callbacks = stack[eventName];
      if (callbacks) delete callbacks[pointer.id];
    };
  };

  context['Event'] = new Event();

})(global[global['context']]);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * @author umin
 * @copyright Copyright (c) 2018, YZKJ
 * @description 任务队列
 */
let tasks = [];
let status = 'stop';

class Queue {

  /**
   * 构造函数
   */
  constructor() {
    KND.Util.log('Queue init...');
  };

  /**
   * 添加任务
   * @param task
   */
  queue(task) {
    tasks.push(task);
    if (status === 'stop' && tasks.length === 1) this.execute(tasks[0]);
  };

  /**
   * 加载队列任务
   */
  dequeue() {
    status = 'stop';
    tasks.shift();
    if (tasks.length === 0) {
      // loading
      Indicator.close();
    } else {
      this.execute(tasks[0]);
    }
  };

  /**
   * 执行任务
   * @param task
   */
  execute(task) {
    let me = this;
    let success = task['success'];
    let error = task['error'];

    status = 'running';
    task.success = data => {
      me.dequeue();
      if (success) success(data);
    };
    task.error = err => {
      me.dequeue();
      if (error) {
        error(err);
      } else {
        let message = err.response && err.response.data.ERROR;
        // 屏蔽空数据报错
        if (message === 'There is no data for the requested resource') {
          success({});
          return;
        }
        console.error(err);
        Toast({
          message: message || '获取数据失败',
          position: 'bottom',
          duration: 4000
        });
      }
    };

    // start loading
    if (task.loading !== false) Indicator.open({ spinnerType: 'fading-circle' });

    // start task
    task.execute(task);
  };
};

/* harmony default export */ __webpack_exports__["default"] = (new Queue());


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__rules__ = __webpack_require__(16);
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
            let flag = __WEBPACK_IMPORTED_MODULE_0__rules__["default"][ms[i]].test(value) || (!modifiers.require && !value);
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

    let getErrMsg = (tag, type) => {
      var errMsgs = {
        require: `${tag}不能为空`,
        number: `${tag}必须是数字`,
        email: `${tag}格式不正确`,
        fax: `${tag}格式错误`,
        phone: `${tag}格式错误`,
        nonNegative: `${tag}不能是负数`,
        positiveInteger: `${tag}必须为正整数`
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

/* harmony default export */ __webpack_exports__["default"] = (new ValidatorPlug());


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * rules
 * @type {{rule: RegExp, numericRegex: RegExp, email: RegExp, fax: RegExp, phone: RegExp, url: RegExp, money: RegExp, english: RegExp, chinese: RegExp, percent: RegExp}}
 */
/* harmony default export */ __webpack_exports__["default"] = ({
  require: /[^\s]/,
  // 匹配 max_length(12) => ['max_length',12]
  rule: /^(.+?)\((.+)\)$/,
  // 数字
  number: /^[0-9]+$/,
  // 非负数
  nonNegative: /^\d+(\.{0,1}\d+){0,1}$/,
  // 正整数
  positiveInteger: /^[1-9]\d*$/,
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
});


/***/ })
/******/ ]);