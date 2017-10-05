/**
 * Created by qiujian on 7/22/17.
 */
var type = "PRODUCTION";
var dbCfg = {};

const test_dbCfg = {
  multipleStatements: true,  //配置允许执行多条语句，会有注入攻击的风险
  host: '127.0.0.1',
  user: 'tomatoDo',
  password: 'tomatoDo0846',
  database: 'tomatoDo'
};

const prod_dbCfg = {
  multipleStatements: true,  //配置允许执行多条语句，会有注入攻击的风险
  host: '162.219.122.125',
  user: 'tomatoDo',
  password: 'tomatoDo123>',
  database: 'tomatoDo'
};

if(type == "TEST") {
  dbCfg = test_dbCfg
} else {
  dbCfg = prod_dbCfg;
}

export default dbCfg;