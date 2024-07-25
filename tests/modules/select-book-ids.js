const database = require("../../src/database");

module.exports = class SelectBookIDs {
  static async run(params) {
    const { pool } = database;
    const query = `
      SELECT
        id AS bookID
      FROM
        books
      ORDER BY
        created_at DESC
      LIMIT ?;
    `;

    const values = [params.bookSize];
    const [result] = await pool.query(query, values);
    return result;
  }
};
