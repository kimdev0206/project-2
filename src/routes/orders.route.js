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
  router.get("/:deliveryID", controller.getOrdersDetail);
  router.delete("/:deliveryID", controller.deleteOrder);

  return router;
};
