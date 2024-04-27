const { Router } = require("express");
const CategoriesService = require("../services/categories.service");

class CategoriesController {
  path = "/categories";
  router = Router();
  service = new CategoriesService();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get(this.path, this.getCategories);
  }

  getCategories = async (_, res, next) => {
    try {
      const data = await this.service.getCategories();

      res.json({
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new CategoriesController();
