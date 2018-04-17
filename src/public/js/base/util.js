/**
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
      return arr.join(join);
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

  };

  /**
   * 日期格式化
   * @param format 待转换的日期格式字符串 eg：yyyy-MM-dd
   */
  // eslint-disable-next-line
  Date.prototype.format = function(format) {
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
    return format === 'NaN-aN-aN' ? '' : format;
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
