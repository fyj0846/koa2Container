/* koa2 REST-ful 服务路由配置 */

import Router from 'koa-router';
import todoCtrl from './todo/todoController';   // 引入todo模块逻辑层

const router = new Router();
router.get('/todo/list', todoCtrl.list);

export default router;