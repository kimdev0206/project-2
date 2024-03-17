module.exports = class BooksRepository {
  constructor(database) {
    this.database = database;
  }

  selectBooks = async (param) => {
    const pool = await this.database.pool;
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
  };

  selectBooksCount = async (param) => {
    const pool = await this.database.pool;
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

    if (conditions.length) {
      query += `
        WHERE
          ${conditions.join(" AND ")}
      `;
    }

    query += ";";

    const [result] = await pool.query(query, values);
    return result;
  };

  selectBook = async (param) => {
    const pool = await this.database.pool;
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

    const values = [param.userID, param.bookID];
    const [result] = await pool.query(query, values);
    return result;
  };

  selectCategories = async () => {
    const pool = await this.database.pool;
    const query = `
      SELECT
        id,
        category
      FROM
        categories;
    `;

    const [result] = await pool.query(query);
    return result;
  };
};
