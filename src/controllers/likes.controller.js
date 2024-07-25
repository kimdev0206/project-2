const { Router } = require("express");
const {
  validateBookID,
  validateError,
  verifyAccessToken,
} = require("../middlewares");
const LikesService = require("../services/likes.service");

class LikesController {
  path = "/likes";
  router = Router();
  service = new LikesService();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(
      `${this.path}/:bookID`,
      verifyAccessToken,
      validateBookID,
      validateError,
      this.postLike
    );
    this.router.delete(
      `${this.path}/:bookID`,
      verifyAccessToken,
      validateBookID,
      validateError,
      this.deleteLike
    );
  }

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
}

module.exports = new LikesController();
