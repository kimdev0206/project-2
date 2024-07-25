const database = require("../database");

module.exports = class UsersRepository {
  database = database;

  async selectUser(email) {
    const { pool } = this.database;
    const query = `
      SELECT
        id AS userID,
        hashed_password AS hashedPassword,
        salt
      FROM
        users
      WHERE
        email = ?
        AND is_deleted = 0;
    `;

    const values = [email];
    const [result] = await pool.query(query, values);
    return result;
  }

  async insertUser(dao) {
    const { pool } = this.database;
    const query = `
      INSERT INTO
        users (
          email,
          hashed_password,
          salt
        )
      VALUES
        (?, ?, ?);
    `;

    const values = [dao.email, dao.hashedPassword, dao.salt];
    await pool.query(query, values);
  }

  async updateUserPassword(dao) {
    const { pool } = this.database;
    const query = `
      UPDATE
        users
      SET
        hashed_password = ?,
        salt = ?
      WHERE
        email = ?
        AND is_deleted = 0;
    `;

    const values = [dao.hashedPassword, dao.salt, dao.email];
    const [result] = await pool.query(query, values);
    return result;
  }
};
