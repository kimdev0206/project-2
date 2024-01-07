module.exports = class CartBooksService {
  constructor({ repository, StatusCodes }) {
    this.repository = repository;
    this.StatusCodes = StatusCodes;
  }

  postCartBook = async (param) => {
    try {
      await this.repository.insertCartBook(param);
    } catch (err) {
      if (err.code !== "ER_DUP_ENTRY") {
        err.statusCode = this.StatusCodes.INTERNAL_SERVER_ERROR;
        return Promise.reject(err);
      }

      err = new Error("이미 장바구니 담기 처리되었습니다.");
      err.statusCode = this.StatusCodes.CONFLICT;
      return Promise.reject(err);
    }

    return Promise.resolve(this.StatusCodes.CREATED);
  };

  deleteCartBook = async (param) => {
    const { affectedRows } = await this.repository.deleteCartBook(param);

    if (!affectedRows) {
      const err = new Error("이미 장바구니 담기 취소 처리되었습니다.");
      err.statusCode = this.StatusCodes.NOT_FOUND;
      return Promise.reject(err);
    }

    return Promise.resolve(this.StatusCodes.NO_CONTENT);
  };

  getCartBooks = async (param) => {
    const rows = await this.repository.selectCartBooks(param);

    if (!rows.length) {
      const err = new Error(
        param?.bookIDs?.length
          ? "요청하신 모든 bookIDs 의 도서가 장바구니에 담겨 있지 않습니다."
          : "장바구니에 도서가 담겨 있지 않습니다."
      );
      err.statusCode = this.StatusCodes.NOT_FOUND;
      return Promise.reject(err);
    }

    return Promise.resolve(rows);
  };
};
