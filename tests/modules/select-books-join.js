const database = require("../../src/database");

module.exports = class SelectBooksJoin {
  static async run(params) {
    const { pool } = database;
    let query = `
      SELECT
        b.id,
        b.title,
        b.id AS imgID,
        b.summary,
        b.author,
        b.price,
        CONVERT(ROUND(b.price - b.price *
          MAX(ap.discount_rate)
        ), SIGNED) AS discountedPrice,
        MAX(ap.discount_rate) AS discountRate,
        (
          SELECT
            COUNT(*)
          FROM
            likes
          WHERE
            liked_book_id = b.id
        ) AS likes
      FROM
        books AS b
      LEFT JOIN
        active_promotions AS ap
        ON b.category_id = ap.category_id
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

    let clauses = ["GROUP BY b.id"];

    if (params.isBest) {
      clauses.push("ORDER BY likes DESC, b.pub_date DESC");
    }

    if (params.limit && params.page) {
      clauses.push("LIMIT ? OFFSET ?");

      const offset = (params.page - 1) * params.limit;
      values.push(params.limit, offset);
    }

    query += `
      ${clauses.join(" ")};
    `;

    const [result] = await pool.query(query, values);
    return result;
  }
};
