const crypto = require("node:crypto");
const util = require("node:util");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const BooksService = require("./books.service");
const CartBooksService = require("./cart-books.service");
const LikesService = require("./likes.service");
const OrdersService = require("./orders.service");
const UsersService = require("./users.service");
const repositories = require("../repositories");
const database = require("../database");

const booksService = new BooksService({
  repository: repositories.booksRepository,
  StatusCodes,
});
const cartBooksService = new CartBooksService({
  repository: repositories.cartBooksRepository,
  StatusCodes,
});
const likesService = new LikesService({
  repository: repositories.likesRepository,
  StatusCodes,
});
const ordersService = new OrdersService({
  repositories,
  StatusCodes,
  database,
});
const usersService = new UsersService({
  repository: repositories.usersRepository,
  randomBytes: util.promisify(crypto.randomBytes),
  pbkdf2: util.promisify(crypto.pbkdf2),
  StatusCodes,
  jwt,
});

module.exports = {
  booksService,
  cartBooksService,
  likesService,
  ordersService,
  usersService,
};
