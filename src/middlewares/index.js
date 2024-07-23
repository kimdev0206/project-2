const error = require("./error");
const httpError = require("./http-error");
const log = require("./log");
const pathError = require("./path-error");
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
  error,
  httpError,
  log,
  pathError,
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
