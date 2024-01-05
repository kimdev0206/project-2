const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const validator = require("express-validator");
const AuthMiddleware = require("./auth.middleware");
const ValidMiddleware = require("./valid.middleware");

const authMiddleware = new AuthMiddleware({ StatusCodes, jwt });
const validMiddleware = new ValidMiddleware({ StatusCodes, validator });

module.exports = {
  authMiddleware,
  validMiddleware,
};
