const { Router } = require("express");
const {
  validateBookID,
  validateBookIDs,
  validateCartBook,
  validateError,
  verifyAccessToken,
} = require("../middlewares");
const CartBooksService = require("../services/cart-books.service");

class CartBooksController {
  path = "/cart-books";
  router = Router();
  service = new CartBooksService();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(
      `${this.path}/:bookID`,
      verifyAccessToken,
      validateCartBook,
      validateError,
      this.postCartBook
    );
    this.router.delete(
      `${this.path}/:bookID`,
      verifyAccessToken,
      validateBookID,
      validateError,
      this.deleteCartBook
    );
    this.router.get(this.path, verifyAccessToken, this.getCartBooks);
    this.router.get(
      `${this.path}/selected`,
      verifyAccessToken,
      validateBookIDs,
      validateError,
      this.getCartBooks
    );
  }

  postCartBook = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;
      const { bookID } = req.params;
      const { count } = req.body;

      const param = { userID, bookID, count };
      const status = await this.service.postCartBook(param);

      res.status(status).json({
        message: "장바구니 담기 처리되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCartBook = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;
      const { bookID } = req.params;

      const param = { userID, bookID };
      const status = await this.service.deleteCartBook(param);

      res.status(status).end();
    } catch (error) {
      next(error);
    }
  };

  getCartBooks = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;
      const { bookIDs } = req.body;

      const param = { userID, bookIDs };
      const data = await this.service.getCartBooks(param);

      res.json({
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new CartBooksController();
