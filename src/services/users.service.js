const { randomBytes, pbkdf2 } = require("node:crypto");
const { promisify } = require("node:util");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const HttpError = require("../error/HttpError");
const UsersRepository = require("../repositories/users.repository");

module.exports = class UsersService {
  bufLen = 16; // NOTE: 최종 hashedPassword 길이가 아닙니다.
  iterations = 100_000;
  repository = new UsersRepository();

  async signUp(param) {
    const [row] = await this.repository.selectUserByEmail(param);

    if (row) {
      const message = "동일한 email 의 회원이 존재합니다.";
      throw new HttpError(StatusCodes.BAD_REQUEST, message);
    }

    const salt = (await promisify(randomBytes)(this.bufLen)).toString("base64");
    const hashedPassword = (
      await promisify(pbkdf2)(
        param.password,
        salt,
        this.iterations,
        this.bufLen,
        "sha512"
      )
    ).toString("base64");

    param = { ...param, salt, hashedPassword };
    await this.repository.insertUser(param);

    return Promise.resolve(StatusCodes.CREATED);
  }

  async logIn(param) {
    const [row] = await this.repository.selectUserByEmail(param);

    if (!row) {
      const message = "요청하신 email 의 회원이 존재하지 않습니다.";
      throw new HttpError(StatusCodes.BAD_REQUEST, message);
    }

    const hashedPassword = (
      await promisify(pbkdf2)(
        param.password,
        row.salt,
        this.iterations,
        this.bufLen,
        "sha512"
      )
    ).toString("base64");

    if (row.hashedPassword !== hashedPassword) {
      const message = "요청하신 password 가 일치하지 않습니다.";
      throw new HttpError(StatusCodes.UNAUTHORIZED, message);
    }

    const accessToken = jwt.sign(
      { userID: row.userID },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
        issuer: "Yongki Kim",
      }
    );
    const refreshToken = jwt.sign(
      { userID: row.userID },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: "15d",
        issuer: "Yongki Kim",
      }
    );

    param.userID = row.userID;
    param.refreshToken = refreshToken;
    await this.repository.updateUserRefreshToken(param);

    return {
      accessToken,
      refreshToken,
    };
  }

  async postResetPassword(param) {
    const [row] = await this.repository.selectUserByEmail(param);

    if (!row) {
      const message = "요청하신 email 의 회원이 존재하지 않습니다.";
      throw new HttpError(StatusCodes.BAD_REQUEST, message);
    }
  }

  async putResetPassword(param) {
    const salt = (await promisify(randomBytes)(this.bufLen)).toString("base64");
    const hashedPassword = (
      await promisify(pbkdf2)(
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
      const message = "요청하신 email 의 회원이 존재하지 않습니다.";
      throw new HttpError(StatusCodes.BAD_REQUEST, message);
    }
  }

  async getAccessToken(param) {
    const [row] = await this.repository.selectUserByID(param);

    if (row.refreshToken !== param.refreshToken) {
      const message = "재발급 토큰이 유효하지 않습니다.";
      throw new HttpError(StatusCodes.FORBIDDEN, message);
    }

    const accessToken = jwt.sign(
      { userID: row.userID },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
        issuer: "Yongki Kim",
      }
    );

    return accessToken;
  }
};
