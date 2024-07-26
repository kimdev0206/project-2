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
<<<<<<< Updated upstream
=======

  postLike = async (dto) => {
    try {
      await this.repository.insertLike(dto);
    } catch (error) {
      const message = "이미 좋아요 처리되었습니다.";
      throw new HttpError(409, message);
    }

    return 201;
  };

  async deleteLike(dto) {
    const { affectedRows } = await this.repository.deleteLike(dto);

    if (!affectedRows) {
      const message = "이미 좋아요 취소 처리되었습니다.";
      throw new HttpError(404, message);
    }

    return 204;
  }

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
      const message = dto.bookIDs?.length
        ? "요청하신 bookIDs 의 도서가 장바구니에 담겨 있지 않습니다."
        : "장바구니에 도서가 존재하지 않습니다.";
      throw new HttpError(404, message);
    }

    return rows;
  }
>>>>>>> Stashed changes
};
