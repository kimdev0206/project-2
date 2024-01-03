module.exports = class BooksService {
  constructor({ repository, StatusCodes }) {
    this.repository = repository;
    this.StatusCodes = StatusCodes;
  }

  getBooks = async (param) => {
    param.offset = (param.page - 1) * param.limit;
    const rows = await this.repository.selectBooks(param);

    if (!rows.length) {
      const err = new Error("도서가 존재하지 않습니다.");
      err.statusCode = this.StatusCodes.NOT_FOUND;
      return Promise.reject(err);
    }

    return Promise.resolve(rows);
  };

  getBook = async (param) => {
    const [row] = await this.repository.selectBook(param);

    if (!row) {
      const err = new Error("요청하신 bookID 의 도서가 존재하지 않습니다.");
      err.statusCode = this.StatusCodes.NOT_FOUND;
      return Promise.reject(err);
    }

    return Promise.resolve(row);
  };
};
