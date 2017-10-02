/**
 * Created by qiujian on 7/22/17.
 */
const moment = require('moment');
import BasicController from '../BasicController';

/* project控制器，继承自基本控制器，可以直接使用父类的数据库连接池 */
class UserController extends BasicController {
  constructor() {
    super();
  }

  // 根据user， 查询用户认证是否通过
  static async userLogin(ctx) {
    console.log("UserController.userLogin execute");
    // 解析请求参数
    // const [userId] = BasicController.validation(ctx, ['userId']);
    const {userName, userPassword} = ctx.request.body;
    console.log("user: " + userName);
    // 数据库操作参数准备
    var sql = {
      sql: 'SELECT T.* from user T WHERE T.userName = ? AND T.userPassword = ?',
      values: [userName, userPassword],
      options: ctx.query  //T,F,ALL
    };
    // 数据库操作
    await BasicController.simpleQuery(ctx, sql, 'T');
  }

  // 创建project
  static async userRegistry(ctx) {
    console.log("UserController.userRegistry execute");
    // 解析请求参数
    const {userName, userPassword, userNickName, userMail, userGental, isDelete='F'} = ctx.request.body;

    // 参数准备
    var id = new Date().getTime();
    var newUser = {
      userId: id,
      userName: userName,
      userPassword: userPassword,
      userNickName: userNickName,
      userMail: userMail,
      userGental: userGental,
      isDelete: isDelete,
      regTime: BasicController.getLocalDateString()
    };

    // 创建新用户时需要先确认用户名没有被占用
    var sqlsInTransaction = [
      {
        sql: "SELECT * FROM user where userName = ?;",
        values: userName,
      }, {
        sql: "INSERT INTO user SET ? ;",
        values: newUser,
      }
    ];
    // 等待数据库操作
    await BasicController.uniqueCreate(ctx, sqlsInTransaction);
  }
};

export default UserController;