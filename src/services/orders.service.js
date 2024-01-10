module.exports = class OrdersService {
  constructor({ repositories, StatusCodes, database }) {
    this.repositories = repositories;
    this.StatusCodes = StatusCodes;
    this.database = database;
  }

  postOrder = async (param) => {
    const { cartBooksRepository, ordersRepository } = this.repositories;
    const pool = await this.database.pool;
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const { insertId: deliveryID } = await ordersRepository.insertDelivery(
        conn,
        param.delivery
      );

      param.deliveryID = deliveryID;
      const { insertId: orderID } = await ordersRepository.insertOrder(
        conn,
        param
      );

      param.orderID = orderID;
      param.bookIDs = param.books.map((book) => book.bookID);
      await Promise.allSettled([
        ordersRepository.insertOrderedBook(conn, param),
        cartBooksRepository.deleteCartBooks(conn, param),
      ]);

      await conn.commit();

      return Promise.resolve(this.StatusCodes.CREATED);
    } catch (err) {
      await conn.rollback();

      err.statusCode = this.StatusCodes.INTERNAL_SERVER_ERROR;
      return Promise.reject(err);
    } finally {
      conn.release();
    }
  };
};