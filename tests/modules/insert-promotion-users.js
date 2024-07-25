const database = require("../../src/database");

module.exports = class InsertPromotionUsers {
  static async run() {
    const { pool } = database;
    const query = `
      INSERT INTO
        promotion_users (
          user_id,
          promotion_id
        )
      SELECT
        u.id,
        2 AS promotion_id
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
