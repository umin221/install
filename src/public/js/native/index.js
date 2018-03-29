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
  // 是否本地调试
  let debug = config.debug;
  // 缓存超时
  let exp = config.cacheExp;
  // 时间戳
  const LOCK = 1521174072972;
  // 会话缓存
  let session = {
    set: (key, val) => {
      key += LOCK;
      sessionStorage.setItem(key, val);
    },
    get: (key) => {
      key += LOCK;
      return sessionStorage.getItem(key);
    },
    remove: (key) => {
      key += LOCK;
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
     * 图库选图 或 拍照
     * @param {Number} option.count 选填 默认为1，数量
     * @param {Array} option.sizeType 选填 ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
     * @param {Array} option.sourceType 可以指定来源是相册还是相机，默认二者都有
     * @response {Array} res.localIds ["img:///storage/emulated/0/xxx/xxx/xxx.jpg"] 拍照结果
     * @response {String} res.errMsg chooseImage:ok
     */
    chooseImage(option) {
      wx.chooseImage(Object.assign({
        count: 1, // 默认9
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function(res) {
          var localIds = res.localIds; // 返回选定照片的本地ID列表，
          // andriod中localId可以作为img标签的src属性显示图片；
          // 而在IOS中需通过上面的接口getLocalImgData获取图片base64数据，从而用于img标签的显示
          console.log(localIds);
        }
      }, option));
      // 本地调试
      if (debug) {
        KND.Util.invoke(option.success, {
          localIds: ['img:///storage/emulated/0/Tencent/WeixinWork/tempimagecache/1688852028455906/b4bc209fa2f44c64a57c159645330240.jpg'],
          errMsg: 'chooseImage:ok'
        });
      }
    };

    /**
     * 上传本地图片
     * @param {Number} option.isShowProgressTips 选填 默认为1，显示进度提示
     * @param {String} option.localId 必填 'img:///storage/emulated/0/xxx/xxx/xxx.jpg', 需要上传的图片localId
     * @response {Array} res.serverId "1sb9A-V1qJt4tcfiKMM4UzpjMHuBHMMIIgYKl96OQ1_pBe8h0xte9G6aTPNjEQaYI" 上传结果
     * @response {String} res.errMsg uploadImage:ok
     */
    uploadImage(option) {
      wx.uploadImage(Object.assign({
        localId: '', // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 1, //
        success: function(res) {
          var serverId = res.serverId; // 返回图片的服务器端ID
          console.log(serverId);
        }
      }, option));
      // 本地调试
      if (debug) {
        KND.Util.invoke(option.success, {
          serverId: '1sb9A-V1qJt4tcfiKMM4UzpjMHuBHMMIIgYKl96OQ1_pBe8h0xte9G6aTPNjEQaYI',
          errMsg: 'uploadImage:ok'
        });
      }
    };

    /**
     * 预览图片
     * @param {String} option.current 必填 当前显示图片的http链接
     * @param {Array} option.urls 必填 需要预览的图片http链接列表
     */
    previewImage(option) {
      wx.previewImage(Object.assign({
        urls: ['http://n.sinaimg.cn/translate/653/w400h253/20180322/0sp9-fyskeue4878551.jpg']
      }, option));
    };

    /**
     * 扫一扫
     * @param {String} option.desc
     * @param {Number} option.needResult 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
     * @param {String} option.scanType 可以指定扫二维码还是一维码，默认二者都有
     * @response {String} res.errMsg scanQRCode:ok
     * @response {String} res.resultStr xxxx 扫描结果
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
