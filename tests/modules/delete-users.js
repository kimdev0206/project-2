const database = require("../../src/database");

module.exports = class DeleteUsers {
  static async run(params) {
    const { pool } = database;
    const query = `
      DELETE
      FROM
        users
      WHERE
        id IN (?);
    `;

    const values = [params.userIDs];
    const [result] = await pool.query(query, values);
    return result;
  }
};
