const { Router } = require("express");
const {
  verifyAccessToken,
  validateError,
  validateOrder,
} = require("../middlewares");
const OrdersService = require("../services/orders.service");

class OrdersController {
  path = "/orders";
  router = Router();
  service = new OrdersService();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(
      `${this.path}/:deliveryID`,
      verifyAccessToken,
      validateOrder,
      validateError,
      this.postOrder
    );
    this.router.get(this.path, verifyAccessToken, this.getOrders);
    this.router.get(
      `${this.path}/:deliveryID`,
      verifyAccessToken,
      this.getOrdersDetail
    );
    this.router.delete(
      `${this.path}/:deliveryID`,
      verifyAccessToken,
      this.deleteOrder
    );
  }

  postOrder = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;
      const { deliveryID } = req.params;
      const { mainBookTitle, books, delivery, totalCount, totalPrice } =
        req.body;

      const param = {
        userID,
        deliveryID,
        mainBookTitle,
        books,
        delivery,
        totalCount,
        totalPrice,
      };
      const status = await this.service.postOrder(param);

      res.status(status).json({
        message: "주문 처리되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  getOrders = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;

      const param = { userID };
      const data = await this.service.getOrders(param);

      res.json({
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getOrdersDetail = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;
      const { deliveryID } = req.params;

      const param = { userID, deliveryID };
      const data = await this.service.getOrdersDetail(param);

      res.json({
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteOrder = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;
      const { deliveryID } = req.params;

      const param = { userID, deliveryID };
      const status = await this.service.deleteOrder(param);

      res.status(status).end();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new OrdersController();
