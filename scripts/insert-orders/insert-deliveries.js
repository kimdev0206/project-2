const { fakerKO: faker } = require("@faker-js/faker");
const { makeIDs } = require("../utils");

module.exports = class InsertDeliveries {
  static size = 100;

  static makeValues() {
    const deliveryIDs = makeIDs(this.size);

    return deliveryIDs.map((deliveryID) => [
      deliveryID,
      faker.location.streetAddress({ useFullAddress: true }),
      `${faker.person.lastName()}${faker.person.firstName()}`,
      faker.phone.number(),
    ]);
  }

  static async run(conn) {
    const query = `
      INSERT INTO 
        deliveries
        (
          id,
          address,
          receiver,
          contact
        )
      VALUES
        ?;
    `;

    const values = this.makeValues();
    const [result] = await conn.query(query, [values]);
    return result;
  }
};
