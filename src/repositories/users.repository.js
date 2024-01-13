module.exports = class UsersRepository {
  constructor(database) {
    this.database = database;
  }

  selectUser = async (param) => {
    const pool = await this.database.pool;
    const query = `
      SELECT
        id,
        email,
        hashed_password AS hashedPassword,
        salt
      FROM
        users
      WHERE
        email = ?;
    `;

    const [result] = await pool.query(query, [param]);
    return result;
  };

  selectUserByID = async (param) => {
    const pool = await this.database.pool;
    const query = `
      SELECT
        id AS userID,
        refresh_token AS refreshToken
      FROM
        users
      WHERE
        id = ?;
    `;

    const values = [param.userID];
    const [result] = await pool.query(query, values);
    return result;
  };

  insertUser = async (param) => {
    const pool = await this.database.pool;
    const query = `
      INSERT INTO users
        (email, hashed_password, salt)
      VALUES
        (?, ?, ?);
    `;

    const values = [param.email, param.hashedPassword, param.salt];
    await pool.query(query, values);
  };

  updateUserRefreshToken = async (param) => {
    const pool = await this.database.pool;
    const query = `
      UPDATE
        users
      SET
        refresh_token = ?
      WHERE
        id = ?;
    `;

    const values = [param.refreshToken, param.userID];
    const [result] = await pool.query(query, values);
    return result;
  };

  updateUserPassword = async (param) => {
    const pool = await this.database.pool;
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
  };
};
