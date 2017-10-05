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

 Date: 10/05/2017 16:57:52 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `project`
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `projectId` bigint(15) NOT NULL,
  `projectName` varchar(127) NOT NULL,
  `projectDescribe` varchar(127) DEFAULT NULL,
  `isDelete` varchar(3) NOT NULL,
  KEY `projectId` (`projectId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `scene`
-- ----------------------------
DROP TABLE IF EXISTS `scene`;
CREATE TABLE `scene` (
  `sceneId` bigint(15) NOT NULL,
  `sceneName` varchar(127) NOT NULL,
  `sceneDescribe` varchar(127) DEFAULT NULL,
  `isDelete` varchar(3) NOT NULL,
  PRIMARY KEY (`sceneId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `tag`
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `tagId` bigint(15) NOT NULL,
  `tagName` varchar(127) NOT NULL,
  `tagDescribe` varchar(127) NOT NULL,
  `isDelete` varchar(3) NOT NULL,
  PRIMARY KEY (`tagId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `todo`
-- ----------------------------
DROP TABLE IF EXISTS `todo`;
CREATE TABLE `todo` (
  `todoId` bigint(15) NOT NULL,
  `todoTitle` varchar(255) NOT NULL,
  `priority` int(3) DEFAULT NULL,
  `cTime` datetime NOT NULL,
  `expectFinishTime` datetime DEFAULT NULL,
  `expectClock` float(4,1) DEFAULT NULL,
  `todoDescribe` varchar(255) DEFAULT NULL,
  `spentClock` float(4,1) DEFAULT NULL,
  `finishTime` datetime DEFAULT NULL,
  `isFinished` varchar(3) NOT NULL,
  `isDelete` varchar(3) NOT NULL,
  `satisfiyDegree` float(4,1) DEFAULT NULL,
  `score` float(4,1) DEFAULT NULL,
  `deleteTime` datetime DEFAULT NULL,
  `tags` varchar(127) DEFAULT NULL,
  `clockElapse` int(11) DEFAULT NULL,
  PRIMARY KEY (`todoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='todo table';

-- ----------------------------
--  Table structure for `todo-project-rel`
-- ----------------------------
DROP TABLE IF EXISTS `todo-project-rel`;
CREATE TABLE `todo-project-rel` (
  `todoId` bigint(15) NOT NULL,
  `projectId` bigint(15) NOT NULL,
  PRIMARY KEY (`todoId`,`projectId`),
  KEY `projectId` (`projectId`),
  CONSTRAINT `todo_project_FK_p` FOREIGN KEY (`projectId`) REFERENCES `project` (`projectId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `todo_project_FK_t` FOREIGN KEY (`todoId`) REFERENCES `todo` (`todoId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `todo-scene-rel`
-- ----------------------------
DROP TABLE IF EXISTS `todo-scene-rel`;
CREATE TABLE `todo-scene-rel` (
  `todoId` bigint(15) NOT NULL,
  `sceneId` bigint(15) NOT NULL,
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
  `todoId` bigint(15) NOT NULL,
  `tagId` bigint(15) NOT NULL,
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
  `userId` bigint(15) NOT NULL,
  `userName` varchar(127) NOT NULL,
  `userNickName` varchar(127) DEFAULT NULL,
  `userPassword` varchar(127) NOT NULL,
  `userMail` varchar(127) NOT NULL,
  `userGental` varchar(3) DEFAULT NULL,
  `isDelete` varchar(3) NOT NULL,
  `regTime` datetime NOT NULL,
  PRIMARY KEY (`userId`,`userPassword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `user-clock`
-- ----------------------------
DROP TABLE IF EXISTS `user-clock`;
CREATE TABLE `user-clock` (
  `userId` bigint(15) NOT NULL,
  `clockUnit` int(11) NOT NULL,
  PRIMARY KEY (`userId`),
  CONSTRAINT `userId_clock_FK` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `user-project-rel`
-- ----------------------------
DROP TABLE IF EXISTS `user-project-rel`;
CREATE TABLE `user-project-rel` (
  `userId` bigint(15) NOT NULL,
  `projectId` bigint(15) NOT NULL,
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
  `userId` bigint(15) NOT NULL,
  `sceneId` bigint(15) NOT NULL,
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
  `userId` bigint(15) NOT NULL,
  `tagId` bigint(15) NOT NULL,
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
  `userId` bigint(15) NOT NULL,
  `todoId` bigint(15) NOT NULL,
  PRIMARY KEY (`todoId`,`userId`),
  KEY `user_FK` (`userId`) USING BTREE,
  KEY `todo_FK` (`todoId`) USING BTREE,
  CONSTRAINT `todoId` FOREIGN KEY (`todoId`) REFERENCES `todo` (`todoId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
