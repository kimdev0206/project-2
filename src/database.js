const mysql = require("mysql2/promise");
const { isProduction } = require("./utils");

class Database {
  config = {
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "project-2",
  };

  constructor() {
    isProduction() &&
      (this.config = {
        ...this.config,
        ...{
          host: process.env.MYSQL_HOST,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
        },
      });
  }

  pool = mysql.createPool(this.config);

  connect() {
    this.pool
      .query("SELECT 1;")
      .then(() => console.info("Connected on port 3306 (MySQL)"))
      .catch((error) => console.info(error));
  }
}

module.exports = new Database();
