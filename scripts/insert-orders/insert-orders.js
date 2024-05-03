const { fakerKO: faker } = require("@faker-js/faker");
const InsertBooks = require("./insert-books");
const InsertDeliveries = require("./insert-deliveries");
const InsertUsers = require("./insert-users");
const { makeIDs, makeIDIterator } = require("../utils");

module.exports = class InsertOrders {
  static makeValues() {
    const deliveryIDs = makeIDs(InsertDeliveries.size);

    const userIDs = makeIDs(InsertUsers.size).flatMap((userID) =>
      Array(InsertUsers.size).fill(userID)
    );
    const getUserID = makeIDIterator(userIDs);

    const bookDetailSize = 10;
    const getBookDetailSize = makeIDIterator(makeIDs(bookDetailSize));

    const getBooks = (size) =>
      Array.from({ length: size }, () => ({
        bookID: faker.helpers.rangeToNumber({ min: 1, max: InsertBooks.size }),
        title: faker.lorem.words(),
        author: `${faker.person.lastName()}${faker.person.firstName()}`,
        price: faker.commerce.price({ dec: 0, min: 1_000, max: 10_000 }),
        count: faker.helpers.rangeToNumber({ min: 1, max: 10 }),
      }));

    return deliveryIDs.map((deliveryID) => {
      const books = getBooks(getBookDetailSize());

      let totalCount = 0;
      let totalPrice = 0;

      for (let i = 0; i < books.length; i += 1) {
        const book = books[i];

        totalCount += book.count;
        totalPrice += Number(book.price) * book.count;
      }

      return [
        getUserID(),
        deliveryID,
        JSON.stringify(books),
        faker.lorem.words(),
        totalCount,
        totalPrice,
      ];
    });
  }

  static async run(conn) {
    const query = `
      INSERT INTO 
        orders
        (
          user_id,
          delivery_id,
          books,
          main_book_title,
          total_count,
          total_price
        )
      VALUES
        ?;
    `;

    const values = this.makeValues();
    const [result] = await conn.query(query, [values]);
    return result;
  }
};
