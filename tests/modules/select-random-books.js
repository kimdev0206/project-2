const database = require("../../src/database");

module.exports = class SelectRandomBooks {
  static async run(params) {
    const { pool } = database;
    const query = `
      SELECT
        id AS bookID,
        title,
        author,
        price,
        amount
      FROM (
        SELECT
          *
        FROM
          books
        ORDER BY
          created_at DESC
        LIMIT ?
      ) AS recent_books
      ORDER BY
        RAND()
      LIMIT ?;
    `;

    const values = [params.amount, params.count];
    const [result] = await pool.query(query, values);
    return result;
  }
};
