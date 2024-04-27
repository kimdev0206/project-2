const { StatusCodes } = require("http-status-codes");
const HttpError = require("../error/HttpError");
const CategoriesRepository = require("../repositories/categories.repository");

module.exports = class CategoriesService {
  repository = new CategoriesRepository();

  async getCategories() {
    const rows = await this.repository.selectCategories();

    if (!rows.length) {
      const message = "카테고리가 존재하지 않습니다.";
      throw new HttpError(StatusCodes.NOT_FOUND, message);
    }

    return rows;
  }
};
