module.exports = function ({ express, controller, middlewares }) {
  const router = express.Router();
  const { authMiddleware, validMiddleware } = middlewares;

  router.use(authMiddleware.verifyToken);
  router.post(
    "/",
    validMiddleware.validatePostOrder,
    validMiddleware.errHandler,
    controller.postOrder
  );

  return router;
};
