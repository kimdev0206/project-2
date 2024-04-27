const { StatusCodes } = require("http-status-codes");
const HttpError = require("../error/HttpError");
const LikesRepository = require("../repositories/likes.repository");

module.exports = class LikesService {
  repository = new LikesRepository();

  postLike = async (param) => {
    try {
      await this.repository.insertLike(param);
    } catch (error) {
      const message = "이미 좋아요 처리되었습니다.";
      throw new HttpError(StatusCodes.CONFLICT, message);
    }

    return StatusCodes.CREATED;
  };

  async deleteLike(param) {
    const { affectedRows } = await this.repository.deleteLike(param);

    if (!affectedRows) {
      const message = "이미 좋아요 취소 처리되었습니다.";
      throw new HttpError(StatusCodes.NOT_FOUND, message);
    }

    return StatusCodes.NO_CONTENT;
  }
};
