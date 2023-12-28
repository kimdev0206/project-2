const UsersService = require("./users.service");
const repositories = require("../repositories");

const usersService = new UsersService({
  repository: repositories.usersRepository,
});

module.exports = {
  usersService,
};
