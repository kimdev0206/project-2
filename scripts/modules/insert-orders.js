function userIDIterator(A) {
  let index = 0;

  return () => {
    const id = A[index];
    index = (index + 1) % A.length;

    return id;
  };
}

module.exports = class InsertOrders {
  constructor({ faker, deliverySize, userSize }) {
    const deliveryIDs = Array.from(
      { length: deliverySize },
      (_, index) => index + 1
    );

    const userIDs = Array.from({ length: userSize }, (_, index) => index + 1);
    const getUserID = userIDIterator(userIDs);

    const values = deliveryIDs.map((deliveryID) => [
      deliveryID,
      getUserID(),
      deliveryID,
      faker.lorem.words(),
      faker.helpers.rangeToNumber({ min: 10, max: 100 }),
      faker.commerce.price({ dec: 0, min: 1_000 }),
    ]);

    this.values = values;
  }

  run = async ({ conn }) => {
    const query = `
      INSERT INTO orders
        (
          id,
          user_id,
          delivery_id,
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
