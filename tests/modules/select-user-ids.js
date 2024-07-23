const database = require("../../src/database");

module.exports = class SelectUserIDs {
  static async run(params) {
    const { pool } = database;
    const query = `
      SELECT
        u.id AS userID
      FROM
        users AS u
      ORDER BY
        u.created_at DESC
      LIMIT ?;
    `;

    const values = [params.userSize];
    const [result] = await pool.query(query, values);
    return result;
  }
};
