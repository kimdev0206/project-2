const express = require("express");
const makeUsersRoute = require("./users.route");
const controllers = require("../controllers");

const usersRoute = makeUsersRoute({
  express,
  controller: controllers.usersController,
});

module.exports = {
  usersRoute,
};
