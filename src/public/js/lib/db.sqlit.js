function sqlite(database, version, note, size) {
  var db = openDatabase(database, version, note, size);

  /**
   * 构造创建字段
   * @param {Object} field
   * @returns {string} 构造结果
   */
  function make_field(field) {
    var data = [];
    for (var key in field) {
      var pKey = key == "id" ? " primary key" : "";//设置ID主键
      data.push("'" + key + "'" + " " + field[key] + pKey);
    }
    return "(" + data.join(",") + ")";
  }

  /**
   * 构造插入字段
   * @param {Object} kv
   * @returns {Object} 构造结果
   */
  function make_insert(kv) {
    var k = [];
    var v = [];
    var tmp = {};
    for (var key in kv) {
      k.push(key);
      if (kv[key] == null) {
        v.push(kv[key] + "");
      } else if (typeof(kv[key]) == "string" && kv[key].indexOf("datetime") >= 0) {
        v.push(kv[key] + "");
      } else {
        v.push("'" + kv[key] + "'");
      }
    }
    tmp.key = k.join(",");
    tmp.value = v.join(",");
    return tmp;
  }

  /**
   * 构造更新字段
   * @param {Object} kv
   * @returns {string} 构造结果
   */
  function make_update(kv) {
    var data = [];
    for (var key in kv) {
      data.push(key + "='" + kv[key] + "'");
    }
    return data.join(",");
  }

  /**
   * 执行sql
   * @param {String} sql
   * @param {Function} callback
   */
  var r = {};
  r.query = function (sql, callback) {
    //console.log('sql => ', sql);
    var object = this;
    db.transaction(function (tx) {
      tx.executeSql(sql, [], cb);
    });
    function cb(tx, rs) {
      if (callback) {
        rs.sql = sql;
        callback.call(object, rs);
      }
    }
  };

  r.ctSql = function (sql, callback) {
    var object = this;
    object.query(sql, callback);
  };

  /**
   * 创建表
   * @param {String} table 表名
   * @param {Object} field 字段对象 {field: 'VARCHAT(200)', ...}
   * @param {Function} callback
   */
  r.ct = function (table, field, callback) {
    var object = this;
    var sql = "create table " + table + make_field(field);
    object.query(sql, callback);
  };

  /**
   * 表重明名
   * @param {String} ot 旧表名
   * @param {String} nt 新表名
   * @param {Function} callback
   */
  r.rt = function (ot, nt, callback) {
    var object = this;
    var sql = "alter table " + ot + " rename to " + nt;
    object.query(sql, callback);
  };

  /**
   * 删除表
   * @param {String} table 表名
   * @param {Function} callback
   */
  r.dt = function (table, callback) {
    var object = this;
    var sql = "drop table if exists " + table;
    object.query(sql, callback);
  };

  /**
   * 获取字段最大值
   * @param {String} table 表名
   * @param {String} id 字段名
   */
  r.getMaxId = function (table, id, callback) {
    var object = this;
    var sql = "select max(" + id + ") as maxId from " + table;
    object.get(sql, callback);
  };

  /**
   * 查询所有表
   * @param {Function} callback
   */
  r.gt = function (callback) {
    var object = this;
    var sql = "select name from sqlite_master where type='table' and sql<>'' and name not in ('__WebKitDatabaseInfoTable__','sqlite_autoindex___WebKitDatabaseInfoTable___1','sqlite_sequence','sqlite_stat1','sqlite_stat2','sqlite_stat3')";
    object.query(sql, cb);
    function cb(rs) {
      var list = [];
      for (var i = 0; i < rs.rows.length; i++) {
        list.push(rs.rows.item(i).name);
      }
      callback.call(object, list);
    }
  };

  /**
   * 查询表
   * @param {String} table 表名
   * @param {Function} callback
   */
  r.gts = function (table, callback) {
    var object = this;
    var sql = "select sql from sqlite_master where type='table' and name='" + table + "'";

    object.query(sql, cb);
    function cb(rs) {
      callback.call(object, rs.rows.length && rs.rows.item(0).sql);
    }
  };

  /**
   * 插入数据
   * @param {String} table 表名
   * @param {Object} kv 属性键值对
   * @param {Function} callback
   */
  r.insert = function (table, kv, callback) {
    var object = this;
    var tmp = make_insert(kv);
    var sql = "insert into " + table + "(" + tmp.key + ") values(" + tmp.value + ")";

    object.query(sql, callback);
  };

  /**
   * 执行sql
   * @param {String} sql
   * @param {Function} callback
   */
  r.insertSQL = function (sql, callback) {
    var object = this;
    object.query(sql, callback);
  };

  /**
   * 更新数据
   * @param {String} table 表名
   * @param {Object} kv 属性键值对
   * @param {String} id 主键id
   * @param {Function} callback
   */
  r.update = function (table, kv, id, callback) {
    var object = this;
    var tmp = make_update(kv);
    var sql = "update " + table + " set " + tmp + " where id=" + id;
    object.query(sql, callback);
  };

  /**
   * 执行sql
   * @param {String} sql
   * @param {Function} callback
   */
  r.updateSQL = function (sql, callback) {
    var object = this;
    object.query(sql, callback);
  };

  /**
   * 删除数据
   * @param {String} table 表名
   * @param {String} id 主键id
   * @param callback
   */
  r.delete = function (table, id, callback) {
    var object = this;
    var sql = "delete from " + table + " where id in (" + id + ")";
    object.query(sql, callback);
  };

  /**
   * 执行sql
   * @param {String} sql
   * @param {Function} callback
   */
  r.deleteSQL = function (sql, callback) {
    var object = this;
    object.query(sql, callback);
  };

  /**
   * 查询单条记录
   * @param {String} sql
   * @param {Function} callback
   */
  r.get = function (sql, callback) {
    var object = this;
    object.query(sql, cb);
    function cb(rs) {
      var obj = rs.rows.length > 0 ? rs.rows.item(0) : null;
      callback.call(object, obj);
    }
  };

  /**
   * 获取当前版本
   * @param {Function} callback
   */
  r.gv = function (callback) {
    var object = this;
    var sql = "select sqlite_version(*) as version";
    object.query(sql, cb);
    function cb(rs) {
      callback.call(object, rs.rows.item(0).version);
    }
  };

  /**
   * 增加列
   * @param {String} table 表名
   * @param {Object} field 列字段
   * @param {String} type
   * @param {Function} callback
   */
  r.af = function (table, field, type, callback) {
    var object = this;
    var sql = "alter table " + table + " add column '" + field + "' " + type;
    object.query(sql, callback);
  };

  /**
   * 查询表
   * @param {String} table 表名
   * @param {Function} callback
   */
  r.gf = function (table, callback) {
    var object = this;
    object.gts(table, cb);
    function cb(sql) {
      var reg = sql.match(/\(.*\)/);
      reg = reg[0].slice(1, reg[0].length - 1).split(",");
      var list = [];
      for (var i = 0; i < reg.length; i++) {
        var tmp = reg[i].split(" ");
        tmp = tmp[0].replace('"', '').replace("'", "");
        if (tmp != "") {
          list.push(tmp);
        }
      }
      callback.call(object, list);
    }
  };
  return r;
}

(function () {
  if (typeof window.$sqlite !== 'undefined') {
    window._$sqlite = window.$sqlite;
  }
  window.$sqlite = {};

  $sqlite.db = new sqlite("sqlite", "1.1", "sqlite 1.1", 1024 * 1024 * 5);
})();

module.exports = $sqlite.db;
