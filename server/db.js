const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME     || "db_vv",
});

db.getConnection((err, conn) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err.message);
  } else {
    console.log("✅  Banco conectado!");
    conn.release();
  }
});

// Helper para queries com Promise
const query = (sql, params) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  );

module.exports = { db, query };