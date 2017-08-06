import dbCfg from '../configs/db';
import mysql from 'mysql';

class BasicController {
  /* 静态属性， 创建数据库连接资源池，供派生子类直接调用 */
  static pool = mysql.createPool(dbCfg);

  /* 构造方法 */
  constructor() {
    console.log("BasicController init");
  }
}

export default BasicController;