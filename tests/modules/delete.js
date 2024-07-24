const database = require("../../src/database");

module.exports = class Delete {
  static async run(params) {
    const { pool } = database;
    const query = `
      DELETE
      FROM
        ${params.table}
      WHERE
        id IN (?)
    `;

    const values = [params.ids];
    const [result] = await pool.query(query, values);
    return result;
  }
};
