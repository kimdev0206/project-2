module.exports = class CartBooksController {
  constructor({ service, logger }) {
    this.service = service;
    this.logger = logger;
  }

  postCartBook = async (req, res) => {
    try {
      const { userID } = req.decodedToken;
      const { bookID } = req.params;
      const { count } = req.body;

      const param = { userID, bookID, count };
      const statusCode = await this.service.postCartBook(param);

      res.status(statusCode).json({
        message: "장바구니 담기 처리되었습니다",
      });
    } catch (err) {
      this.logger.err(err.message);

      res.status(err.statusCode).json({
        message: err.message,
      });
    }
  };

  deleteCartBook = async (req, res) => {
    try {
      const { userID } = req.decodedToken;
      const { bookID } = req.params;

      const param = { userID, bookID };
      const statusCode = await this.service.deleteCartBook(param);

      res.status(statusCode).end();
    } catch (err) {
      this.logger.err(err.message);

      res.status(err.statusCode).json({
        message: err.message,
      });
    }
  };
};
