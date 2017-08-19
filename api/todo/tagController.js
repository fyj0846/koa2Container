/**
 * Created by qiujian on 7/22/17.
 */
const moment = require('moment');
import BasicController from '../BasicController';

/* tag控制器，继承自基本控制器，可以直接使用父类的数据库连接池 */
class TagController extends BasicController {
  constructor() {
    super();
  }

  // 根据userId和tagId，查询tag
  static async getTagByTagId(ctx) {
    console.log("TagController.getTagByTagId execute");
    // 解析请求参数
    const [userId, tagId] = BasicController.validation(ctx, ['userId', 'tagId']);
    // 数据库操作参数准备
    var sql = {
      sql: 'SELECT A.* from tag A, `user-tag-rel` B WHERE B.userId = ? AND B.tagId = ? AND B.tagId = A.tagId',
      values: [userId, tagId]
    };
    // 数据库操作
    await BasicController.simpleQuery(ctx, sql);
  }

  // 根据userId， 查询tags
  static async getTagsByUserId(ctx) {
    console.log("TagController.getTags execute");
    // 解析请求参数
    const [userId] = BasicController.validation(ctx, ['userId']);
    // 数据库操作参数准备
    var sql = {
      sql: 'SELECT A.* from tag A, `user-tag-rel` B WHERE B.userId = ? AND B.tagId = A.tagId',
      values: userId
    };
    // 数据库操作
    await BasicController.simpleQuery(ctx, sql);
  }

  // 创建tag
  static async createTag(ctx) {
    console.log("TagController.create execute");
    // 解析请求参数
    const [userId] = BasicController.validation(ctx, ['userId']);
    const {tagName, tagDescribe} = ctx.request.body;

    // 参数准备
    var id = new Date().getTime();
    var newTag = {
      tagId: id,
      tagName: tagName,
      tagDescribe: tagDescribe
    };

    var newRel = {
      tagId: id,
      userId: userId
    };

    var sqlsInTransaction = [
      {
        sql: "INSERT INTO tag SET ? ;",
        values: newTag,
        affectedId: 'tagId'
      }, {
        sql: "INSERT INTO `user-tag-rel` SET ? ;",
        values: newRel
      }
    ];
    // 等待数据库操作
    await BasicController.twoStagesCreate(ctx, sqlsInTransaction);
  }

  // 根据tagId, 更新tag
  static async updateTagByTagId(ctx) {
    console.log("TagController.update execute");
    // 解析请求参数
    const [userId, tagId] = BasicController.validation(ctx, ['userId', 'tagId']);
    const {tagName, tagDescribe} = ctx.request.body;
    // 参数准备
    var updateTag = {
      tagId: tagId,
      tagName: tagName,
      tagDescribe: tagDescribe
    };
    var sqlsInTransaction = [
      {
        sql: "SELECT count(*) as count from tag A, `user-tag-rel` B where B.tagId = ? AND B.userId = ? AND A.tagId=B.tagId;",
        values: [tagId, userId],
        existFlag: 'count'
      }, {
        sql: "UPDATE tag  SET ? WHERE tagId=?;",
        values: [updateTag, tagId]
      }
    ];
    // 等待数据库操作
    await BasicController.twoStagesUpdate(ctx, sqlsInTransaction)
  }

  // 根据tagId，删除tag
  static async deleteTagByTagId(ctx) {
    console.log("TagController.delete execute");
    // 解析请求参数
    const [userId, tagId] = BasicController.validation(ctx, ['userId', 'tagId']);
    // 等待数据库操作
    var sqlsInTransaction = [{
      sql: "DELETE FROM `user-tag-rel` WHERE tagId=? AND userId=? ;",
      values: [tagId, userId]
    },{
      sql: "DELETE FROM tag WHERE tagId=? ;",
      values: tagId
    }];
    await BasicController.twoStagesDelete(ctx, sqlsInTransaction);
  }
};

export default TagController;