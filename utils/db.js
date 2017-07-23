/**
 * Created by qiujian on 7/22/17.
 */
const mysql = require("mysql");

// 通过连接池连接
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'tomatoDo',
  password: 'tomatoDo0846',
  database: 'test'
});

let executeSql = function (sql, args) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if(err) {
        reject(err);
      }
      connection.query(sql, args, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
        // 结束会话
        connection.release();
      });
    });
  })
};

module.exports = {
  executeSql
}
