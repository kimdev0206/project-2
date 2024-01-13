module.exports = class AuthMiddleware {
  constructor({ StatusCodes, logger, jwt }) {
    this.StatusCodes = StatusCodes;
    this.logger = logger;
    this.jwt = jwt;
  }

  verifyAccessToken = async (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(this.StatusCodes.BAD_REQUEST).json({
        message: "로그인 API 를 통해, 접근 토큰을 발급 받으세요.",
      });
    }

    try {
      const accessToken = req.headers.authorization;
      req.decodedToken = await this.jwt.verify(
        accessToken,
        process.env.JWT_PRIVATE_KEY
      );
    } catch (err) {
      if (err instanceof this.jwt.TokenExpiredError) {
        return res.status(this.StatusCodes.UNAUTHORIZED).json({
          message:
            "접근 토큰이 만료되었습니다. 접근 토큰 재발급 API 를 통해, 접근 토큰을 재발급 받으세요.",
        });
      }

      if (err instanceof this.jwt.JsonWebTokenError) {
        this.logger.err(err.message);
        return res.status(this.StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: err.message,
        });
      }
    }

    next();
  };

  decodeAccessToken = async (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(this.StatusCodes.BAD_REQUEST).json({
        message: "로그인 API 를 통해, 접근 토큰을 발급 받으세요.",
      });
    }

    const accessToken = req.headers.authorization;
    req.decodedToken = this.jwt.decode(
      accessToken,
      process.env.JWT_PRIVATE_KEY
    );

    next();
  };
};
