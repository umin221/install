/**
 * @author umin
 * @copyright Copyright (c) 2018, YZKJ
 * @description 工具库
 */
(function(context) {

  class Util {

    constructor() {
      console.info('util init ...');
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
      return this.isArray(o) ? o : [o];
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
      var ots = Object.prototype.toString;
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
      for (var n in obj) {
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
      var __name = 'random_name_' + new Date().getTime();
      window[__name] = function() {
        method.apply(null, Array.prototype.slice.call(arguments, 0));
        window[__name] = undefined;
      };
      return __name;
    };

  };

  /**
   * 日期格式化
   * @param format 待转换的日期格式字符串 eg：yyyy-MM-dd
   */
  // eslint-disable-next-line
  Date.prototype.format = function(format) {
    var o = {
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

    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
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
