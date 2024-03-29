const BooksRepository = require("./books.repository");
const CartBooksRepository = require("./cart-books.repository");
const LikesRepository = require("./likes.repository");
const OrdersRepository = require("./orders.repository");
const UsersRepository = require("./users.repository");
const database = require("../database");

const booksRepository = new BooksRepository(database);
const cartBooksRepository = new CartBooksRepository(database);
const likesRepository = new LikesRepository(database);
const ordersRepository = new OrdersRepository(database);
const usersRepository = new UsersRepository(database);

module.exports = {
  booksRepository,
  cartBooksRepository,
  likesRepository,
  ordersRepository,
  usersRepository,
};
