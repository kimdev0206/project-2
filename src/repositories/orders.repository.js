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

  insertOrderedBook = async (conn, param) => {
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
};
