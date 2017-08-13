INSERT INTO `project` VALUES ('1', 'EDA', 'EDA'), ('2', 'ITSM', 'ITSM'), ('3', '家庭', '家庭'), ('4', '兴趣', '兴趣'), ('5', 'todo', 'todo');
INSERT INTO `scene` VALUES ('1', '单位', '单位做的事'), ('2', '家庭', '家里做的事'), ('3', '通勤', '通勤'), ('4', '媳妇', '媳妇');
INSERT INTO `tag` VALUES ('1', '挑战', '难度极高'), ('2', '机械', '没有难度');
INSERT INTO `todo` VALUES
  ('1', 'EDA_基线管理', '5', '2017-08-05 12:53:03', '2017-08-05 15:53:12', '3.0', 'EDA基线工作', null, null, 'F', 'F', null, null),
  ('2', 'EDA_测试排查', '4', '2017-08-05 12:54:21', '2017-08-05 17:54:24', '2.0', 'EDA测试支持', null, null, 'T', 'F', null, null),
  ('3', 'ITSM_机构优化', '5', '2017-08-05 12:55:20', '2017-08-06 12:55:24', '6.0', 'ITST开发工作', null, null, 'F', 'F', null, null),
  ('4', '党小组总结', '3', '2017-08-05 12:56:09', '2017-08-08 12:56:11', '1.0', '党务', null, null, 'T', 'F', null, null),
  ('5', '陪产检', '5', '2017-08-05 12:57:22', '2017-08-11 12:57:25', '3.0', '家务', null, null, 'F', 'F', null, null);
INSERT INTO `user` VALUES ('1', 'tester', 'tester', 'test@gmail.com', 'M', 'tester');
COMMIT;

INSERT INTO `user-todo-rel` VALUES ('1', '1'), ('1', '2'), ('1', '3'), ('1', '4'), ('1', '5');
INSERT INTO `user-project-rel` VALUES ('1','1'),('1','2'),('1','3'),('1','4'),('1','5');
INSERT INTO `todo-project-rel` VALUES ('1', '1'), ('2', '1'), ('3', '2'), ('4', '4'), ('5', '4');
INSERT INTO `user-tag-rel` VALUES ('1', '1'), ('1', '2');
INSERT INTO `todo-tag-rel` VALUES ('1', '1'), ('1', '2'),('2', '1'), ('3', '2'),('4', '1'), ('5', '2');
INSERT INTO `user-scene-rel` VALUES ('1', '1'), ('1', '2'), ('1', '3');
INSERT INTO `todo-scene-rel` VALUES ('1', '1'), ('1', '2'),('1', '3'), ('2', '2'),('3', '3'), ('4', '2'), ('5', '1'), ('5', '2');
COMMIT;