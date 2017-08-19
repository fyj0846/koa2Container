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
    const [userId, todoId] = BasicController.validation(ctx, ['userId', 'todoId']);
    // 数据库操作参数准备
    var sql = {
      sql: 'SELECT A.* from todo A, `user-todo-rel` B WHERE B.userId = ? AND B.todoId = ? AND B.todoId = A.todoId;',
      values: [userId, todoId]
    };
    // 数据库操作
    await BasicController.simpleQuery(ctx, sql);
  }

  // 根据userId， 查询todos
  static async getTodosByUserId(ctx) {
    console.log("TodoController.getTodos execute");
    // 解析请求参数
    const [userId] = BasicController.validation(ctx, ['userId']);
    // 数据库操作参数准备
    var sql = {
      sql: 'SELECT A.* from todo A, `user-todo-rel` B WHERE B.userId = ? AND B.todoId = A.todoId',
      values: userId
    };
    // 数据库操作
    await BasicController.simpleQuery(ctx, sql);
  }

  // curl -l -H "Content-type: application/json" -X POST -d '{"todoTitle":"newAddTodo3","expectFinishTime":"2017-09-21 17:00:00","expectClock":"1","priority":"4", "comment":"an comment3"}' http://localhost:8080/api/V1/todo/1
  static async createTodo(ctx) {
    console.log("TodoController.create execute");
    // 解析请求参数
    const [userId] = BasicController.validation(ctx, ['userId']);
    const {todoTitle, priority, expectClock, expectFinishTime, comment} = ctx.request.body;
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

    var sqlsInTransaction = [
      {
        sql: "insert into todo set ? ;",
        values: newTodo,
        affectedId: 'todoId'
      }, {
        sql: "insert into `user-todo-rel` set ? ;",
        values: newRel
      }
    ];
    // 等待数据库操作
    await BasicController.twoStagesCreate(ctx, sqlsInTransaction);
  }

  // curl -l -H "Content-type: application/json" -X PUT -d '{"todoTitle":"newAddTodoUpdate","expectFinishTime":"2017-09-21 17:00:00","expectClock":"1","priority":"4", "comment":"an comment3"}' http://localhost:8080/api/V1/todo/1/3
  static async updateTodoByTodoId(ctx) {
    console.log("TodoController.update execute");
    // 解析请求参数
    const [userId, todoId] = BasicController.validation(ctx, ['userId', 'todoId']);
    const {todoTitle, priority, cTime, expectClock, expectFinishTime, comment, isFinished, isDelete} = ctx.request.body;
    // 参数准备
    var updateTodo = {
      todoId: todoId,
      todoTitle: todoTitle,
      priority: priority,
      cTime: cTime,
      expectFinishTime: expectFinishTime,
      expectClock: expectClock,
      comment: comment,
      isFinished: isFinished,  // 固定设置， F/T
      isDelete: isDelete    // 固定设置， F/T
    };

    var sqlsInTransaction = [
      {
        sql: "select count(*) as count from todo A, `user-todo-rel` B where B.todoId = ? AND B.userId = ? AND A.todoId=B.todoId;",
        values: [todoId, userId],
        existFlag: 'count'
      }, {
        sql: "UPDATE todo  SET ? WHERE todoId=?;",
        values: [updateTodo, todoId]
      }
    ];
    // 等待数据库操作
    await BasicController.twoStagesUpdate(ctx, sqlsInTransaction)
  }

  // curl -l -X DELETE http://localhost:8080/api/V1/todo/1/5
  static async deleteTodoByTodoId(ctx) {
    console.log("TodoController.delete execute");
    // 解析请求参数
    const [userId, todoId] = BasicController.validation(ctx, ['userId', 'todoId']);
    // 等待数据库操作
    var sqlsInTransaction = [{
      sql: "DELETE FROM `user-todo-rel` WHERE todoId=? AND userId=? ;",
      values: [todoId, userId]
    },{
      sql: "DELETE FROM todo WHERE todoId=? ;",
      values: todoId
    }];
    await BasicController.twoStagesDelete(ctx, sqlsInTransaction);
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