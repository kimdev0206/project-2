const DeleteBooks = require("./delete-books");
const DeleteUser = require("./delete-user");
const DeleteUsers = require("./delete-users");
const InsertBooks = require("./insert-books");
const InsertLikes = require("./insert-likes");
const InsertPromotionCategory = require("./insert-promotion-category");
const InsertPromotionUser = require("./insert-promotion-user");
const InsertUsers = require("./insert-users");
const SelectBookCount = require("./select-book-count");
const SelectBookIDs = require("./select-book-ids");
const SelectBooksJoin = require("./select-books-join");
const SelectBooksSubQuery = require("./select-books-sub-query");
const SelectUserIDs = require("./select-user-ids");

module.exports = {
  DeleteBooks,
  DeleteUser,
  DeleteUsers,
  InsertBooks,
  InsertLikes,
  InsertPromotionCategory,
  InsertPromotionUser,
  InsertUsers,
  SelectBookCount,
  SelectBookIDs,
  SelectBooksJoin,
  SelectBooksSubQuery,
  SelectUserIDs,
};
