const database = require("../../src/database");

module.exports = class DeleteBooks {
  static async run(params) {
    const { pool } = database;
    const query = `
      DELETE
      FROM
        books
      WHERE
        id IN (?)
    `;

    const values = [params.bookIDs];
    const [result] = await pool.query(query, values);
    return result;
  }
};
