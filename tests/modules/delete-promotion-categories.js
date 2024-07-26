const database = require("../../src/database");

module.exports = class DeletePromotionCategories {
  static async run(params) {
    const { pool } = database;
    const query = `
      DELETE
      FROM
        promotion_categories
      WHERE
        category_id = ?;
    `;

    const values = [params.categoryID];
    const [result] = await pool.query(query, values);
    return result;
  }
};
