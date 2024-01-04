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
        ) AS likes,
        b.pub_date AS pubDate
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

    query += "LIMIT ? OFFSET ?";
    values.push(param.limit, param.offset);

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
        (
          SELECT
            COUNT(*)
          FROM
            likes
          WHERE
            liked_book_id = b.id
        ) AS likes,
        b.pub_date AS pubDate
      FROM
        categories AS c
      LEFT JOIN
        books AS b
        ON c.id = b.category_id
      WHERE
        b.id = ?;
    `;

    const values = [param.bookID];
    const [result] = await pool.query(query, values);
    return result;
  };
};
