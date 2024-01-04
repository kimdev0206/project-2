const express = require("express");
const makeLikesRoute = require("./likes.route");
const makeUsersRoute = require("./users.route");
const controllers = require("../controllers");
const middlewares = require("../middlewares");

const likesRoute = makeLikesRoute({
  express,
  controller: controllers.likesController,
  middleware: middlewares.authMiddleware,
});
const usersRoute = makeUsersRoute({
  express,
  controller: controllers.usersController,
});

module.exports = {
  likesRoute,
  usersRoute,
};
