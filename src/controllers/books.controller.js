const { Router } = require("express");
const {
  validateBookID,
  validateBooks,
  validateCartBook,
  validateError,
  verifyAccessToken,
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
    this.router.post(
      this.path + "/:bookID/cart",
      verifyAccessToken,
      validateCartBook,
      validateError,
      this.postCartBook
    );
    this.router.delete(
      this.path + "/:bookID/cart",
      verifyAccessToken,
      validateBookID,
      validateError,
      this.deleteCartBook
    );
    this.router.get(this.path + "/carts", verifyAccessToken, this.getCartBooks);

    this.router.get(
      this.path + "/authorized",
      verifyAccessToken,
      validateBooks,
      validateError,
      this.getAuthorizedBooks
    );
    this.router.get(this.path, validateBooks, validateError, this.getBooks);

    this.router.get(
      this.path + "/:bookID/authorized",
      verifyAccessToken,
      validateBookID,
      validateError,
      this.getAuthorizedBook
    );
    this.router.get(
      this.path + "/:bookID",
      validateBookID,
      validateError,
      this.getBook
    );

    this.router.post(
      this.path + "/:bookID/like",
      verifyAccessToken,
      validateBookID,
      validateError,
      this.postLike
    );
    this.router.delete(
      this.path + "/:bookID/like",
      verifyAccessToken,
      validateBookID,
      validateError,
      this.deleteLike
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

      const dto = {
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
      const { meta, data } = await this.service.getBooks(dto);

      res.json({
        meta,
        data,
      });
    } catch (error) {
      res.locals.name = this.getBooks.name;
      next(error);
    }
  };

  getAuthorizedBooks = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;
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

      const dto = {
        userID,
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
      const { meta, data } = await this.service.getBooks(dto);

      res.json({
        meta,
        data,
      });
    } catch (error) {
      res.locals.name = this.getAuthorizedBooks.name;
      next(error);
    }
  };

  getBook = async (req, res, next) => {
    try {
      const { bookID } = req.params;

      const dto = { bookID };
      const { meta, data } = await this.service.getBook(dto);

      res.json({
        meta,
        data,
      });
    } catch (error) {
      res.locals.name = this.getBook.name;
      next(error);
    }
  };

  getAuthorizedBook = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;
      const { bookID } = req.params;

      const dto = { userID, bookID };
      const { meta, data } = await this.service.getBook(dto);

      res.json({
        meta,
        data,
      });
    } catch (error) {
      res.locals.name = this.getAuthorizedBook.name;
      next(error);
    }
  };

  postLike = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;
      const { bookID } = req.params;

      const dto = { userID, bookID };
      const status = await this.service.postLike(dto);

      res.status(status).json({
        message: "좋아요 처리되었습니다.",
      });
    } catch (error) {
      res.locals.name = this.postLike.name;
      next(error);
    }
  };

  deleteLike = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;
      const { bookID } = req.params;

      const dto = { userID, bookID };
      const status = await this.service.deleteLike(dto);

      res.status(status).end();
    } catch (error) {
      res.locals.name = this.deleteLike.name;
      next(error);
    }
  };

  postCartBook = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;
      const { bookID } = req.params;
      const { count } = req.body;

      const dto = { userID, bookID, count };
      const status = await this.service.postCartBook(dto);

      res.status(status).json({
        message: "장바구니 담기 처리되었습니다.",
      });
    } catch (error) {
      res.locals.name = this.postCartBook.name;
      next(error);
    }
  };

  deleteCartBook = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;
      const { bookID } = req.params;

      const dto = { userID, bookID };
      const status = await this.service.deleteCartBook(dto);

      res.status(status).end();
    } catch (error) {
      res.locals.name = this.deleteCartBook.name;
      next(error);
    }
  };

  getCartBooks = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;
      const { bookIDs } = req.body;

      const dto = { userID, bookIDs };
      const data = await this.service.getCartBooks(dto);

      res.json({
        data,
      });
    } catch (error) {
      res.locals.name = this.getCartBooks.name;
      next(error);
    }
  };
}

module.exports = new BooksController();
