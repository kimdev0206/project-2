const database = require("../../src/database");

module.exports = class InsertPromotionUser {
  static async run() {
    const { pool } = database;
    const query = `
      INSERT INTO
        promotion_users (
          promotion_id,
          user_id
        )
      SELECT
        2 AS promotion_id,
        u.id
      FROM
        users AS u
      WHERE
        u.email LIKE '%@gmail.com'
        AND u.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 5 SECOND) AND NOW();
    `;

    const [result] = await pool.query(query);
    return result;
  }
};
