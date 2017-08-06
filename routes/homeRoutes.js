/**
 * Created by qiujian on 7/18/17.
 */

/* koa2 静态资源服务路由配置 */

import Router from 'koa-router';
import fs from 'fs';

const home = new Router();
home.get('/', async (ctx)=> {
  ctx.type = 'html'
  ctx.body = fs.createReadStream('./public/index.html')
})

export default home;
