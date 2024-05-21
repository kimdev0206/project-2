const { Router } = require("express");
const {
  verifyRefreshToken,
  validateUser,
  validateError,
} = require("../middlewares");
const UsersService = require("../services/users.service");

class UsersController {
  path = "/users";
  router = Router();
  service = new UsersService();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(`${this.path}/reset-password`, this.postResetPassword);
    this.router.put(`${this.path}/reset-password`, this.putResetPassword);
    this.router.get(
      `${this.path}/access-token`,
      verifyRefreshToken,
      this.getAccessToken
    );
    this.router.post(
      `${this.path}/sign-up`,
      validateUser,
      validateError,
      this.signUp
    );
    this.router.post(
      `${this.path}/log-in`,
      validateUser,
      validateError,
      this.logIn
    );
  }

  signUp = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const param = { email, password };
      const status = await this.service.signUp(param);

      res.status(status).json({
        message: "회원가입 되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  logIn = async (req, res, next) => {
    try {
      const { ip } = req;
      const { email, password } = req.body;

      const param = { ip, email, password };
      const { accessToken, refreshToken } = await this.service.logIn(param);

      res.header("Access-Token", accessToken);
      res.header("Refresh-Token", refreshToken);
      res.json({
        message: "로그인 되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  postResetPassword = async (req, res, next) => {
    try {
      const { email } = req.body;

      const param = { email };
      await this.service.postResetPassword(param);

      res.json({
        message: "비밀번호 초기화가 요청 되었습니다.",
        email,
      });
    } catch (error) {
      next(error);
    }
  };

  putResetPassword = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const param = { email, password };
      await this.service.putResetPassword(param);

      res.json({
        message: "비밀번호 초기화 되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  getAccessToken = async (req, res, next) => {
    try {
      const { ip } = req;
      const { userID } = req.decodedToken;
      const refreshToken = req.headers["refresh-token"];

      const param = { ip, userID, refreshToken };
      const accessToken = await this.service.getAccessToken(param);

      res.header("Access-Token", accessToken);
      res.json({
        message: "접근 토큰이 재발급 되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new UsersController();
