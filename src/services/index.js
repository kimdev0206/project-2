const { StatusCodes } = require("http-status-codes");
const UsersService = require("./users.service");
const repositories = require("../repositories");

const usersService = new UsersService({
  repository: repositories.usersRepository,
  StatusCodes,
});

module.exports = {
  usersService,
};
