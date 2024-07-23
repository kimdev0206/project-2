const database = require("../../src/database");

module.exports = class SelectBookCount {
  static async run(params) {
    const { pool } = database;
    let query = `
      SELECT
        COUNT(*) AS counted
      FROM
        books AS b
    `;

    let conditions = [];
    let values = [];

    if (params.categoryID) {
      conditions.push("b.category_id = ?");
      values.push(params.categoryID);
    }

    if (params.isNew) {
      conditions.push(
        "b.pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()"
      );
    }

    if (params.keyword) {
      let condition = [];

      if (params.isTitle) {
        condition.push("b.title LIKE ?");
        values.push(`%${params.keyword}%`);
      }

      if (params.isSummary) {
        condition.push("b.summary LIKE ?");
        values.push(`%${params.keyword}%`);
      }

      if (params.isContents) {
        condition.push("b.contents LIKE ?");
        values.push(`%${params.keyword}%`);
      }

      if (params.isDetail) {
        condition.push("b.detail LIKE ?");
        values.push(`%${params.keyword}%`);
      }

      condition.length && conditions.push(`(${condition.join(" OR ")})`);
    }

    if (conditions.length) {
      query += `
        WHERE
          ${conditions.join(" AND ")}
      `;
    }

    let clauses = [];

    if (params.isBest) {
      clauses.push(`
        ORDER BY (
            SELECT
              COUNT(*)
            FROM
              likes
            WHERE
              liked_book_id = b.id
          ) DESC, 
          b.pub_date DESC
      `);
    }

    query += `
      ${clauses.join(" ")};
    `;

    const [result] = await pool.query(query, values);
    return result;
  }
};
