const { SelectBooksQueryBuilder } = require("../../src/query-builders");
const database = require("../../src/database");

module.exports = class SelectBooksJoin {
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
    `;

    builder
      .setBaseQuery(baseQuery)([params.userID])
      .setCategoryID(params.categoryID)
      .setIsNewPublished(params.isNew)
      .setKeyword(params)
      .setGrouping()
      .setIsBest(params.isBest)
      .setPaging(params)
      .build();

    const { pool } = database;
    const [result] = await pool.query(builder.query, builder.values);
    return result;
  }
};
