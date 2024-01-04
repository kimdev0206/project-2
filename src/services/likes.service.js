module.exports = class LikesService {
  constructor({ repository, StatusCodes }) {
    this.repository = repository;
    this.StatusCodes = StatusCodes;
  }

  postLike = async (param) => {
    await this.repository.insertLike(param);

    return Promise.resolve(this.StatusCodes.CREATED);
  };
};
