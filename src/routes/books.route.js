module.exports = function ({ express, controller, middlewares }) {
  const router = express.Router();

  router.get(
    "/",
    middlewares.validMiddleware.validateGetBooks,
    middlewares.validMiddleware.errHandler,
    controller.getBooks
  );
  router.get(
    "/:bookID",
    middlewares.authMiddleware.verifyAccessToken,
    controller.getBook
  );

  return router;
};
