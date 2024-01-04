module.exports = class LikesController {
  constructor({ service, logger }) {
    this.service = service;
    this.logger = logger;
  }

  postLike = async (req, res) => {
    try {
      const { userID } = req.decodedToken;
      const { bookID } = req.params;

      const param = { userID, bookID };
      const statusCode = await this.service.postLike(param);

      res.status(statusCode).json({
        message: "좋아요 처리되었습니다",
      });
    } catch (err) {
      this.logger.err(err.message);

      res.status(err.statusCode).json({
        message: err.message,
      });
    }
  };

  deleteLike = async (req, res) => {
    try {
      const { userID } = req.decodedToken;
      const { bookID } = req.params;

      const param = { userID, bookID };
      const statusCode = await this.service.deleteLike(param);

      res.status(statusCode).end();
    } catch (err) {
      this.logger.err(err.message);

      res.status(err.statusCode).json({
        message: err.message,
      });
    }
  };
};
