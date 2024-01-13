const express = require("express");
const makeBooksRoute = require("./books.route");
const makeCartBooksRoute = require("./cart-books.route");
const makeLikesRoute = require("./likes.route");
const makeUsersRoute = require("./users.route");
const controllers = require("../controllers");
const middlewares = require("../middlewares");

const booksRoute = makeBooksRoute({
  express,
  controller: controllers.booksController,
  middlewares,
});
const cartBooksRoute = makeCartBooksRoute({
  express,
  controller: controllers.cartBooksController,
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
  middlewares,
});

module.exports = {
  booksRoute,
  cartBooksRoute,
  likesRoute,
  usersRoute,
};
