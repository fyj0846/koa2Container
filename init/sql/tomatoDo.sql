/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 50719
 Source Host           : localhost
 Source Database       : tomatoDo

 Target Server Type    : MySQL
 Target Server Version : 50719
 File Encoding         : utf-8

 Date: 08/05/2017 13:59:06 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `project`
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `projectId` int(11) NOT NULL,
  `projectName` varchar(127) NOT NULL,
  `projectDescribe` varchar(127) DEFAULT NULL,
  KEY `projectId` (`projectId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ----------------------------
--  Table structure for `scene`
-- ----------------------------
DROP TABLE IF EXISTS `scene`;
CREATE TABLE `scene` (
  `sceneId` int(11) NOT NULL,
  `sceneName` varchar(127) NOT NULL,
  `sceneDescribe` varchar(127) DEFAULT NULL,
  PRIMARY KEY (`sceneId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ----------------------------
--  Table structure for `tag`
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `tagId` int(11) NOT NULL,
  `tagName` varchar(127) NOT NULL,
  `tagDescribe` varchar(127) NOT NULL,
  PRIMARY KEY (`tagId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ----------------------------
--  Table structure for `todo`
-- ----------------------------
DROP TABLE IF EXISTS `todo`;
CREATE TABLE `todo` (
  `todoId` int(11) NOT NULL,
  `todoTitle` varchar(255) NOT NULL,
  `priority` int(3) DEFAULT NULL,
  `cTime` datetime NOT NULL,
  `expectFinishTime` datetime DEFAULT NULL,
  `expeckClock` float(4,1) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `spentClock` float(4,1) DEFAULT NULL,
  `finishTime` datetime DEFAULT NULL,
  `isFinished` varchar(3) NOT NULL,
  `isDelete` varchar(3) NOT NULL,
  `satisfiyDegree` float(4,1) DEFAULT NULL,
  `score` float(4,1) DEFAULT NULL,
  PRIMARY KEY (`todoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='todo table';


-- ----------------------------
--  Table structure for `todo-project-rel`
-- ----------------------------
DROP TABLE IF EXISTS `todo-project-rel`;
CREATE TABLE `todo-project-rel` (
  `todoId` int(11) NOT NULL,
  `projectId` int(11) NOT NULL,
  PRIMARY KEY (`todoId`,`projectId`),
  KEY `projectId` (`projectId`),
  CONSTRAINT `todo_project_FK_p` FOREIGN KEY (`projectId`) REFERENCES `project` (`projectId`) ON UPDATE CASCADE,
  CONSTRAINT `todo_project_FK_t` FOREIGN KEY (`todoId`) REFERENCES `todo` (`todoId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `todo-scene-rel`
-- ----------------------------
DROP TABLE IF EXISTS `todo-scene-rel`;
CREATE TABLE `todo-scene-rel` (
  `todoId` int(11) NOT NULL,
  `sceneId` int(11) NOT NULL,
  PRIMARY KEY (`todoId`,`sceneId`),
  KEY `sceneId` (`sceneId`),
  CONSTRAINT `todo_scene_FK_s` FOREIGN KEY (`sceneId`) REFERENCES `scene` (`sceneId`) ON UPDATE CASCADE,
  CONSTRAINT `todo_scene_FK_t` FOREIGN KEY (`todoId`) REFERENCES `todo` (`todoId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `todo-tag-rel`
-- ----------------------------
DROP TABLE IF EXISTS `todo-tag-rel`;
CREATE TABLE `todo-tag-rel` (
  `todoId` int(11) NOT NULL,
  `tagId` int(11) NOT NULL,
  PRIMARY KEY (`todoId`,`tagId`),
  KEY `tagId` (`tagId`),
  CONSTRAINT `todo_tag_FK_t` FOREIGN KEY (`todoId`) REFERENCES `todo` (`todoId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `todo_tag_FK_tag` FOREIGN KEY (`tagId`) REFERENCES `tag` (`tagId`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `userId` int(11) NOT NULL,
  `userName` varchar(127) NOT NULL,
  `userPassword` varchar(127) NOT NULL,
  `userMail` varchar(127) NOT NULL,
  `userGental` varchar(3) DEFAULT NULL,
  `userNickName` varchar(127) DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- ----------------------------
--  Table structure for `user-project-rel`
-- ----------------------------
DROP TABLE IF EXISTS `user-project-rel`;
CREATE TABLE `user-project-rel` (
  `userId` int(11) NOT NULL,
  `projectId` int(11) NOT NULL,
  PRIMARY KEY (`userId`,`projectId`),
  KEY `projectId` (`projectId`),
  CONSTRAINT `user_project_FK_p` FOREIGN KEY (`projectId`) REFERENCES `project` (`projectId`) ON UPDATE CASCADE,
  CONSTRAINT `user_project_FK_u` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `user-scene-rel`
-- ----------------------------
DROP TABLE IF EXISTS `user-scene-rel`;
CREATE TABLE `user-scene-rel` (
  `userId` int(11) NOT NULL,
  `sceneId` int(11) NOT NULL,
  PRIMARY KEY (`userId`,`sceneId`),
  KEY `sceneId` (`sceneId`),
  CONSTRAINT `user_scene_FK_s` FOREIGN KEY (`sceneId`) REFERENCES `scene` (`sceneId`) ON UPDATE CASCADE,
  CONSTRAINT `user_scene_FK_u` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `user-tag-rel`
-- ----------------------------
DROP TABLE IF EXISTS `user-tag-rel`;
CREATE TABLE `user-tag-rel` (
  `userId` int(11) NOT NULL,
  `tagId` int(11) NOT NULL,
  PRIMARY KEY (`userId`,`tagId`),
  KEY `tagId` (`tagId`),
  CONSTRAINT `user_tag_FK_tag` FOREIGN KEY (`tagId`) REFERENCES `tag` (`tagId`) ON UPDATE CASCADE,
  CONSTRAINT `user_tag_FK_u` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `user-todo-rel`
-- ----------------------------
DROP TABLE IF EXISTS `user-todo-rel`;
CREATE TABLE `user-todo-rel` (
  `userId` int(11) NOT NULL,
  `todoId` int(11) NOT NULL,
  PRIMARY KEY (`todoId`,`userId`),
  KEY `user_FK` (`userId`) USING BTREE,
  KEY `todo_FK` (`todoId`) USING BTREE,
  CONSTRAINT `todoId` FOREIGN KEY (`todoId`) REFERENCES `todo` (`todoId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;


-- test Data Initialized

-- ----------------------------
--  Records of `project`
-- ----------------------------
BEGIN;
INSERT INTO `project` VALUES ('1', 'EDA', 'EDA'), ('2', 'ITSM', 'ITSM'), ('3', '家庭', '家庭'), ('4', '兴趣', '兴趣'), ('5', 'todo', 'todo');
COMMIT;

-- ----------------------------
--  Records of `scene`
-- ----------------------------
BEGIN;
INSERT INTO `scene` VALUES ('1', '单位', '单位做的事'), ('2', '家庭', '家里做的事'), ('3', '通勤', '通勤'), ('4', '媳妇', '媳妇');
COMMIT;

-- ----------------------------
--  Records of `tag`
-- ----------------------------
BEGIN;
INSERT INTO `tag` VALUES ('1', '挑战', '难度极高'), ('2', '机械', '没有难度');
COMMIT;

-- ----------------------------
--  Records of `todo`
-- ----------------------------
BEGIN;
INSERT INTO `todo` VALUES
  ('1', 'EDA_基线管理', '5', '2017-08-05 12:53:03', '2017-08-05 15:53:12', '3.0', 'EDA基线工作', null, null, 'F', 'F', null, null),
  ('2', 'EDA_测试排查', '4', '2017-08-05 12:54:21', '2017-08-05 17:54:24', '2.0', 'EDA测试支持', null, null, 'T', 'F', null, null),
  ('3', 'ITSM_机构优化', '5', '2017-08-05 12:55:20', '2017-08-06 12:55:24', '6.0', 'ITST开发工作', null, null, 'F', 'F', null, null),
  ('4', '党小组总结', '3', '2017-08-05 12:56:09', '2017-08-08 12:56:11', '1.0', '党务', null, null, 'T', 'F', null, null),
  ('5', '陪产检', '5', '2017-08-05 12:57:22', '2017-08-11 12:57:25', '3.0', '家务', null, null, 'F', 'F', null, null);
COMMIT;

-- ----------------------------
--  Records of `user`
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('1', 'tester', 'tester', 'test@gmail.com', 'M', 'tester');
COMMIT;


-- ----------------------------
--  Records of `user-todo-rel`
-- ----------------------------
BEGIN;
INSERT INTO `user-todo-rel` VALUES ('1', '1'), ('1', '2'), ('1', '3'), ('1', '4'), ('1', '5');
COMMIT;

BEGIN;
INSERT INTO `user-project-rel` VALUES（'1', '1'), ('1', '2'), ('1', '3'), ('1', '4'), ('1', '5');
COMMIT;

BEGIN;
INSERT INTO `todo-project-rel` VALUES ('1', '1'), ('2', '1'), ('3', '2'), ('4', '4'), ('5', '4');
COMMIT;

BEGIN;
INSERT INTO `user-tag-rel` VALUES ('1', '1'), ('1', '2');
COMMIT;

BEGIN;
INSERT INTO `todo-tag-rel` VALUES ('1', '1'), ('1', '2'),('2', '1'), ('3', '2'),('4', '1'), ('5', '2');
COMMIT;

BEGIN;
INSERT INTO `user-scene-rel` VALUES ('1', '1'), ('1', '2'), ('1', '3');
COMMIT;

BEGIN;
INSERT INTO `todo-scene-rel` VALUES ('1', '1'), ('1', '2'),('1', '3'), ('2', '2'),('3', '3'), ('4', '2'), ('5', '1'), ('5', '2');
COMMIT;