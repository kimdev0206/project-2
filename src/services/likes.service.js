const LikesRepository = require("../repositories/likes.repository");
const HttpError = require("../HttpError");

module.exports = class LikesService {
  repository = new LikesRepository();

  postLike = async (dto) => {
    try {
      await this.repository.insertLike(dto);
    } catch (error) {
      const message = "이미 좋아요 처리되었습니다.";
      throw new HttpError(409, message);
    }

    return 201;
  };

  async deleteLike(dto) {
    const { affectedRows } = await this.repository.deleteLike(dto);

    if (!affectedRows) {
      const message = "이미 좋아요 취소 처리되었습니다.";
      throw new HttpError(404, message);
    }

    return 204;
  }
};
