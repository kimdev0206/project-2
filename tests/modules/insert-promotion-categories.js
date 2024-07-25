const database = require("../../src/database");

module.exports = class InsertPromotionCategories {
  static async run(params) {
    const { pool } = database;
    const query = `
      INSERT INTO 
        promotion_categories (
          book_id,
          category_id,
          promotion_id
        )
      SELECT
        b.id,
        b.category_id,
        1 AS promotion_id
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
