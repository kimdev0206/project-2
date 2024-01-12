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
    const [row] = await this.repository.selectUser(param.email);

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
    const [row] = await this.repository.selectUser(param.email);

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

    const accessToken = this.jwt.sign(
      { userID: row.id },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: "15m",
        issuer: "Yongki Kim",
      }
    );
    const refreshToken = this.jwt.sign(
      { userID: row.id },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: "15d",
        issuer: "Yongki Kim",
      }
    );

    return Promise.resolve({
      accessToken,
      refreshToken,
    });
  };

  postResetPassword = async (param) => {
    const [row] = await this.repository.selectUser(param.email);

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
};
