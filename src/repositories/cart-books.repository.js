const { SelectCartBooksBuilder } = require("../query-builders");
const database = require("../database");

module.exports = class CartBooksRepository {
  database = database;

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
