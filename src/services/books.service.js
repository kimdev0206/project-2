const { BookCategoryID } = require("../enums");
const BooksRepository = require("../repositories/books.repository");
const database = require("../database");
const HttpError = require("../HttpError");

module.exports = class BooksService {
  repository = new BooksRepository();
  database = database;

  async getBooks(dto) {
    const offset = (dto.page - 1) * dto.limit;
    const dao = { ...dto, offset };

    const isJoin = dto.categoryID || dto.isNew || dto.keyword || dto.isBest;
    const [row] = await this.repository.selectBookCount(dto);

    if (dto.userID) {
      if (isJoin) {
        var rows = await this.repository.selectAuthorizedBooksJoin(dao);
      } else if (row.counted === dto.limit) {
        var rows = await this.repository.selectAuthorizedBooksJoin(dao);
      } else {
        var rows = await this.repository.selectAuthorizedBooksSubQuery(dao);
      }
    } else {
      if (isJoin) {
        var rows = await this.repository.selectBooksJoin(dao);
      } else if (row.counted === dto.limit) {
        var rows = await this.repository.selectAuthorizedBooksJoin(dao);
      } else {
        var rows = await this.repository.selectBooksSubQuery(dao);
      }
    }

    if (!rows.length) {
      const message = "도서 목록이 존재하지 않습니다.";
      throw new HttpError(404, message);
    }

    return {
      meta: { page: dto.page, counted: row.counted },
      data: rows,
    };
  }

  async getBook(dto) {
    if (dto.userID) {
      var [row] = await this.repository.selectAuthorizedBook(dto);
    } else {
      var [row] = await this.repository.selectBook(dto);
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

  postLike = async (dto) => {
    const { pool } = this.database;
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      await this.repository.insertLike(conn, dto);
      await this.repository.increaseLikes(conn, dto);

      await conn.commit();

      return 201;
    } catch (error) {
      await conn.rollback();

      if (error.code === "ER_DUP_ENTRY") {
        const message = "이미 좋아요 처리되었습니다.";
        throw new HttpError(409, message);
      }

      throw error;
    } finally {
      conn.release();
    }
  };

  deleteLike = async (dto) => {
    const { pool } = this.database;
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const { affectedRows } = await this.repository.deleteLike(conn, dto);

      if (!affectedRows) {
        const message = "이미 좋아요 취소 처리되었습니다.";
        throw new HttpError(404, message);
      }

      await this.repository.decreaseLikes(conn, dto);

      await conn.commit();

      return 204;
    } catch (error) {
      await conn.rollback();

      throw error;
    } finally {
      conn.release();
    }
  };

  postCartBook = async (dto) => {
    try {
      await this.repository.insertCartBook(dto);
    } catch (error) {
      const message = "이미 장바구니 담기 처리되었습니다.";
      throw new HttpError(409, message);
    }

    return 201;
  };

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
};
