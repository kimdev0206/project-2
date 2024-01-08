const BooksController = require("./books.controller");
const CartBooksController = require("./cart-books.controller");
const LikesController = require("./likes.controller");
const UsersController = require("./users.controller");
const services = require("../services");
const logger = require("../logger");

const booksController = new BooksController({
  service: services.booksService,
  logger,
});
const cartBooksController = new CartBooksController({
  service: services.cartBooksService,
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
  cartBooksController,
  likesController,
  usersController,
};
