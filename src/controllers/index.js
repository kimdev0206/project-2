const UsersController = require("./users.controller");
const services = require("../services");
const logger = require("../logger");

const usersController = new UsersController({
  service: services.usersService,
  logger,
});

module.exports = {
  usersController,
};
