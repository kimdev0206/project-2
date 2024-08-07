const { SelectBooksQueryBuilder } = require("../../src/query-builders");
const database = require("../../src/database");

module.exports = class SelectBooksSubQuery {
  static async run(params) {
    const builder = new SelectBooksQueryBuilder();
    const baseQuery = `
      SELECT
        b.id,
        b.title,
        b.id AS imgID,
        b.summary,
        b.author,
        b.price,
        (
          SELECT
            COUNT(*)
          FROM
            likes
          WHERE
            book_id = b.id
        ) AS likes,
        CONVERT(ROUND(b.price - b.price * (
          SELECT
            MAX(ap.discount_rate)
          FROM
            active_promotions AS ap
          WHERE
            ap.user_id = ?
            OR b.category_id = ap.category_id
        )), SIGNED) AS discountedPrice,
        (
          SELECT
            MAX(ap.discount_rate)
          FROM
            active_promotions AS ap
          WHERE
            ap.user_id = ?
            OR b.category_id = ap.category_id
        ) AS discountRate        
      FROM
        books AS b
    `;

    builder
      .setBaseQuery(baseQuery)([params.userID, params.userID])
      .setCategoryID(params.categoryID)
      .setIsNewPublished(params.isNew)
      .setKeyword(params)
      .setIsBest(params.isBest)
      .setPaging(params)
      .build();

    const { pool } = database;
    const [result] = await pool.query(builder.query, builder.values);
    return result;
  }
};
