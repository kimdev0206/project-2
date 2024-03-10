module.exports = class OrdersRepository {
  constructor(database) {
    this.database = database;
  }

  insertDelivery = async (conn, param) => {
    const query = `
      INSERT INTO deliveries
        (address, receiver, contact)
      VALUES
        (?, ?, ?);
    `;

    const values = [param.address, param.receiver, param.contact];
    const [result] = await conn.query(query, values);
    return result;
  };

  insertOrder = async (conn, param) => {
    const query = `
      INSERT INTO orders
        (
          user_id,
          delivery_id,
          main_book_title,
          total_count,
          total_price
        )
      VALUES
        (?, ?, ?, ?, ?);
    `;

    const values = [
      param.userID,
      param.deliveryID,
      param.mainBookTitle,
      param.totalCount,
      param.totalPrice,
    ];
    const [result] = await conn.query(query, values);
    return result;
  };

  insertOrderedBooks = async (conn, param) => {
    const query = `
      INSERT INTO ordered_books
        (order_id, book_id, count)
      VALUES
        ?;
    `;

    const values = [
      param.books.map((book) => [param.orderID, book.bookID, book.count]),
    ];
    await conn.query(query, values);
  };

  selectOrders = async (param) => {
    const pool = await this.database.pool;
    const query = `
      SELECT
        o.id AS orderID,
        d.address,
        d.receiver,
        d.contact,
        o.main_book_title AS mainBookTitle,
        o.total_price AS totalPrice,
        o.total_count AS totalCount,
        o.created_at AS createdAt
      FROM
        deliveries AS d
      LEFT JOIN
        orders AS o
        ON d.id = o.delivery_id
      WHERE
        o.user_id = ?;
    `;

    const values = [param.userID];
    const [result] = await pool.query(query, values);
    return result;
  };

  selectOrdersDetail = async (param) => {
    const pool = await this.database.pool;
    const query = `
      SELECT
        b.id AS bookID,
        b.title,
        b.author,
        b.price,
        ob.count
      FROM
        books AS b
      LEFT JOIN
        ordered_books AS ob
        ON b.id = ob.book_id
      WHERE
        ob.order_id = ?;
    `;

    const values = [param.orderID];
    const [result] = await pool.query(query, values);
    return result;
  };

  deleteOrder = async (param) => {
    const pool = await this.database.pool;
    const query = `
      DELETE
      FROM
        orders
      WHERE
        id = ?;
    `;

    const values = [param.orderID];
    const [result] = await pool.query(query, values);
    return result;
  };
};
