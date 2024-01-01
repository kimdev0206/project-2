module.exports = class UsersRepository {
  constructor(database) {
    this.database = database;
  }

  selectUser = async (param) => {
    const pool = await this.database.pool;
    const query = `
      SELECT
        *
      FROM
        users
      WHERE
        email = ?;
    `;

    const [result] = await pool.query(query, [param]);
    return result;
  };

  insertUser = async (param) => {
    const pool = await this.database.pool;
    const query = `
      INSERT INTO users
        (email, password)
      VALUES
        (?, ?);
    `;

    await pool.query(query, Object.values(param));
  };
};
