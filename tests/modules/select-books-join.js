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

    builder
      .setBaseQuery(baseQuery)()
      .setCategoryID(params.categoryID)
      .setIsNew(params.isNew)
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
