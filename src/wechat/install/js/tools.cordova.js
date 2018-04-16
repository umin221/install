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
    let me = this;
    document.addEventListener('offline', function() {
      console.log('offline');
    }, false);
    document.addEventListener('online', function() {
      console.log('online');
    }, false);
    document.addEventListener('deviceready', function() {
      // 说明：这里的使用了Framework7
      chcp.fetchUpdate(function(error, data) {
        if (!error) {
          me.confirm('有更新，确定更新吗?', result => {
            if (result === 1) {
              me.alert('正在升级，升级完毕应用将自动重启...');
              chcp.installUpdate(error => {
                me.alert('更新完成');
              });
            } else {
              console.log('取消更新！');
            }
          });
        } else {
          console.log('你当前是最新版本', ['提示']);
        }
      });
    }, false);
  };

  /**
   * 检测当前网络状态
   * wifi/4g
   */
  checkNetwork() {
    return navigator.connection.type;
  };

  /**
   * 提示框
   * @param msg
   * @param cb
   * @param title
   * @param text
   */
  alert(msg, cb, title = '提示', text = '确定') {
    navigator.notification.alert(
      msg,                  // message
      cb,                   // callback
      title,                // title
      text                  // buttonName
    );
  };

  /**
   * 确认对话框
   * @param msg
   * @param cb 回调 按钮角标 例如确定 回调 1， 取消回调 2
   * @param title
   * @param text
   */
  confirm(msg, cb, title = '提示', text = ['确认', '取消']) {
    navigator.notification.confirm(
      msg,                  // message
      cb,                   // callback
      title,                // title
      text                  // buttonName
    );
  }

}; tools.cordova = new Cordova();
