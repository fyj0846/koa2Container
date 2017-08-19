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
    if(!ctx || !ctx.params) {
      throw new restError("ERROR", "lack of user info");
    }
    var result = toValidate.every(function(p) {
      return ctx.params.hasOwnProperty(p);
    });
    if(!result) {
      throw new restError("ERROR", "lack of user info");
    }
    else {
      return toValidate.map(function(p) {
        return ctx.params[p];
      });
    }
  }

  /* 数据库操作：查询 */
  static async simpleQuery(ctx, sql) {
    return new Promise((resolve, reject) => {
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
  };

  /* 数据库操作：新增 */
  static async twoStagesCreate(ctx, sqls) {
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
  };

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
            // 此处判断记录数是否符合期望
            if (!results || results.length < 1 || results[0][sqls[0].existFlag] != 1) {
              return reject(new restError('204', '未找到需要更新的记录'));
            }
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
        });
      });
    });
  }

  /* 数据库操作：删除 */
  static async twoStagesDelete(ctx, sqls) {
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
}
export default BasicController;