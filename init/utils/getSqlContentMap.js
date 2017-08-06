/**
 * Created by qiujian on 7/22/17.
 */
const fs = require('fs')
const getSqlMap = require('./getSqlFileMap')

let sqlContentMap = {}

/**
 * 读取sql文件内容
 * @param  {string} fileName 文件名称
 * @param  {string} path     文件所在的路径
 * @return {string}          脚本文件内容
 */
function getSqlContent(fileName, path) {
  let content = fs.readFileSync(path, 'binary');
  sqlContentMap[fileName] = content;  // {fileName: fileContent}
}

/**
 * 封装所有sql文件脚本内容
 * @param {string}  path  目标文件所在的路径
 * @return {object}
 */
function getSqlContentMap(path) {
  let sqlMap = getSqlMap(path); // {fileName: filePath2file}
  for (let fileName in sqlMap) {
    getSqlContent(fileName, sqlMap[fileName])
  }
  return sqlContentMap
}

// for test
// getSqlContentMap();

module.exports = getSqlContentMap
