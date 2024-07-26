const {
  SelectBookCountQueryBuilder,
  SelectBooksQueryBuilder,
  SelectCartBooksBuilder,
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

  async insertLike(dao) {
    const { pool } = this.database;
    const query = `
      INSERT INTO 
        likes (
          user_id,
          book_id
        )
      VALUES
        (?, ?);
    `;

    const values = [dao.userID, dao.bookID];
    await pool.query(query, values);
  }

  async deleteLike(dao) {
    const { pool } = this.database;
    const query = `
      DELETE
      FROM
        likes
      WHERE
        user_id = ?
        AND book_id = ?;
    `;

    const values = [dao.userID, dao.bookID];
    const [result] = await pool.query(query, values);
    return result;
  }

  async insertCartBook(dao) {
    const { pool } = this.database;
    const query = `
      INSERT INTO
        cart_books (
          user_id,
          book_id,
          count
        )
      VALUES
        (?, ?, ?);
    `;

    const values = [dao.userID, dao.bookID, dao.count];
    await pool.query(query, values);
  }

  async deleteCartBook(dao) {
    const { pool } = this.database;
    const query = `
      DELETE
      FROM
        cart_books       
      WHERE
        user_id = ?
        AND book_id = ?;
    `;

    const values = [dao.userID, dao.bookID];
    const [result] = await pool.query(query, values);
    return result;
  }

  async selectCartBooks(dao) {
    const builder = new SelectCartBooksBuilder();
    const baseQuery = `
      SELECT
        cb.book_id AS bookID,
        b.title,
        b.summary,
        cb.count,
        b.price,
        b.author
      FROM
        books AS b
      LEFT JOIN
        cart_books AS cb
        ON b.id = cb.book_id
    `;

    builder
      .setBaseQuery(baseQuery)()
      .setUserID(dao.userID)
      .setBookIDs(dao.bookIDs)
      .build();

    const { pool } = this.database;
    const [result] = await pool.query(builder.query, builder.values);
    return result;
  }
};
