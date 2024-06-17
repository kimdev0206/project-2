const database = require("../database");

module.exports = class PromotionsRepository {
  database = database;

  async selectPromotions() {
    const pool = this.database.readPool;
    const query = `
      SELECT
        id,
        title,
        discount_rate AS discountRate,
        start_at AS startAt,
        end_at AS endAt
      FROM
        promotions;
    `;

    const [result] = await pool.query(query);
    return result;
  }
};
