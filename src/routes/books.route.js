module.exports = function ({ express, controller }) {
  const router = express.Router();

  router.get("/", controller.getBooks);
  router.get("/:bookID", controller.getBook);

  return router;
};
