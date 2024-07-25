const BooksRepository = require("../repositories/books.repository");
const HttpError = require("../HttpError");
const { BookCategoryID } = require("../enums");

module.exports = class BooksService {
  repository = new BooksRepository();

  async getBooks(dto) {
    const offset = (dto.page - 1) * dto.limit;
    const dao = { ...dto, offset };

    if (!dto.userID) {
      var rows = await this.repository.selectBooks(dao);
    } else {
      var rows = await this.repository.selectAuthorizedBooks(dao);
    }

    if (!rows.length) {
      const message = "도서 목록이 존재하지 않습니다.";
      throw new HttpError(404, message);
    }

    const [row] = await this.repository.selectBookCount(dto);

    return {
      meta: { counted: row.counted },
      data: rows,
    };
  }

  async getBook(dto) {
    if (!dto.userID) {
      var [row] = await this.repository.selectBook(dto);
    } else {
      var [row] = await this.repository.selectAuthorizedBook(dto);
    }

    if (!row) {
      const message = `요청하신 bookID(${dto.bookID}) 의 도서가 존재하지 않습니다.`;
      throw new HttpError(404, message);
    }

    return {
      meta: { categoryID: BookCategoryID },
      data: row,
    };
  }
};
