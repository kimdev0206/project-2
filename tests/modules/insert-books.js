const { fakerKO: faker } = require("@faker-js/faker");
const { BookCategoryID } = require("../../src/enums");
const database = require("../../src/database");
const { getRandomKey } = require("../utils");

module.exports = class InsertBooks {
  static makeValues(size) {
    const isbnList = faker.helpers.uniqueArray(faker.commerce.isbn, size);

    return isbnList.map((isbn) => [
      faker.lorem.words(),
      getRandomKey(BookCategoryID),
      faker.system.commonFileType(),
      isbn,
      faker.lorem.sentences(),
      faker.lorem.paragraphs(),
      `${faker.person.lastName()}${faker.person.firstName()}`,
      faker.number.int({ min: 1, max: 1_000 }),
      faker.lorem.lines(),
      faker.commerce.price({ dec: 0, min: 1_000, max: 10_000 }),
      faker.helpers.rangeToNumber({ min: 10, max: 100 }),
      faker.date.past(),
    ]);
  }

  static async run(params) {
    const { pool } = database;
    const query = `
      INSERT INTO 
        books (
          title,
          category_id,
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

    const values = [this.makeValues(params.bookSize)];
    const [result] = await pool.query(query, values);
    return result;
  }
};
