module.exports = function ({ express, controller, middleware }) {
  const router = express.Router();

  router.get("/", controller.getBooks);
  router.get("/:bookID", middleware.verifyToken, controller.getBook);

  return router;
};
