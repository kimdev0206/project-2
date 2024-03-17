module.exports = class BooksController {
  constructor({ service, logger }) {
    this.service = service;
    this.logger = logger;
  }

  getBooks = async (req, res) => {
    try {
      const { categoryID, isNew, isBest, limit, page } = req.query;

      const param = {
        categoryID,
        isNew: JSON.parse(isNew),
        isBest: JSON.parse(isBest),
        limit: +limit,
        page: +page,
      };
      const { meta, data } = await this.service.getBooks(param);

      res.json({
        meta,
        data,
      });
    } catch (err) {
      this.logger.err(err.message);

      res.status(err.statusCode).json({
        message: err.message,
      });
    }
  };

  getBook = async (req, res) => {
    try {
      const { userID } = req.decodedToken;
      const { bookID } = req.params;

      const param = { userID, bookID };
      const data = await this.service.getBook(param);

      res.json({
        data,
      });
    } catch (err) {
      this.logger.err(err.message);

      res.status(err.statusCode).json({
        message: err.message,
      });
    }
  };

  getCategories = async (_, res) => {
    try {
      const data = await this.service.getCategories();

      res.json({
        data,
      });
    } catch (err) {
      this.logger.err(err.message);

      res.status(err.statusCode).json({
        message: err.message,
      });
    }
  };
};
