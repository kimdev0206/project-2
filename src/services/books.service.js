const { StatusCodes } = require("http-status-codes");
const HttpError = require("../error/HttpError");
const BooksRepository = require("../repositories/books.repository");

module.exports = class BooksService {
  repository = new BooksRepository();

  async getBooks(param) {
    param.offset = (param.page - 1) * param.limit;
    const rows = await this.repository.selectBooks(param);

    if (!rows.length) {
      const message = "도서가 존재하지 않습니다.";
      throw new HttpError(StatusCodes.NOT_FOUND, message);
    }

    const [{ count }] = await this.repository.selectBooksCount(param);

    return {
      meta: { page: param.page, count },
      data: rows,
    };
  }

  async getBook(param) {
    const [row] = await this.repository.selectBook(param);

    if (!row) {
      const message = "요청하신 bookID 의 도서가 존재하지 않습니다.";
      throw new HttpError(StatusCodes.NOT_FOUND, message);
    }

    return row;
  }
};
