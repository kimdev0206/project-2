const BooksController = require("./books.controller");
const LikesController = require("./likes.controller");
const UsersController = require("./users.controller");
const services = require("../services");
const logger = require("../logger");

const booksController = new BooksController({
  service: services.booksService,
  logger,
});
const likesController = new LikesController({
  service: services.likesService,
  logger,
});
const usersController = new UsersController({
  service: services.usersService,
  logger,
});

module.exports = {
  booksController,
  likesController,
  usersController,
};
