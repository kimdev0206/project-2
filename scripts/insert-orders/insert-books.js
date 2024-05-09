const { fakerKO: faker } = require("@faker-js/faker");
const { makeIDs, makeIDIterator } = require("../utils");

module.exports = class InsertBooks {
  static size = 1000;
  static categorySize = 3;

  static makeValues() {
    const bookIDs = makeIDs(this.size);
    const categoryIDs = makeIDs(this.categorySize);
    const getCategoryID = makeIDIterator(categoryIDs);

    return bookIDs.map((bookID) => [
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
      faker.commerce.price({ dec: 0, min: 1_000, max: 10_000 }),
      faker.helpers.rangeToNumber({ min: 10, max: 100 }),
      faker.date.past(),
    ]);
  }

  static async run(conn) {
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
          count,
          pub_date
        )
      VALUES
        ?;
    `;

    const values = this.makeValues();
    const [result] = await conn.query(query, [values]);
    return result;
  }
};
