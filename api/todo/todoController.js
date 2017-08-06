/**
 * Created by qiujian on 7/22/17.
 */

import BasicController from '../BasicController'

/* todo控制器，继承自基本控制器，可以直接使用父类的数据库连接池 */
class TodoController extends BasicController {
  constructor() {
    super();
  }

  // todos list
  static async list(ctx) {
    console.log("TodoController.list execute");
    await function () {
      return new Promise((resolve, reject) => {
        BasicController.pool.getConnection(function (error, connection) {
          connection.query("select * from todo", (error, results, fields) => {
            if (error) {
              reject();
              throw error;
            }
            // connected!
            ctx.body = results;
            // 结束会话
            connection.release();
            resolve();
          });
        });
      })
    }();
  }
};

export default TodoController;


// 技术验证
// const mysql = require("mysql");
// 直接连接
// const connection = mysql.createConnection({
//   host: '127.0.0.1',
//   user: 'tomatoDo',
//   password: 'tomatoDo0846',
//   database: 'test'
// });
// connection.query("select * from user", (error, results, fields) => {
//   if (error) throw error
//   // connected!
//   console.log(results);
//   // 结束会话
//   connection.destroy();
// });
//
// // 通过连接池连接
// const pool = mysql.createPool({
//   host: '127.0.0.1',
//   user: 'tomatoDo',
//   password: 'tomatoDo0846',
//   database: 'tomatoDo'
// })