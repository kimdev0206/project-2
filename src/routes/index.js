const express = require("express");
const makeBooksRoute = require("./books.route");
const makeUsersRoute = require("./users.route");
const controllers = require("../controllers");

const booksRoute = makeBooksRoute({
  express,
  controller: controllers.booksController,
});
const usersRoute = makeUsersRoute({
  express,
  controller: controllers.usersController,
});

module.exports = {
  booksRoute,
  usersRoute,
};
