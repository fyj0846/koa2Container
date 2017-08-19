/**
 * Created by qiujian on 7/22/17.
 */
const moment = require('moment');
import BasicController from '../BasicController';

/* scene控制器，继承自基本控制器，可以直接使用父类的数据库连接池 */
class SceneController extends BasicController {
  constructor() {
    super();
  }

  // 根据userId和sceneId，查询scene
  static async getSceneBySceneId(ctx) {
    console.log("SceneController.getSceneBySceneId execute");
    // 解析请求参数
    const [userId, sceneId] = BasicController.validation(ctx, ['userId', 'sceneId']);
    // 数据库操作参数准备
    var sql = {
      sql: 'SELECT A.* from scene A, `user-scene-rel` B WHERE B.userId = ? AND B.sceneId = ? AND B.sceneId = A.sceneId',
      values: [userId, sceneId]
    };
    // 数据库操作
    await BasicController.simpleQuery(ctx, sql);
  }

  // 根据userId， 查询scenes
  static async getScenesByUserId(ctx) {
    console.log("SceneController.getScenes execute");
    // 解析请求参数
    const [userId] = BasicController.validation(ctx, ['userId']);
    // 数据库操作参数准备
    var sql = {
      sql: 'SELECT A.* from scene A, `user-scene-rel` B WHERE B.userId = ? AND B.sceneId = A.sceneId',
      values: userId
    };
    // 数据库操作
    await BasicController.simpleQuery(ctx, sql);
  }

  // 创建scene
  static async createScene(ctx) {
    console.log("SceneController.create execute");
    // 解析请求参数
    const [userId] = BasicController.validation(ctx, ['userId']);
    const {sceneName, sceneDescribe} = ctx.request.body;

    // 参数准备
    var id = new Date().getTime();
    var newScene = {
      sceneId: id,
      sceneName: sceneName,
      sceneDescribe: sceneDescribe
    };

    var newRel = {
      sceneId: id,
      userId: userId
    };

    var sqlsInTransaction = [
      {
        sql: "INSERT INTO scene SET ? ;",
        values: newScene,
        affectedId: 'sceneId'
      }, {
        sql: "INSERT INTO `user-scene-rel` SET ? ;",
        values: newRel
      }
    ];
    // 等待数据库操作
    await BasicController.twoStagesCreate(ctx, sqlsInTransaction);
  }

  // 根据sceneId, 更新scene
  static async updateSceneBySceneId(ctx) {
    console.log("SceneController.update execute");
    // 解析请求参数
    const [userId, sceneId] = BasicController.validation(ctx, ['userId', 'sceneId']);
    const {sceneName, sceneDescribe} = ctx.request.body;
    // 参数准备
    var updateScene = {
      sceneId: sceneId,
      sceneName: sceneName,
      sceneDescribe: sceneDescribe
    };
    var sqlsInTransaction = [
      {
        sql: "SELECT count(*) as count from scene A, `user-scene-rel` B where B.sceneId = ? AND B.userId = ? AND A.sceneId=B.sceneId;",
        values: [sceneId, userId],
        existFlag: 'count'
      }, {
        sql: "UPDATE scene  SET ? WHERE sceneId=?;",
        values: [updateScene, sceneId]
      }
    ];
    // 等待数据库操作
    await BasicController.twoStagesUpdate(ctx, sqlsInTransaction)
  }

  // 根据sceneId，删除scene
  static async deleteSceneBySceneId(ctx) {
    console.log("SceneController.delete execute");
    // 解析请求参数
    const [userId, sceneId] = BasicController.validation(ctx, ['userId', 'sceneId']);
    // 等待数据库操作
    var sqlsInTransaction = [{
      sql: "DELETE FROM `user-scene-rel` WHERE sceneId=? AND userId=? ;",
      values: [sceneId, userId]
    },{
      sql: "DELETE FROM scene WHERE sceneId=? ;",
      values: sceneId
    }];
    await BasicController.twoStagesDelete(ctx, sqlsInTransaction);
  }
};

export default SceneController;