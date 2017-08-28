/* koa2 REST-ful 服务路由配置 */

import Router from 'koa-router';
import todoCtrl from './todo/todoController';   // 引入todo模块逻辑层
import projectCtrl from './todo/projectController';   // 引入project模块逻辑层
import sceneCtrl from './todo/sceneController';   // 引入scene模块逻辑
import tagCtrl from './todo/tagController';   // 引入tag模块逻辑
const apiRouters = new Router();

apiRouters
  /* todo功能 */
  /* todo查询： 根据用户Id和todoId查询 */
  .get('/todo/:userId/:todoId', todoCtrl.getTodoByTodoId)
  /* todo查询： 根据用户Id查询 */
  .get('/todo/:userId', todoCtrl.getTodosByUserId)
  /* todo新增： 新增todo（返回结构中包含affectedId，为动态生成的新todoId） */
  .post('/todo/:userId', todoCtrl.createTodo)
  /* todo更新： 根据用户Id和todoId更新，通过更新isDelete字段实现软删除 */
  .put('/todo/:userId/:todoId', todoCtrl.updateTodoByTodoId)
  /* todo删除： 根据用户Id和todoId删除，硬删除*/
  .delete('/todo/:userId/:todoId', todoCtrl.deleteTodoByTodoId)

  /* project功能 */
  .get('/project/:userId/:projectId', projectCtrl.getProjectByProjectId)
  .get('/project/:userId', projectCtrl.getProjectsByUserId)
  .post('/project/:userId', projectCtrl.createProject)
  .put('/project/:userId/:projectId', projectCtrl.updateProjectByProjectId)
  .delete('/project/:userId/:projectId', projectCtrl.deleteProjectByProjectId)

  /* scene功能 */
  .get('/scene/:userId/:sceneId', sceneCtrl.getSceneBySceneId)
  .get('/scene/:userId', sceneCtrl.getScenesByUserId)
  .post('/scene/:userId', sceneCtrl.createScene)
  .put('/scene/:userId/:sceneId', sceneCtrl.updateSceneBySceneId)
  .delete('/scene/:userId/:sceneId', sceneCtrl.deleteSceneBySceneId)

  /* tag功能 */
  .get('/tag/:userId/:tagId', tagCtrl.getTagByTagId)
  .get('/tag/:userId', tagCtrl.getTagsByUserId)
  .post('/tag/:userId', tagCtrl.createTag)
  .put('/tag/:userId/:tagId', tagCtrl.updateTagByTagId)
  .delete('/tag/:userId/:tagId', tagCtrl.deleteTagByTagId)
export default apiRouters;