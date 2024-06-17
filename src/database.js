const mysql = require("mysql2/promise");
const logger = require("./logger");

class Database {
  constructor() {
    this.initConfig();
    this.initPool();
  }

  connect() {
    this.readPool
      .query("SELECT 1;")
      .then(() => logger.info("Connected on port 3306 (MySQL)"))
      .catch((error) => logger.error(error.message));
  }

  initConfig() {
    if (process.env.NODE_ENV?.trim() === "production") {
      this.config = {
        host: process.env.MYSQL_HOST_READ,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: "project-2",
      };
    } else {
      this.config = {
        host: "localhost",
        user: "root",
        password: process.env.MYSQL_PASSWORD,
        database: "project-2",
      };
    }
  }

  initPool() {
    if (process.env.NODE_ENV?.trim() === "production") {
      this.writePool = mysql.createPool({
        ...this.config,
        host: process.env.MYSQL_HOST_WRITE,
      });
      this.readPool = mysql.createPool(this.config);
    } else {
      this.writePool = mysql.createPool(this.config);
      this.readPool = mysql.createPool(this.config);
    }
  }
}

module.exports = new Database();
