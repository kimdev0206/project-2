const { fakerKO: faker } = require("@faker-js/faker");
const database = require("../../src/database");

module.exports = class InsertUsers {
  static makeValues(size) {
    const emailList = faker.helpers.uniqueArray(faker.internet.email, size);

    return emailList.map((email) => [
      email,
      faker.internet.password({ length: 24 }),
      faker.internet.password({ length: 24 }),
    ]);
  }

  static async run(params) {
    const { pool } = database;
    const query = `
      INSERT INTO
        users (
          email,
          hashed_password,
          salt
        )
      VALUES
        ?;
    `;

    const values = [this.makeValues(params.userSize)];
    const [result] = await pool.query(query, values);
    return result;
  }
};
