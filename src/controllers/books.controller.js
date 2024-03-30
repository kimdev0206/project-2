module.exports = class BooksController {
  constructor({ service, logger }) {
    this.service = service;
    this.logger = logger;
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
        isNew: JSON.parse(isNew),
        isBest: JSON.parse(isBest),
        isTitle: isTitle && JSON.parse(isTitle),
        isSummary: isSummary && JSON.parse(isSummary),
        isContents: isContents && JSON.parse(isContents),
        isDetail: isDetail && JSON.parse(isDetail),
        limit: +limit,
        page: +page,
        keyword,
      };
      const { meta, data } = await this.service.getBooks(param);

      res.json({
        meta,
        data,
      });
    } catch (err) {
      next(err);
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
    } catch (err) {
      next(err);
    }
  };

  getCategories = async (_, res, next) => {
    try {
      const data = await this.service.getCategories();

      res.json({
        data,
      });
    } catch (err) {
      next(err);
    }
  };
};
