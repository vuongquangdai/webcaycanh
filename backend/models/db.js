// backend/models/db.js

/**
 * @fileOverview Thiết lập kết nối đến cơ sở dữ liệu MySQL sử dụng mysql2.
 * Sử dụng pool kết nối với Promise để xử lý các truy vấn bất đồng bộ.
 */

const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

module.exports = pool;