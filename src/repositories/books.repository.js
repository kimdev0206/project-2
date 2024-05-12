const database = require("../database");

module.exports = class BooksRepository {
  database = database;

  async selectBooks(param) {
    const pool = this.database.pool;
    let query = `
      SELECT
        b.id,
        b.title,
        b.img_id AS imgID,
        b.summary,
        b.author,
        b.price,
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
    `;

    let conditions = [];
    let values = [];

    if (param.categoryID) {
      conditions.push("b.category_id = ?");
      values.push(param.categoryID);
    }

    if (param.isNew) {
      conditions.push(
        "b.pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()"
      );
    }

    if (param.keyword) {
      let condition = [];

      if (param.isTitle) {
        condition.push("b.title LIKE ?");
        values.push(`%${param.keyword}%`);
      }

      if (param.isSummary) {
        condition.push("b.summary LIKE ?");
        values.push(`%${param.keyword}%`);
      }

      if (param.isContents) {
        condition.push("b.contents LIKE ?");
        values.push(`%${param.keyword}%`);
      }

      if (param.isDetail) {
        condition.push("b.detail LIKE ?");
        values.push(`%${param.keyword}%`);
      }

      condition.length && conditions.push(condition.join(" OR "));
    }

    if (conditions.length) {
      query += `
      WHERE
      ${conditions.join(" AND ")}
      `;
    }

    if (param.isBest) {
      query += `
        ORDER BY
          likes DESC,
          b.pub_date DESC
      `;
    }

    query += "LIMIT ? OFFSET ?";
    values.push(param.limit, param.offset);

    query += ";";

    const [result] = await pool.query(query, values);
    return result;
  }

  async selectBooksCount(param) {
    const pool = this.database.pool;
    let query = `
      SELECT
        COUNT(*) AS count
      FROM
        books AS b
    `;

    let conditions = [];
    let values = [];

    if (param.categoryID) {
      conditions.push("b.category_id = ?");
      values.push(param.categoryID);
    }

    if (param.isNew) {
      conditions.push(
        "b.pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()"
      );
    }

    if (param.keyword) {
      let condition = [];

      if (param.isTitle) {
        condition.push("b.title LIKE ?");
        values.push(`%${param.keyword}%`);
      }

      if (param.isSummary) {
        condition.push("b.summary LIKE ?");
        values.push(`%${param.keyword}%`);
      }

      if (param.isContents) {
        condition.push("b.contents LIKE ?");
        values.push(`%${param.keyword}%`);
      }

      if (param.isDetail) {
        condition.push("b.detail LIKE ?");
        values.push(`%${param.keyword}%`);
      }

      condition.length && conditions.push(condition.join(" OR "));
    }

    if (conditions.length) {
      query += `
        WHERE
          ${conditions.join(" AND ")}
      `;
    }

    query += ";";

    const [result] = await pool.query(query, values);
    return result;
  }

  async selectBook(param) {
    const pool = this.database.pool;
    const query = `
      SELECT
        b.id,
        b.title,
        c.id AS categoryID,
        c.category,
        b.img_id AS imgID,
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
            MAX(p.discount_rate) AS discountRate
          FROM
            promotions AS p
          JOIN
            applied_promotions AS ap
            ON p.id = ap.promotion_id
          WHERE
            (
              p.start_at IS NULL
              OR 
              NOW() BETWEEN p.start_at AND p.end_at
            )
            AND user_id = ?
            AND book_id = ?
        )), SIGNED) AS discountedPrice,
        b.count,
        (
          SELECT
            COUNT(*)
          FROM
            likes
          WHERE
            liked_book_id = b.id
        ) AS likes,
        (
          SELECT EXISTS (
            SELECT
              *
            FROM
              likes
            WHERE
              user_id = ?
              AND liked_book_id = b.id
          )
        ) AS liked,
        b.pub_date AS pubDate
      FROM
        categories AS c
      JOIN
        books AS b
        ON c.id = b.category_id
      WHERE
        b.id = ?;
    `;

    const values = [param.userID, param.bookID, param.userID, param.bookID];
    const [result] = await pool.query(query, values);
    return result;
  }

  async updateCount(conn, param) {
    const query = `
      UPDATE
        books
      SET
        count = count - 1
      WHERE
        count > 0
        AND id IN ( ? );
    `;

    const values = [param.books.map((book) => book.bookID)];
    const [result] = await conn.query(query, values);
    return result;
  }
};
