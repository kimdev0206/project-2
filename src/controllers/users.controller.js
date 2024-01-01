module.exports = class UsersController {
  constructor({ service, logger }) {
    this.service = service;
    this.logger = logger;
  }

  signUp = async (req, res) => {
    try {
      const { email, password } = req.body;

      const param = { email, password };
      const statusCode = await this.service.signUp(param);

      res.status(statusCode).json({
        message: "회원가입 되었습니다.",
      });
    } catch (err) {
      this.logger.err(err.message);

      res.status(err.statusCode).json({
        message: err.message,
      });
    }
  };
};
