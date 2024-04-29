const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const HttpError = require("../error/HttpError");

module.exports = async function verifyAccessToken(req, res, next) {
  if (!req.headers["access-token"]) {
    const message = "로그인 API 를 통해, 접근 토큰을 발급 받으세요.";
    return next(new HttpError(StatusCodes.BAD_REQUEST, message));
  }

  try {
    const accessToken = req.headers["access-token"];
    req.decodedToken = jwt.verify(accessToken, process.env.JWT_PRIVATE_KEY);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const message =
        "접근 토큰이 만료되었습니다. 접근 토큰 재발급 API 를 통해, 접근 토큰을 재발급 받으세요.";
      return next(new HttpError(StatusCodes.UNAUTHORIZED, message));
    }

    if (error instanceof jwt.JsonWebTokenError) return next(error);
  }

  next();
};
