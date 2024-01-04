const express = require("express");
const makeBooksRoute = require("./books.route");
const makeUsersRoute = require("./users.route");
const controllers = require("../controllers");
const middlewares = require("../middlewares");

const booksRoute = makeBooksRoute({
  express,
  controller: controllers.booksController,
  middleware: middlewares.authMiddleware,
});
const usersRoute = makeUsersRoute({
  express,
  controller: controllers.usersController,
});

module.exports = {
  booksRoute,
  usersRoute,
};
