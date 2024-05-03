const mysql = require("mysql2/promise");
const logger = require("./logger");

class Database {
  config =
    process.env.NODE_ENV?.trim() === "production"
      ? {
          host: process.env.MYSQL_HOST,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE_NAME,
        }
      : {
          host: "localhost",
          user: "root",
          password: process.env.MYSQL_PASSWORD,
          database: "project-2",
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
