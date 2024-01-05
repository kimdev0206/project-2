const UsersRepository = require("./users.repository");
const database = require("../database");

const usersRepository = new UsersRepository(database);

module.exports = {
  usersRepository,
};
