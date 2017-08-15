/**
 * Created by qiujian on 7/22/17.
 */
const moment = require('moment');
import BasicController from '../BasicController';
import restError from '../../middlewares/restError';

/* todo控制器，继承自基本控制器，可以直接使用父类的数据库连接池 */
class TodoController extends BasicController {
  constructor() {
    super();
  }

  // 根据userId和todoId，查询todo
  static async getTodoByTodoId(ctx) {
    console.log("TodoController.getTodoByTodoId execute");
    // 解析请求参数
    var userId = ctx.params['userId'];
    var todoId = ctx.params['todoId'];
    if (!todoId || !userId) {
      throw new restError("ERROR", "lack of query condition");
    }
    // 等待数据库操作
    await function () {
      return new Promise((resolve, reject) => {
        BasicController.pool.getConnection(function (error, connection) {
          console.log("sql: select a.* from todo a, `user-todo-rel` b where b.todoId= " + todoId + " and b.userId=" + userId + " and b.todoId=a.todoId;");
          connection.query({
            sql: 'SELECT A.* from todo A, `user-todo-rel` B WHERE B.userId = ? AND B.todoId = ? AND B.todoId = A.todoId',
            timeout: 8000,
            values: [userId, todoId]
          }, (error, results, fields) => {
            if (error) {
              reject(new restError(error.code, error.message));
            }
            else {
              // connected!
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
      })
    }();

  }

  // 根据userId， 查询todos
  static async getTodosByUserId(ctx) {
    console.log("TodoController.getTodos execute");
    // 解析请求参数
    var userId = ctx.params['userId'];
    if (!userId) {
      throw new restError("ERROR", "lack of query condition");
    }
    // 等待数据库操作
    await function () {
      return new Promise((resolve, reject) => {
        BasicController.pool.getConnection(function (error, connection) {
          connection.query({
            sql: 'SELECT A.* from todo A, `user-todo-rel` B WHERE B.userId = ? AND B.todoId = A.todoId',
            timeout: 8000,
            values: [userId]
          }, (error, results, fields) => {
            if (error) {
              reject(new restError(error.code, error.message));
            }
            else {
              // connected!
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
      })
    }();
  }

  // curl -l -H "Content-type: application/json" -X POST -d '{"todoTitle":"newAddTodo3","expectFinishTime":"2017-09-21 17:00:00","expectClock":"1","priority":"4", "comment":"an comment3"}' http://localhost:8080/api/V1/todo/1
  static async createTodo(ctx) {
    console.log("TodoController.create execute");
    // 解析请求参数
    var userId = ctx.params['userId'];
    const {todoTitle, priority, expectClock, expectFinishTime, comment} = ctx.request.body;

    if (!userId) {
      throw new restError("ERROR", "lack of user info");
    }
    // 参数准备
    var id = new Date().getTime();
    var newTodo = {
      todoId: id,
      todoTitle: todoTitle,
      priority: priority,
      cTime: new Date(),
      expectFinishTime: expectFinishTime,
      expectClock: expectClock,
      comment: comment,
      isFinished: 'F',  // 固定设置， F/T
      isDelete: "F"     // 固定设置， F/T
    };

    var newRel = {
      todoId: id,
      userId: userId
    };
    // 等待数据库操作
    await function () {
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

            var query = connection.query("insert into todo set ? ;", newTodo, (error, results, fields) => {
              if (error) {
                // 请求异常
                console.log(error);
                return connection.rollback(function () {
                  reject(new restError(error.code, error.message));
                });
              }
              console.log(query.sql);

              var query2 = connection.query("insert into `user-todo-rel` set ? ;", newRel, (error, results, fields) => {
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
    }();
  }
}
;

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