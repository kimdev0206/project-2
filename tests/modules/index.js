const DeletePromotionCategories = require("./delete-promotion-categories");
const DeleteUser = require("./delete-user");
const Delete = require("./delete");
const InsertBooks = require("./insert-books");
const InsertLikes = require("./insert-likes");
const InsertOrders = require("./insert-orders");
const InsertPromotionCategories = require("./insert-promotion-categories");
const InsertPromotionUsers = require("./insert-promotion-users");
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
  DeletePromotionCategories,
  DeleteUser,
  Delete,
  InsertBooks,
  InsertLikes,
  InsertOrders,
  InsertPromotionCategories,
  InsertPromotionUsers,
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
