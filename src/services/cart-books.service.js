const { StatusCodes } = require("http-status-codes");
const HttpError = require("../error/HttpError");
const CartBooksRepository = require("../repositories/cart-books.repository");

module.exports = class CartBooksService {
  repository = new CartBooksRepository();

  async postCartBook(param) {
    try {
      await this.repository.insertCartBook(param);
    } catch (error) {
      const message = "이미 장바구니 담기 처리되었습니다.";
      throw new HttpError(StatusCodes.CONFLICT, message);
    }

    return StatusCodes.CREATED;
  }

  async deleteCartBook(param) {
    const { affectedRows } = await this.repository.deleteCartBook(param);

    if (!affectedRows) {
      const message = "이미 장바구니 담기 취소 처리되었습니다.";
      throw new HttpError(StatusCodes.NOT_FOUND, message);
    }

    return Promise.resolve(StatusCodes.NO_CONTENT);
  }

  async getCartBooks(param) {
    const rows = await this.repository.selectCartBooks(param);

    if (!rows.length) {
      const message = param?.bookIDs?.length
        ? "요청하신 모든 bookIDs 의 도서가 장바구니에 담겨 있지 않습니다."
        : "장바구니에 도서가 담겨 있지 않습니다.";
      throw new HttpError(StatusCodes.NOT_FOUND, message);
    }

    return rows;
  }
};
