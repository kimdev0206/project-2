const database = require("../../src/database");

module.exports = class InsertPromotionCategory {
  static async run(params) {
    const { pool } = database;
    const query = `
      INSERT INTO 
        promotion_categories (
          promotion_id,
          category_id,
          book_id
        )
      SELECT
        1 AS promotion_id,
        b.category_id,
        b.id
      FROM
        books AS b
      WHERE
        b.category_id = ?
        AND b.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 5 SECOND) AND NOW();
    `;

    const values = [params.categoryID];
    const [result] = await pool.query(query, values);
    return result;
  }
};
