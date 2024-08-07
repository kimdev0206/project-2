const database = require("../../src/database");

module.exports = class SelectBookJoin {
  static async run(params) {
    const { pool } = database;
    const query = `
      SELECT
        b.id,
        b.title,
        b.category_id AS categoryID,
        b.id AS imgID,
        b.form,
        b.isbn,
        b.summary,
        b.detail,
        b.author,
        b.pages,
        b.contents,
        b.price,
        b.amount,
        b.published_at AS publishedAt,
        (
          SELECT
            COUNT(*)
          FROM
            likes
          WHERE
            book_id = b.id
        ) AS likes,
        CONVERT(ROUND(b.price - b.price *
          MAX(ap.discount_rate)
        ), SIGNED) AS discountedPrice,
        MAX(ap.discount_rate) AS discountRate
      FROM
        books AS b
      LEFT JOIN (
        SELECT
          DISTINCT p.id,
          p.discount_rate,
          pu.user_id,
          pc.category_id
        FROM
          promotions AS p
        LEFT JOIN
          promotion_users AS pu
          ON p.id = pu.promotion_id
        LEFT JOIN
          promotion_categories AS pc
          ON p.id = pc.promotion_id
        WHERE
          (pu.user_id = ? AND p.start_at IS NULL)
          OR NOW() BETWEEN p.start_at AND p.end_at
      ) AS ap
        ON b.category_id = ap.category_id      
      WHERE
        b.id = ?
      GROUP BY
        b.id;
    `;

    const values = [params.userID, params.bookID];
    const [result] = await pool.query(query, values);
    return result;
  }
};
