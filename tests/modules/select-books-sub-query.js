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
        likes,
        (
          SELECT 
            CONVERT(ROUND(b.price - b.price * sub.discountRate), SIGNED)
          FROM
            (
              SELECT 
                MAX(p.discount_rate) AS discountRate
              FROM 
                promotions AS p
              LEFT JOIN 
                promotion_users AS pu 
                ON p.id = pu.promotion_id 
                AND pu.user_id = ?
              LEFT JOIN 
                promotion_categories AS pc 
                ON p.id = pc.promotion_id                
              WHERE 
                (b.category_id = pc.category_id OR pu.user_id = ?)
                AND (p.start_at IS NULL OR NOW() BETWEEN p.start_at AND p.end_at)
            ) AS sub
        ) AS discountedPrice,  
        (
          SELECT 
            sub.discountRate
          FROM 
            (
              SELECT 
                MAX(p.discount_rate) AS discountRate
              FROM 
                promotions AS p
              LEFT JOIN 
                promotion_users AS pu 
                ON p.id = pu.promotion_id 
                AND pu.user_id = ?
              LEFT JOIN 
                promotion_categories AS pc 
                ON p.id = pc.promotion_id                
              WHERE
                (b.category_id = pc.category_id OR pu.user_id = ?)
                AND (p.start_at IS NULL OR NOW() BETWEEN p.start_at AND p.end_at)
            ) AS sub
        )AS discountRate
      FROM
        books AS b
    `;

    builder
      .setBaseQuery(baseQuery)([
        params.userID,
        params.userID,
        params.userID,
        params.userID,
      ])
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
