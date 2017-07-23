// create application object
var Koa = require('koa');
var app = new Koa();
var route = require('koa-route');
var path = require('path');
var serve = require('koa-static');
var fs = require('fs');

// trust proxy
app.proxy = true;

// 静态资源解析
app.use(serve(path.resolve()));

// 入口文件（指向VUE项目目录: dist，入口文件: index）
app.use(route.get('/', function(ctx) {
  ctx.type = 'html'
  ctx.body = fs.createReadStream('public/index.html')
}));

app.listen(8080);
console.log('Listening on http://localhost:8080');