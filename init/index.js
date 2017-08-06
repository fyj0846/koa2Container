/**
 * Created by qiujian on 8/1/17.
 */
/**
 * Created by qiujian on 7/22/17.
 * 数据库初始化 入口文件: node --harmony index.js
 */
const fs = require('fs');
const getSqlContentMap = require('./utils/getSqlContentMap');
const {executeSql} = require('./utils/db');


// 打印脚本执行日志
const eventLog = function (err, sqlFile, index) {
  if (err) {
    console.log(`[ERROR] sql脚本文件: ${sqlFile} 第${index + 1}条脚本 执行失败 o(╯□╰)o ！`)
  } else {
    console.log(`[SUCCESS] sql脚本文件: ${sqlFile} 第${index + 1}条脚本 执行成功 O(∩_∩)O !`)
  }
};

// 获取所有sql脚本内容
let sqlContentMap = getSqlContentMap();

// 执行建表sql脚本
const createAllTables = async () => {
  for (let file in sqlContentMap) {
    let sqlScripts = sqlContentMap[file];
    let sqlScriptList = sqlScripts.split(';');

    for (let [i, sentence] of sqlScriptList.entries()) {
      if (sentence.trim()) {
        let result = await executeSql(sentence)
        if (result.serverStatus * 1 === 2) {
          eventLog(null, file, i);  //执行成功
        } else {
          eventLog(true, file, i);  //执行失败
        }
      }
    }
  }
  console.log('sql脚本执行结束！');
  console.log('请按 ctrl + c 键退出！');
}

createAllTables();