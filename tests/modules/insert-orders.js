const { fakerKO: faker } = require("@faker-js/faker");
const database = require("../../src/database");
const { makeIDs, makeDeliveries, makeOrderIDs } = require("../utils");
const SelectRandomBooks = require("./select-random-books");

module.exports = class InsertOrders {
  static async makeValues(params) {
    const orderIDs = makeOrderIDs(params.orderSize);
    const deliveries = makeDeliveries(params.orderSize);
    const getUserID = params.userIDs.makeIDIterator();

    const getBookCount = makeIDs(10).makeIDIterator();
    const amount = params.bookSize;
    const promises = Array.from({ length: params.orderSize }, () => {
      const params = { amount, count: getBookCount() };
      return SelectRandomBooks.run(params);
    });

    const results = await Promise.all(promises);
    const randomBooksList = results.map((randomBooks) =>
      randomBooks.map((randomBook) => ({
        ...randomBook,
        count: faker.helpers.rangeToNumber({ min: 1, max: 10 }),
      }))
    );

    return orderIDs.map((orderID, index) => {
      const randomBooks = randomBooksList[index];
      const [mainBook] = randomBooks;
      const totalCount = randomBooks.reduce(
        (prev, book) => prev + book.count,
        0
      );
      const totalPrice = randomBooks.reduce(
        (prev, book) => prev + book.price * book.count,
        0
      );

      return [
        orderID,
        getUserID(),
        JSON.stringify(deliveries[index]),
        JSON.stringify(randomBooks),
        mainBook.title,
        totalCount,
        totalPrice,
      ];
    });
  }

  static async run(params) {
    const { pool } = database;
    const query = `
      INSERT INTO 
        orders (
          order_id,
          user_id,
          delivery,
          books,
          main_book_title,
          total_count,
          total_price
        )
      VALUES
        ?;
    `;

    const values = [await this.makeValues(params)];
    const [result] = await pool.query(query, values);
    return result;
  }
};
