module.exports = class AuthMiddleware {
  constructor({ StatusCodes, logger, jwt }) {
    this.StatusCodes = StatusCodes;
    this.logger = logger;
    this.jwt = jwt;
  }

  verifyToken = async (req, res, next) => {
    if (!req.cookies.accessToken && !req.headers.authorization) {
      return res.status(this.StatusCodes.BAD_REQUEST).json({
        message: "로그인 API 를 통해 토큰을 발급 받으세요.",
      });
    }

    if (req.cookies.accessToken) {
      const { accessToken } = req.cookies;
      req.decodedToken = this.jwt.verify(
        accessToken,
        process.env.JWT_PRIVATE_KEY
      );

      return next();
    }

    const refreshToken = req.headers.authorization;
    let decodedToken;

    try {
      decodedToken = this.jwt.verify(refreshToken, process.env.JWT_PRIVATE_KEY);
    } catch (err) {
      if (err instanceof this.jwt.TokenExpiredError) {
        return res.status(this.StatusCodes.UNAUTHORIZED).json({
          message:
            "토큰이 만료되었습니다. 로그인 API 를 통해 토큰을 재발급 받으세요.",
        });
      }

      this.logger.err(err.message);
      return res.status(this.StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: err.message,
      });
    }

    const { userID } = decodedToken;
    const accessToken = this.jwt.sign({ userID }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: "15m",
      issuer: "Yongki Kim",
    });

    req.decodedToken = decodedToken;
    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000, // 15m
      httpOnly: true,
    });
    res.header("Authorization", refreshToken);

    next();
  };
};
