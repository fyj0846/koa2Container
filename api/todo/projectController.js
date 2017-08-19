/**
 * Created by qiujian on 7/22/17.
 */
const moment = require('moment');
import BasicController from '../BasicController';

/* project控制器，继承自基本控制器，可以直接使用父类的数据库连接池 */
class ProjectController extends BasicController {
  constructor() {
    super();
  }

  // 根据userId和projectId，查询project
  static async getProjectByProjectId(ctx) {
    console.log("ProjectController.getProjectByProjectId execute");
    // 解析请求参数
    const [userId, projectId] = BasicController.validation(ctx, ['userId', 'projectId']);
    // 数据库操作参数准备
    var sql = {
      sql: 'SELECT A.* from project A, `user-project-rel` B WHERE B.userId = ? AND B.projectId = ? AND B.projectId = A.projectId',
      values: [userId, projectId]
    };
    // 数据库操作
    await BasicController.simpleQuery(ctx, sql);
  }

  // 根据userId， 查询projects
  static async getProjectsByUserId(ctx) {
    console.log("ProjectController.getProjects execute");
    // 解析请求参数
    const [userId] = BasicController.validation(ctx, ['userId']);
    // 数据库操作参数准备
    var sql = {
      sql: 'SELECT A.* from project A, `user-project-rel` B WHERE B.userId = ? AND B.projectId = A.projectId',
      values: userId
    };
    // 数据库操作
    await BasicController.simpleQuery(ctx, sql);
  }

  // 创建project
  static async createProject(ctx) {
    console.log("ProjectController.create execute");
    // 解析请求参数
    const [userId] = BasicController.validation(ctx, ['userId']);
    const {projectName, projectDescribe} = ctx.request.body;

    // 参数准备
    var id = new Date().getTime();
    var newProject = {
      projectId: id,
      projectName: projectName,
      projectDescribe: projectDescribe
    };

    var newRel = {
      projectId: id,
      userId: userId
    };

    var sqlsInTransaction = [
      {
        sql: "INSERT INTO project SET ? ;",
        values: newProject,
        affectedId: 'projectId'
      }, {
        sql: "INSERT INTO `user-project-rel` SET ? ;",
        values: newRel
      }
    ];
    // 等待数据库操作
    await BasicController.twoStagesCreate(ctx, sqlsInTransaction);
  }

  // 根据projectId, 更新project
  static async updateProjectByProjectId(ctx) {
    console.log("ProjectController.update execute");
    // 解析请求参数
    const [userId, projectId] = BasicController.validation(ctx, ['userId', 'projectId']);
    const {projectName, projectDescribe} = ctx.request.body;
    // 参数准备
    var updateProject = {
      projectId: projectId,
      projectName: projectName,
      projectDescribe: projectDescribe
    };
    var sqlsInTransaction = [
      {
        sql: "SELECT count(*) as count from project A, `user-project-rel` B where B.projectId = ? AND B.userId = ? AND A.projectId=B.projectId;",
        values: [projectId, userId],
        existFlag: 'count'
      }, {
        sql: "UPDATE project  SET ? WHERE projectId=?;",
        values: [updateProject, projectId]
      }
    ];
    // 等待数据库操作
    await BasicController.twoStagesUpdate(ctx, sqlsInTransaction)
  }

  // 根据projectId，删除project
  static async deleteProjectByProjectId(ctx) {
    console.log("ProjectController.delete execute");
    // 解析请求参数
    const [userId, projectId] = BasicController.validation(ctx, ['userId', 'projectId']);
    // 等待数据库操作
    var sqlsInTransaction = [{
      sql: "DELETE FROM `user-project-rel` WHERE projectId=? AND userId=? ;",
      values: [projectId, userId]
    },{
      sql: "DELETE FROM project WHERE projectId=? ;",
      values: projectId
    }];
    await BasicController.twoStagesDelete(ctx, sqlsInTransaction);
  }
};

export default ProjectController;