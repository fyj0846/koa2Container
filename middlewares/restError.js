/*
 *   封装restful服务的异常处理
 *   controller中，发生异常时直接抛出 throw new restError()即可
 */

var restError = function (status, message) {
  this.status = status || 'internal:unknown_error';
  this.message = message || '';
};

export default restError;