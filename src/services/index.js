const crypto = require("node:crypto");
const util = require("node:util");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const LikesService = require("./likes.service");
const UsersService = require("./users.service");
const repositories = require("../repositories");

const likesService = new LikesService({
  repository: repositories.likesRepository,
  StatusCodes,
});
const usersService = new UsersService({
  repository: repositories.usersRepository,
  randomBytes: util.promisify(crypto.randomBytes),
  pbkdf2: util.promisify(crypto.pbkdf2),
  StatusCodes,
  jwt,
});

module.exports = {
  likesService,
  usersService,
};
