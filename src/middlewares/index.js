const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const AuthMiddleware = require("./auth.middleware");

const authMiddleware = new AuthMiddleware({ StatusCodes, jwt });

module.exports = {
  authMiddleware,
};
