/**
 * @author umin
 * @since
 * @copyright Copyright (c) 2018, YZKJ
 * @description cache
 */
import api from '../api/api';

let db = require('public/js/lib/db.sqlit');
//
let util = KND.Util;
// 获取当前时间戳
let now = util.now;

/**
 * 构造创建字段
 * @param {Array} field 表字段数组
 * @returns {{}}
 */
let buildCreateField = field => {
  let property = {};
  for (var i in field) {
    property[i] = field[i] || 'VARCHAR(200)';
  };
  return property;
};

/**
 * 查询数据过滤
 * @param data
 */
let filter = data => {
  return data.length ? util.parse(data[0].data) : data;
};

/**
 * helper
 */
class Helper {

  /**
   * 执行SQL
   * @param method sql 方法
   * @param callback
   */
  invokeSQL(...args) {
    let method = args.shift();
    if (!method) return;
    // eslint-disable-next-line
    return new Promise((resolve, reject) => {
      try {
        args.push(data => resolve(data));
        db[method](...args);
      } catch (e) {
        reject(e);
      }
    });
  };

  /**
   * 查询数据
   * @param {String} table 表名
   * @param {Object} condition 查询条件
   * @param callback
   */
  query(table, condition, callback) {
    let conditionArr = ['1=1'];
    for (var i in condition) conditionArr.push(`${i}='${condition[i]}'`);
    db.query((`select * from ${table} where ${conditionArr.join(' and ')}`), data => {
      var arr = [];
      for (var i = 0; i < data.rows.length; i++) {
        arr.push(data.rows.item(i));
      }
      callback(arr);
    });
  };

  /**
   * 严格模式查询
   */
  queryStrict(table, condition, callback) {
    let me = this;
    let arr = [];
    me.invokeSQL('gts', table).then(result => {
      result ? me.query(table, condition, callback) : callback(arr);
    });
  };

  /**
   * 删除记录
   * @param {String} table 必填 表名
   * @param {Object} condition 必填 查询条件
   * @param {Function} callback
   */
  delete(table, condition, callback) {
    let conditionArr = ['1=1'];
    for (let i in condition) conditionArr.push(`${i}=${condition[i]}`);
    db.query((`delete from ${table} where ${conditionArr.join(' and ')}`), data => {
      callback(data);
    });
  };

  /**
   * 更新或插入数据，id存在记录则更新，否则插入记录
   * @param {String} table 必填 表名
   * @param {Object} data 必填 更新或插入数据
   * @param {Object} condition 必填 查询条件
   * @param {Function} callback
   */
  upsert(table, data, condition, callback) {
    this.query(table, condition, result => {
      result.length ? db.updateByCondition(table, data, condition, callback) : db.insert(table, data, callback);
    });
  };

  /**
   * 清除缓存
   * @returns {Promise}
   */
  clear(all) {
    let me = this;
    return new Promise((resolve, reject) => {
      console.log('------------ 获取最新数据 start ------------');
      console.log('清除历史数据...');
      Indicator.process('正在初始化...');
      me.invokeSQL('gt').then(result => {
        let tasks = [];
        result = util.toArray(result);
        for (let i = 0, len = result.length; i < len; i++) {
          let table = result[i];
          // 非全量初始化
          if (!all && table === 'user') continue;
          console.log(`清除数据库表 ${table}...`);
          tasks.push(me.invokeSQL('dt', table));
        };
        Promise.all(tasks).then(() => {
          console.log('clear ok...');
          resolve();
        });
      });
    });
  };

  /**
   * 初始化数据库表
   * @returns {Promise}
   */
  create(all) {
    let me = this;
    return new Promise((resolve, reject) => {
      console.log('初始化数据库表...');
      let tasks = [
        me.invokeSQL('ct', 'user', buildCreateField({user_id: null, data: null, state: null, create_date: null})).then(result => {
          console.log('创建数据库表 user...');
        }),
        me.invokeSQL('ct', 'batch', buildCreateField({data: 'VARCHAR(20000)', state: null, create_date: null})).then(result => {
          console.log('创建数据库表 batch...');
        }),
        me.invokeSQL('ct', 'building', buildCreateField({order_id: null, task_id: null, data: 'VARCHAR(2000)', state: null, create_date: null})).then(result => {
          console.log('创建数据库表 building...');
        }),
        me.invokeSQL('ct', 'assets', buildCreateField({order_id: null, task_id: null, building_num: null, data: 'VARCHAR(20000)', state: null, create_date: null})).then(result => {
          console.log('创建数据库表 assets...');
        }),
        me.invokeSQL('ct', 'order_line', buildCreateField({order_id: null, data: 'VARCHAR(2000)', state: null, create_date: null})).then(result => {
          console.log('创建数据库表 order_line...');
        }),
        me.invokeSQL('ct', 'install_record', buildCreateField({id: null, data: null, state: null, create_date: null})).then(result => {
          console.log('创建数据库表 install_record...');
        })
      ];
      // 非全量初始化
      if (!all) tasks.shift();
      Promise.all(tasks).then(() => {
        console.log('init ok...');
        Indicator.process('初始化完成...');
        resolve();
      });
    });
  };
}; let helper = new Helper();

/**
 * data handle
 */
class DataHandle {

  /**
   * 构造函数
   */
  constructor() {
    util.log('DataHandle init...');
    let me = this;
    document.addEventListener('online', function() {
      handle.getPendingInstallRecord(result => {
        if (result.length) {
          me.checkNetwork();
        };
      });
    }, false);
  };

  /**
   * 检测当前网络环境
   */
  checkNetwork() {
    console.log('check network...');
    let me = this;
    let state = tools.cordova.checkNetwork();
    if (state !== 'none') {
      // 检测4g确认后提交
      state !== 'wifi' ? tools.cordova.confirm('当前非wifi环境，是否确认提交？', result => {
        if (result === 2) me.submit();
      }) : me.submit();
    }
  };

  /**
   * 查找本地未提交安装记录
   * @param {Function} callback 必填 回调函数
   */
  getPendingInstallRecord(callback) {
    helper.queryStrict('install_record', {state: 'pending'}, callback);
  };

  /**
   * 提交本地安装信息
   */
  submit() {
    this.getPendingInstallRecord(data => {
      // 未提交数据
      if (data.length) {
        Indicator.process('正在提交本地数据...');
        // 制定提交记录任务
        let tasks = [];
        let result = [];
        for (let i = 0, len = data.length; i < len; i++) {
          let item = data[i];
          tasks.push(new Promise((resolve, reject) => {
            api.get({
              key: 'installOrderAssets',
              data: util.parse(item.data),
              success: data => {
                result.push(item);
                // 提交成功后修改数据状态
                db.update('install_record', {state: 'finish'}, `'${item.id}'`, result => {
                  resolve(result);
                });
              },
              error: () => {
                let failRecord = util.parse(item.data);
                Toast(`记录<${failRecord['Id']} , ${failRecord['Serial Number']}> 提交失败`);
                console.log(failRecord);
              }
            });
          }));
        };
        Promise.all(tasks).then(result => {
          console.log(result);
          MessageBox.alert(`成功提交${result.length}条安装记录！`, '恭喜');
          KND.Event.emit('submitHook');
          Indicator.process(false);
        }).catch(err => {
          console.error(err);
          KND.Event.emit('submitHook');
          Indicator.process(false);
        });
      } else {
        // 无数据提交
        Toast({
          message: '暂无本地记录',
          position: 'bottom'
        });
      };
    });
  };

}; let handle = new DataHandle();

/**
 * cache 数据缓存
 */
class Cache {

  /**
   * 构造函数
   */
  constructor() {
    util.log('Cache init...');
  };

  /**
   * 公共暴露
   * @param {Object} setting 参数请求配置
   */
  invoke(setting) {
    console.log(setting);
    let localMethod = {'queryLocalInstallRecord': 1};
    if (config.offline || localMethod[setting.key]) {
      let method = this[setting.key];
      method ? method.call(this, setting) : console.error(`${setting.key} is not a function`);
    } else {
      api.get(setting);
    }
  };

  /**
   * 初始化数据库
   * 1. 删除数据表
   * 2. 创建数据表
   */
  init(callback) {
    // 初始化删除所有数据表
    const ALL = 'all';
    helper.clear(ALL).then(result => helper.create(ALL)).then(result => callback(result));
  };

  /**
   * 获取最新数据
   * 1. 删除数据表
   * 2. 创建数据表
   * 3. 缓存数据
   * @param {Object} data 必填 批次汇总
   */
  refresh(data) {
    let me = this;
    handle.getPendingInstallRecord(result => {
      if (result.length) {
        tools.cordova.alert('检测到本地还有未提交的数据，请先提交数据');
      } else {
        helper.clear().then(result => helper.create()).then(result => me.reCache(data)).catch(err => console.error(err));
      }
    });
  };

  /**
   * 刷新缓存
   * @param {Object} setting 接口参数配置
   */
  reCache(data = {}) {
    /**
     * 1. 缓存批次数据
     * 2. 缓存楼栋数据
     * 3. 缓存房号资产数据
     */
    let invokeSQL = helper.invokeSQL;
    return new Promise((resolve, reject) => {
      resolve(data);
    }).then(data => {
      // 1. 缓存批次数据
      return new Promise((resolve, reject) => {
        console.log(data);
        console.log('开始缓存批次...');
        Indicator.process('正在缓存批次数据...');
        invokeSQL('insert', 'batch', {
          data: JSON.stringify(data),
          create_date: now()
        }).then(result => {
          let batchs = data.SiebelMessage;
          batchs = batchs && batchs.Contact;
          let installTask = util.toArray(batchs['KL Installation Task']);
          console.log('批次缓存完成...');
          resolve(installTask);
        });
      });
    }).then(batchs => {
      // 2. 缓存订单行
      return new Promise((resolve, reject) => {
        console.log('开始缓存订单行...');
        Indicator.process('正在缓存订单数据...');
        let tasks = [];
        for (let i = 0, len = batchs.length; i < len; i++) {
          tasks.push(new Promise((resolve, reject) => {
            let batch = batchs[i];
            api.get({
              key: 'queryOrderLines',
              data: {
                'Order Header Id': batch['Order Id']
              },
              success: data => {
                console.log(data);
                invokeSQL('insert', 'order_line', {
                  order_id: batch['Order Id'],
                  data: JSON.stringify(data),
                  create_date: now()
                }).then(resolve);
              },
              error: err => {
                console.error(`订单失败：${err}`);
                resolve(err);
              }
            });
          }));
        };
        Promise.all(tasks).then(result => {
          console.log('订单行缓存完成...');
          resolve(batchs);
        });
      });
    }).then(batchs => {
      // 3. 缓存楼栋数据
      return new Promise((resolve, reject) => {
        console.log('开始缓存楼栋...');
        Indicator.process('正在缓存楼栋数据...');
        let tasks = [];
        for (let i = 0, len = batchs.length; i < len; i++) {
          tasks.push(new Promise((resolve, reject) => {
            let batch = batchs[i];
            api.get({
              key: 'queryBuilding',
              data: {
                TaskId: batch.Id
              },
              success: data => {
                console.log(data);
                batch.building = data;
                invokeSQL('insert', 'building', {
                  order_id: batch['Order Id'],
                  task_id: batch.Id,
                  data: JSON.stringify(data),
                  create_date: now()
                }).then(resolve);
              },
              error: err => {
                console.error(`楼栋失败：${err}`);
                resolve(err);
              }
            });
          }));
        };
        Promise.all(tasks).then(result => {
          console.log('楼栋缓存完成...');
          resolve(batchs);
        });
      });
    }).then(result => {
      // 4. 缓存房号资产数据
      return new Promise((resolve, reject) => {
        console.log(result);
        console.log('开始缓存资产...');
        Indicator.process('正在缓存资产数据...');
        let tasks = [];
        for (let i = 0, len = result.length; i < len; i++) {
          let building = [];
          let batch = result[i];
          let buildingNumber = parseInt(batch.building && batch.building.BuildingNumber, 10);
          if (buildingNumber) building = util.toArray(batch.building.SiebelMessage.Building);
          // 获取楼栋下的资产
          for (let i = 0, len = building.length; i < len; i++) {
            tasks.push(new Promise((resolve, reject) => {
              api.get({
                key: 'getLayer',
                data: {
                  'Original Order Id': batch['Order Id'],
                  'KL Activity Id': batch.Id,
                  'KL Building Number': building[i].BuildingNum
                },
                success: data => {
                  console.log(data);
                  invokeSQL('insert', 'assets', {
                    order_id: batch['Order Id'],
                    task_id: batch.Id,
                    building_num: building[i].BuildingNum,
                    data: JSON.stringify(data),
                    create_date: now()
                  }).then(resolve);
                },
                error: err => {
                  console.error(`资产失败：${err}`);
                  resolve(err);
                }
              });
            }));
          }
        };
        Promise.all(tasks).then(result => {
          console.log('资产缓存完成...');
          Indicator.process('数据缓存成功...');
          resolve(result);
        });
      });
    }).then(result => {
      Indicator.process(false);
      console.log(result);
      console.log('------------ 获取最新数据 end ------------');
    }).catch(err => {
      console.error(err);
    });
  };

  /**
   * 获取批次列表 <查询本地 & 远程>
   * @param {Object} setting 接口参数配置
   */
  queryInstallTask(setting) {
    let me = this;
    // 获取批次并缓存所有数据
    let getRemoteData = () => {
      let callback = setting.success;
      setting.success = data => {
        callback(data);
        // 缓存数据
        me.refresh(data);
      };
      api.get(setting);
    };

    /**
     * 默认优先获取本地数据
     * 否则获取在线数据并缓存
     */
    setting.mode === 'refresh' ? getRemoteData() : helper.queryStrict('batch', {}, result => {
      result.length ? setting.success(filter(result)) : getRemoteData();
    });
  };

  /**
   * 员工查询批次
   */
  queryEmpInstallTask(setting) {
    this.queryInstallTask(setting);
  };

  /**
   * 搜索本地安装批次
   * @param {Object} setting.data.val 项目名称
   */
  searchInstallTask(setting) {
    helper.query('batch', {}, result => {
      setting.success(result);
    });
  };

  /**
   * 查询楼栋信息 <查询本地>
   * @param setting
   */
  queryBuilding(setting) {
    helper.query('building', {
      task_id: setting.data.TaskId
    }, result => {
      setting.success(filter(result));
    });
  };

  /**
   * 查询房号资产 <查询本地>
   * @param setting
   */
  getLayer(setting) {
    let param = setting.data;
    helper.query('assets', {
      task_id: param['KL Activity Id'],
      building_num: param['KL Building Number']
    }, result => {
      setting.success(filter(result));
    });
  };

  /**
   * 查询订单行 <查询本地>
   * @param setting
   */
  queryOrderLines(setting) {
    helper.query('order_line', {
      order_id: setting.data['Order Header Id']
    }, result => {
      console.log(result);
      setting.success(filter(result));
    });
  };

  /**
   * 绑定资产条码信息 <保存本地>
   * @param setting
   */
  installOrderAssets(setting) {
    let data = setting.data;
    let id = data.Id;
    helper.upsert('install_record', {
      id: id,
      data: JSON.stringify(data),
      state: 'pending',
      create_date: now()
    }, {id: id}, result => {
      setting.success(result);
      // handle.checkNetwork();
    });
  };

  /**
   * 查询本地扫码安装记录 <查询本地>
   * @param setting
   */
  queryLocalInstallRecord(setting) {
    helper.query('install_record', {}, result => {
      let data = {};
      for (let i = 0, len = result.length; i < len; i++) data[result[i].id] = result[i];
      setting.success(data);
    });
  };

  /**
   * 检测网络并提交数据
   */
  checkAndSubmit() {
    handle.checkNetwork();
  };

  /**
   * 缓存用户信息
   */
  cacheUser(user) {
    helper.upsert('user', {
      user_id: user.Id,
      data: JSON.stringify(user),
      create_date: now()
    }, {rowid: 1}, result => {
      console.log(`缓存用户信息成功 ${user['Last Name']}`);
    });
  };

  /**
   * 获取最后登录用户的信息
   * 1. 查询本地是否有 user 表，没有直接回调空数组
   * 2. 查询是否有登陆记录，没有直接回调空数组
   */
  getCacheUser(setting) {
    let callback = setting.success;
    helper.queryStrict('user', {rowid: 1}, result => {
      callback(result);
    });
  };

  /**
   * 委外人员登陆
   * @param {Object} setting 必填 请求参数配置
   */
  queryUserInfo(setting) {
    let me = this;
    let callback = setting.success;
    setting.success = data => {
      let user = data.items;
      // 初始化
      me.init(result => {
        // 缓存用户信息
        me.cacheUser(user);
        // 回调
        callback(user);
      });
    };
    api.get(setting);
  };

  /**
   * 注销用户登录
   * 清除本地用户信息
   */
  logout(setting) {
    handle.getPendingInstallRecord(result => {
      result.length ? tools.cordova.alert('检测到本地还有未提交的数据，请先提交数据') : helper.delete('user', {rowid: 1}, result => {
        setting.success(result);
      });
    });
  };

  /**
   * 清除本地缓存
   */
  clear() {
    helper.clear();
  };

};

export default new Cache();
