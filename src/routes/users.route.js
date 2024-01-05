module.exports = function ({ express, controller, middleware }) {
  const router = express.Router();

  router.post("/reset-password", controller.postResetPassword);

  router.use(middleware.validateAuth, middleware.errHandler);
  router.post("/sign-up", controller.signUp);
  router.post("/log-in", controller.logIn);
  router.put("/reset-password", controller.putResetPassword);

  return router;
};
