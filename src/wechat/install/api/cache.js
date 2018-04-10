/**
 * @author umin
 * @since
 * @copyright Copyright (c) 2018, YZKJ
 * @description cache
 */
import api from './api';

let db = require('public/js/lib/db.sqlit');
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
  return data.length ? KND.Util.parse(data[0].data) : data;
};

/**
 * 查询数据
 * @param {String} table 表名
 * @param {Object} condition 查询条件
 * @param callback
 */
let query = (table, condition, callback) => {
  var sql = `select * from ${table} where 1 = 1`;
  for (var i in condition) {
    sql += ` and ${i}="${condition[i]}"`;
  };
  db.query(sql, data => {
    var arr = [];
    for (var i = 0; i < data.rows.length; i++) {
      arr.push(data.rows.item(i));
    }
    callback(arr);
  });
};

/**
 * 清除缓存
 * @param data
 * @returns {Promise}
 */
let clear = data => {
  let me = this.a;
  return new Promise((resolve, reject) => {
    console.log('清除历史数据...');
    me.invokeSQL('gt').then(result => {
      let tasks = [];
      result = KND.Util.toArray(result);
      for (let i = 0, len = result.length; i < len; i++) {
        let table = result[i];
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
 * @param data
 * @returns {Promise}
 */
let create = data => {
  let me = this.a;
  return new Promise((resolve, reject) => {
    console.log('初始化数据库表...');
    Promise.all([
      me.invokeSQL('ct', 'batch', buildCreateField({data: 'VARCHAR(20000)', state: null, create_date: null})).then(result => {
        console.log('创建数据库表 batch...');
      }),
      me.invokeSQL('ct', 'building', buildCreateField({order_id: null, task_id: null, data: 'VARCHAR(2000)', state: null, create_date: null})).then(result => {
        console.log('创建数据库表 building...');
      }),
      me.invokeSQL('ct', 'assets', buildCreateField({order_id: null, task_id: null, building_num: null, data: 'VARCHAR(20000)', state: null, create_date: null})).then(result => {
        console.log('创建数据库表 assets...');
      })
    ]).then(() => {
      console.log('init ok...');
      resolve();
    });
  });
};

/**
 * 数据缓存
 */
class Cache {

  /**
   * 构造函数
   */
  constructor() {
    KND.Util.log('Cache init...');
  };

  /**
   * 公共暴露
   * @param {Object} setting 参数请求配置
   */
  invoke(setting) {
    console.log(setting);
    if (config.offline) {
      let method = this[setting.key];
      method ? method.call(this, setting) : console.error(`${setting.key} is not a function`);
    } else {
      api.get(setting);
    }
  };

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
   * 初始化数据库
   * 1. 删除数据表
   * 2. 创建数据表
   * 3. 缓存数据
   * @param {Object} setting 接口参数配置
   */
  init(data) {
    let me = this;
    clear().then(result => create()).then(result => me.cache(data)).catch(err => console.error(err));
  };

  /**
   * 缓存批次
   * @param {Object} setting 接口参数配置
   */
  cache(data = {}) {
    /**
     * 1. 缓存批次数据
     * 2. 缓存楼栋数据
     * 3. 缓存房号资产数据
     */
    let me = this;
    let invokeSQL = me.invokeSQL;
    return new Promise((resolve, reject) => {
      Indicator.open({
        text: '获取最新数据...',
        spinnerType: 'fading-circle'
      });
      resolve(data);
    }).then(data => {
      // 1. 缓存批次数据
      return new Promise((resolve, reject) => {
        console.log(data);
        console.log('开始缓存批次...');
        invokeSQL('insert', 'batch', {
          data: JSON.stringify(data),
          create_date: KND.Util.now()
        }).then(result => {
          let installTask = KND.Util.toArray(data.SiebelMessage && data.SiebelMessage.Contact['KL Installation Task']);
          console.log('批次缓存完成...');
          resolve(installTask);
        });
      });
    }).then(batchs => {
      // 2. 缓存楼栋数据
      return new Promise((resolve, reject) => {
        console.log(batchs);
        console.log('开始缓存楼栋...');
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
                batch.building = data;
                invokeSQL('insert', 'building', {
                  order_id: batch['Order Id'],
                  task_id: batch.Id,
                  data: JSON.stringify(data),
                  create_date: KND.Util.now()
                }).then(resolve);
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
      // 3. 缓存房号资产数据
      return new Promise((resolve, reject) => {
        console.log(result);
        console.log('开始缓存资产...');
        let tasks = [];
        for (let i = 0, len = result.length; i < len; i++) {
          let building = [];
          let batch = result[i];
          let buildingNumber = parseInt(batch.building.BuildingNumber, 10);
          if (buildingNumber) building = batch.building.SiebelMessage.Building;
          // 获取楼栋下的资产
          for (let i = 0, len = building.length; i < len; i++) {
            tasks.push(new Promise((resolve, reject) => {
              api.get({
                key: 'getLayer',
                data: {
                  'Original Order Id': batch['Order Id'],
                  'KL Activity Id': batch.Id,
                  'Integration Id 2': building[i].BuildingNum
                },
                success: data => {
                  invokeSQL('insert', 'assets', {
                    order_id: batch['Order Id'],
                    task_id: batch.Id,
                    building_num: building[i].BuildingNum,
                    data: JSON.stringify(data),
                    create_date: KND.Util.now()
                  }).then(resolve);
                }
              });
            }));
          }
        };
        Promise.all(tasks).then(result => {
          console.log('资产缓存完成...');
          resolve(result);
        });
      });
    }).then(result => {
      console.log(result);
      console.log('缓存完成...');
    }).catch(err => {
      console.error(err);
    });
  };

  /**
   * 获取批次列表
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
        me.init(data);
      };
      api.get(setting);
    };

    /**
     * 1. 主动获取最新批次并缓存
     *  or
     * 2. 获取本地批次无数据时回到第一步
     */
    setting.mode === 'refresh' ? getRemoteData() : query('batch', {}, result => {
      result.length ? setting.success(filter(result)) : getRemoteData();
    });
  };

  /**
   * 查询楼栋信息
   * @param setting
   */
  queryBuilding(setting) {
    query('building', {
      task_id: setting.data.TaskId
    }, result => {
      setting.success(filter(result));
    });
  };

  /**
   * 查询房号资产
   * @param setting
   */
  getLayer(setting) {
    let param = setting.data;
    query('assets', {
      task_id: param['KL Activity Id'],
      building_num: param['Integration Id 2']
    }, result => {
      console.log(result);
      setting.success(filter(result));
    });
  };

};

export default new Cache();
