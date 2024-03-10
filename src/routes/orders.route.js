module.exports = function ({ express, controller, middlewares }) {
  const router = express.Router();
  const { authMiddleware, validMiddleware } = middlewares;

  router.use(authMiddleware.verifyAccessToken);
  router.post(
    "/",
    validMiddleware.validatePostOrder,
    validMiddleware.errHandler,
    controller.postOrder
  );
  router.get("/", controller.getOrders);
  router.get("/:orderID", controller.getOrdersDetail);
  router.delete("/:orderID", controller.deleteOrder);

  return router;
};
