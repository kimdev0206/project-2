module.exports = class UsersController {
  constructor({ service, logger }) {
    this.service = service;
    this.logger = logger;
  }

  // TODO: 요청값
  signUp = async (_, res) => {
    try {
      await this.service.signUp();

      res.json({
        message: "회원가입 되었습니다",
      });
    } catch (err) {
      this.logger.err(err.message);

      res.status(err.status).json({
        message: err.message,
      });
    }
  };
};
