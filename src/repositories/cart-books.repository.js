module.exports = class CartBooksRepository {
  constructor(database) {
    this.database = database;
  }

  insertCartBook = async (param) => {
    const pool = await this.database.pool;
    const query = `
      INSERT INTO cart_books
        (book_id, user_id, count)
      VALUES
        (?, ?, ?);
    `;

    const values = [param.bookID, param.userID, param.count];
    await pool.query(query, values);
  };

  deleteCartBook = async (param) => {
    const pool = await this.database.pool;
    const query = `
      DELETE
      FROM
        cart_books       
      WHERE
        user_id = ?
        AND book_id = ?;
    `;

    const values = [param.userID, param.bookID];
    const [result] = await pool.query(query, values);
    return result;
  };

  deleteCartBooks = async (conn, param) => {
    let query = `
      DELETE
      FROM
        cart_books
      WHERE
        user_id = ?
        AND book_id IN ( ? );
    `;

    const values = [param.userID, param.bookIDs];
    await conn.query(query, values);
  };

  selectCartBooks = async (param) => {
    const pool = await this.database.pool;
    let query = `
      SELECT
        cb.book_id AS bookID,
        b.title,
        b.summary,
        cb.count,
        b.price
      FROM
        books AS b
      LEFT JOIN
        cart_books AS cb
        ON b.id = cb.book_id
    `;

    let conditions = [];
    let values = [];

    if (param.userID) {
      conditions.push("cb.user_id = ?");
      values.push(param.userID);
    }

    if (param.bookIDs) {
      conditions.push("cb.book_id IN ( ? )");
      values.push(param.bookIDs);
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
};
