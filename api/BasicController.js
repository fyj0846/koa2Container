import dbCfg from '../configs/db';
import mysql from 'mysql';
import restError from '../middlewares/restError';
class BasicController {
  /* 静态属性， 创建数据库连接资源池，供派生子类直接调用 */
  static pool = mysql.createPool(dbCfg);

  /* 构造方法 */
  constructor() {
    console.log("BasicController init");
  }

  /* 参数校验 */
  static validation(ctx, toValidate) {
    if (!ctx || !ctx.params) {
      throw new restError("ERROR", "lack of user info");
    }
    var result = toValidate.every(function (p) {
      return ctx.params.hasOwnProperty(p);
    });
    if (!result) {
      throw new restError("ERROR", "lack of user info");
    }
    else {
      return toValidate.map(function (p) {
        return ctx.params[p];
      });
    }
  }

  // 动态查询条件/排序条件扩展
  static dynamicSql(sql, reject, table) {
    var options = Object.assign({}, {"F_isDelete": "F"}, sql.options);  //默认查询未删除的记录
    var prefix = table || "";
    var filters = [];
    var orders = [];
    if (!sql || !sql.sql) {
      return reject(new restError("ERROR", "lack of sql"));
    }
    // 传入参数预处理
    for (var p in options) {
      var p_list = p.split("_");
      if (p_list[0] === 'F') {
        filters.push({'column': prefix + "." + p_list[1], 'filterCnd': options[p]});
      }
      else if (p_list[0] === 'O') {
        orders.push({'column': prefix + "." + p_list[1], 'orderType': options[p]});
      }
    }

    // 移除可能的分号
    sql.sql = sql.sql.replace(";", "");

    // 扩展WHERE条件
    for (var i = 0; i < filters.length; i++) {
      if (i == 0 && sql.sql.toUpperCase().indexOf("WHERE") < 0) {
        sql.sql += " WHERE 1=1 ";
      }
      sql.sql += " AND " + filters[i]['column'] + "='" + filters[i]['filterCnd'] + "'";
    }
    // 扩展ORDER BY条件
    if (orders.length > 0) {
      sql.sql += " ORDER BY " + orders[0]['column'] + " " + orders[0]['orderType'];
    }
    sql.sql += ";";
    // console.log(sql.sql);
  }

  // 对象空属性处理，实现部分字段更新
  static removeNullProperty(target) {
    var result = null;
    if (Array.isArray(target)) {
      // 数组处理
      result = [];
      for(var i = 0; i < target.length; i++) {
        result[i] = '';
        if(typeof target[i] != 'object') {
          if(target[i]) {
            result[i] = target[i];
          }
        } else {
          result[i] = BasicController.removeNullProperty(target[i]);
        }
      }
    }
    else {
      // 对象处理
      result = {};
      for (var p in target) {
        if (typeof target[p] != 'object') {
          if(target[p]) {
            result[p] = target[p];
          }
        }
        else {
          result[p] = BasicController.removeNullProperty(target[p]);
        }
      }
    }
    return result;
  }

  /* 数据库操作：查询 */
  static async simpleQuery(ctx, sql, table) {
    return new Promise((resolve, reject) => {
      BasicController.dynamicSql(sql, reject,table);  // 实现有限的查询条件和排序条件动态扩展
      BasicController.pool.getConnection(function (error, connection) {
        connection.query({
          sql: sql.sql,
          timeout: sql.timeout || 8000,
          values: sql.values
        }, (error, results, fields) => {
          if (error) {
            reject(new restError(error.code, error.message));
          }
          else {
            // 构造返回对象, 包括执行状态，结果集
            ctx.rest({
              status: 'SUCCESS',
              resultSet: results
            });
            resolve();
          }
          // 结束会话
          connection.release();
        });
      });
    });
  }

  /* 数据库操作：新增 */
  static  async twoStagesCreate(ctx, sqls) {
    // 一阶创建
    if (sqls && sqls.length == 1) {
      return new Promise((resolve, reject) => {
        BasicController.pool.getConnection(function (error, connection) {
          connection.query({
            sql: sqls[0].sql,
            timeout: sqls[0].timeout || 8000,
            values: sqls[0].values
          }, (error, results, fields) => {
            if (error) {
              // 请求异常
              console.log(error);
              reject(new restError(error.code, error.message));
            }
            else {
              connection.commit(function (error) {
                if (error) {
                  return connection.rollback(function () {
                    reject(new restError(error.code, error.message));
                  });
                }
                console.log('success!');
                ctx.rest({
                  status: 'SUCCESS',
                  affectedId: id,
                  resultSet: results
                });
                resolve();
              });
            }
            // 释放连接
            connection.release();
          });
        });
      });
    }
    // 二阶创建
    else if (sqls && sqls.length == 2) {
      return new Promise((resolve, reject) => {
        BasicController.pool.getConnection(function (error, connection) {
          connection.beginTransaction(function (error) {
            if (error) {
              // 请求异常
              console.log(error);
              return connection.rollback(function () {
                reject(new restError(error.code, error.message));
              });
            }
            var query = connection.query({
              sql: sqls[0].sql,
              timeout: sqls[0].timeout || 8000,
              values: sqls[0].values
            }, (error, results, fields) => {
              if (error) {
                // 请求异常
                console.log(error);
                return connection.rollback(function () {
                  reject(new restError(error.code, error.message));
                });
              }
              console.log(query.sql);
              var query2 = connection.query({
                sql: sqls[1].sql,
                timeout: sqls[1].timeout || 8000,
                values: sqls[1].values
              }, (error, results, fields) => {
                if (error) {
                  // 请求异常
                  console.log(error);
                  return connection.rollback(function () {
                    reject(new restError(error.code, error.message));
                  });
                }
                console.log(query2.sql);
                connection.commit(function (error) {
                  if (error) {
                    return connection.rollback(function () {
                      reject(new restError(error.code, error.message));
                    });
                  }
                  console.log('success!');
                  ctx.rest({
                    status: 'SUCCESS',
                    affectedId: sqls[0].values[sqls[0].affectedId],
                    resultSet: results
                  });
                  resolve();
                  // 释放连接
                  connection.release();
                });
              });
            });
          })
        });
      })
    }
  }

  /* 数据库操作：更新 */
  static async twoStagesUpdate(ctx, sqls) {
    return new Promise((resolve, reject) => {
      BasicController.pool.getConnection(function (error, connection) {
        connection.beginTransaction(function (error) {
          if (error) {
            // 请求异常
            console.log(error);
            return connection.rollback(function () {
              reject(new restError(error.code, error.message));
            });
          }
          var query = connection.query({
            sql: sqls[0].sql,
            timeout: sqls[0].timeout || 8000,
            values: BasicController.removeNullProperty(sqls[0].values)  // 实现部分字段更新
          }, (error, results, fields) => {
            if (error) {
              // 请求异常
              console.log(error);
              return connection.rollback(function () {
                reject(new restError(error.code, error.message));
              });
            }
            console.log(query.sql);
            // 此处判断记录数是否符合期望
            if (!results || results.length < 1 || results[0][sqls[0].existFlag] != 1) {
              return reject(new restError('204', '未找到需要更新的记录'));
            }
            var query2 = connection.query({
              sql: sqls[1].sql,
              timeout: sqls[1].timeout || 8000,
              values: BasicController.removeNullProperty(sqls[1].values) //实现部分字段更新
            }, (error, results, fields) => {
              if (error) {
                // 请求异常
                console.log(error);
                return connection.rollback(function () {
                  reject(new restError(error.code, error.message));
                });
              }
              console.log(query2.sql);
              connection.commit(function (error) {
                if (error) {
                  return connection.rollback(function () {
                    reject(new restError(error.code, error.message));
                  });
                }
                console.log('success!');
                ctx.rest({
                  status: 'SUCCESS',
                  resultSet: results
                });
                resolve();
                // 释放连接
                connection.release();
              });
            });
          });
        });
      });
    });
  }

  /* 数据库操作：删除 */
  static  async twoStagesDelete(ctx, sqls) {
    return new Promise((resolve, reject) => {
      BasicController.pool.getConnection(function (error, connection) {
        connection.beginTransaction(function (error) {
          if (error) {
            // 请求异常
            console.log(error);
            return connection.rollback(function () {
              reject(new restError(error.code, error.message));
            });
          }
          var query = connection.query({
            sql: sqls[0].sql,
            timeout: sqls[0].timeout || 8000,
            values: sqls[0].values
          }, (error, results, fields) => {
            if (error) {
              // 请求异常
              console.log(error);
              return connection.rollback(function () {
                reject(new restError(error.code, error.message));
              });
            }
            console.log(query.sql);

            var query2 = connection.query({
              sql: sqls[1].sql,
              timeout: sqls[1].timeout || 8000,
              values: sqls[1].values
            }, (error, results, fields) => {
              if (error) {
                // 请求异常
                console.log(error);
                return connection.rollback(function () {
                  reject(new restError(error.code, error.message));
                });
              }
              console.log(query2.sql);
              connection.commit(function (error) {
                if (error) {
                  return connection.rollback(function () {
                    reject(new restError(error.code, error.message));
                  });
                }
                console.log('success!');
                ctx.rest({
                  status: 'SUCCESS',
                  resultSet: results
                });
                resolve();
                // 释放连接
                connection.release();
              });
            });
          });
        })
      });
    })
  }

  /* 数据库操作：删除 */
  static async threeStagesDelete(ctx, sqls) {
    return new Promise((resolve, reject) => {
      BasicController.pool.getConnection(function (error, connection) {
        connection.beginTransaction(function (error) {
          if (error) {
            // 请求异常
            console.log(error);
            return connection.rollback(function () {
              reject(new restError(error.code, error.message));
            });
          }
          var query = connection.query({
            sql: sqls[0].sql,
            timeout: sqls[0].timeout || 8000,
            values: sqls[0].values
          }, (error, results, fields) => {
            if (error) {
              // 请求异常
              console.log(error);
              return connection.rollback(function () {
                reject(new restError(error.code, error.message));
              });
            }
            console.log(query.sql);
            var query2 = connection.query({
              sql: sqls[1].sql,
              timeout: sqls[1].timeout || 8000,
              values: sqls[1].values
            }, (error, results, fields) => {
              if (error) {
                // 请求异常
                console.log(error);
                return connection.rollback(function () {
                  reject(new restError(error.code, error.message));
                });
              }
              console.log(query2.sql);
              var query3 = connection.query({
                sql: sqls[2].sql,
                timeout: sqls[2].timeout || 8000,
                values: sqls[2].values
              }, (error, results, fields) => {
                if (error) {
                  // 请求异常
                  console.log(error);
                  return connection.rollback(function () {
                    reject(new restError(error.code, error.message));
                  });
                }
                console.log(query3.sql);
                connection.commit(function (error) {
                  if (error) {
                    return connection.rollback(function () {
                      reject(new restError(error.code, error.message));
                    });
                  }
                  console.log('success!');
                  ctx.rest({
                    status: 'SUCCESS',
                    resultSet: results
                  });
                  resolve();
                  // 释放连接
                  connection.release();
                });
              });
            });
          });
        })
      });
    })
  }
}
export default BasicController;