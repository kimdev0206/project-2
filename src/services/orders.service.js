module.exports = class OrdersService {
  constructor({ repository, StatusCodes, database }) {
    this.repository = repository;
    this.StatusCodes = StatusCodes;
    this.database = database;
  }

  postOrder = async (param) => {
    const pool = await this.database.pool;
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const { insertId: deliveryID } = await this.repository.insertDelivery(
        conn,
        param.delivery
      );

      param.deliveryID = deliveryID;
      const { insertId: orderID } = await this.repository.insertOrder(
        conn,
        param
      );

      param.orderID = orderID;
      await this.repository.insertOrderedBook(conn, param);

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
