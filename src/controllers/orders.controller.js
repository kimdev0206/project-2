module.exports = class OrdersController {
  constructor({ service, logger }) {
    this.service = service;
    this.logger = logger;
  }

  postOrder = async (req, res) => {
    try {
      const { userID } = req.decodedToken;
      const { mainBookTitle, books, delivery, totalCount, totalPrice } =
        req.body;

      const param = {
        userID,
        mainBookTitle,
        books,
        delivery,
        totalCount,
        totalPrice,
      };
      const statusCode = await this.service.postOrder(param);

      res.status(statusCode).json({
        message: "주문 처리되었습니다.",
      });
    } catch (err) {
      this.logger.err(err.message);

      res.status(err.statusCode).json({
        message: err.message,
      });
    }
  };

  getOrders = async (req, res) => {
    try {
      const { userID } = req.decodedToken;

      const param = { userID };
      const data = await this.service.getOrders(param);

      res.json({
        data,
      });
    } catch (err) {
      this.logger.err(err.message);

      res.status(err.statusCode).json({
        message: err.message,
      });
    }
  };

  getOrdersDetail = async (req, res) => {
    try {
      const { userID } = req.decodedToken;
      const { deliveryID } = req.params;

      const param = { userID, deliveryID };
      const data = await this.service.getOrdersDetail(param);

      res.json({
        data,
      });
    } catch (err) {
      this.logger.err(err.message);

      res.status(err.statusCode).json({
        message: err.message,
      });
    }
  };

  deleteOrder = async (req, res) => {
    try {
      const { userID } = req.decodedToken;
      const { deliveryID } = req.params;

      const param = { userID, deliveryID };
      const statusCode = await this.service.deleteOrder(param);

      res.status(statusCode).end();
    } catch (err) {
      this.logger.err(err.message);

      res.status(err.statusCode).json({
        message: err.message,
      });
    }
  };
};
