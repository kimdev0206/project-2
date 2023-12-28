module.exports = class UsersService {
  constructor({ repository }) {
    this.repository = repository;
  }

  // TODO: 인자. 에러문구. 회원가입 서비스 로직.
  signUp = async () => {
    const [row] = await this.repository.selectUser();

    if (row) {
      const err = new Error("");
      return Promise.reject(err);
    }

    await this.repository.insertUser();
  };
};
