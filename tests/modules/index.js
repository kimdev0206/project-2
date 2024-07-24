const DeleteUser = require("./delete-user");
const Delete = require("./delete");
const InsertBooks = require("./insert-books");
const InsertLikes = require("./insert-likes");
const InsertOrders = require("./insert-orders");
const InsertPromotionCategory = require("./insert-promotion-category");
const InsertPromotionUser = require("./insert-promotion-user");
const InsertUsers = require("./insert-users");
const SelectBookCount = require("./select-book-count");
const SelectBookIDs = require("./select-book-ids");
const SelectBookJoin = require("./select-book-join");
const SelectBookSubQuery = require("./select-book-sub-query");
const SelectBooksJoin = require("./select-books-join");
const SelectBooksSubQuery = require("./select-books-sub-query");
const SelectRandomBooks = require("./select-random-books");
const SelectUserIDs = require("./select-user-ids");

module.exports = {
  DeleteUser,
  Delete,
  InsertBooks,
  InsertLikes,
  InsertOrders,
  InsertPromotionCategory,
  InsertPromotionUser,
  InsertUsers,
  SelectBookCount,
  SelectBookIDs,
  SelectBookJoin,
  SelectBookSubQuery,
  SelectBooksJoin,
  SelectBooksSubQuery,
  SelectRandomBooks,
  SelectUserIDs,
};
