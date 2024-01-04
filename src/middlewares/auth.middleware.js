module.exports = class AuthMiddleware {
  constructor({ StatusCodes, jwt }) {
    this.StatusCodes = StatusCodes;
    this.jwt = jwt;
  }

  verifyToken = async (req, res, next) => {
    if (!req.cookies.token) {
      return res.status(this.StatusCodes.UNAUTHORIZED).json({
        message: "로그인 API 를 통해 쿠키를 발급 받으세요.",
      });
    }

    const { token } = req.cookies;
    req.decodedToken = this.jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    next();
  };
};
