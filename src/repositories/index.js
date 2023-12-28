const UsersRepository = require("./users.repository");
// TODO: database.js import

const usersRepository = new UsersRepository();

module.exports = {
  usersRepository,
};
