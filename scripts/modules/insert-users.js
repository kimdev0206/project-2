module.exports = class InsertUsers {
  constructor({ faker, userSize }) {
    const userIDs = Array.from({ length: userSize }, (_, index) => index + 1);

    const values = userIDs.map((userID) => [
      userID,
      faker.internet.email(),
      faker.internet.password({ length: 24 }),
      faker.internet.password({ length: 24 }),
    ]);

    this.values = values;
  }

  run = async ({ conn }) => {
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

    const values = this.values;
    const [result] = await conn.query(query, [values]);
    return result;
  };
};
