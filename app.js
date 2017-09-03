// create application object
import Koa from 'koa';
import path from 'path';
import serve from 'koa-static';
import cors from 'koa-cors';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import home from './routes/homeRoutes';
import apiRouter from './api/apiRouters';
import restify from './middlewares/restify';

// 初始化app对象
var app = new Koa();

// 定义路由模块
let router = new Router();
// 引入静态资源路由模块
router.use('/', home.routes(), home.allowedMethods());
// 引入restfull服务路由模块
router.use('/api/V1', apiRouter.routes(), apiRouter.allowedMethods());

// trust proxy
app.proxy = true;

// 跨域支持
app.use(cors());
// 请求解析
app.use(bodyParser());

// 静态资源解析
app.use(serve(path.resolve()));

// 统一的数据返回处理和异常处理
app.use(restify());

// 入口文件（指向VUE项目目录: ./public，入口文件: index）
app.use(router.routes())
   .use(router.allowedMethods());

// 启动应用，并监听8080端口
app.listen(8080);
console.log('Listening on http://localhost:8080');

// 下面是Koa测试代码
// 1、koa-router
// const Router = require('koa-router');
// let home = new Router();
// // 子路由1
// home.get('/', async (ctx) => {
//   let html = `
//     <ul>
//       <li><a href="/page/helloworld">/page/helloworld</a></li>
//       <li><a href="/page/404">/page/404</a></li>
//     </ul>
//   `
//   ctx.body = html;
// })
//
// // 子路由2
// let page2 = new Router();
// page2.get('/404', async (ctx) => {
//   ctx.body = '404 page!'
// }).get('/helloworld', async (ctx) => {
//   ctx.body = 'helloworld page!'
// })
//
// // 装载所有子路由
// let router = new Router()
// router.use('/', home.routes(), home.allowedMethods());
// debugger
// router.use('/page3', page2.routes(), page2.allowedMethods())
//
// // 加载路由中间件
// app.use(router.routes()).use(router.allowedMethods())
//
// app.listen(3000)
// console.log('[demo] route-use-middleware is starting at port 3000')

// 2、koa get数据获取
// app.use(async (ctx) => {
//   let url = ctx.url;
//
//   // 通过上下文request获取请求参数
//   let request = ctx.request;
//   let request_query = request.query;
//   let request_querystirng = request.querystring;
//
//   // 通过上下文直接获取请求参数
//   let ctx_query = ctx.query;
//   let ctx_querystring = ctx.querystring;
//
//   ctx.body = {
//     url,
//     request_query,
//     request_querystirng,
//     ctx_query,
//     ctx_querystring
//   }
// })
//
// app.listen(3000);
// console.log("request start get at port 3000");

// 3、post请求参数获取 -- 自行实现
// function parsePostData(ctx) {
//   return new Promise((resolve, reject) => {
//     try {
//       let postData = "";
//       ctx.req.addListener('data', (data) => {
//         postData += data;
//       })
//       ctx.req.addListener('end', () => {
//         let parsedData = parseQueryString(postData);
//         resolve(parsedData);
//       })
//     } catch (err) {
//       reject(err);
//     }
//
//   })
// }
//
// function parseQueryString(queryStr) {
//   let queryData = {};
//   let queryStringList = queryStr.split("&");
//   console.log(queryStringList);
//
//   for (let [index, str] of queryStringList.entries()) {
//     let itemList = str.split("=");
//     queryData[itemList[0]] = decodeURIComponent(itemList[1])
//   }
//   return queryData;
// }
//
// app.use(async (ctx) => {
//   if (ctx.url === '/' && ctx.method === 'GET') {
//     // 当GET请求时候返回表单页面
//     let html = `
//       <h1>koa2 request post demo</h1>
//       <form method="POST" action="/">
//         <p>userName</p>
//         <input name="userName" /><br/>
//         <p>nickName</p>
//         <input name="nickName" /><br/>
//         <p>email</p>
//         <input name="email" /><br/>
//         <button type="submit">submit</button>
//       </form>
//     `
//     ctx.body = html
//   } else if (ctx.url === '/' && ctx.method === 'POST') {
//     // 当POST请求的时候，解析POST表单里的数据，并显示出来
//     let postData = await parsePostData(ctx)
//     ctx.body = postData
//   } else {
//     // 其他请求显示404
//     ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
//   }
// })
//
// app.listen(3000);
// console.log("request start get at port 3000");

// 4、post请求参数获取，--使用parsebody
// const bodyParser = require('koa-bodyparser');
// app.use(bodyParser());
// app.use( async (ctx) => {
//   if ( ctx.url === '/' && ctx.method === 'GET' ) {
//     // 当GET请求时候返回表单页面
//     let html = `
//       <h1>koa2 request post demo</h1>
//       <form method="POST" action="/">
//         <p>userName</p>
//         <input name="userName" /><br/>
//         <p>nickName</p>
//         <input name="nickName" /><br/>
//         <p>email</p>
//         <input name="email" /><br/>
//         <button type="submit">submit</button>
//       </form>
//     `
//     ctx.body = html
//   } else if ( ctx.url === '/' && ctx.method === 'POST' ) {
//     // 当POST请求的时候，中间件koa-bodyparser解析POST表单里的数据，并显示出来
//     let postData = ctx.request.body
//     ctx.body = postData
//   } else {
//     // 其他请求显示404
//     ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
//   }
// });
//
// app.listen(3000);
// console.log('[demo] request post is starting at port 3000')

// 5、koa2静态资源
// const staticPath = '/public';
// app.use(serve(
//   path.join(__dirname, staticPath)
// ))

// 6、koa2 cookies
// app.use( async (ctx)=> {
//   if(ctx.url === "/index") {
//     ctx.cookies.set(
//       'cid',
//       'trojan',
//       {
//         domain: 'localhost',  // 写cookie所在的域名
//         path: '/index',       // 写cookie所在的路径
//         maxAge: 10 * 60 * 1000, // cookie有效时长
//         expires: new Date('2017-08-01'),  // cookie失效时间
//         httpOnly: false,  // 是否只用于http请求中获取
//         overwrite: false  // 是否允许重写
//       }
//     );
//     ctx.body='cookie is ok!'
//   } else {
//     ctx.body='hello Cookies'
//   }
// });
//
// app.listen(3000);
// console.log("start koa2 at port 3000")

// 7、koa2 jsonp
// app.use(async (ctx) => {
//   // 如果jsonp 的请求为GET
//   if (ctx.method === 'GET' && ctx.url.split('?')[0] === '/getData.jsonp') {
//     // 获取jsonp的callback
//     let callbackName = ctx.query.callback || 'callback'
//     let returnData = {
//       success: true,
//       data: {
//         text: 'this is a jsonp api demo',
//         time: new Date().getTime(),
//       }
//     }
//     // jsonp的script字符串
//     let jsonpStr = `;${callbackName}(${JSON.stringify(returnData)})`
//
//     // 用text/javascript，让请求支持跨域获取
//     ctx.type = 'text/javascript';
//     // 输出jsonp字符串
//     ctx.body = jsonpStr;
//   } else {
//     ctx.body = 'hello jsonp'
//   }
// });
//
// app.listen(3000)
// console.log('[demo] jsonp is starting at port 3000')