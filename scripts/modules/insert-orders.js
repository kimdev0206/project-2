function iterator(A) {
  let index = 0;

  return () => {
    const id = A[index];
    index = (index + 1) % A.length;

    return id;
  };
}

module.exports = class InsertOrders {
  constructor({ faker, deliverySize, userSize, bookSize }) {
    const deliveryIDs = Array.from(
      { length: deliverySize },
      (_, index) => index + 1
    );

    const userIDs = Array.from(
      { length: userSize },
      (_, index) => index + 1
    ).flatMap((userID) => Array(userSize).fill(userID));
    const getUserID = iterator(userIDs);

    const bookDetailSizes = Array.from({ length: 10 }, (_, index) => index + 1);
    const getBookDetailSize = iterator(bookDetailSizes);

    const getBooks = (length) =>
      Array.from({ length }, () => ({
        bookID: faker.helpers.rangeToNumber({ min: 1, max: bookSize }),
        title: faker.lorem.words(),
        author: `${faker.person.lastName()}${faker.person.firstName()}`,
        price: faker.commerce.price({ dec: 0, min: 1_000, max: 10_000 }),
        count: faker.helpers.rangeToNumber({ min: 1, max: 10 }),
      }));

    const values = deliveryIDs.map((deliveryID) => {
      const books = getBooks(getBookDetailSize());

      let totalCount = 0;
      let totalPrice = 0;

      for (let i = 0; i < books.length; i += 1) {
        const book = books[i];

        totalCount += book.count;
        totalPrice += +book.price * book.count;
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

    this.values = values;
  }

  run = async ({ conn }) => {
    const query = `
      INSERT INTO orders
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

    const values = this.values;
    const [result] = await conn.query(query, [values]);
    return result;
  };
};
