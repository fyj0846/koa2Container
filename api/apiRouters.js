/* koa2 REST-ful 服务路由配置 */

import Router from 'koa-router';
import todoCtrl from './todo/todoController';   // 引入todo模块逻辑层

const apiRouters = new Router();

apiRouters
  .get('/todo/:userId/:todoId', todoCtrl.getTodoByTodoId)
  .get('/todo/:userId', todoCtrl.getTodosByUserId)

  .post('/todo/:userId', todoCtrl.createTodo)
export default apiRouters;