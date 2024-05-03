const { fakerKO: faker } = require("@faker-js/faker");
const InsertBooks = require("./insert-books");
const InsertDeliveries = require("./insert-deliveries");
const InsertOrders = require("./insert-orders");
const InsertUsers = require("./insert-users");

const userSize = 10;
const bookSize = 1000;
const deliverySize = 100;
const categorySize = 3;

const insertBooks = new InsertBooks({ faker, bookSize, categorySize });
const insertDeliveries = new InsertDeliveries({ faker, deliverySize });
const insertOrders = new InsertOrders({
  faker,
  deliverySize,
  userSize,
  bookSize,
});
const insertUsers = new InsertUsers({ faker, userSize });

module.exports = {
  insertBooks,
  insertDeliveries,
  insertOrders,
  insertUsers,
};
