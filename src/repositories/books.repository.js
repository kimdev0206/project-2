const {
  SelectBookCountQueryBuilder,
  SelectBooksQueryBuilder,
} = require("../query-builders");
const database = require("../database");

module.exports = class BooksRepository {
  database = database;

  async selectBooks(dao) {
    const builder = new SelectBooksQueryBuilder();
    const baseQuery = `
      SELECT
        b.id,
        b.title,
        b.id AS imgID,
        b.summary,
        b.author,
        b.price,
        CONVERT(ROUND(b.price - b.price * (
          SELECT
            MAX(ap.discount_rate)
          FROM
            active_promotions AS ap
          WHERE
            b.category_id = ap.category_id
        )), SIGNED) AS discountedPrice,
        (
          SELECT
            MAX(ap.discount_rate)
          FROM
            active_promotions AS ap
          WHERE
            b.category_id = ap.category_id
        ) AS discountRate,
        (
          SELECT
            COUNT(*)
          FROM
            likes
          WHERE
            book_id = b.id
        ) AS likes
      FROM
        books AS b
    `;

    builder
      .setBaseQuery(baseQuery)()
      .setCategoryID(dao.categoryID)
      .setIsNewPublished(dao.isNew)
      .setKeyword(dao)
      .setIsBest(dao.isBest)
      .setPaging(dao)
      .build();

    const { pool } = this.database;
    const [result] = await pool.query(builder.query, builder.values);
    return result;
  }

  async selectAuthorizedBooks(dao) {
    const builder = new SelectBooksQueryBuilder();
    const baseQuery = `
      SELECT
        b.id,
        b.title,
        b.id AS imgID,
        b.summary,
        b.author,
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
        (
          SELECT
            COUNT(*)
          FROM
            likes
          WHERE
            book_id = b.id
        ) AS likes
      FROM
        books AS b
    `;

    builder
      .setBaseQuery(baseQuery)([dao.userID, dao.userID])
      .setCategoryID(dao.categoryID)
      .setIsNewPublished(dao.isNew)
      .setKeyword(dao)
      .setIsBest(dao.isBest)
      .setPaging(dao)
      .build();

    const { pool } = this.database;
    const [result] = await pool.query(builder.query, builder.values);
    return result;
  }

  async selectBookCount(dao) {
    const builder = new SelectBookCountQueryBuilder();
    const baseQuery = `
      SELECT
        COUNT(*) AS counted
      FROM
        books AS b
    `;

    builder
      .setBaseQuery(baseQuery)()
      .setCategoryID(dao.categoryID)
      .setIsNewPublished(dao.isNew)
      .setKeyword(dao)
      .setIsBest(dao.isBest)
      .build();

    const { pool } = this.database;
    const [result] = await pool.query(builder.query, builder.values);
    return result;
  }

  async selectBook(dao) {
    const { pool } = this.database;
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
        CONVERT(ROUND(b.price - b.price *
          MAX(ap.discount_rate)
        ), SIGNED) AS discountedPrice,
        MAX(ap.discount_rate) AS discountRate,
        b.amount,
        (
          SELECT
            COUNT(*)
          FROM
            likes
          WHERE
            book_id = b.id
        ) AS likes,
        b.published_at AS publishedAt
      FROM
        books AS b
      LEFT JOIN
        active_promotions AS ap
        ON b.category_id = ap.category_id
      WHERE
        b.id = ?;
    `;

    const values = [dao.bookID];
    const [result] = await pool.query(query, values);
    return result;
  }

  async selectAuthorizedBook(dao) {
    const { pool } = this.database;
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
        CONVERT(ROUND(b.price - b.price *
          MAX(ap.discount_rate)
        ), SIGNED) AS discountedPrice,
        MAX(ap.discount_rate) AS discountRate,
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
      LEFT JOIN
        active_promotions AS ap
        ON (ap.user_id = ? OR b.category_id = ap.category_id)
      WHERE
        b.id = ?;
    `;

    const values = [dao.userID, dao.userID, dao.bookID];
    const [result] = await pool.query(query, values);
    return result;
  }
};
