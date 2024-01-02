const crypto = require("node:crypto");
const util = require("node:util");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const UsersService = require("./users.service");
const repositories = require("../repositories");

const usersService = new UsersService({
  repository: repositories.usersRepository,
  randomBytes: util.promisify(crypto.randomBytes),
  pbkdf2: util.promisify(crypto.pbkdf2),
  StatusCodes,
  jwt,
});

module.exports = {
  usersService,
};
