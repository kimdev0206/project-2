module.exports = function ({ express, controller }) {
  const router = express.Router();

  router.post("/sign-up", controller.signUp);

  return router;
};
