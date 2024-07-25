const { Router } = require("express");
const {
  verifyAccessToken,
  validateError,
  validateOrderID,
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
      this.path + "/:orderID",
      verifyAccessToken,
      validateOrderID,
      validateOrder,
      validateError,
      this.postOrder
    );
    this.router.get(this.path, verifyAccessToken, this.getOrders);
    this.router.get(
      this.path + "/:orderID",
      verifyAccessToken,
      validateOrderID,
      this.getOrder
    );
    this.router.delete(
      this.path + "/:orderID",
      verifyAccessToken,
      validateOrderID,
      this.deleteOrder
    );
  }

  postOrder = async (req, res, next) => {
    try {
      const { orderID } = req.params;
      const { userID } = req.decodedToken;
      const { delivery, mainBookTitle, books, totalCount, totalPrice } =
        req.body;

      const dto = {
        orderID,
        userID,
        delivery,
        mainBookTitle,
        books,
        totalCount,
        totalPrice,
      };
      const status = await this.service.postOrder(dto);

      res.status(status).json({
        message: "주문 처리되었습니다.",
      });
    } catch (error) {
      res.locals.name = this.postOrder.name;
      next(error);
    }
  };

  getOrders = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;

      const dto = { userID };
      const data = await this.service.getOrders(dto);

      res.json({
        data,
      });
    } catch (error) {
      res.locals.name = this.getOrders.name;
      next(error);
    }
  };

  getOrder = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;
      const { orderID } = req.params;

      const dto = { userID, orderID };
      const data = await this.service.getOrder(dto);

      res.json({
        data,
      });
    } catch (error) {
      res.locals.name = this.getOrder.name;
      next(error);
    }
  };

  deleteOrder = async (req, res, next) => {
    try {
      const { userID } = req.decodedToken;
      const { orderID } = req.params;

      const dto = { userID, orderID };
      const status = await this.service.deleteOrder(dto);

      res.status(status).end();
    } catch (error) {
      res.locals.name = this.deleteOrder.name;
      next(error);
    }
  };
}

module.exports = new OrdersController();
