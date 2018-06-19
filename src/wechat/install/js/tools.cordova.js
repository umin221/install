/**
 * @author umin
 * @since
 * @copyright Copyright (c) 2018, YZKJ
 * @description cordova tools
 */
let util = KND.Util;
/* eslint-disable */
class Cordova {
  constructor() {
    util.log('CordovaTools init...');
    this.init();
  };

  init() {
    this.initEvent();
    this.app = {
      version: '*.*.*'
    };
  };

  /**
   * 初始化事件
   */
  initEvent() {
    let me = this;
    // 网络离线
    document.addEventListener('offline', function() {
      console.log('offline');
    }, false);
    // 网络在线
    document.addEventListener('online', function() {
      console.log('online');
    }, false);
    // 设备启动
    document.addEventListener('deviceready', function() {
      me.onDeviceReady();
    }, false);
    //监听返回键按钮事件
    //document.addEventListener("backbutton", function() {
    //}, false);
  };

  /**
   * 设备准备完成回调
   */
  onDeviceReady() {
    this.fetchUpdate();
    this.getDevice();
    this.getAppVersion();
  };

  /**
   * 获取更新
   */
  fetchUpdate() {
    let me = this;
//    upgrade mode
    let upgrade = config.upgrade;
//    check, if update was previously loaded and available for download
//    chcp.isUpdateAvailableForInstallation(function(error, data) {
//      console.log('isUpdateAvailableForInstallation: ' + JSON.stringify(error));
//      if (error) {
        chcp.fetchUpdate((error, data) => {
          console.log('fetchUpdate: ' + JSON.stringify(error));
          if (!error) {
            console.log('--------发现新版本，准备更新--------');
            // update
            let update = () => {
              Indicator.open('--------正在更新--------');
              return new Promise((resolve, reject) => {
                // install update
                chcp.installUpdate((error) => {
                  console.log('installUpdate: ' + JSON.stringify(error));
                  error ? reject(error) : resolve();
                });
              });
            };
//            默认提示升级
            if (upgrade === 'default') {
              me.confirm('发现新版本', result => {
                if (result === 2) {
                  update().then(() => {
                    me.alert('升级完成');
                  });
                } else {
                  console.log('--------取消更新--------');
                }
              }, '请确认', ['取消', '更新']);
//              静默升级 silent
            } else {
              update().then(() => {
                console.log('Update installed!');
              });
            }
          } else {
            console.log('--------没有发现新版本--------');
          }
        });
//      }
//    });
  };

  /**
   * 条形码扫描
   *
   function (result) {
        alert("We got a barcode\n" +
          "Result: " + result.text + "\n" +
          "Format: " + result.format + "\n" +
          "Cancelled: " + result.cancelled);
      },
   function (error) {
        alert("Scanning failed: " + error);
      }
   */
  scan(success, fail) {
    if (window.cordova) {
      cordova.plugins.barcodeScanner.scan(success, err => {
        console.error(err);
      });
    } else {
      success({
        text: '6917878030623'
      });
    }
  };

  /**
   * 使用zbar库扫码
   * @param {Object} option 启用配置
   * @param {String} success 成功回调
   * @param fail
   */
  zBarScan(option, success, fail) {
    let defaultOpt = {
      text_title: "条码扫描", // Android only
      text_instructions: "请对准条码", // Android only
      camera: "back", // defaults to "back"
      flash: "auto", // defaults to "auto". See Quirks
      drawSight: true //defaults to true, create a red sight/line in the center of the scanner view.
    };
    if (typeof option === 'function') {
      success = option;
    } else {
      defaultOpt = Object.assign(defaultOpt, option);
    }
    if (cloudSky) {
      cloudSky.zBar.scan(defaultOpt, success, function(s) {
        console.log(s);
      });
    } else {
      success('6917878030623');
    }
  };

  /**
   * APP进入后台
   */
  goHome() {
    navigator.Backbutton.goHome(() => {
      console.log('goHome success');
    }, function() {
      console.log('goHome success1');
    });
  };

  /**
   * 检测当前网络状态
   * @return {String} wifi/4g
   */
  checkNetwork() {
    return navigator.connection.type || 'wifi';
  };

  /**
   * 提示框
   * @param msg
   * @param {Function} cb
   * @param {String} title
   * @param {String} text
   */
  alert(msg, cb, title = '提示', text = '确定') {
    if (navigator.notification) {
      navigator.notification.alert(msg, cb, title, text);
    } else {
      alert(msg);
    }
  };

  /**
   * 确认对话框
   * @param msg message
   * @param {Function} cb 回调 按钮角标 例如取消 回调 1， 确认回调 2
   * @param {String} title
   * @param {Array} text buttonName
   */
  confirm(msg, cb, title = '提示', text = ['取消', '确认']) {
    if (navigator.notification) {
      navigator.notification.confirm(msg, cb, title, text);
    } else {
      let flag = confirm(msg);
      cb(flag ? 2 : 1);
    }
  };

  getDevice() {
    this.platform = KND.Util.getDevice();
  };

  /**
   * 获取当前app版本
   */
  getAppVersion() {
//    let me = this;
    let platform = this.platform.IOS ? 'ios' : 'android';
    if (cordova) {
      cordova.getAppVersion.getVersionNumber().then(version => {
        if (version !== config[platform].version) {
          console.log('app需要更新，请前往公众号更新');
//          me.confirm('发现新版本', result => {
//            if (result === 2) {
//            } else {
//              console.log('--------取消更新--------');
//            }
//          }, '请确认', ['取消', '更新']);
        }

        this.app.version = version
      });
    }
  };

}; tools.cordova = new Cordova();
