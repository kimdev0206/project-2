const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const UsersService = require("./users.service");
const repositories = require("../repositories");

const usersService = new UsersService({
  repository: repositories.usersRepository,
  StatusCodes,
  jwt,
});

module.exports = {
  usersService,
};
