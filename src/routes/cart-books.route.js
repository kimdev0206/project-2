module.exports = function ({ express, controller, middleware }) {
  const router = express.Router();

  router.use(middleware.verifyToken);
  router.post("/:bookID", controller.postCartBook);
  router.delete("/:bookID", controller.deleteCartBook);
  router.get("/", controller.getCartBooks);
  router.get("/selected", controller.getCartBooks);

  return router;
};
