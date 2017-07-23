/**
 * Created by qiujian on 7/22/17.
 */
const mysql = require("mysql");

// 直接连接
// const connection = mysql.createConnection({
//   host: '127.0.0.1',
//   user: 'tomatoDo',
//   password: 'tomatoDo0846',
//   database: 'test'
// });
// connection.query("select * from user", (error, results, fields) => {
//   if (error) throw error
//   // connected!
//   console.log(results);
//   // 结束会话
//   connection.destroy();
// });

// 通过连接池连接
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'tomatoDo',
  password: 'tomatoDo0846',
  database: 'test'
})

pool.getConnection(function (error, connection) {
  connection.query("select * from user", (error, results, fields) => {
    if (error) throw error
    // connected!
    console.log(results);
    // 结束会话
    connection.release();
  });
});