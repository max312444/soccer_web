const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  port: 13306,  // 너가 선택한 MySQL 외부 포트
  user: 'soccer',
  password: 'soccer123',
  database: 'soccer_db',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
