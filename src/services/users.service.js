const { randomBytes, pbkdf2 } = require("node:crypto");
const { promisify } = require("node:util");
const UsersRepository = require("../repositories/users.repository");
const HttpError = require("../HttpError");

module.exports = class UsersService {
  bufLen = 16; // NOTE: 최종 hashedPassword 길이가 아닙니다.
  iterations = 100_000;
  repository = new UsersRepository();

  async signUp(dto) {
    const [row] = await this.repository.selectUser(dto.email);

    if (row) {
      const message = `요청하신 email(${dto.email}) 의 회원이 존재합니다.`;
      throw new HttpError(400, message);
    }

    const buf = await promisify(randomBytes)(this.bufLen);
    const salt = buf.toString("base64");

    const derivedKey = await promisify(pbkdf2)(
      dto.password,
      salt,
      this.iterations,
      this.bufLen,
      "sha512"
    );
    const hashedPassword = derivedKey.toString("base64");

    const dao = { ...dto, salt, hashedPassword };
    await this.repository.insertUser(dao);

    return 201;
  }

  async logIn(dto) {
    const [row] = await this.repository.selectUser(dto.email);

    if (!row) {
      const message = `요청하신 email(${dto.email}) 의 회원이 존재하지 않습니다.`;
      throw new HttpError(400, message);
    }

    const derivedKey = await promisify(pbkdf2)(
      dto.password,
      row.salt,
      this.iterations,
      this.bufLen,
      "sha512"
    );
    const hashedPassword = derivedKey.toString("base64");

    if (row.hashedPassword !== hashedPassword) {
      const message = "요청하신 password 가 일치하지 않습니다.";
      throw new HttpError(401, message);
    }

    const accessToken = row.userID.makeJWT();
    const refreshToken = row.userID.makeJWT("15d");

    return {
      accessToken,
      refreshToken,
    };
  }

  async postResetPassword(dto) {
    const [row] = await this.repository.selectUser(dto.email);

    if (!row) {
      const message = `요청하신 email(${dto.email}) 의 회원이 존재하지 않습니다.`;
      throw new HttpError(400, message);
    }
  }

  async putResetPassword(dto) {
    const buf = await promisify(randomBytes)(this.bufLen);
    const salt = buf.toString("base64");

    const derivedKey = await promisify(pbkdf2)(
      dto.password,
      salt,
      this.iterations,
      this.bufLen,
      "sha512"
    );
    const hashedPassword = derivedKey.toString("base64");

    const dao = { ...dto, salt, hashedPassword };
    const { affectedRows } = await this.repository.updateUserPassword(dao);

    if (!affectedRows) {
      const message = `요청하신 email(${dto.email}) 의 회원이 존재하지 않습니다.`;
      throw new HttpError(400, message);
    }
  }

  async getAccessToken(userID) {
    return userID.makeJWT();
  }
};
