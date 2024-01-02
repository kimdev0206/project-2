module.exports = class UsersService {
  constructor({ repository, StatusCodes, jwt }) {
    this.repository = repository;
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

    if (row.password !== param.password) {
      const err = new Error("요청하신 password 가 일치하지 않습니다.");
      err.statusCode = this.StatusCodes.UNAUTHORIZED;
      return Promise.reject(err);
    }

    const token = this.jwt.sign(
      { email: row.email },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: "15m",
        issuer: "Yongki Kim",
      }
    );
    return Promise.resolve(token);
  };
};
