module.exports = function ({ express, controller, middlewares }) {
  const router = express.Router();
  const { authMiddleware, validMiddleware } = middlewares;

  router.post("/reset-password", controller.postResetPassword);
  router.get(
    "/access-token",
    authMiddleware.decodeAccessToken,
    controller.getAccessToken
  );

  router.use(validMiddleware.validateAuth, validMiddleware.errHandler);
  router.post("/sign-up", controller.signUp);
  router.post("/log-in", controller.logIn);
  router.put("/reset-password", controller.putResetPassword);

  return router;
};
