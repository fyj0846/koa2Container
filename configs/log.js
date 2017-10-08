import path from 'path';
//日志根目录
var baseLogPath = path.resolve(__dirname, '../logs');
var errPath = '/error';
var errFilename = 'error.log'

var rspPath = '/response';
var rspFilename = 'response.log'


var log = {
  "appenders": {
    error: {
      "category": "errorLogger",             //logger名称
      "type": "dateFile",                   //日志类型
      "filename": baseLogPath + errPath + "/" + errFilename,             //日志输出位置
      "alwaysIncludePattern": true,          //是否总是有后缀名
      "pattern": "-yyyy-MM-dd-hh.log",      //后缀，每小时创建一个新的日志文件
      "path": errPath
    },
    response: {
      "category": "resLogger",
      "type": "dateFile",
      "filename": baseLogPath + rspPath + "/" + rspFilename,
      "alwaysIncludePattern": true,
      "pattern": "-yyyy-MM-dd-hh.log",
      "path": rspPath,
    }
  },
  "categories": {
    error: {appenders: ['error'], level: 'error'},
    response: {appenders: ['response'], level: 'info'},
    default: {appenders: ['response'], level: 'info'},
  },
  "baseLogPath": baseLogPath  //logs根目录
};

export default log;