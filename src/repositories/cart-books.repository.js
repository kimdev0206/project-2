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
};
