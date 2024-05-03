const { fakerKO: faker } = require("@faker-js/faker");
const { makeIDs } = require("../utils");

module.exports = class InsertUsers {
  static size = 10;

  static makeValues() {
    const userIDs = makeIDs(this.size);

    return userIDs.map((userID) => [
      userID,
      faker.internet.email(),
      faker.internet.password({ length: 24 }),
      faker.internet.password({ length: 24 }),
    ]);
  }

  static async run(conn) {
    const query = `
      INSERT INTO users
        (
          id,
          email,
          hashed_password,
          salt
        )
      VALUES
        ?;
    `;

    const values = this.makeValues();
    const [result] = await conn.query(query, [values]);
    return result;
  }
};
