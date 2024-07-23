const DeleteBooks = require("./delete-books");
const DeleteUsers = require("./delete-users");
const InsertBooks = require("./insert-books");
const SelectBookCount = require("./select-book-count");
const SelectBookIDs = require("./select-book-ids");
const SelectBooksJoin = require("./select-books-join");
const SelectBooksSubQuery = require("./select-books-sub-query");

module.exports = {
  DeleteBooks,
  DeleteUsers,
  InsertBooks,
  SelectBookCount,
  SelectBookIDs,
  SelectBooksJoin,
  SelectBooksSubQuery,
};
