const database = require("../database");

module.exports = class CategoriesRepository {
  database = database;

  async selectCategories() {
    const pool = this.database.readPool;
    const query = `
      SELECT
        id,
        category
      FROM
        categories;
    `;

    const [result] = await pool.query(query);
    return result;
  }
};
