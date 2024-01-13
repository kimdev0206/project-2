module.exports = class UsersService {
  bufLen = 16; // NOTE: 최종 hashedPassword 길이가 아닙니다.
  iterations = 100_000;

  constructor({ repository, randomBytes, pbkdf2, StatusCodes, jwt }) {
    this.repository = repository;
    this.randomBytes = randomBytes;
    this.pbkdf2 = pbkdf2;
    this.StatusCodes = StatusCodes;
    this.jwt = jwt;
  }

  signUp = async (param) => {
    const [row] = await this.repository.selectUserByEmail(param);

    if (row) {
      const err = new Error("동일한 email 의 회원이 존재합니다.");
      err.statusCode = this.StatusCodes.BAD_REQUEST;
      return Promise.reject(err);
    }

    const salt = (await this.randomBytes(this.bufLen)).toString("base64");
    const hashedPassword = (
      await this.pbkdf2(
        param.password,
        salt,
        this.iterations,
        this.bufLen,
        "sha512"
      )
    ).toString("base64");

    param = { ...param, salt, hashedPassword };
    await this.repository.insertUser(param);

    return Promise.resolve(this.StatusCodes.CREATED);
  };

  logIn = async (param) => {
    const [row] = await this.repository.selectUserByEmail(param);

    if (!row) {
      const err = new Error("요청하신 email 의 회원이 존재하지 않습니다.");
      err.statusCode = this.StatusCodes.BAD_REQUEST;
      return Promise.reject(err);
    }

    const hashedPassword = (
      await this.pbkdf2(
        param.password,
        row.salt,
        this.iterations,
        this.bufLen,
        "sha512"
      )
    ).toString("base64");

    if (row.hashedPassword !== hashedPassword) {
      const err = new Error("요청하신 password 가 일치하지 않습니다.");
      err.statusCode = this.StatusCodes.UNAUTHORIZED;
      return Promise.reject(err);
    }

    try {
      const accessToken = await this.jwt.sign(
        { userID: row.userID },
        process.env.JWT_PRIVATE_KEY,
        {
          expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
          issuer: "Yongki Kim",
        }
      );
      const refreshToken = await this.jwt.sign(
        {},
        process.env.JWT_PRIVATE_KEY,
        {
          expiresIn: "15d",
          issuer: "Yongki Kim",
        }
      );

      param.userID = row.userID;
      param.refreshToken = refreshToken;
      await this.repository.updateUserRefreshToken(param);

      return Promise.resolve(accessToken);
    } catch (err) {
      err.statusCode = this.StatusCodes.INTERNAL_SERVER_ERROR;
      return Promise.reject(err);
    }
  };

  postResetPassword = async (param) => {
    const [row] = await this.repository.selectUserByEmail(param);

    if (!row) {
      const err = new Error("요청하신 email 의 회원이 존재하지 않습니다.");
      err.statusCode = this.StatusCodes.BAD_REQUEST;
      return Promise.reject(err);
    }
  };

  putResetPassword = async (param) => {
    const salt = (await this.randomBytes(this.bufLen)).toString("base64");
    const hashedPassword = (
      await this.pbkdf2(
        param.password,
        salt,
        this.iterations,
        this.bufLen,
        "sha512"
      )
    ).toString("base64");

    param = { ...param, salt, hashedPassword };
    const { affectedRows } = await this.repository.updateUserPassword(param);

    if (!affectedRows) {
      const err = new Error("요청하신 email 의 회원이 존재하지 않습니다.");
      err.statusCode = this.StatusCodes.BAD_REQUEST;
      return Promise.reject(err);
    }
  };

  getAccessToken = async (param) => {
    const [row] = await this.repository.selectUserByID(param);

    try {
      await this.jwt.verify(row.refreshToken, process.env.JWT_PRIVATE_KEY);

      const accessToken = await this.jwt.sign(
        { userID: row.userID },
        process.env.JWT_PRIVATE_KEY,
        {
          expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
          issuer: "Yongki Kim",
        }
      );

      return Promise.resolve(accessToken);
    } catch (err) {
      if (err instanceof this.jwt.TokenExpiredError) {
        err.statusCode = this.StatusCodes.UNAUTHORIZED;
        err.message =
          "재발급 토큰이 만료되었습니다. 로그인 API 를 통해, 재발급 토큰을 발급 받으세요.";
      }

      err.statusCode = this.StatusCodes.INTERNAL_SERVER_ERROR;
      return Promise.reject(err);
    }
  };
};
