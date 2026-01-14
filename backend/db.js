const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3309,
  user: 'soccer',
  password: 'soccer123',
  database: 'soccer_db',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
