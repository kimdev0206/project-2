const database = require("../../src/database");

module.exports = class SelectBookIDs {
  static async run(params) {
    const { pool } = database;
    const query = `
      SELECT
        b.id AS bookID
      FROM
        books AS b
      ORDER BY
        b.id DESC
      LIMIT ?;
    `;

    const values = [params.bookSize];
    const [result] = await pool.query(query, values);
    return result;
  }
};
