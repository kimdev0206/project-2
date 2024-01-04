const LikesRepository = require("./likes.repository");
const UsersRepository = require("./users.repository");
const database = require("../database");

const likesRepository = new LikesRepository(database);
const usersRepository = new UsersRepository(database);

module.exports = {
  likesRepository,
  usersRepository,
};
