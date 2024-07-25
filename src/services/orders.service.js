const OrdersRepository = require("../repositories/orders.repository");
const database = require("../database");
const HttpError = require("../HttpError");

module.exports = class OrdersService {
  repository = new OrdersRepository();
  database = database;

  postOrder = async (dto) => {
    const { pool } = this.database;
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const bookIDs = dto.books.map((book) => book.bookID);
      const dao = { ...dto, bookIDs };
      await this.repository.insertOrder(conn, dao);
      await this.repository.deleteCartBooks(conn, dao);

      const counts = dto.books.map((book) => book.count);
      const promises = bookIDs.map((bookID, index) => {
        const dao = { bookID, count: counts[index] };
        return this.repository.updateBookAmount(conn, dao);
      });
      await Promise.all(promises);

      await conn.commit();

      return 201;
    } catch (error) {
      await conn.rollback();

      if (error.code === "ER_DUP_ENTRY") {
        const message = `요청하신 orderID(${dto.orderID}) 의 주문이 존재합니다.`;
        throw new HttpError(409, message);
      }

      throw error;
    } finally {
      conn.release();
    }
  };

  async getOrders(dto) {
    const rows = await this.repository.selectOrders(dto);

    if (!rows.length) {
      const message = "주문 목록이 존재하지 않습니다.";
      throw new HttpError(404, message);
    }

    return rows;
  }

  async getOrder(dto) {
    const [row] = await this.repository.selectOrdersDetail(dto);

    if (!row) {
      const message = `요청하신 orderID(${dto.orderID}) 의 주문이 존재하지 않습니다.`;
      throw new HttpError(404, message);
    }

    return row.books;
  }

  async deleteOrder(dto) {
    const { affectedRows } = await this.repository.deleteOrder(dto);

    if (!affectedRows) {
      const message = `요청하신 orderID(${dto.orderID}) 는 이미 주문 취소 처리되었습니다.`;
      throw new HttpError(404, message);
    }

    return 204;
  }
};
