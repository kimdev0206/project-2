const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const HttpError = require("../error/HttpError");

module.exports = async function verifyRefreshToken(req, res, next) {
  if (!req.headers["refresh-token"]) {
    const message = "로그인 API 를 통해, 재발급 토큰을 발급 받으세요.";
    return next(new HttpError(StatusCodes.BAD_REQUEST, message));
  }

  try {
    const refreshToken = req.headers["refresh-token"];
    req.decodedToken = jwt.verify(refreshToken, process.env.JWT_PRIVATE_KEY);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const message =
        "재발급 토큰이 만료되었습니다. 로그인 API 를 통해, 재발급 토큰을 발급 받으세요.";
      return next(new HttpError(StatusCodes.UNAUTHORIZED, message));
    }

    if (error instanceof jwt.JsonWebTokenError) return next(error);
  }

  next();
};
