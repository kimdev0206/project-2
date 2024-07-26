const database = require("../database");

module.exports = class OrdersRepository {
  database = database;

  async insertOrder(conn, dao) {
    const query = `
      INSERT INTO
        orders (
          order_id,
          user_id,
          delivery,
          books,
          main_book_title,
          total_count,
          total_price
        )
      VALUES
        (?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      dao.orderID,
      dao.userID,
      JSON.stringify(dao.delivery),
      JSON.stringify(dao.books),
      dao.mainBookTitle,
      dao.totalCount,
      dao.totalPrice,
    ];
    await conn.query(query, values);
  }

  async selectOrders(dao) {
    const { pool } = this.database;
    const query = `
      SELECT
        order_id AS orderID,
        delivery->>"$.address" AS address,
        delivery->>"$.receiver" AS receiver,
        delivery->>"$.contact" AS contact,
        main_book_title AS mainBookTitle,
        total_price AS totalPrice,
        total_count AS totalCount,
        created_at AS createdAt
      FROM
        orders
      WHERE
        user_id = ?;
    `;

    const values = [dao.userID];
    const [result] = await pool.query(query, values);
    return result;
  }

  async selectOrdersDetail(dao) {
    const { pool } = this.database;
    const query = `
      SELECT
        books AS books
      FROM
        orders
      WHERE
        order_id = ?
        AND user_id = ?;
    `;

    const values = [dao.orderID, dao.userID];
    const [result] = await pool.query(query, values);
    return result;
  }

  async updateBookAmount(conn, dao) {
    const query = `
      UPDATE
        books
      SET
        amount = amount - ?
      WHERE
        amount >= amount + ?
        AND id = ?;
    `;

    const values = [dao.count, dao.count, dao.bookID];
    const [result] = await conn.query(query, values);
    return result;
  }

  async deleteOrder(dao) {
    const { pool } = this.database;
    const query = `
      DELETE
      FROM
        orders
      WHERE
        order_id = ?
        AND user_id = ?;
    `;

    const values = [dao.orderID, dao.userID];
    const [result] = await pool.query(query, values);
    return result;
  }

  async deleteCartBooks(conn, dao) {
    const query = `
      DELETE
      FROM
        cart_books
      WHERE
        user_id = ?
        AND book_id IN ( ? );
    `;

    const values = [dao.userID, dao.bookIDs];
    await conn.query(query, values);
  }
};
