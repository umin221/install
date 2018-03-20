/**
 * @author umin
 * @copyright Copyright (c) 2018, YZKJ
 * @description 工具库
 */
import axios from 'axios';
import cache from '../lib/cache';

(function(context) {
  // 工具类
  let Util = context['Util'];
  // 用户ID
  let userID;
  // 缓存超时
  let exp = config.cacheExp;
  // 时间戳
  const lock = 1521174072972;
  // 会话缓存
  let session = {
    set: (key, val) => {
      key += lock;
      sessionStorage.setItem(key, val);
    },
    get: (key) => {
      key += lock;
      return sessionStorage.getItem(key);
    },
    remove: (key) => {
      key += lock;
      return sessionStorage.removeItem(key);
    }
  };

  /**
   * 本地化服务
   */
  class Native {

    /**
     * 构造函数
     */
    constructor() {
      Util.log('Native init...');

      userID = this.getUserID();
      Object.defineProperty(this, 'userID', {
        enumerable: false,
        configurable: true,
        get: () => {
          console.info('当前用户ID：' + userID);
          return userID;
        },
        set: (val) => {
          session.remove('userInfo');
          console.info('设置用户ID：' + val);
          userID = val;
          session.set('userID', val);
        }
      });
    };

    /**
     * 获取用户信息
     * @param {Function} callback 必填 回调函数
     * @response {Object} data 用户信息 包含职位等数据
     */
    getUserInfo(callback) {
      Util.log('获取用户信息 ' + userID);
      let user = session.get('userInfo');
      if (user) {
        callback(Util.parse(user));
      } else {
        this.ajax({
          method: 'get',
          url: 'data/KL Employee Interface BO/Employee/?searchspec=[Login Name] = "' + userID + '" &PageSize=2&StartRowNum=0',
          success: data => {
            session.set('userInfo', JSON.stringify(data.items));
            callback(data.items);
          }
        });
      };
    };

    /**
     * 获取用户ID
     * @returns {string} 用户userID
     * IM02 IE01
     */
    getUserID() {
      return session.get('userID') || 'IM02' || Util['getParam']('userID');
    };

    /**
     * 扫一扫
     * @param {String} option.desc
     * @param {Number} option.needResult 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
     * @param {String} option.scanType 可以指定扫二维码还是一维码，默认二者都有
     * @response {String} res 扫描结果
     */
    scanQRCode(option) {
      wx.scanQRCode(Object.assign({
        desc: 'scanQRCode desc',
        needResult: 1,
        scanType: ['qrCode', 'barCode'],
        success: function(res) {
          console.log(res);
        },
        error: function(res) {
          if (res.errMsg.indexOf('function_not_exist') > 0) {
            alert('版本过低请升级');
          }
        }
      }, option));
    };

    /**
     * 获取当前位置信息
     * @param {String} option.type 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
     * @response {String} res.latitude 纬度，浮点数，范围为90 ~ -90
     * @response {String} res.longitude 经度，浮点数，范围为180 ~ -180。
     * @response {String} res.speed 速度，以米/每秒计
     * @response {String} res.accuracy 位置精度
     */
    getLocation(option) {
      wx.getLocation(Object.assign({
        type: 'wgs84',
        success: function(res) {
          console.log(res);
        }
      }, option));
    };

    /**
     * 异步请求
     * @param {Object} option 必填 ajax setting
     */
    online(option) {
      // loading
      if (option.loading !== false) {
        Indicator.open({
          spinnerType: 'fading-circle'
        });
      };
      // post data
      let setting = Object.extend(true, {
        headers: {
          'Authorization': 'Basic ' + btoa(userID + ':' + userID)
        },
        timeout: 30000,
        method: 'post'
      }, option);
      // url valid
      if (!/^http/i.test(option.url)) {
        setting.url = config.host + config.context + setting.url;
      };
      // get data
      axios(setting).then(response => {
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
      }).catch(error => {
        Indicator.close();
        if (option.error) {
          option.error(error);
        } else {
          console.error(error);
          let message = error.response && error.response.data.ERROR;
          Toast({
            message: message || '获取数据失败',
            position: 'bottom',
            duration: 4000
          });
        }
      });
    };

    /**
     * 异步请求&cache
     * @param {Object} option 必填 ajax setting
     */
    cache(option) {
      // 是否支持数据缓存
      if (cache.isSupport) {
        let data = cache.get(option.url);
        if (data) {
          option.success(data);
        } else {
          let success = option.success;
          option.success = data => {
            cache.set(option.url, data, {exp: exp});
            success(data);
          };
          this.online(option);
        }
      } else {
        this.online(option);
      }
    };

    /**
     * 异步请求接口
     * @param {Object} option 必填 ajax setting
     */
    ajax(option) {
      this[option.cache ? 'cache' : 'online'](option);
    }

  };

  context['Native'] = new Native();

})(global[global['context']]);
