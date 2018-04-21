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
    this.getUpdateController();
  };

  /**
   * 获取更新
   */
  getUpdateController() {
    let me = this;
    // check, if update was previously loaded and available for download
    chcp.isUpdateAvailableForInstallation(function(error, data) {
      console.log('isUpdateAvailableForInstallation: ' + JSON.stringify(error));
      if (error) {
        chcp.fetchUpdate((error, data) => {
          console.log('fetchUpdate: ' + JSON.stringify(error));
          if (!error) {
            Indicator.open('正在更新');
            chcp.installUpdate((error) => {
              console.log('installUpdate: ' + JSON.stringify(error));
              if (!error) {
                me.alert('升级完成，重新启动');
                console.log('Update installed!');
              }
            });
          }
        });
      }
    });
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
   * wifi/4g
   */
  checkNetwork() {
    return navigator.connection.type || 'wifi';
  };

  /**
   * 提示框
   * @param msg
   * @param cb
   * @param title
   * @param text
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
   * @param cb 回调 按钮角标 例如取消 回调 1， 确认回调 2
   * @param title
   * @param text buttonName
   */
  confirm(msg, cb, title = '提示', text = ['取消', '确认']) {
    if (navigator.notification) {
      navigator.notification.confirm(msg, cb, title, text);
    } else {
      let flag = confirm(msg);
      cb(flag ? 2 : 1);
    }
  }

}; tools.cordova = new Cordova();
