/*
 *   封装restful服务的返回方法和异常处理
 */
import logUtil from '../utils/logUtil'

var logger = () => {
  return async (ctx, next) => {
    //响应开始时间
    const start = new Date();
    try {
      //响应间隔时间
      var ms;
      await next();
      ms = new Date() - start;
      //记录响应日志
      logUtil.logResponse(ctx, ms);
    } catch (error) {
      ms = new Date() - start;
      //记录异常日志
      logUtil.logError(ctx, error, ms);
    }
  }
}
export default logger;