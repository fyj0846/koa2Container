/**
 * Created by qiujian on 7/22/17.
 */
const fs = require('fs')
const goThroughFiles = require('./goThroughFiles')

/**
 * 获取sql目录下的文件目录数据
 * @return {object}
 */
function getSqlMap (filePath) {
  let basePath = filePath || __dirname + "/../sql/test";  // 默认sql相对于utils的路径
  console.log("getSqlMap: " + basePath);
  basePath = basePath.replace(/\\/g, '\/');  // 兼容不同平台的文件分割符

  // 遍历路径下的sql文件
  let fileList = goThroughFiles(basePath, 'sql');
  return fileList
}

// for test
getSqlMap();

module.exports = getSqlMap