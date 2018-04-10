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
let buildInsertField = field => {
  let property = {};
  for (var i in field) {
    property[i] = field[i] || 'VARCHAR(200)';
  };
  return property;
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

// config.online = false;
class Cache {

  /**
   * 构造函数
   */
  constructor() {
    // 查看所有表
    this.queryAllTable();
    // this.hasInit((result) => {
    //  // 未初始化表则执行初始化操作
    //  if (!result) {
    //    this.init(result);
    //  }
    // });
  };

  /**
   * 公共暴露
   * @param {Object} setting 参数请求配置
   */
  invoke(setting) {
    console.log(setting);
    let method = this[setting.key];
    method ? method.call(this, setting) : console.error(`${setting.key} is not a function`);
  };

  /**
   * 执行SQL
   * @param method sql 方法
   * @param callback
   */
  invokeSQL(...args) {
    let method = args.shift();
    let callback = args[args.length - 1];
    if (!method) return;
    try {
      db[method](...args);
    } catch (e) {
      callback();
    }
  };

  /**
   * 是否初始化判断
   * @param callback
   */
  hasInit(callback) {
    this.invokeSQL('gts', 'batch', callback);
  };

  /**
   * 初始化数据库表
   * @param {Object} setting 接口参数配置
   */
  init(setting) {
    this.clearTable();
    this.createTable();
    this.cacheBatch(setting);
    this.cacheBuilding();
  };

  /**
   * 清除本地缓存
   */
  clearTable() {
    console.log('清除历史数据...');
    this.queryAllTable(result => {
      this.invokeSQL('dt', result, data => {
        console.log(data);
      });
    });
  };

  /**
   * 初始化数据库表
   */
  createTable() {
    console.log('开始初始化数据...');
    console.log('初始化batch数据...');
    this.invokeSQL('dt', 'batch');
    this.invokeSQL('ct', 'batch', buildInsertField({id: null, data: 'VARCHAR(20000)', state: null, create_date: null}));
  };

  /**
   * 缓存批次
   * @param {Object} setting 接口参数配置
   */
  cacheBatch(setting) {
    let callback = setting.success;
    setting.success = data => {
      callback(data);
    };
    api.get(setting);
    // 填充批次数据
    // if (data) this.insertBatchData(data);
  };

  cacheBuilding() {

  };

  /**
   * 查询所有表
   */
  queryAllTable(callback) {
    this.invokeSQL('gt', result => {
      console.log(result);
      if (callback) callback(KND.Util.toArray(result));
    });
  };

  /**
   * 缓存批次数据
   * @param {Object} data 批次数据
   */
  insertBatchData(data) {
    this.invokeSQL('insert', 'batch', {
      id: 1,
      data: JSON.stringify(data),
      create_date: KND.Util.now()
    }, result => {
      let installTask = KND.Util.toArray(data.SiebelMessage && data.SiebelMessage.Contact['KL Installation Task']);
      console.log(installTask);
      console.log('批次缓存完成！');
    });
  };

  /**
   * 获取批次列表
   * @param {Object} setting 接口参数配置
   */
  queryInstallTask(setting) {
    let me = this;
    query('batch', {}, result => {
      let data = result[0];
      data ? setting.success(KND.Util.parse(data.data)) : me.init(setting);
    });
  };

  queryBuilding(setting) {
    api.get(setting);
  };

};

export default new Cache();
