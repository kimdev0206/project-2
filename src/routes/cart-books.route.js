module.exports = function ({ express, controller, middlewares }) {
  const router = express.Router();
  const { authMiddleware, validMiddleware } = middlewares;

  router.use(authMiddleware.verifyAccessToken);
  router.post(
    "/:bookID",
    validMiddleware.validatePostCartBook,
    validMiddleware.errHandler,
    controller.postCartBook
  );
  router.delete("/:bookID", controller.deleteCartBook);
  router.get("/", controller.getCartBooks);
  router.get(
    "/selected",
    validMiddleware.validateGetSelectedCartBooks,
    validMiddleware.errHandler,
    controller.getCartBooks
  );

  return router;
};
