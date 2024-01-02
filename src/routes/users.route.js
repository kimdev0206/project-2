module.exports = function ({ express, controller }) {
  const router = express.Router();

  router.post("/sign-up", controller.signUp);
  router.post("/log-in", controller.logIn);
  router.post("/reset-password", controller.postResetPassword);
  router.put("/reset-password", controller.putResetPassword);

  return router;
};
