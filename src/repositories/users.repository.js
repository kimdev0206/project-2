module.exports = class UsersRepository {
  constructor(database) {
    this.database = database;
  }

  // TODO: 인자. 쿼리.
  selectUser = async () => {
    const pool = await this.database;
    const query = `      
    `;

    const [result] = await pool.query(query);
    return result;
  };

  insertUser = async () => {
    const pool = await this.database;
    const query = `
    `;

    await pool.query(query);
  };
};
