const express = require("express");
const makeBooksRoute = require("./books.route");
const makeLikesRoute = require("./likes.route");
const makeUsersRoute = require("./users.route");
const controllers = require("../controllers");
const middlewares = require("../middlewares");

const booksRoute = makeBooksRoute({
  express,
  controller: controllers.booksController,
  middlewares,
});
const likesRoute = makeLikesRoute({
  express,
  controller: controllers.likesController,
  middleware: middlewares.authMiddleware,
});
const usersRoute = makeUsersRoute({
  express,
  controller: controllers.usersController,
  middleware: middlewares.validMiddleware,
});

module.exports = {
  booksRoute,
  likesRoute,
  usersRoute,
};
