module.exports = class BooksController {
  constructor({ service, logger }) {
    this.service = service;
    this.logger = logger;
  }

  getBooks = async (req, res) => {
    try {
      const { categoryID, isNew } = req.query;

      const param = { categoryID, isNew: JSON.parse(isNew) };
      const data = await this.service.getBooks(param);

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

  getBook = async (req, res) => {
    try {
      const { bookID } = req.params;

      const param = { bookID };
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
};
