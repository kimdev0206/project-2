const database = require("../database");

module.exports = class OrdersRepository {
  database = database;

  async insertDelivery(conn, param) {
    const query = `
      INSERT INTO
        deliveries
      (
        id,
        address,
        receiver,
        contact
      )
      VALUES
        (?, ?, ?, ?);
    `;

    const values = [
      param.deliveryID,
      param.delivery.address,
      param.delivery.receiver,
      param.delivery.contact,
    ];
    const [result] = await conn.query(query, values);
    return result;
  }

  async insertOrder(conn, param) {
    const query = `
      INSERT INTO orders
        (
          user_id,
          delivery_id,
          books,
          main_book_title,
          total_count,
          total_price
        )
      VALUES
        (?, ?, ?, ?, ?, ?);
    `;

    const values = [
      param.userID,
      param.deliveryID,
      JSON.stringify(param.books),
      param.mainBookTitle,
      param.totalCount,
      param.totalPrice,
    ];

    await conn.query(query, values);
  }

  async selectOrders(param) {
    const pool = this.database.pool;
    const query = `
      SELECT
        ROW_NUMBER() OVER (ORDER BY d.id) AS seq,
        d.id AS deliveryID,
        d.address,
        d.receiver,
        d.contact,
        o.main_book_title AS mainBookTitle,
        o.total_price AS totalPrice,
        o.total_count AS totalCount,
        o.created_at AS createdAt
      FROM
        deliveries AS d
      JOIN
        orders AS o
        ON d.id = o.delivery_id
      WHERE
        o.user_id = ?;
    `;

    const values = [param.userID];
    const [result] = await pool.query(query, values);
    return result;
  }

  async selectOrdersDetail(param) {
    const pool = this.database.pool;
    const query = `
      SELECT
        books AS books
      FROM
        orders
      WHERE
        user_id = ?
        AND delivery_id = ?;
    `;

    const values = [param.userID, param.deliveryID];
    const [result] = await pool.query(query, values);
    return result;
  }

  async deleteOrder(param) {
    const pool = this.database.pool;
    const query = `
      DELETE
      FROM
        orders
      WHERE
        user_id = ?
        AND delivery_id = ?;
    `;

    const values = [param.userID, param.deliveryID];
    const [result] = await pool.query(query, values);
    return result;
  }
};
