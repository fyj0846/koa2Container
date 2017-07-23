const fs = require('fs')

/**
 * 遍历指定目录下的文件目录
 * @param  {string} pathResolve  需进行遍历的目录路径
 * @param  {string} fileType         遍历文件的后缀名
 * @return {object}              返回遍历后的目录结果
 */
const goThroughFiles = function(path2GoDir , expectFileType){
  let files = fs.readdirSync(path2GoDir)
  let fileList = {}
  for( let [index, fileName] of files.entries() ) {
    console.log(fileName);
    let fileNameSplited = fileName.split('.')
    let fileType = (fileNameSplited.length > 1) ? fileNameSplited[fileNameSplited.length - 1] : 'undefined';
    let fileNameString = fileName + ''
    if (fileType === expectFileType) {
      fileList[fileNameString] = path2GoDir + (path2GoDir.endsWith("/") ? "":"/") + fileName;
    }
  }
  console.log(fileList);
  return fileList
}

// for test
// goThroughFiles("/Users/qiujian", "lock");

module.exports = goThroughFiles