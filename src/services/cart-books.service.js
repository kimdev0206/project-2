const HttpError = require("../HttpError");
const CartBooksRepository = require("../repositories/cart-books.repository");

module.exports = class CartBooksService {
  repository = new CartBooksRepository();

  async postCartBook(dto) {
    try {
      await this.repository.insertCartBook(dto);
    } catch (error) {
      const message = "이미 장바구니 담기 처리되었습니다.";
      throw new HttpError(409, message);
    }

    return 201;
  }

  async deleteCartBook(dto) {
    const { affectedRows } = await this.repository.deleteCartBook(dto);

    if (!affectedRows) {
      const message = "이미 장바구니 담기 취소 처리되었습니다.";
      throw new HttpError(404, message);
    }

    return 204;
  }

  async getCartBooks(dto) {
    const rows = await this.repository.selectCartBooks(dto);

    if (!rows.length) {
      const message = dto?.bookIDs.length
        ? "요청하신 bookIDs 의 도서가 장바구니에 담겨 있지 않습니다."
        : "장바구니에 도서가 존재하지 않습니다.";
      throw new HttpError(404, message);
    }

    return rows;
  }
};
