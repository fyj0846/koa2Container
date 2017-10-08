import log4js from 'log4js';
import logConfig from '../configs/log';

//加载配置文件
log4js.configure(logConfig);

let logUtil = {};

let errorLogger = log4js.getLogger('error'); //categories的元素
let resLogger = log4js.getLogger('response');


//错误日志接口
logUtil.logError = function (ctx, error, resTime) {
  if (ctx && error) {
    errorLogger.error(formatError(ctx, error, resTime));
  }
};

//响应日志接口
logUtil.logResponse = function (ctx, resTime) {
  if (ctx) {
    resLogger.info(formatRes(ctx, resTime));
  }
};


//格式化响应日志
var formatRes = function (ctx, resTime) {
  var logText = new String();
  //响应日志开始
  logText += "\n" + "*************** response log ***************" + "\n";
  //添加请求日志
  logText += formatReqLog(ctx.request, resTime);
  //响应状态码
  logText += "response status: " + ctx.status + "\n";
  //响应内容
  logText += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n";
  //响应日志结束
  logText += "*************** response log end ***************" + "\n";
  return logText;
}

//格式化错误日志
var formatError = function (ctx, err, resTime) {
  var logText = new String();
  //错误信息开始
  logText += "\n" + "*************** error log ***************" + "\n";
  //添加请求日志
  logText += formatReqLog(ctx.request, resTime);
  //错误名称
  logText += "error name: " + err.name + "\n";
  //错误状态
  logText += "error status: " + err.status + "\n";
  //错误信息
  logText += "error message: " + err.message + "\n";
  //错误详情
  logText += "error stack: " + err.status + "\n";
  //错误信息结束
  logText += "*************** error log end ***************" + "\n";
  return logText;
};

//格式化请求日志
var formatReqLog = function (req, resTime) {
  var logText = new String();
  var method = req.method;
  //访问方法
  logText += "request method: " + method + "\n";
  //请求原始地址
  logText += "request originalUrl:  " + req.originalUrl + "\n";
  //客户端ip
  logText += "request client ip:  " + req.ip + "\n";
  //请求参数
  if (method === 'GET') {
    logText += "request query:  " + JSON.stringify(req.query) + "\n";
  } else {
    var body = "";
    if(req.body && req.body.hasOwnProperty('userPassword')) {
      body = JSON.parse(JSON.stringify(req.body))
      // 考虑过滤掉密码字段
      body.userPassword = "******";
      logText += "request body: " + "\n" + JSON.stringify(body) + "\n";
    }
    else {
      logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n";
    }
  }
  //服务器响应时间
  logText += "response time: " + resTime + "\n";
  return logText;
}

export default logUtil;