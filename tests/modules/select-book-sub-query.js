const database = require("../../src/database");

module.exports = class SelectBookSubQuery {
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
        CONVERT(ROUND(b.price - b.price * (
          SELECT
            MAX(ap.discount_rate)
          FROM
            active_promotions AS ap
          WHERE
            (
              ap.user_id = ?
              OR b.category_id = ap.category_id
            )
        )), SIGNED) AS discountedPrice,
        (
          SELECT
            MAX(ap.discount_rate)
          FROM
            active_promotions AS ap
          WHERE
            (
              ap.user_id = ?
              OR b.category_id = ap.category_id
            )
        ) AS discountRate,
        b.amount,
        (
          SELECT
            COUNT(*)
          FROM
            likes
          WHERE
            book_id = b.id
        ) AS likes,
        (
          SELECT EXISTS (
            SELECT
              *
            FROM
              likes
            WHERE
              user_id = ?
              AND book_id = b.id
          )
        ) AS liked,
        b.published_at AS publishedAt
      FROM
        books AS b        
      WHERE
        b.id = ?;
    `;

    const values = [params.userID, params.userID, params.userID, params.bookID];
    const [result] = await pool.query(query, values);
    return result;
  }
};
