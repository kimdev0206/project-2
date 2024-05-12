const { Router } = require("express");
const PromotionsService = require("../services/promotions.service");

class PromotionsController {
  path = "/promotions";
  router = Router();
  service = new PromotionsService();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get(this.path, this.getPromotions);
  }

  getPromotions = async (_, res, next) => {
    try {
      const data = await this.service.getPromotions();

      res.json({
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new PromotionsController();
