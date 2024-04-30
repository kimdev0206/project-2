const errorMiddleware = require("./error.middleware");
const logMiddleware = require("./log.middleware");
const validateBookID = require("./validate-book-id.middleware");
const validateBookIDs = require("./validate-book-ids.middleware");
const validateBooks = require("./validate-books.middleware");
const validateCartBook = require("./validate-cart-book.middleware");
const validateError = require("./validate-error.middleware");
const validateOrder = require("./validate-order.middleware");
const validateUser = require("./validate-user.middleware");
const verifyAccessToken = require("./verify-access-token.middleware");
const verifyRefreshToken = require("./verify-refresh-token.middleware");

module.exports = {
  errorMiddleware,
  logMiddleware,
  validateBookID,
  validateBookIDs,
  validateBooks,
  validateCartBook,
  validateError,
  validateOrder,
  validateUser,
  verifyAccessToken,
  verifyRefreshToken,
};
