module.exports = class UsersService {
  constructor({ repository, StatusCodes }) {
    this.repository = repository;
    this.StatusCodes = StatusCodes;
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
};
