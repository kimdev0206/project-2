module.exports = class InsertOrderedBooks {
  constructor({ faker, bookSize, deliverySize }) {
    const deliveryIDs = Array.from(
      { length: deliverySize },
      (_, index) => index + 1
    );
    const bookIDs = Array.from({ length: bookSize }, (_, index) => index + 1);

    const values = deliveryIDs.map((deliveryID, index) => [
      deliveryID,
      bookIDs[index],
      faker.helpers.rangeToNumber({ min: 1, max: 10 }),
    ]);

    this.values = values;
  }

  run = async ({ conn }) => {
    const query = `
      INSERT INTO ordered_books
        (
          order_id, 
          book_id, 
          count
        )
      VALUES
        ?;
    `;

    const values = this.values;
    const [result] = await conn.query(query, [values]);
    return result;
  };
};
