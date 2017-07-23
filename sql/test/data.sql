CREATE TABLE IF NOT EXISTS  `data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data_info` json DEFAULT NULL,
  `create_time` varchar(20) DEFAULT NULL,
  `modified_time` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

TRUNCATE table `data`;

INSERT INTO `data` SET level=1, create_time='2016-07-22';
INSERT INTO `data` SET level=2, create_time='2016-07-23';
INSERT INTO `data` SET level=3, create_time='2016-07-24';