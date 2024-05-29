const database = require("../database");

module.exports = class UsersRepository {
  database = database;

  async selectUserByEmail(param) {
    const pool = this.database.pool;
    const query = `
      SELECT
        id AS userID,
        hashed_password AS hashedPassword,
        salt
      FROM
        users
      WHERE
        email = ?;
    `;

    const values = [param.email];
    const [result] = await pool.query(query, values);
    return result;
  }

  async insertUser(param) {
    const pool = this.database.pool;
    const query = `
      INSERT INTO
        users
        (
          email,
          hashed_password,
          salt
        )
      VALUES
        (?, ?, ?);
    `;

    const values = [param.email, param.hashedPassword, param.salt];
    await pool.query(query, values);
  }

  async updateUserPassword(param) {
    const pool = this.database.pool;
    const query = `
      UPDATE
        users
      SET
        hashed_password = ?,
        salt = ?
      WHERE
        email = ?;
    `;

    const values = [param.hashedPassword, param.salt, param.email];
    const [result] = await pool.query(query, values);
    return result;
  }
};
