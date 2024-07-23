const database = require("../../src/database");

module.exports = class DeleteUser {
  static async run(params) {
    const { pool } = database;
    const query = `
      UPDATE
        users
      SET
        is_deleted = 1
      WHERE
        id = ?;
    `;

    const values = [params.userID];
    const [result] = await pool.query(query, values);
    return result;
  }
};
