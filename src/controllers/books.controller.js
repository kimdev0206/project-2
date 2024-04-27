const { Router } = require("express");
const {
  validateBooks,
  validateError,
  verifyAccessToken,
  validateBookID,
} = require("../middlewares");
const BooksService = require("../services/books.service");

class BooksController {
  path = "/books";
  router = Router();
  service = new BooksService();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get(this.path, validateBooks, validateError, this.getBooks);
    this.router.get(
      `${this.path}/:bookID`,
      verifyAccessToken,
      validateBookID,
      validateError,
      this.getBook
    );
  }

  getBooks = async (req, res, next) => {
    try {
      const {
        categoryID,
        isNew,
        isBest,
        isTitle,
        isSummary,
        isContents,
        isDetail,
        limit,
        page,
        keyword,
      } = req.query;

      const param = {
        categoryID,
        isNew,
        isBest,
        isTitle,
        isSummary,
        isContents,
        isDetail,
        limit,
        page,
        keyword,
      };
      const { meta, data } = await this.service.getBooks(param);

      res.json({
        meta,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getBook = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;
      const { bookID } = req.params;

      const param = { userID, bookID };
      const data = await this.service.getBook(param);

      res.json({
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new BooksController();
