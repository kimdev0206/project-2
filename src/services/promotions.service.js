const PromotionsRepository = require("../repositories/promotions.repository");

module.exports = class PromotionsService {
  repository = new PromotionsRepository();

  async getPromotions() {
    const rows = await this.repository.selectPromotions();

    if (!rows.length) {
      const message = "프로모션이 존재하지 않습니다.";
      throw new HttpError(StatusCodes.NOT_FOUND, message);
    }

    return rows;
  }
};
