const { fakerKO: faker } = require("@faker-js/faker");
const InsertBooks = require("./insert-books");
const InsertDeliveries = require("./insert-deliveries");
const InsertOrderedBooks = require("./insert-ordered-books");
const InsertOrders = require("./insert-orders");
const InsertUsers = require("./insert-users");

const userSize = 10;
const bookSize = 1000;
const deliverySize = 100;
const categorySize = 3;

const insertBooks = new InsertBooks({ faker, bookSize, categorySize });
const insertDeliveries = new InsertDeliveries({ faker, deliverySize });
const insertOrderedBooks = new InsertOrderedBooks({ faker, bookSize, deliverySize });
const insertOrders = new InsertOrders({ faker, deliverySize, userSize });
const insertUsers = new InsertUsers({ faker, userSize });

module.exports = {
  insertBooks,
  insertDeliveries,
  insertOrderedBooks,
  insertOrders,
  insertUsers,
};
