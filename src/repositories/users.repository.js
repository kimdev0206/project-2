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

  async selectRefreshToken(param) {
    const pool = this.database.pool;
    const query = `
      SELECT
        u.id AS userID,
        r.refresh_token AS refreshToken
      FROM
        users AS u
      LEFT JOIN
        refresh_tokens AS r
        ON u.id = r.user_id
      WHERE
        u.id = ?
        AND r.ip = ?;
    `;

    const values = [param.userID, param.ip];
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

  async upsertRefreshToken(param) {
    const pool = this.database.pool;
    const query = `
      INSERT INTO
        refresh_tokens
        (
          user_id,
          ip,
          refresh_token
        )
      VALUES
        (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        user_id = VALUES(user_id),
        ip = VALUES(ip),
        refresh_token = VALUES(refresh_token);
    `;

    const values = [param.userID, param.ip, param.refreshToken];
    const [result] = await pool.query(query, values);
    return result;
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
