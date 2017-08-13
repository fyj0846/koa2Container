/*
 *   封装restful服务的返回方法和异常处理
 */

var restify = (pathPrefix) => {
  pathPrefix = pathPrefix || '/api/';
  return async (ctx, next) => {
    if (ctx.request.path.startsWith(pathPrefix)) {
      // 绑定rest()方法，统一封装了正常数据返回结果
      ctx.rest = (data) => {
        ctx.response.type = 'application/json';
        ctx.response.body = data;
      }
      // 统一封装了异常处理
      try {
        await next();
      } catch (e) {
        // 异常处理
        ctx.response.status = 400;    // http请求的错误码
        ctx.response.type = 'application/json';
        ctx.response.body = {
          status: e.status || e.code || 'internal:unknown_error',     // 业务逻辑的错误码，e为restError类型
          message: e.message || ''
        };
      }
    } else {
      await next();
    }
  };
}
export default restify;