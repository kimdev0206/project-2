const BooksController = require("./books.controller");
const UsersController = require("./users.controller");
const services = require("../services");
const logger = require("../logger");

const booksController = new BooksController({
  service: services.booksService,
  logger,
});
const usersController = new UsersController({
  service: services.usersService,
  logger,
});

module.exports = {
  booksController,
  usersController,
};
