module.exports = function ({ express, controller, middleware }) {
  const router = express.Router();

  router.use(middleware.verifyToken);
  router.post("/:bookID", controller.postLike);
  router.delete("/:bookID", controller.deleteLike);

  return router;
};
