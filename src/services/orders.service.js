const { StatusCodes } = require("http-status-codes");
const HttpError = require("../error/HttpError");
const BooksRepository = require("../repositories/books.repository");
const CartBooksRepository = require("../repositories/cart-books.repository");
const OrdersRepository = require("../repositories/orders.repository");
const database = require("../database");

module.exports = class OrdersService {
  repository = new OrdersRepository();
  database = database;

  postOrder = async (param) => {
    const booksRepository = new BooksRepository();
    const cartBooksRepository = new CartBooksRepository();

    const pool = this.database.pool;
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      try {
        await this.repository.insertDelivery(conn, param);
      } catch {
        const message = "이미 주문 처리되었습니다.";
        throw new HttpError(StatusCodes.CONFLICT, message);
      }

      const { affectedRows } = await booksRepository.updateCount(conn, param);

      if (!affectedRows) {
        const message = "남은 수량이 존재하지 않습니다.";
        throw new HttpError(StatusCodes.NOT_FOUND, message);
      }

      param.bookIDs = param.books.map((book) => book.bookID);
      await Promise.allSettled([
        this.repository.insertOrder(conn, param),
        cartBooksRepository.deleteCartBooks(conn, param),
      ]);

      await conn.commit();

      return StatusCodes.CREATED;
    } catch (error) {
      await conn.rollback();

      throw error;
    } finally {
      await conn.release();
    }
  };

  async getOrders(param) {
    const rows = await this.repository.selectOrders(param);

    if (!rows.length) {
      const message = "주문이 존재하지 않습니다.";
      throw new HttpError(StatusCodes.NOT_FOUND, message);
    }

    return rows;
  }

  async getOrdersDetail(param) {
    const [row] = await this.repository.selectOrdersDetail(param);

    if (!row) {
      const message = "요청하신 deliveryID 의 주문이 존재하지 않습니다.";
      throw new HttpError(StatusCodes.NOT_FOUND, message);
    }

    return row.books;
  }

  async deleteOrder(param) {
    const { affectedRows } = await this.repository.deleteOrder(param);

    if (!affectedRows) {
      const message = "이미 주문 취소 처리되었습니다.";
      throw new HttpError(StatusCodes.NOT_FOUND, message);
    }

    return StatusCodes.NO_CONTENT;
  }
};
