const BooksRepository = require("./books.repository");
const UsersRepository = require("./users.repository");
const database = require("../database");

const booksRepository = new BooksRepository(database);
const usersRepository = new UsersRepository(database);

module.exports = {
  booksRepository,
  usersRepository,
};
