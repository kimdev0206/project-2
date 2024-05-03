function categoryIDIterator(A) {
  let index = 0;

  return () => {
    const id = A[index];
    index = (index + 1) % A.length;

    return id;
  };
}

module.exports = class InsertBooks {
  constructor({ faker, bookSize, categorySize }) {
    const bookIDs = Array.from({ length: bookSize }, (_, index) => index + 1);

    const categoryIDs = Array.from(
      { length: categorySize },
      (_, index) => index + 1
    );
    const getCategoryID = categoryIDIterator(categoryIDs);

    const values = bookIDs.map((bookID) => [
      bookID,
      faker.lorem.words(),
      getCategoryID(),
      bookID,
      faker.system.commonFileType(),
      faker.commerce.isbn(),
      faker.lorem.sentences({ max: 10 }),
      faker.lorem.paragraphs({ max: 15 }),
      `${faker.person.lastName()}${faker.person.firstName()}`,
      faker.number.int({ min: 1, max: 1_000 }),
      faker.lorem.lines({ max: 100 }),
      faker.commerce.price({ dec: 0, min: 1_000 }),
      faker.date.past(),
    ]);

    this.values = values;
  }

  run = async ({ conn }) => {
    const query = `
      INSERT INTO books
        (
          id,
          title,
          category_id,
          img_id,
          form,
          isbn,
          summary,
          detail,
          author,
          pages,
          contents,
          price,
          pub_date
        )
      VALUES
        ?;
    `;

    const values = this.values;
    const [result] = await conn.query(query, [values]);
    return result;
  };
};
