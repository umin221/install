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
      me.ready();
    }, false);
    //监听返回键按钮事件
    //document.addEventListener("backbutton", function() {
    //}, false);
  };

  /**
   * cordova 启动完成回调
   */
  ready() {
    this.checkUpdate();
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
   * 检测更新
   */
  checkUpdate() {
    // 说明：这里的使用了Framework7
    chcp.fetchUpdate(function(error, data) {
      if (!error) {
        me.confirm('有更新，确定更新吗?', result => {
          if (result === 2) {
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