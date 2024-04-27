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
  pool = mysql.createPool(this.config);

  connect() {
    this.pool
      .query("SELECT 1;")
      .then(() => logger.info("Connected on port 3306 (MySQL)"))
      .catch((error) => logger.error(error.message));
  }
}

module.exports = new Database();
