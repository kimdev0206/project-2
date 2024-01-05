const mysql = require("mysql2/promise");
const logger = require("./logger");

class Database {
  config = {
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "project-2",
    dateStrings: true,
  };

  constructor({ mysql, logger }) {
    this._pool = mysql.createPool(this.config);
    this._pool
      .query("SELECT 1;")
      .then(() => logger.info("Connected on port 3306 (MySQL)"))
      .catch((err) => logger.err(err.message));
  }

  get pool() {
    return this._pool;
  }

  set pool(pool) {
    this._pool = pool;
  }
}

module.exports = new Database({ mysql, logger });
